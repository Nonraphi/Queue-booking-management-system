import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
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
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBranchDto: CreateBranchDto) {
    const name = createBranchDto.name?.trim();

    if (!name) {
      throw new BadRequestException('กรุณาระบุชื่อสาขา');
    }

    try {
      return await this.prisma.branch.create({
        data: { name },
      });
    } catch (error: unknown) {
      if (isPrismaUniqueConstraintError(error) && error.code === 'P2002') {
        throw new ConflictException('ชื่อสาขานี้มีอยู่แล้ว');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.branch.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} branch`;
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    void updateBranchDto;
    return `This action updates a #${id} branch`;
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
