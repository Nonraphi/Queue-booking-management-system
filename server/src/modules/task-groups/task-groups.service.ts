import { Injectable } from '@nestjs/common';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TaskGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTaskGroupDto: CreateTaskGroupDto) {
    return 'This action adds a new taskGroup';
  }

  findAll() {
    return this.prisma.taskGroup.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} taskGroup`;
  }

  update(id: number, updateTaskGroupDto: UpdateTaskGroupDto) {
    return `This action updates a #${id} taskGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskGroup`;
  }
}
