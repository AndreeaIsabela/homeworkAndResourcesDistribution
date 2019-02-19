import { Document, Schema, Model, model} from "mongoose";
const SHA256 = require('crypto-js/sha256');

interface IStudent {
  password: string
}

export interface IStudentModel extends IStudent, Document { };

export const studentSchema: Schema = new Schema({
  email: {required: true, type: String},
  password: {required: true, type: String},
  name: {required: true, type: String},
  surname: {required: true, type: String},
});

studentSchema.pre('save', function (next) {
  const studentUser = this as IStudentModel;

  // only hash the password if it has been modified (or is new)
  if (!studentUser.isModified('password')) {
    return next();
  }
  // hash the password
  const hash = SHA256(studentUser.password);
  studentUser.password = hash;
  next();
});

studentSchema.methods.comparePassword = function (candidatePassword) {
  try {
    return SHA256(candidatePassword) == this.password; // eslint-disable-line eqeqeq
  }
  catch (err) {
    console.log(err);
  }
};

export const StudentModel: Model<IStudentModel> = model<IStudentModel>('Student', studentSchema);
