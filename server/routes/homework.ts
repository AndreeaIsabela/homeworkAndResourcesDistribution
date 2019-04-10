import { Router } from "express";
const homeworkRoutes: any = Router();
import { HomeworkController } from "../controllers/homework";
import { HomeworkModel as HomeworkModel } from "../models/homework";

const jwtService = require('../middleware/authenticationMiddleware');

// injecting the homework model in the controller instance
const homeworkController = new HomeworkController(HomeworkModel);

homeworkRoutes.get('/:teacherId', async (req, res) => {
  try {
    const homeworks = await homeworkController.getHomeworks(req.params.teacherId);
    res.json(homeworks);
  } catch (err) {
    return res.status(500).end();
  }
});

homeworkRoutes.get('/:teacherId/totalPages', jwtService.teacherAuthentication, async (req, res) => {
  try {
    //get the total number of items used for pagination
    const teacherId = req.params.teacherId;
    const response = await homeworkController.getTotaNrOfLinks(teacherId);
    return res.json(Number(response));
  } catch (err) {
    res.status(500).end();
  }
});

homeworkRoutes.get('/:teacherId/page/:page', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const pageNo = parseInt(req.params.page);
    const size = 20;
    var query: any = {};
    if (pageNo < 0 || pageNo === 0) {
      const response = { "error": true, "message": "invalid page number, should start with 1" };
      return res.json(response);
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    const links = await homeworkController.getPageLinks(query, teacherId);
    res.json(links);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

homeworkRoutes.get('/:id', async (req, res) => {
  try {
    const homework = await homeworkController.getHomeworkById(req.params.id);
    res.json(homework);
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

homeworkRoutes.put('/:id', jwtService.teacherAuthentication, async (req, res) => {
  try {
    await homeworkController.updateHomework(req.params.id, req.body);
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

module.exports = homeworkRoutes;
