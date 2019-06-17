import { Document, Schema, Model, model } from "mongoose";
const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');

interface ITeacher {
  password: string
}
var ObjectId = mongoose.Schema.ObjectId;
export interface ITeacherModel extends ITeacher, Document { };

export const teacherSchema: Schema = new Schema({
  email: {
    type: String,
    validate: {
      validator: function (email) {
        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const gmailReg = /^(.+?)\++(.+?)@gmail.com/;
        return emailReg.test(email) || gmailReg.test(email);
      },
    },
    required: [true, 'User email required']
  },
  password: { required: true, type: String },
  username: { required: true, type: String },
  resources: {
    type: [{ _id: ObjectId, stars: Number, tags: [String], description: String, title: String, link: String, date: String }]
  }
});

teacherSchema.pre('save', function (next) {
  const teacherUser = this as ITeacherModel;

  // only hash the password if it has been modified (or is new)
  if (!teacherUser.isModified('password')) {
    return next();
  }
  // hash the password
  const hash = SHA256(teacherUser.password);
  teacherUser.password = hash;
  next();
});

teacherSchema.methods.comparePassword = function (candidatePassword) {
  try {
    return SHA256(candidatePassword) == this.password; // eslint-disable-line eqeqeq
  }
  catch (err) {
    console.log(err);
  }
};

export const TeacherModel: Model<ITeacherModel> = model<ITeacherModel>('Teacher', teacherSchema);
