import {Router} from "express";
const studentRoutes:any =  Router();
import  {StudentController} from "../controllers/student";
import { StudentModel as StudentModel } from "../models/student";

const jwtService = require('../middleware/authenticationMiddleware');

// injecting the student model in the controller instance
const studentController = new StudentController(StudentModel);

studentRoutes.post('/login', async (req, res) => {
  try {
    const student = await studentController.getStudent(req.body.email);

    if (student.comparePassword(req.body.password) === true) {
      const studentJson = student.toJSON();
      res.send({
        user: studentJson,
        token: studentController.jwtSignUser(studentJson)
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

studentRoutes.get('/', jwtService.studentAuthentication, async (req, res) => {
  try {
    const students = await studentController.getStudents();
    res.json(students);
  } catch (err) {
    return res.status(500).end();
  }
});

studentRoutes.get('/:id', jwtService.studentAuthentication, async (req, res) => {
  try {
    const student = await studentController.getStudentById(req.params.id);
    res.json(student);
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

studentRoutes.post('/register', async (req, res) => {
  try {
    await studentController.addStudent(req.body);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

studentRoutes.put('/:id', jwtService.studentAuthentication, async (req, res) => {
  try {
    const updatedStudent = await studentController.updateStudent(req.params.id, req.body);
    const updatedStudentJson:string = updatedStudent.toJSON();
    res.send({
      user: updatedStudentJson,
      token: studentController.jwtSignUser(updatedStudentJson)
    });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

studentRoutes.delete('/:id', jwtService.studentAuthentication, async (req, res) => {
  try {
    await studentController.deleteStudent(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = studentRoutes;
