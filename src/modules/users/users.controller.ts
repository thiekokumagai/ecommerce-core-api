import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
  } from '@nestjs/swagger';
  
  import { CreateUserDto } from './dto/create-user.dto';
  import { UserResponseDto } from './dto/user-response.dto';
  import {DeleteUserDto} from './dto/delete-user.dto'
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  @ApiTags('Users')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard) 
  @Controller('users')
  export class UsersController {
    constructor(private service: UsersService) {}
    @Get()
    @ApiOperation({ summary: 'Listar usuários' })
    @ApiResponse({
      status: 200,
      description: 'Lista de usuários',
      type: [UserResponseDto],
    })
    findAll() {
      return this.service.findAll();
    }
  
    @Post()
    @ApiOperation({ summary: 'Criar usuário' })
    @ApiResponse({
      status: 201,
      description: 'Usuário criado com sucesso',
      type: UserResponseDto,
    })
    create(@Body() dto: CreateUserDto) {
      return this.service.create(dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Deletar usuário' })
    @ApiResponse({
      status: 200,
      description: 'Usuário removido',
    })
    delete(@Param('id') body: DeleteUserDto) {
      return this.service.delete(body.id);
    }
  }