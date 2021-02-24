import type { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { SurveysRepository } from '../../repositories/SurveysRepository';

export class SurveyController {
  public async create(req: Request, res: Response) {
    const { description, title } = req.body;
    const surveysRepository = getCustomRepository(SurveysRepository);

    const survey = surveysRepository.create({ description, title });

    await surveysRepository.save(survey);

    return res.status(201).json(survey);
  }

  public async show(req: Request, res: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const all = await surveysRepository.find();

    return res.json(all);
  }
}
