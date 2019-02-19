import { Document, Schema, Model, model} from "mongoose";
const SHA256 = require('crypto-js/sha256');

interface ITeacher {
  password: string
}

export interface ITeacherModel extends ITeacher, Document { };

export const teacherSchema: Schema = new Schema({
    email: {required: true, type: String},
    password: {required: true, type: String},
    name: {required: true, type: String},
    surname: {required: true, type: String},
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
