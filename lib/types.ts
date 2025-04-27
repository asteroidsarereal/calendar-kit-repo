export type CalendarItemType =
  | 'LEAVE'
  | 'HOLIDAY'
  | 'BIRTHDAY'
  | 'ABSENCE';

export type CalendarItemEmployee = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  departmentName: string;
  avatarUrl?: string;
};

export type CalendarItem = {
  id: number;
  startDate: string;
  endDate: string;
  type: string;
  itemType: CalendarItemType; // Formatted type for color coding
  object_type: string;
  employee: CalendarItemEmployee;
};
