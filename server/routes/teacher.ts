import { Router } from "express";
import { TeacherRoutes } from './teacherRoutes';

const jwtService = require('../middleware/authenticationMiddleware');
const teacherRoutes = new TeacherRoutes();
const router: any = Router();

router.post('/login', teacherRoutes.login);

router.get('/', jwtService.teacherAuthentication, teacherRoutes.getTeachers);

router.get('/:id', jwtService.teacherAuthentication, teacherRoutes.getTeacherById);

router.post('/register', teacherRoutes.registerTeacher);

router.post('/:teacherId/resources', teacherRoutes.addLearningResource);

router.put('/:id', jwtService.teacherAuthentication, teacherRoutes.updateTeacher);

router.get('/:teacherId/resources/totalPages', jwtService.teacherAuthentication, teacherRoutes.getTotalNoOfResources);

router.get('/:teacherId/resources/page/:page', jwtService.teacherAuthentication, teacherRoutes.getResourcesPerPage);

router.delete('/:teacherId/resources/:resourceId', jwtService.teacherAuthentication, teacherRoutes.deleteResource);

module.exports = router;
