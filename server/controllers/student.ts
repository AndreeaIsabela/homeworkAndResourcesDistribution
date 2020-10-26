var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

export class StudentController {
  model: any;
  constructor(studentModel) {
    this.model = studentModel;
  }

  async getStudents() {
    return await this.model.find();
  }

  async getStudentById(id) {
    return await this.model.findById(id);
  }

  async addStudent(student) {
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
  async getTotaNrOfLinks(studentId) {
    const student = await this.model.findById(studentId);
    const resources = student.resources;
    return resources.length;
  }

  async addResource(resource, studentId) {
    const student: any = await this.model.findById(studentId);
    resource._id = new ObjectId;
    student.resources.push(resource);
    return await student.save();
  }
  async getPageLinks(query, studentId) {
    const student = await this.model.findById(studentId);
    const resources = student.resources;
    const array = resources.slice(query.skip, query.limit);
    return array.reverse();
  }
  async deleteResource(studentId, resourceId) {
    const student: any = await this.model.findById(studentId);
    var index = student.resources.map(x => {
      return x._id;
    }).indexOf(resourceId);
    student.resources.splice(index, 1);
    return await student.save();
  }
}
