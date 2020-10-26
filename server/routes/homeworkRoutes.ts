import { HomeworkController } from '../controllers/homework';
import { HomeworkModel as HomeworkModel } from '../models/homework';
import { UploaderController } from '../controllers/uploader';

// injecting the homework model in the controller instance
const homeworkController = new HomeworkController(HomeworkModel);
const uploaderController = new UploaderController(HomeworkModel);

export class HomeworkRoutes {

  constructor() { }

  readonly getTeacherID = async (req, res, _next) => {
    try {
      const homeworks = await homeworkController.getHomeworksByTecherID(req.params.teacherId);
      res.json(homeworks);
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly getNoOfResources = async (req, res, _next) => {
    try {
      //get the total number of items used for pagination
      const userId = req.params.userId;
      const response = await homeworkController.getTotaNrOfLinks(userId);
      return res.json(Number(response));
    } catch (err) {
      res.status(500).end();
    }
  }

  readonly getResourcesPerPage = async (req, res, _next) => {
    try {
      const userId = req.params.userId;
      const pageNo = parseInt(req.params.page);
      const size = 20;
      var query: any = {};
      if (pageNo < 0 || pageNo === 0) {
        const response = { 'error': true, 'message': 'invalid page number, should start with 1' };
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
  }

  readonly getHomeworkById = async (req, res, _next) => {
    try {
      const homework = await homeworkController.getHomeworkById(req.params.id);
      res.json(homework);
    }
    catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  }

  readonly getStudentsPerHomework = async (req, res, _next) => {
    try {
      const students = await homeworkController.getStudents(req.params.id);
      res.json(students);
    }
    catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  }

  readonly addHomework = async (req, res, _next) => {
    try {
      await homeworkController.addHomework(req.body);
      return res.status(200).end();
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly assignHomeworkToStudent = async (req, res, _next) => {
    try {
      await homeworkController.addStudentToHomework(req.params.homeworkId, req.body);
      return res.status(200).end();
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly addComment = async (req, res, _next) => {
    try {
      await homeworkController.addComment(req.params.id, req.body);
      return res.status(200).end();
    } catch (err) {
      return res.status(500).end();
    }
  }

  readonly updateHomework = async (req, res, _next) => {
    try {
      await homeworkController.updateHomework(req.params.id, req.body);
      res.status(204).end();
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }

  readonly addStudentResources = async (req, res, _next) => {
    try {
      await homeworkController.addStudentResources(req.params.homeworkId, req.body);
      res.status(204).end();
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }

  readonly deleteHomework = async (req, res, _next) => {
    try {
      await homeworkController.deleteHomework(req.params.teacherId, req.params.homeworkId);
      res.status(204).end();
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }

  readonly uploadHomework = async (req, res, _next) => {
    try {
      let updateDate = req.body.updateDate;
      let filePath = req.body.filePath
      if (req.file) {
        filePath = await uploaderController.save(req.file, req.params);
      }
      //update filePath and update date
      const updatedLink = await uploaderController.updateLink(req.params.userId, updateDate, filePath, req.params.homeworkId);
      res.json(updatedLink);
    } catch (err) {
      if (err == 'No can do')
        return res.status(400).end();
      console.log(err);
      res.status(500).end();
    }
  }

  readonly downloadStudentHomework = async (req, res, _next) => {
    try {
      var fileId = req.params.fileId;

      res.attachment(fileId);
      var fileStream = await uploaderController.download(fileId);
      fileStream.pipe(res);
    } catch (err) {
      res.status(500).end();
    }
  }

  readonly updateLink = async (req, res, _next) => {
    try {
      const updatedLink = await uploaderController.updateLink(req.params.userId, req.body.updateDate, req.body.filePath, req.body.homeworkId);
      res.json(updatedLink);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }

  readonly gradeStudentSolution = async (req, res, _next) => {
    try {
      const solutionGrade = await homeworkController.gradeSolution(req.params.userId, req.body.grade, req.body.observations, req.body.homeworkId);
      res.json(solutionGrade);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }

}