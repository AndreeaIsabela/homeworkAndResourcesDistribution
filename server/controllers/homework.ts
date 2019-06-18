var mongoose = require('mongoose');
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import { Stream, Readable } from 'stream';
var nodemailer = require("nodemailer");

var ObjectId = mongoose.Types.ObjectId;
export class HomeworkController {
  model: any;
  constructor(homeworkModel) {
    this.model = homeworkModel;
  }

  async getHomeworksByTecherID(teacherId) {
    return await this.model.find({ tacher: teacherId });
  }

  async getTotaNrOfLinks(userId) {
    var user = await this.model.find({ teacher: userId });
    if(!user.length){
      user = await this.model.find({ 'students.userId': userId });
    }
    return user.length;
  }

  async getPageLinks(query, userId) {
    var homework = await this.model.find({ teacher: userId });
    if(!homework.length){
      homework = await this.model.find({ 'students.userId': userId });
    }
    const array = homework.slice(query.skip, query.limit);
    return array.reverse();
  }

  async getHomeworkById(id) {
    return await this.model.findById(id);
  }

  async getStudents(id) {
    const homework =  await this.model.findById(id);
    return homework.students;
  }

  async addHomework(homework) {
    const newHomework: any = new this.model(homework);
    newHomework.teacher = new ObjectId(homework.teacher);
    return await newHomework.save();
  }

  async addComment(homeworkId, comment) {
    const homework: any = await this.model.findById(homeworkId);
    comment._id = new ObjectId;
    homework.comments.push(comment);
    return await homework.save();
  }

  async addStudentToHomework(homeworkId, student) {
    const homework: any = await this.model.findById(homeworkId);
    student.id = new ObjectId(student.id);
    student.filePath = '';
    student.updateDate = '';
    student.grade = 0;
    student.observations = '';
    homework.students.push(student);
    return await homework.save();
  }

  async updateHomework(id, homework) {
    const updatedHomework: any = new this.model(await this.model.findOneAndUpdate({ _id: id }, homework, { new: true }));
    return await updatedHomework.save();
  }

  async addStudentResources(id, resource) {
    const homework: any = await this.model.findById(id);
    homework.studentResources.push(resource);
    return await homework.save();
  }

  async deleteHomework(teacherId, homeworkId) {
    return await this.model.findOneAndRemove({ teacher: teacherId, _id: homeworkId });
  }

  async save(file, params): Promise<String> {
    const tmp_path = file.path;
    const target_path = 'files/' + params.userId + '/';
    const savingPath = target_path + file.originalname;
    //get file extension
    this.checkExtension(file.originalname);

    //creates a new file with the specified path
    mkdirp('client/' + target_path, (err, res) => {
      if (err) {
        throw 'No can do';
      }
      //copy the file from uploads and put in in target path
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream('client/' + savingPath);
      src.pipe(dest);
    });
    return savingPath;
  }
  async download(fileId) {
    try{
    let f = await this.getLink(fileId);
    let resolve = require('path').resolve;
    let abs = resolve('./client/' + f.filePath);
    return await fs.createReadStream(abs);
    } catch(error){
      console.log(error);
    }
  }

  checkExtension(fname) {
    const extension = fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2);
    if (extension !== 'zip' && extension !== 'rar' && extension !== '7z') {
      throw 'No can do';
    }
  }

  async updateLink(userId, updateDate, filePath) {
    var resp =  await this.model.updateOne({'students.userId': userId },{
      $set: {'students.$.updateDate': updateDate, 'students.$.filePath': filePath }}, { new: true });
    return resp;
  }

  async gradeSolution(userId, grade, observations, homeworkId) {
    var resp =  await this.model.updateOne({'students.userId': userId },{
      $set: {'students.$.grade': grade, 'students.$.observations': observations }}, { new: true });
    const homework = await this.model.findById(homeworkId);
    const student = await this.model.findOne({ 'students.userId': { $eq: ObjectId(userId) } }, {students: 1}) ;
    const studentEmail = {
      subject: 'Grade for ' + homework.title,
      grade: 'Your grade is: ' + student.students[0].grade,
      email: student.students[0].userEmail,
      observations: 'Observations: ' + student.students[0].observations
    }

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
             user: 'edreho@gmail.com',
             pass: 'qwert12345ASD!@#'
         }
     });

    let info = await transporter.sendMail({
      from: 'edreho96@gmail.com', // sender address
      to: studentEmail.email, // list of receivers
      subject: studentEmail.subject, // Subject line
      text: studentEmail.grade + "\n" + studentEmail.observations // plain text body
    });

    var url  = nodemailer.getTestMessageUrl(info);
    return resp;
  }

  async getLink(id) {
    const linkList = await this.model.findOne({ 'students.userId': { $eq: ObjectId(id) } }, {students: 1}) ;
    const students = linkList.students;

    return students[0];
  }
}
