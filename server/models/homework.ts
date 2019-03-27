import { Document, Schema, Model, model} from "mongoose";


export interface IHomeworkModel extends  Document { };

export const homeworkSchema: Schema = new Schema({
  teacher: {required: true, type: String},
  students: {type: [String]},
  title: {required: true, type: String},
  date: {required: true, type: String},
  expirationDate: {type: String},
  requirement: {required: true, type: String}

});

export const HomeworkModel: Model<IHomeworkModel> = model<IHomeworkModel>('Homework', homeworkSchema);
