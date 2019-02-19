import { Router } from "express";

import * as studentRoutes from './student';
import * as teacherRoutes from './teacher';

const MainRouter: any = Router();

// mounting the routes on their specific endpoints
MainRouter.use('/student', studentRoutes);
MainRouter.use('/teacher', teacherRoutes);

module.exports = MainRouter;
