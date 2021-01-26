import { Document, Schema, Model, model} from 'mongoose';

export interface ISolutionModel extends Document { };

export const solutionSchema: Schema = new Schema({
  homework: {required: true, type: String},
  studentName: {type: String, required: true},
  updateDate: {required: true, type: String},
  filePath: {type: String}
});

export const SolutionModel: Model<ISolutionModel> = model<ISolutionModel>('Solution', solutionSchema);
