import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserRepository } from './repositories/user.repository';
import { UserPrismaRepository } from './repositories/user.prisma.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [UserRepository],
})
export class UserPersistenceModule {}