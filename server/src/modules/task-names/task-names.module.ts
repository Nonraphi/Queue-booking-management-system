import { Module } from '@nestjs/common';
import { TaskNamesService } from './task-names.service';
import { TaskNamesController } from './task-names.controller';

@Module({
  controllers: [TaskNamesController],
  providers: [TaskNamesService],
})
export class TaskNamesModule {}
