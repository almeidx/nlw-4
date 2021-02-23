import type { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../../models/User';

export class UserController {
  public async create(req: Request, res: Response) {
    const { email, name } = req.body;
    const usersRepository = getRepository(User);

    const existingUser = await usersRepository.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = usersRepository.create({ email, name });

    await usersRepository.save(user);

    return res.json(user);
  }
}
