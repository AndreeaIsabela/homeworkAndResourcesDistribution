import * as jwt from "jsonwebtoken";
import { config } from '../config/config';


export class TeacherController {
  model: any;
  constructor(teacherModel) {
    this.model = teacherModel;
  }

  jwtSignUser(user) {
    const ONE_DAY: number = 60 * 60 * 24;
    return jwt.sign(user, config.authentication.teacher.jwtSecret, {
      expiresIn: ONE_DAY
    });
  }

  async getTeachers() {
    return await this.model.find();
  }

  async getTotaNrOfLinks(teacherId) {
    const teacher = await this.model.findById(teacherId);
    const resources = teacher.resources;
    return await resources.count();
  }

  async getPageLinks(query, teacherId) {
    const teacher = await this.model.findById(teacherId);
    const resources = teacher.resources;
    return await resources.sort({ _id: -1 }).skip(query.skip).limit(query.limit);
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

  async getTeacher(email) {
    return await this.model.findOne({email:email});
  }

  async deleteTeacher(teacherId, resourceId) {
    return await (this.model.findById(teacherId)).findByIdAndRemove(resourceId);
  }

}
