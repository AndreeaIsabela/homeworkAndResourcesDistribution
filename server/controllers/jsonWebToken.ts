import * as jwt from "jsonwebtoken";
import { config } from '../config/config';

export class JsonWebToken {

  constructor() { }

  jwtSignUser(user, userType) {
    const ONE_DAY: number = 60 * 60 * 24;
    return jwt.sign(user, config.authentication[userType].jwtSecret, {
      expiresIn: ONE_DAY
    });
  }
}