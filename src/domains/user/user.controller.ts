import { UserService } from "./user.service";
import {
  createUserValidator,
  updateNicknameValidator,
  UpdateNicknameResponseDto,
  updatePasswordValidator,
  UpdatePasswordResponseDto,
  CreateUserDto,
} from "./dto/user.dto";
import { AuthRequest } from "@common/types/request.type";
import { Controller, Post, Req, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@common/guards/auth.guard";
import { ApiGuard } from "@common/guards/api.guard";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("signup")
  async signup(@Body() body: CreateUserDto) {
    const dto = createUserValidator.validate(body);
    const user = await this.userService.createUser(dto);

    return {
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  @Post("update-nickname")
  @UseGuards(AuthGuard, ApiGuard)
  async updateNickname(@Req() req: AuthRequest, @Body() body: any) {
    const dto = updateNicknameValidator.validate(body);
    const { userId } = req.user!;
    const user = await this.userService.updateNickname(userId, dto);

    const responseDto: UpdateNicknameResponseDto = {
      nickname: user.nickname,
      updatedAt: user.updatedAt,
    };

    return responseDto;
  }

  @Post("update-password")
  @UseGuards(AuthGuard, ApiGuard)
  async updatePassword(@Req() req: AuthRequest, @Body() body: any) {
    const dto = updatePasswordValidator.validate(body);
    const { userId } = req.user!;
    const user = await this.userService.updatePassword(userId, dto);

    const responseDto: UpdatePasswordResponseDto = {
      updatedAt: user.updatedAt,
    };

    return responseDto;
  }

  @Post("delete")
  @UseGuards(AuthGuard, ApiGuard)
  async deleteUser(@Req() req: AuthRequest) {
    const { userId } = req.user!;
    await this.userService.deleteUser(userId);

    return { message: "사용자가 성공적으로 삭제되었습니다." };
  }
}
