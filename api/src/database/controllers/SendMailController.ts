import type { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';

import { SurveysRepository } from '../../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../../repositories/SurveysUsersRepository';
import { UsersRepository } from '../../repositories/UsersRepository';
import SendMailService from '../../services/SendMailService';

export class SendMailController {
  public async execute(req: Request, res: Response) {
    const { email, survey_id: surveyID } = req.body;
    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist.' });
    }

    const survey = await surveysRepository.findOne({ id: surveyID });
    if (!survey) {
      return res.status(400).json({ error: 'Survey does not exist.' });
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs');

    const variables = {
      description: survey.description,
      link: process.env.MAIL_URL,
      name: user.name,
      title: survey.title,
      user_id: user.id,
    };

    const existingSurveyUser = await surveysUsersRepository.findOne({
      relations: ['user', 'survey'],
      where: [{ user_id: user.id }, { value: null }],
    });

    if (existingSurveyUser) {
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return res.json(existingSurveyUser);
    }

    const surveyUser = surveysUsersRepository.create({
      survey_id: surveyID,
      user_id: user.id,
    });

    await surveysUsersRepository.save(surveyUser);

    await SendMailService.execute(email, survey.title, variables, npsPath);

    return res.json(surveyUser);
  }
}
