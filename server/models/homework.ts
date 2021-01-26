import { Document, Schema, Model, model } from 'mongoose';
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
export interface IHomeworkModel extends Document { };

export const homeworkSchema: Schema = new Schema({
  teacher: { required: true, type: ObjectId },
  group: { required: true, type: String },
  students: {
    type: [{
      userId: ObjectId, userEmail: String, userName: String,
      filePath: String, updateDate: String, grade: Number,
      observations: String
    }]
  },
  title: { required: true, type: String },
  date: { required: true, type: String },
  expirationDate: { type: String },
  requirement: { required: true, type: String },
  resources: {
    type:
      [{
        _id: ObjectId, stars: Number, tags: [String],
        description: String, title: String, link: String,
        date: String
      }]
  },
  studentResources: {
    type:
      [{
        _id: ObjectId, stars: Number,
        title: String, link: String,
        description: String,
        studentName: String
      }]
  },
  comments: { type: [{ _id: ObjectId, userEmail: String, userId: ObjectId, text: String, date: String }] }
});

export const HomeworkModel: Model<IHomeworkModel> = model<IHomeworkModel>('Homework', homeworkSchema);
