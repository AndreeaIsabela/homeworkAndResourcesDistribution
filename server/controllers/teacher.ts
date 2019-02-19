import * as jwt from "jsonwebtoken";
import { config } from '../config/config';


export class TeacherController {
  model: any;
  constructor(teacherModel) {
    this.model = teacherModel;
  }

  jwtSignUser(user) {
    const ONE_DAY: number = 60 * 60 * 24;
    return jwt.sign(user, config.authentification.jwtSecret, {
      expiresIn: ONE_DAY
    });
  }

  async getTeachers() {
    return await this.model.find();
  }

  async getTeacherById(id) {
    return await this.model.findById(id);
  }

  async addTeacher(teacher) {
    console.log(teacher);
    const newTeacher: any = new this.model(teacher);
    return await newTeacher.save();
  }

  async updateTeacher(id, teacher) {
    const updatedTeacher: any = new this.model(await this.model.findOneAndUpdate({ _id: id }, teacher, { new: true }));
    return updatedTeacher.save();
  }

  async getTeacher() {
    return await this.model.findOne();
  }

  async deleteTeacher(id) {
    return await this.model.findByIdAndRemove(id);
  }

}
