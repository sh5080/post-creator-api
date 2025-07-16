import {
  BadRequestException,
  NotFoundException,
} from "@common/types/response.type";
import { User, USER_ROLE } from "@common/models/user.model";
import {
  CreateUserDto,
  UpdateNicknameDto,
  UpdatePasswordDto,
} from "./dto/user.dto";
import * as bcrypt from "bcrypt";

export class UserService {
  async createUser(dto: CreateUserDto) {
    const existingUser = await User.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException("이미 존재하는 이메일입니다.");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new User({
      nickname: dto.nickname,
      email: dto.email,
      password: hashedPassword,
      role: USER_ROLE.USER,
    });

    await user.save();
    return user;
  }

  async updateNickname(userId: string, dto: UpdateNicknameDto) {
    const user = await User.findByIdAndUpdate(
      userId,
      { nickname: dto.nickname },
      { new: true }
    );
    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
    return user;
  }
  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
    return user;
  }
}
