import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../users/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginUseCase {
  constructor(
    private usersRepo: UserRepository,
    private jwt: JwtService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.usersRepo.findByEmail(email);

    if (!user || user.password !== password) {
      throw new Error('Credenciais inválidas');
    }

    return {
      access_token: this.jwt.sign({
        sub: user.id,
        email: user.email,
      }),
    };
  }
}