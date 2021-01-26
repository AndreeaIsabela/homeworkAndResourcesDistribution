const mongoose = require('mongoose');
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';

const ObjectId = mongoose.Types.ObjectId;

export class UploaderController {
  private model: any;

  constructor(homeworkModel) {
    this.model = homeworkModel;
  }

  async save(file, params): Promise<String> {
    const tmp_path = file.path;
    const target_path = 'files/' + params.userId + '/';
    const savingPath = target_path + file.originalname;
    //get file extension
    this.checkExtension(file.originalname);

    //creates a new file with the specified path
    mkdirp('client/' + target_path, (err, res) => {
      if (err) {
        throw 'No can do';
      }
      //copy the file from uploads and put in in target path
      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream('client/' + savingPath);
      src.pipe(dest);
    });
    return savingPath;
  }
  async download(fileId) {
    try{
    let f = await this.getLink(fileId);
    let resolve = require('path').resolve;
    let abs = resolve('./client/' + f.filePath);
    return await fs.createReadStream(abs);
    } catch(error){
      console.log(error);
    }
  }

  checkExtension(fname) {
    const extension = fname.slice((fname.lastIndexOf('.') - 1 >>> 0) + 2);
    if (extension !== 'zip' && extension !== 'rar' && extension !== '7z') {
      throw 'No can do';
    }
  }

  async updateLink(userId, updateDate, filePath, homeworkId) {
    var resp =  await this.model.updateOne({'students.userId': userId, _id: homeworkId },{
      $set: {'students.$.updateDate': updateDate, 'students.$.filePath': filePath }}, { new: true });
    return resp;
  }

  async getLink(id) {
    const linkList = await this.model.findOne({ 'students.userId': { $eq: ObjectId(id) } }, {students: 1}) ;
    const students = linkList.students;

    return students[0];
  }
}