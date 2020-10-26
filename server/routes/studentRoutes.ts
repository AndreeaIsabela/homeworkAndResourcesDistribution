import { StudentController } from '../controllers/student';
import { StudentModel as StudentModel } from '../models/student';
import { JsonWebToken } from '../controllers/jsonWebToken';

// injecting the student model in the controller instance
const studentController = new StudentController(StudentModel);
const jwtController = new JsonWebToken();

export class StudentRoutes {

  constructor() { }

  readonly login = async (req, res, _next) => {
    try {
      const student = await studentController.getStudent(req.body.email);

      if (student.comparePassword(req.body.password) === true) {
        const studentJson = student.toJSON();
        res.send({
          user: studentJson,
          token: jwtController.jwtSignUser(studentJson, 'student')
        });
        return res.status(200).end();
      }
      return res.status(401).end();
    }
    catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  }

  readonly getStudents = async (req, res, _next) => {
    try {
      const students = await studentController.getStudents();
      res.json(students);
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly getStudentByID = async (req, res, _next) => {
    try {
      const student = await studentController.getStudentById(req.params.id);
      res.json(student);
    }
    catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  }

  readonly register = async (req, res, _next) => {
    try {
      const student = await studentController.addStudent(req.body);
      res.json(student);
      return res.status(200).end();
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly updateStudent = async (req, res, _next) => {
    try {
      const updatedStudent = await studentController.updateStudent(req.params.id, req.body);
      const updatedStudentJson: string = updatedStudent.toJSON();
      res.send({
        user: updatedStudentJson,
        token: jwtController.jwtSignUser(updatedStudentJson, 'student')
      });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }

  readonly addResources = async (req, res, _next) => {
    try {
      await studentController.addResource(req.body, req.params.studentId);
      return res.status(200).end();
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly getResources = async (req, res, _next) => {
    try {
      //get the total number of items used for pagination
      const studentId = req.params.studentId;
      const response = await studentController.getTotaNrOfLinks(studentId);
      return res.json(Number(response));
    } catch (err) {
      res.status(500).end();
    }
  }

  readonly getResourcesPerPage = async (req, res, _next) => {
    try {
      const studentId = req.params.studentId;
      const pageNo = parseInt(req.params.page);
      const size = 20;
      var query: any = {};
      if (pageNo < 0 || pageNo === 0) {
        const response = { 'error': true, 'message': 'invalid page number, should start with 1' };
        return res.json(response);
      }
      query.skip = size * (pageNo - 1);
      query.limit = size;
      const links = await studentController.getPageLinks(query, studentId);
      res.json(links);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }

  readonly deleteStudentResource = async (req, res, _next) => {
    try {
      const studentId = req.params.studentId;
      await studentController.deleteResource(studentId, req.params.resourceId);
      res.status(204).end();
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }
}
