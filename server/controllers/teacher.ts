import * as jwt from "jsonwebtoken";
import { config } from '../config/config';
var mongoose = require('mongoose');

var ObjectId = mongoose.Types.ObjectId;
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
    return resources.length;
  }

  async getPageLinks(query, teacherId) {
    const teacher = await this.model.findById(teacherId);
    const resources = teacher.resources;
    const array = resources.slice(query.skip, query.limit);
    return array.reverse();
  }

  async getTeacherById(id) {
    return await this.model.findById(id);
  }

  async addTeacher(teacher) {
    console.log(teacher);
    const newTeacher: any = new this.model(teacher);
    return await newTeacher.save();
  }

  async addResource(resource, teacherId) {
    const teacher: any = await this.model.findById(teacherId);
    resource._id = new ObjectId;
    teacher.resources.push(resource);
    return await teacher.save();
  }

  async updateTeacher(id, teacher) {
    const updatedTeacher: any = new this.model(await this.model.findOneAndUpdate({ _id: id }, teacher, { new: true }));
    return updatedTeacher.save();
  }

  async getTeacher(email) {
    return await this.model.findOne({ email: email });
  }

  async deleteResource(teacherId, resourceId) {
    const teacher: any = await this.model.findById(teacherId);
    var index = teacher.resources.map(x => {
      return x._id;
    }).indexOf(resourceId);
    teacher.resources.splice(index, 1);
    console.log(teacher.resources);
    return await teacher.save();
  }

}
