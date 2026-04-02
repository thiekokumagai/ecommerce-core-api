import {
    Injectable,
    UnauthorizedException,
    ForbiddenException,
  } from '@nestjs/common';
  import { PrismaService } from '../../../prisma/prisma.service';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwt: JwtService,
    ) {}
  
    async login(email: string, password: string) {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
  
      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
  
      const tokens = await this.generateTokens(user.id, user.email);
  
      await this.updateRefreshToken(user.id, tokens.refreshToken);
  
      return tokens;
    }
    async refresh(userId: string, refreshToken: string) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user || !user.refreshToken) {
        throw new ForbiddenException('Acesso negado');
      }
  
      const tokenMatch = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
  
      if (!tokenMatch) {
        throw new ForbiddenException('Token inválido');
      }
  
      const tokens = await this.generateTokens(user.id, user.email);
  
      await this.updateRefreshToken(user.id, tokens.refreshToken);
  
      return tokens;
    }
    async logout(userId: string) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          refreshToken: null,
        },
      });
    }
    private async generateTokens(userId: string, email: string) {
      const payload = {
        sub: userId,
        email,
      };
  
      const accessToken = await this.jwt.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });
  
      const refreshToken = await this.jwt.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });
  
      return {
        accessToken,
        refreshToken,
      };
    }
    private async updateRefreshToken(userId: string, refreshToken: string) {
      const hash = await bcrypt.hash(refreshToken, 10);
  
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          refreshToken: hash,
        },
      });
    }
  }