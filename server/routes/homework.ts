import { Router } from "express";
import { HomeworkRoutes } from './homeworkRoutes';

const jwtService = require('../middleware/authenticationMiddleware');
const router: any = Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const homeworkRoutes = new HomeworkRoutes();


router.get('/:teacherId', homeworkRoutes.getTeacherID);

router.get('/:userId/totalPages', homeworkRoutes.getNoOfResources);

router.get('/:userId/page/:page', homeworkRoutes.getResourcesPerPage);

router.get('/assigment/:id', homeworkRoutes.getHomeworkById);

router.get('/students/:id', jwtService.teacherAuthentication, homeworkRoutes.getStudentsPerHomework);

router.post('/', homeworkRoutes.addHomework);

router.post('/:homeworkId/addStudent', homeworkRoutes.assignHomeworkToStudent);

router.post('/:id/comment', homeworkRoutes.addComment);

router.put('/:id', jwtService.teacherAuthentication, homeworkRoutes.updateHomework);

router.put('/add/resources/:homeworkId', homeworkRoutes.addStudentResources);

router.delete('/:teacherId/:homeworkId', jwtService.teacherAuthentication, homeworkRoutes.deleteHomework);

router.post('/upload/:homeworkId/:userId', upload.single('file'), homeworkRoutes.uploadHomework);

router.get('/download/:fileId', homeworkRoutes.downloadStudentHomework);

router.put('/:userId', homeworkRoutes.updateLink);

router.put('/grade/:userId', homeworkRoutes.gradeStudentSolution);


module.exports = router;
