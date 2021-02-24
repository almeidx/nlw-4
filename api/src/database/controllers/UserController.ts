import type { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepository } from '../../repositories/UsersRepository';

export class UserController {
  public async create(req: Request, res: Response) {
    const { email, name } = req.body;
    const usersRepository = getCustomRepository(UsersRepository);

    const existingUser = await usersRepository.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = usersRepository.create({ email, name });

    await usersRepository.save(user);

    return res.status(201).json(user);
  }
}
