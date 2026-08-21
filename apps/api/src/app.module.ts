import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/users/users.module';

@Module({
  imports: [DatabaseModule, UserModule],
})
export class AppModule { }
