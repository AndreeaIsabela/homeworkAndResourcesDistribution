import {Router} from "express";
const homeworkRoutes:any =  Router();
import  {HomeworkController} from "../controllers/homework";
import { HomeworkModel as HomeworkModel } from "../models/homework";

const jwtService = require('../middleware/authenticationMiddleware');

// injecting the homework model in the controller instance
const homeworkController = new HomeworkController(HomeworkModel);

homeworkRoutes.get('/', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const homeworks = await homeworkController.getHomeworks();
    res.json(homeworks);
  } catch (err) {
    return res.status(500).end();
  }
});

homeworkRoutes.get('/:id', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const homework = await homeworkController.getHomeworkById(req.params.id);
    res.json(homework);
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

homeworkRoutes.post('/homework', async (req, res) => {
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

homeworkRoutes.delete('/:id', jwtService.teacherAuthentication, async (req, res) => {
  try {
    await homeworkController.deleteHomework(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = homeworkRoutes;
