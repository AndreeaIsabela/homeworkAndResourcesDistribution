const mongoose = require('mongoose');
import { MailerController } from './mailer';

const ObjectId = mongoose.Types.ObjectId;
export class HomeworkController {
  model;
  constructor (homeworkModel) {
    this.model = homeworkModel;
  }

  async getHomeworksByTecherID (teacherId) {
    return await this.model.find({ tacher: teacherId });
  }

  async getTotaNrOfLinks (userId) {
    let user = await this.model.find({ teacher: userId });
    if (!user.length) {
      user = await this.model.find({ 'students.userId': userId });
    }
    return user.length;
  }

  async getPageLinks (query, userId) {
    let homework = await this.model.find({ teacher: userId });
    if (!homework.length) {
      homework = await this.model.find({ 'students.userId': userId });
    }
    const array = homework.slice(query.skip, query.limit);
    return array.reverse();
  }

  async getHomeworkById (id) {
    return await this.model.findById(id);
  }

  async getStudents (id) {
    const homework = await this.model.findById(id);
    return homework.students;
  }

  async addHomework (homework) {
    const newHomework: any = new this.model(homework);
    newHomework.teacher = new ObjectId(homework.teacher);
    return await newHomework.save();
  }

  async addComment (homeworkId, comment) {
    const homework: any = await this.model.findById(homeworkId);
    comment._id = new ObjectId;
    homework.comments.push(comment);
    return await homework.save();
  }

  async addStudentToHomework (homeworkId, student) {
    const homework: any = await this.model.findById(homeworkId);
    student.id = new ObjectId(student.id);
    student.filePath = '';
    student.updateDate = '';
    student.grade = 0;
    student.observations = '';
    homework.students.push(student);
    return await homework.save();
  }

  async updateHomework (id, homework) {
    const updatedHomework: any = new this.model(await this.model.findOneAndUpdate({ _id: id }, homework, { new: true }));
    return await updatedHomework.save();
  }

  async addStudentResources (id, resource) {
    const homework: any = await this.model.findById(id);
    homework.studentResources.push(resource);
    return await homework.save();
  }

  async deleteHomework (teacherId, homeworkId) {
    return await this.model.findOneAndRemove({ teacher: teacherId, _id: homeworkId });
  }

  async gradeSolution (userId, grade, observations, homeworkId) {
    let resp = await this.model.updateOne({ 'students.userId': userId }, {
      $set: { 'students.$.grade': grade, 'students.$.observations': observations }
    }, { new: true });

    const homework = await this.model.findById(homeworkId);
    const student = await this.model.findOne({ 'students.userId': { $eq: ObjectId(userId) } }, { students: 1 });
    const studentEmail = {
      subject: 'Grade for ' + homework.title,
      grade: 'Your grade is: ' + student.students[0].grade,
      email: student.students[0].userEmail,
      observations: 'Observations: ' + student.students[0].observations
    };
    const mailer = new MailerController();
    mailer.sendEmail(studentEmail);

    return resp;
  }
}
