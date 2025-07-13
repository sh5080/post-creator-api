import { BadRequestException } from "@common/types/response.type";
import { hashPassword } from "@common/utils/crypto.util";
import { User, USER_ROLE } from "@common/models/user.model";
import { CreateUserDto } from "./dto/user.dto";

export class UserService {
  async createUser(dto: CreateUserDto) {
    const existingUser = await User.findOne({ email: dto.email });
    if (existingUser) {
      throw new BadRequestException("이미 존재하는 이메일입니다.");
    }

    const hashedPassword = await hashPassword(dto.password);
    const user = new User({
      email: dto.email,
      password: hashedPassword,
      role: USER_ROLE.USER,
    });

    await user.save();
    return user;
  }
}
