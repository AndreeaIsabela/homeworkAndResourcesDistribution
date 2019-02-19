import {Router} from "express";
const teacherRoutes:any =  Router();
import  {TeacherController} from "../controllers/teacher";
import { TeacherModel as TeacherModel } from "../models/teacher";

const jwtService = require('../middleware/authentificationMiddleware');

// injecting the teacher model in the controller instance
const teacherController = new TeacherController(TeacherModel);

teacherRoutes.post('/login', async (req, res) => {
  try {
    const teacher = await teacherController.getTeacher();

    if (teacher.comparePassword(req.body.password) === true) {
      const teacherJson = teacher.toJSON();
      res.send({
        user: teacherJson,
        token: teacherController.jwtSignUser(teacherJson)
      });
      return res.status(200).end();
    }
    return res.status(401).end();
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

teacherRoutes.get('/', async (req, res) => {
  try {
    const teachers = await teacherController.getTeachers();
    res.json(teachers);
  } catch (err) {
    return res.status(500).end();
  }
});

teacherRoutes.get('/:id', jwtService.authentication, async (req, res) => {
  try {
    const teacher = await teacherController.getTeacherById(req.params.id);
    res.json(teacher);
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

teacherRoutes.post('/', async (req, res) => {
  try {

    await teacherController.addTeacher(req.body);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

teacherRoutes.put('/:id', jwtService.authentication, async (req, res) => {
  try {
    const updatedTeacher = await teacherController.updateTeacher(req.params.id, req.body);
    const updatedTeacherJson:string = updatedTeacher.toJSON();
    res.send({
      user: updatedTeacherJson,
      token: teacherController.jwtSignUser(updatedTeacherJson)
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

teacherRoutes.delete('/:id', jwtService.authentication, async (req, res) => {
  try {
    await teacherController.deleteTeacher(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = teacherRoutes;
