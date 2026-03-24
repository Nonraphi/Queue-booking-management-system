import { Injectable } from '@nestjs/common';
import { CreateTaskTypeDto } from './dto/create-task-type.dto';
import { UpdateTaskTypeDto } from './dto/update-task-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { time } from 'console';

@Injectable()
export class TaskTypesService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskTypeDto: CreateTaskTypeDto) {
    const { timeSlots, startDate, ...taskTypeData } = createTaskTypeDto;

    return this.prisma.taskType.create({
      data: {
        ...taskTypeData,
        startDate: new Date(startDate),
        timeSlots: {
          create: timeSlots.map((slot) => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            capacity: slot.capacity,
          })),
        },
      },

      include: {
        timeSlots: true,
      },
    });
  }

  async findAll() {
    return this.prisma.taskType.findMany({
      include: {
        branch: true,
        taskGroup: true,
        taskName: true,
        timeSlots: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.taskType.findUnique({
      where: { id },
      include: { timeSlots: true },
    });
  }

  remove(id: number) {
    return this.prisma.taskType.delete({
      where: { id },
    });
  }
}
