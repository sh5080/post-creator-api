import { Request, Response } from "express";
import { UserService } from "./user.service";
import { createUserValidator } from "./dto/user.dto";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  signup = async (req: Request, res: Response) => {
    const dto = createUserValidator.validate(req.body);
    try {
      const user = await this.userService.createUser(dto);

      res.status(201).json({ user });
    } catch (error) {
      throw error;
    }
  };
}
