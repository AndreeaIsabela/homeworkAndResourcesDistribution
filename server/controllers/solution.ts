export class SolutionController {
  model: any;
  constructor(solutionModel) {
    this.model = solutionModel;
  }

  async getSolutions() {
    return await this.model.find();
  }

  async getSolutionById(id) {
    return await this.model.findById(id);
  }

  async addSolution(solution) {
    const newSolution: any = new this.model(solution);
    return await newSolution.save();
  }

  async deleteSolution(id) {
    return await this.model.findByIdAndRemove(id);
  }

}
