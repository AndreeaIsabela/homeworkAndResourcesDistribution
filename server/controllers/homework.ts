var mongoose = require('mongoose');

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
    console.log(homework);
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
    homework.students.push(student);
    return await homework.save();
  }

  async updateHomework(id, homework) {
    const updatedHomework: any = new this.model(await this.model.findOneAndUpdate({ _id: id }, homework, { new: true }));
    return updatedHomework.save();
  }

  async deleteHomework(teacherId, homeworkId) {
    return await this.model.findOneAndRemove({ teacher: teacherId, _id: homeworkId });
  }

}
