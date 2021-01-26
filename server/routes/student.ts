import { Router } from 'express';
import { StudentRoutes } from './studentRoutes';

const jwtService = require('../middleware/authenticationMiddleware');
const studentRoutes = new StudentRoutes();
const router: any = Router();

router.post('/login', studentRoutes.login);

router.get('/', jwtService.studentAuthentication, studentRoutes.getStudents);

router.get('/:id', jwtService.studentAuthentication, studentRoutes.getStudentByID);

router.post('/register', studentRoutes.register);

router.put('/:id', jwtService.studentAuthentication, studentRoutes.updateStudent);

router.post('/:studentId/resources', studentRoutes.addResources);

router.get('/:studentId/resources/totalPages', jwtService.studentAuthentication, studentRoutes.getResources);

router.get('/:studentId/resources/page/:page', jwtService.studentAuthentication, studentRoutes.getResourcesPerPage);

router.delete('/:studentId/resources/:resourceId', jwtService.studentAuthentication, studentRoutes.deleteStudentResource);

module.exports = router;
