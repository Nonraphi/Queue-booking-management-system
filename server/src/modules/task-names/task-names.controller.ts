import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskNamesService } from './task-names.service';
import { CreateTaskNameDto } from './dto/create-task-name.dto';
import { UpdateTaskNameDto } from './dto/update-task-name.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('api/task-names')
export class TaskNamesController {
  constructor(
    private readonly taskNamesService: TaskNamesService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  create(@Body() createTaskNameDto: CreateTaskNameDto) {
    return this.taskNamesService.create(createTaskNameDto);
  }

  @Get()
  findAll(@Query('groupId') groupId?: string) {
    return this.taskNamesService.findAll(groupId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskNamesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskNameDto: UpdateTaskNameDto,
  ) {
    return this.taskNamesService.update(+id, updateTaskNameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskNamesService.remove(+id);
  }
}
