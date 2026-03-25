export class CreateTimeSlotDto {
  dayOfWeek: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
  startTime: string;
  endTime: string;
  capacity: number;
}

export class CreateTaskTypeDto {
  branchId: number;
  taskGroupId: number;
  taskNameId: number;
  startDate: string;
  recommendation?: string;

  timeSlots: CreateTimeSlotDto[];
}
