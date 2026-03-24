import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskNameDto } from './create-task-name.dto';

export class UpdateTaskNameDto extends PartialType(CreateTaskNameDto) {}
