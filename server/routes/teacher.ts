import { Router } from "express";
const teacherRoutes: any = Router();
import { TeacherController } from "../controllers/teacher";
import { TeacherModel as TeacherModel } from "../models/teacher";

const jwtService = require('../middleware/authenticationMiddleware');

// injecting the teacher model in the controller instance
const teacherController = new TeacherController(TeacherModel);

teacherRoutes.post('/login', async (req, res) => {
  try {
    const teacher = await teacherController.getTeacher(req.body.email);

    if (teacher.comparePassword(req.body.password) === true) {
      const teacherJson = teacher.toJSON();
      console.log(teacherJson._id);
      res.send({
        user: teacherJson,
        token: teacherController.jwtSignUser(teacherJson),
        userId: teacherJson._id
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

teacherRoutes.get('/', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const teachers = await teacherController.getTeachers();
    res.json(teachers);
  } catch (err) {
    return res.status(500).end();
  }
});

teacherRoutes.get('/:id', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const teacher = await teacherController.getTeacherById(req.params.id);
    res.json(teacher);
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

teacherRoutes.post('/register', async (req, res) => {
  try {

    await teacherController.addTeacher(req.body);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

teacherRoutes.post('/:teacherId/resources', async (req, res) => {
  try {

    await teacherController.addResource(req.body, req.params.teacherId);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

teacherRoutes.put('/:id', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const updatedTeacher = await teacherController.updateTeacher(req.params.id, req.body);
    const updatedTeacherJson: string = updatedTeacher.toJSON();
    res.send({
      user: updatedTeacherJson,
      token: teacherController.jwtSignUser(updatedTeacherJson)
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

teacherRoutes.get('/:teacherId/resources/totalPages', jwtService.teacherAuthentication, async (req, res) => {
  try {
    //get the total number of items used for pagination
    const teacherId = req.params.teacherId;
    const response = await teacherController.getTotaNrOfLinks(teacherId);
    return res.json(Number(response));
  } catch (err) {
    res.status(500).end();
  }
});

teacherRoutes.get('/:teacherId/resources/page/:page', jwtService.teacherAuthentication, async (req, res) => {
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
    const links = await teacherController.getPageLinks(query, teacherId);
    res.json(links);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

teacherRoutes.delete('/:teacherId/resources/:resourceId', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    await teacherController.deleteResource(teacherId, req.params.resourceId);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = teacherRoutes;
