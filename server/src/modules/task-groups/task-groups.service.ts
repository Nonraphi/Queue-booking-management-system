import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { PrismaService } from '../../prisma/prisma.service';

function isPrismaUniqueConstraintError(
  error: unknown,
): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

@Injectable()
export class TaskGroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskGroupDto: CreateTaskGroupDto) {
    const name = createTaskGroupDto.name?.trim();

    if (!name) {
      throw new BadRequestException('กรุณาระบุชื่อกลุ่มงาน');
    }

    try {
      return await this.prisma.taskGroup.create({
        data: { name },
      });
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error) && error.code === 'P2002') {
        throw new ConflictException('ชื่อกลุ่มงานนี้มีอยู่แล้ว');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.taskGroup.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} taskGroup`;
  }

  update(id: number, updateTaskGroupDto: UpdateTaskGroupDto) {
    void updateTaskGroupDto;
    return `This action updates a #${id} taskGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskGroup`;
  }
}
