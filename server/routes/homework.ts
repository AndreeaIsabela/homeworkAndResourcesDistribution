import { Router } from "express";
const homeworkRoutes: any = Router();
import { HomeworkController } from "../controllers/homework";
import { HomeworkModel as HomeworkModel } from "../models/homework";

const jwtService = require('../middleware/authenticationMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// injecting the homework model in the controller instance
const homeworkController = new HomeworkController(HomeworkModel);

homeworkRoutes.get('/:teacherId', async (req, res) => {
  try {
    const homeworks = await homeworkController.getHomeworksByTecherID(req.params.teacherId);
    res.json(homeworks);
  } catch (err) {
    return res.status(500).end();
  }
});

homeworkRoutes.get('/:userId/totalPages', async (req, res) => {
  try {
    //get the total number of items used for pagination
    const userId = req.params.userId;
    const response = await homeworkController.getTotaNrOfLinks(userId);
    return res.json(Number(response));
  } catch (err) {
    res.status(500).end();
  }
});

homeworkRoutes.get('/:userId/page/:page', async (req, res) => {
  try {
    const userId = req.params.userId;
    const pageNo = parseInt(req.params.page);
    const size = 20;
    var query: any = {};
    if (pageNo < 0 || pageNo === 0) {
      const response = { "error": true, "message": "invalid page number, should start with 1" };
      return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    const links = await homeworkController.getPageLinks(query, userId);
    res.json(links);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

homeworkRoutes.get('/assigment/:id', async (req, res) => {
  try {
    const homework = await homeworkController.getHomeworkById(req.params.id);
    res.json(homework);
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

homeworkRoutes.get('/students/:id', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const students = await homeworkController.getStudents(req.params.id);
    res.json(students);
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

homeworkRoutes.post('/', async (req, res) => {
  try {
    await homeworkController.addHomework(req.body);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

homeworkRoutes.post('/:homeworkId/addStudent', async (req, res) => {
  try {
    await homeworkController.addStudentToHomework(req.params.homeworkId, req.body);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

homeworkRoutes.post('/:id/comment', async (req, res) => {
  try {
    await homeworkController.addComment(req.params.id, req.body);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

homeworkRoutes.put('/:id', jwtService.teacherAuthentication, async (req, res) => {
  try {
    await homeworkController.updateHomework(req.params.id, req.body);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

homeworkRoutes.put('/add/resources/:homeworkId', async (req, res) => {
  try {
    await homeworkController.addStudentResources(req.params.homeworkId, req.body);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

homeworkRoutes.delete('/:teacherId/:homeworkId', jwtService.teacherAuthentication, async (req, res) => {
  try {
    await homeworkController.deleteHomework(req.params.teacherId, req.params.homeworkId);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

homeworkRoutes.post('/upload/:homeworkId/:userId',
  upload.single('file'),
  async (req, res) => {
    try {
      let updateDate = req.body.updateDate;
      let filePath = req.body.filePath
      if (req.file) {
        filePath = await homeworkController.save(req.file, req.params);
      }
      //update filePath and update date
      const updatedLink = await homeworkController.updateLink(req.params.userId, updateDate, filePath, req.params.homeworkId);
      res.json(updatedLink);
    } catch (err) {
      if (err == 'No can do')
        return res.status(400).end();
      console.log(err);
      res.status(500).end();
    }
  });

homeworkRoutes.get('/download/:fileId', async (req, res) => {
  try {
    var fileId = req.params.fileId;

    res.attachment(fileId);
    var fileStream = await homeworkController.download(fileId);
    fileStream.pipe(res);
  } catch (err) {
    res.status(500).end();
  }
});

homeworkRoutes.put('/:userId', async (req, res) => {
  try {
    const updatedLink = await homeworkController.updateLink(req.params.userId, req.body.updateDate, req.body.filePath, req.body.homeworkId);
    res.json(updatedLink);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

homeworkRoutes.put('/grade/:userId', async (req, res) => {
  try {
    const solutionGrade = await homeworkController.gradeSolution(req.params.userId, req.body.grade, req.body.observations, req.body.homeworkId);
    res.json(solutionGrade);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});


module.exports = homeworkRoutes;
