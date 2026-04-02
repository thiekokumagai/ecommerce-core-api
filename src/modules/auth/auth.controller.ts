import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUseCase } from './usecases/login.usecase';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body.email, body.password);
  }
}