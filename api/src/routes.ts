/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express';

import { SurveyController } from './database/controllers/SurveyController';
import { UserController } from './database/controllers/UserController';

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();

router.post('/users', userController.create);
router.post('/surveys', surveyController.create);
router.get('/surveys', surveyController.show);

export default router;
