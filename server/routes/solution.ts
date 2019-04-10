import { Router } from "express";
const solutionRoutes: any = Router();
import { SolutionController } from "../controllers/solution";
import { SolutionModel as SolutionModel } from "../models/solution";

const jwtService = require('../middleware/authenticationMiddleware');

// injecting the solution model in the controller instance
const solutionController = new SolutionController(SolutionModel);

solutionRoutes.get('/', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const solutions = await solutionController.getSolutions();
    res.json(solutions);
  } catch (err) {
    return res.status(500).end();
  }
});

solutionRoutes.get('/:id', jwtService.teacherAuthentication, async (req, res) => {
  try {
    const solution = await solutionController.getSolutionById(req.params.id);
    res.json(solution);
  }
  catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

solutionRoutes.post('/', async (req, res) => {
  try {
    await solutionController.addSolution(req.body);
    return res.status(200).end();
  } catch (err) {
    return res.status(500).end();
  }
});

solutionRoutes.delete('/:id', jwtService.teacherAuthentication, async (req, res) => {
  try {
    await solutionController.deleteSolution(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = solutionRoutes;
