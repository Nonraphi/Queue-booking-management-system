import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskTypeDto } from './dto/create-task-type.dto';
import { UpdateTaskTypeDto } from './dto/update-task-type.dto';
import { PrismaService } from 'src/prisma/prisma.service';

type TimeSlotInput = {
  dayOfWeek: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  startTime: string;
  endTime: string;
  capacity: number;
};

const dayLabelMap: Record<TimeSlotInput['dayOfWeek'], string> = {
  SUN: 'อาทิตย์',
  MON: 'จันทร์',
  TUE: 'อังคาร',
  WED: 'พุธ',
  THU: 'พฤหัสบดี',
  FRI: 'ศุกร์',
  SAT: 'เสาร์',
};

function toMinutes(time: string): number {
  const [hourText = '0', minuteText = '0'] = time.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return Number.NaN;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return Number.NaN;

  return hour * 60 + minute;
}

function validateTimeSlots(timeSlots: TimeSlotInput[]) {
  const grouped = new Map<TimeSlotInput['dayOfWeek'], TimeSlotInput[]>();

  for (const slot of timeSlots) {
    const bucket = grouped.get(slot.dayOfWeek) ?? [];
    bucket.push(slot);
    grouped.set(slot.dayOfWeek, bucket);
  }

  for (const [day, slots] of grouped.entries()) {
    const dayLabel = dayLabelMap[day] ?? day;

    const ranges = slots.map((slot) => ({
      start: toMinutes(slot.startTime),
      end: toMinutes(slot.endTime),
    }));

    if (
      ranges.some(
        (range) => Number.isNaN(range.start) || Number.isNaN(range.end),
      )
    ) {
      throw new BadRequestException(`ช่วงเวลาของวัน ${dayLabel} ไม่ถูกต้อง`);
    }

    if (ranges.some((range) => range.start >= range.end)) {
      throw new BadRequestException(
        `เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุดของวัน ${dayLabel}`,
      );
    }

    const sorted = [...ranges].sort((a, b) => a.start - b.start);
    for (let index = 1; index < sorted.length; index += 1) {
      const previous = sorted[index - 1];
      const current = sorted[index];

      if (current.start < previous.end) {
        throw new BadRequestException(`ช่วงเวลาซ้อนกันในวัน ${dayLabel}`);
      }
    }
  }
}

@Injectable()
export class TaskTypesService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskTypeDto: CreateTaskTypeDto) {
    const { timeSlots, startDate, recommendation } = createTaskTypeDto;
    const branchId = Number(createTaskTypeDto.branchId);
    const taskGroupId = Number(createTaskTypeDto.taskGroupId);
    const taskNameId = Number(createTaskTypeDto.taskNameId);

    if (
      ![branchId, taskGroupId, taskNameId].every(
        (value) => Number.isInteger(value) && value > 0,
      )
    ) {
      throw new BadRequestException(
        'branchId, taskGroupId และ taskNameId ต้องเป็นตัวเลขที่ถูกต้อง',
      );
    }

    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      throw new BadRequestException('ต้องมีช่วงเวลาอย่างน้อย 1 รายการ');
    }

    validateTimeSlots(timeSlots);

    const parsedStartDate = new Date(startDate);
    if (Number.isNaN(parsedStartDate.getTime())) {
      throw new BadRequestException('startDate ไม่ถูกต้อง');
    }

    const [branch, taskGroup, taskName] = await Promise.all([
      this.prisma.branch.findUnique({
        where: { id: branchId },
        select: { id: true },
      }),
      this.prisma.taskGroup.findUnique({
        where: { id: taskGroupId },
        select: { id: true },
      }),
      this.prisma.taskName.findUnique({
        where: { id: taskNameId },
        select: { id: true, taskGroupId: true },
      }),
    ]);

    if (!branch) {
      throw new BadRequestException('ไม่พบสาขาที่เลือก');
    }

    if (!taskGroup) {
      throw new BadRequestException('ไม่พบกลุ่มงานที่เลือก');
    }

    if (!taskName) {
      throw new BadRequestException('ไม่พบประเภทงานที่เลือก');
    }

    if (taskName.taskGroupId !== taskGroupId) {
      throw new BadRequestException('ประเภทงานไม่ตรงกับกลุ่มงานที่เลือก');
    }

    return this.prisma.taskType.create({
      data: {
        branchId,
        taskGroupId,
        taskNameId,
        startDate: parsedStartDate,
        recommendation,
        timeSlots: {
          create: timeSlots.map((slot) => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            capacity: Math.max(1, Number(slot.capacity) || 1),
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

  async update(id: number, updateTaskTypeDto: UpdateTaskTypeDto) {
    const existing = await this.prisma.taskType.findUnique({
      where: { id },
      include: { timeSlots: true },
    });

    if (!existing) {
      throw new BadRequestException('ไม่พบข้อมูลประเภทงานที่ต้องการแก้ไข');
    }

    const startDate = updateTaskTypeDto.startDate
      ? new Date(updateTaskTypeDto.startDate)
      : existing.startDate;

    if (Number.isNaN(startDate.getTime())) {
      throw new BadRequestException('startDate ไม่ถูกต้อง');
    }

    const nextTimeSlots = Array.isArray(updateTaskTypeDto.timeSlots)
      ? updateTaskTypeDto.timeSlots
      : existing.timeSlots;

    if (!Array.isArray(nextTimeSlots) || nextTimeSlots.length === 0) {
      throw new BadRequestException('ต้องมีช่วงเวลาอย่างน้อย 1 รายการ');
    }

    validateTimeSlots(nextTimeSlots);

    return this.prisma.$transaction(async (tx) => {
      await tx.timeSlot.deleteMany({ where: { taskTypeId: id } });

      return tx.taskType.update({
        where: { id },
        data: {
          startDate,
          recommendation:
            updateTaskTypeDto.recommendation !== undefined
              ? updateTaskTypeDto.recommendation
              : existing.recommendation,
          timeSlots: {
            create: nextTimeSlots.map((slot) => ({
              dayOfWeek: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
              capacity: Math.max(1, Number(slot.capacity) || 1),
            })),
          },
        },
        include: {
          branch: true,
          taskGroup: true,
          taskName: true,
          timeSlots: true,
        },
      });
    });
  }

  remove(id: number) {
    return this.prisma.taskType.delete({
      where: { id },
    });
  }
}
