import { BadRequestException, NotFoundException } from "@nestjs/common";
import {
  CreateUserDto,
  UpdateNicknameDto,
  UpdatePasswordDto,
} from "./dto/user.dto";
import * as bcrypt from "bcrypt";
import { UserRepository } from "./user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException("이미 존재하는 이메일입니다.");
    }
    dto.password = await bcrypt.hash(dto.password, 10);
    return await this.userRepository.createUser(dto);
  }

  async updateNickname(userId: string, dto: UpdateNicknameDto) {
    const user = await this.userRepository.updateNickname(userId, dto);
    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
    return user;
  }
  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    dto.password = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.updatePassword(userId, dto);
    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.userRepository.deleteUser(userId);
    if (!user) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }
    return user;
  }
}
