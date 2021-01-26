import { Router } from 'express';

import * as studentRoutes from './student';
import * as teacherRoutes from './teacher';
import * as homeworkRoutes from './homework';

const MainRouter: any = Router();

// mounting the routes on their specific endpoints
MainRouter.use('/student', studentRoutes);
MainRouter.use('/teacher', teacherRoutes);
MainRouter.use('/homework', homeworkRoutes);

module.exports = MainRouter;
