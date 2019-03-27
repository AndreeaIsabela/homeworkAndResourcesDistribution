export class HomeworkController {
  model: any;
  constructor(homeworkModel) {
    this.model = homeworkModel;
  }

  async getHomeworks() {
    return await this.model.find();
  }

  async getHomeworkById(id) {
    return await this.model.findById(id);
  }

  async addHomework(homework) {
    console.log(homework);
    const newHomework: any = new this.model(homework);
    return await newHomework.save();
  }

  async updateHomework(id, homework) {
    const updatedHomework: any = new this.model(await this.model.findOneAndUpdate({ _id: id }, homework, { new: true }));
    return updatedHomework.save();
  }

  async deleteHomework(id) {
    return await this.model.findByIdAndRemove(id);
  }

}
