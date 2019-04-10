var mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
export class HomeworkController {
  model: any;
  constructor(homeworkModel) {
    this.model = homeworkModel;
  }

  async getHomeworks(teacherId) {
    return await this.model.find({ tacher: teacherId });
  }

  async getTotaNrOfLinks(teacherId) {
    const teacher = await this.model.find({ teacher: teacherId });
    return teacher.length;
  }

  async getPageLinks(query, teacherId) {
    const homework = await this.model.find({ teacher: teacherId });
    const array = homework.slice(query.skip, query.limit);
    return array.reverse();
  }
  async getHomeworkById(id) {
    return await this.model.findById(id);
  }

  async addHomework(homework) {
    console.log(homework);
    const newHomework: any = new this.model(homework);
    newHomework.teacher = new ObjectId(homework.teacher);
    return await newHomework.save();
  }

  async updateHomework(id, homework) {
    const updatedHomework: any = new this.model(await this.model.findOneAndUpdate({ _id: id }, homework, { new: true }));
    return updatedHomework.save();
  }

  async deleteHomework(teacherId, homeworkId) {
    return await this.model.findOneAndRemove({ teacher: teacherId, _id: homeworkId });
  }

}
