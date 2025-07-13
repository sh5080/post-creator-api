import { Request, Response } from "express";
import { UserService } from "./user.service";
import { createUserValidator, CreateUserResponseDto } from "./dto/user.dto";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  signup = async (req: Request, res: Response) => {
    try {
      const dto = createUserValidator.validate(req.body);
      const user = await this.userService.createUser(dto);

      const responseDto: CreateUserResponseDto = {
        email: user.email,
        createdAt: user.createdAt,
      };

      res.status(201).json(responseDto);
    } catch (error) {
      throw error;
    }
  };
}
