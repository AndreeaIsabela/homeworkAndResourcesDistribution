import * as jwt from "jsonwebtoken";
import { config } from '../config/config';


export class StudentController {
  model: any;
  constructor(studentModel) {
    this.model = studentModel;
  }

  jwtSignUser(user) {
    const ONE_DAY: number = 60 * 60 * 24;
    return jwt.sign(user, config.authentication.student.jwtSecret, {
      expiresIn: ONE_DAY
    });
  }

  async getStudents() {
    return await this.model.find();
  }

  async getStudentById(id) {
    return await this.model.findById(id);
  }

  async addStudent(student) {
    console.log(student);
    const newStudent: any = new this.model(student);
    return await newStudent.save();
  }

  async updateStudent(id, student) {
    const updatedStudent: any = new this.model(await this.model.findOneAndUpdate({ _id: id }, student, { new: true }));
    return updatedStudent.save();
  }

  async getStudent(email) {
    return await this.model.findOne({email: email});
  }

  async deleteStudent(id) {
    return await this.model.findByIdAndRemove(id);
  }

}
