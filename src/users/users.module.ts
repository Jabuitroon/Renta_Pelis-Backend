import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BcryptService } from '../providers/hashing/bcrypt.service';
import { HashingService } from '../providers/hashing/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    UsersService,
  ],
})
export class UsersModule {}
