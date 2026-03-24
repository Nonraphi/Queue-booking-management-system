import { Injectable } from '@nestjs/common';
import { CreateTaskNameDto } from './dto/create-task-name.dto';
import { UpdateTaskNameDto } from './dto/update-task-name.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TaskNamesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTaskNameDto: CreateTaskNameDto) {
    return 'This action adds a new taskName';
  }

  findAll(groupId?: number) {
    if (groupId) {
      return this.prisma.taskName.findMany({
        where: {
          taskGroupId: groupId,
        },
      });
    }
    return this.prisma.taskName.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} taskName`;
  }

  update(id: number, updateTaskNameDto: UpdateTaskNameDto) {
    return `This action updates a #${id} taskName`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskName`;
  }
}
