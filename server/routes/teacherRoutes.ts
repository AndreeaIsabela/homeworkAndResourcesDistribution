import { TeacherController } from "../controllers/teacher";
import { TeacherModel as TeacherModel } from "../models/teacher";
import { JsonWebToken } from '../controllers/jsonWebToken';

// injecting the teacher model in the controller instance
const teacherController = new TeacherController(TeacherModel);
const jwtController = new JsonWebToken();

export class TeacherRoutes {

  constructor() { }

  readonly login = async (req, res, _next) => {
    try {
      const teacher = await teacherController.getTeacher(req.body.email);

      if (teacher.comparePassword(req.body.password) === true) {
        const teacherJson = teacher.toJSON();
        res.send({
          user: teacherJson,
          token: jwtController.jwtSignUser(teacherJson, 'teacher'),
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
  }

  readonly getTeachers = async (req, res, _next) => {
    try {
      const teachers = await teacherController.getTeachers();
      res.json(teachers);
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly getTeacherById = async (req, res, _next) => {
    try {
      const teacher = await teacherController.getTeacherById(req.params.id);
      res.json(teacher);
    }
    catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  }

  readonly registerTeacher = async (req, res, _next) => {
    try {
      const teacher = await teacherController.addTeacher(req.body);
      res.json(teacher);
      return res.status(200).end();
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly addLearningResource = async (req, res, _next) => {
    try {
      await teacherController.addResource(req.body, req.params.teacherId);
      return res.status(200).end();
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly updateTeacher = async (req, res, _next) => {
    try {
      const updatedTeacher = await teacherController.updateTeacher(req.params.id, req.body);
      const updatedTeacherJson: string = updatedTeacher.toJSON();
      res.send({
        user: updatedTeacherJson,
        token: jwtController.jwtSignUser(updatedTeacherJson, 'teacher')
      });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }

  readonly getTotalNoOfResources = async (req, res, _next) => {
    try {
      //get the total number of items used for pagination
      const teacherId = req.params.teacherId;
      const response = await teacherController.getTotaNrOfLinks(teacherId);
      return res.json(Number(response));
    } catch (err) {
      res.status(500).end();
    }
  }

  readonly getResourcesPerPage = async (req, res, _next) => {
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
  }

  readonly deleteResource = async (req, res, _next) => {
    try {
      const teacherId = req.params.teacherId;
      await teacherController.deleteResource(teacherId, req.params.resourceId);
      res.status(204).end();
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }
}