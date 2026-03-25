import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskNameDto } from './dto/create-task-name.dto';
import { UpdateTaskNameDto } from './dto/update-task-name.dto';
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
export class TaskNamesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskNameDto: CreateTaskNameDto) {
    const name = createTaskNameDto.name?.trim();
    const taskGroupId = Number(createTaskNameDto.taskGroupId);

    if (!name) {
      throw new BadRequestException('กรุณาระบุชื่องาน');
    }

    if (!Number.isInteger(taskGroupId) || taskGroupId <= 0) {
      throw new BadRequestException('taskGroupId ไม่ถูกต้อง');
    }

    const taskGroup = await this.prisma.taskGroup.findUnique({
      where: { id: taskGroupId },
      select: { id: true },
    });

    if (!taskGroup) {
      throw new NotFoundException('ไม่พบกลุ่มงานที่ระบุ');
    }

    try {
      return await this.prisma.taskName.create({
        data: {
          name,
          taskGroupId,
        },
      });
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error) && error.code === 'P2002') {
        throw new ConflictException('ชื่องานนี้มีอยู่แล้วในกลุ่มงานนี้');
      }
      throw error;
    }
  }

  findAll(groupId?: number | string) {
    const parsedGroupId =
      typeof groupId === 'string' ? Number.parseInt(groupId, 10) : groupId;

    if (Number.isInteger(parsedGroupId)) {
      return this.prisma.taskName.findMany({
        where: {
          taskGroupId: parsedGroupId,
        },
      });
    }
    return this.prisma.taskName.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} taskName`;
  }

  update(id: number, updateTaskNameDto: UpdateTaskNameDto) {
    void updateTaskNameDto;
    return `This action updates a #${id} taskName`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskName`;
  }
}
