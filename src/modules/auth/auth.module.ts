import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './usecases/login.usecase';
import { UserPersistenceModule } from '../users/user-persistence.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserPersistenceModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [LoginUseCase],
})
export class AuthModule {}