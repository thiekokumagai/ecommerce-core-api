import { Module } from '@nestjs/common';

@Module({
  providers: [
    PrismaService,
    JwtServiceCustom,
    JwtStrategy,

    {
      provide: "UserRepository",
      useClass: UserPrismaRepository,
    },

    {
      provide: CreateUserUseCase,
      useFactory: (repo) => new CreateUserUseCase(repo),
      inject: ["UserRepository"],
    },

    {
      provide: LoginUseCase,
      useFactory: (repo, jwt) => new LoginUseCase(repo, jwt),
      inject: ["UserRepository", JwtServiceCustom],
    },

    {
      provide: RefreshTokenUseCase,
      useFactory: (repo, jwt) => new RefreshTokenUseCase(repo, jwt),
      inject: ["UserRepository", JwtServiceCustom],
    },
  ],
  controllers: [AuthController],
})
export class AppModule {}
