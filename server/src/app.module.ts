import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BranchesModule } from './modules/branches/branches.module';
import { TaskGroupsModule } from './modules/task-groups/task-groups.module';
import { TaskNamesModule } from './modules/task-names/task-names.module';
import { TaskTypesModule } from './modules/task-types/task-types.module';

@Module({
  imports: [
    PrismaModule,
    BranchesModule,
    TaskGroupsModule,
    TaskNamesModule,
    TaskTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
