import { CalendarItem, CalendarItemType } from '../types';

// Define the CalendarDay type here since it's not exported from types.ts
type CalendarDay = {
  date: string;
  items: CalendarItem[];
};

// Create a set of fictitious departments
const departments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Product' },
  { id: 3, name: 'Marketing' },
  { id: 4, name: 'Sales' },
  { id: 5, name: 'Customer Support' },
  { id: 6, name: 'Finance' },
  { id: 7, name: 'HR' },
  { id: 8, name: 'Operations' },
];

// Create a set of fictitious divisions
const divisions = [
  { id: 101, name: 'Technology' },
  { id: 102, name: 'Revenue' },
  { id: 103, name: 'Administration' },
  { id: 104, name: 'Customer Success' },
];

// Create a set of fictitious locations
const locations = [
  { id: 201, name: 'London Office' },
  { id: 202, name: 'Manchester Office' },
  { id: 203, name: 'Remote' },
  { id: 204, name: 'Edinburgh Office' },
];

// First names for random generation
const firstNames = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Richard',
  'Joseph',
  'Thomas',
  'Charles',
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'Elizabeth',
  'Barbara',
  'Susan',
  'Jessica',
  'Sarah',
  'Karen',
  'Emma',
  'Olivia',
  'Ava',
  'Isabella',
  'Sophia',
  'Charlotte',
  'Mia',
  'Amelia',
  'Harper',
  'Evelyn',
  'Liam',
  'Noah',
  'Oliver',
  'Elijah',
  'William',
  'James',
  'Benjamin',
  'Lucas',
  'Henry',
  'Alexander',
  'Mohammed',
  'Sofia',
  'Muhammad',
  'Maya',
  'Wei',
  'Chen',
  'Li',
  'Ahmed',
  'Fatima',
  'Omar',
  'Raj',
  'Priya',
  'Akira',
  'Yuki',
  'Jin',
  'Zara',
  'Amir',
  'Ines',
  'Carlos',
  'Elena',
];

// Last names for random generation
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Miller',
  'Davis',
  'Garcia',
  'Rodriguez',
  'Wilson',
  'Martinez',
  'Anderson',
  'Taylor',
  'Thomas',
  'Hernandez',
  'Moore',
  'Martin',
  'Jackson',
  'Thompson',
  'White',
  'Lopez',
  'Lee',
  'Gonzalez',
  'Harris',
  'Clark',
  'Lewis',
  'Robinson',
  'Walker',
  'Perez',
  'Hall',
  'Young',
  'Allen',
  'Sanchez',
  'Wright',
  'King',
  'Scott',
  'Green',
  'Baker',
  'Adams',
  'Nelson',
  'Patel',
  'Singh',
  'Kumar',
  'Shah',
  'Khan',
  'Li',
  'Chen',
  'Yang',
  'Wang',
  'Zhang',
  'Nguyen',
  'Kim',
  'Gupta',
  'Sharma',
  'Ali',
  'Mohammed',
  'Ibrahim',
  'Hassan',
  'Santos',
  'Silva',
];

// Leave types
const leaveTypes = [
  'Holiday',
  'Sick Leave',
  'Personal Leave',
  'Training',
];

// Generate a random date between two dates
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime())
  );
}

// Format date to YYYY-MM-DD
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate a random duration between min and max days
function randomDuration(minDays: number, maxDays: number): number {
  return (
    Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays
  );
}

// Generate a random employee
function generateEmployee(id: number) {
  const firstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];
  const department =
    departments[Math.floor(Math.random() * departments.length)];

  return {
    id,
    first_name: firstName,
    last_name: lastName,
    name: `${firstName} ${lastName}`,
    uuid: `emp-${id}-${Math.random().toString(36).substring(2, 10)}`,
    photo: `https://randomuser.me/api/portraits/${
      Math.random() > 0.5 ? 'men' : 'women'
    }/${(id % 70) + 1}.jpg`,
    department,
  };
}

// Generate a leave request
function generateLeaveRequest(
  id: number,
  employee: any,
  startDate: Date,
  endDate: Date
) {
  const department =
    departments[Math.floor(Math.random() * departments.length)];
  const division =
    divisions[Math.floor(Math.random() * divisions.length)];
  const location =
    locations[Math.floor(Math.random() * locations.length)];
  const type =
    leaveTypes[Math.floor(Math.random() * leaveTypes.length)];

  const halfStart = Math.random() > 0.8;
  const halfEnd = Math.random() > 0.8;

  return {
    id,
    department,
    division,
    employee,
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    half_start: halfStart,
    half_start_am_pm: halfStart
      ? Math.random() > 0.5
        ? 'am'
        : 'pm'
      : null,
    half_end: halfEnd,
    half_end_am_pm: halfEnd
      ? Math.random() > 0.5
        ? 'am'
        : 'pm'
      : null,
    location,
    object_type: 'LeaveRequest',
    type,
  };
}

// Transform the leave request data to match our CalendarItem structure
const transformLeaveRequestToCalendarItem = (
  leaveRequest: any
): CalendarItem => {
  // Determine the item type based on the leave request type
  let itemType: CalendarItemType = 'LEAVE';
  if (leaveRequest.type === 'Holiday') itemType = 'HOLIDAY';
  else if (leaveRequest.type === 'Sick Leave') itemType = 'ABSENCE';

  return {
    id: leaveRequest.id,
    startDate: leaveRequest.start_date,
    endDate: leaveRequest.end_date,
    type: leaveRequest.type,
    itemType: itemType,
    object_type: leaveRequest.object_type,
    employee: {
      id: leaveRequest.employee.id,
      name: leaveRequest.employee.name,
      firstName: leaveRequest.employee.first_name,
      lastName: leaveRequest.employee.last_name,
      departmentName: leaveRequest.department.name,
      avatarUrl: leaveRequest.employee.photo,
    },
  };
};

// Generate date range starting from 2025-01-01 to 2025-12-31
const yearStart = new Date(2025, 0, 1);
const yearEnd = new Date(2025, 11, 31);

// Generate 100 employees
const employeesCount = 100;
let employees = [];
for (let i = 1; i <= employeesCount; i++) {
  employees.push(generateEmployee(i));
}

// Select 60 employees who will have leave requests
const employeesWithLeave = employees
  .sort(() => Math.random() - 0.5)
  .slice(0, 70);

let leaveRequests: any[] = [];
let leaveId = 1;

// Increase number of leave periods per employee and increase their frequency in 2025
employeesWithLeave.forEach((employee) => {
  // Each employee will have 5-12 leave periods (increased from 3-8)
  const numLeavePeriods = Math.floor(Math.random() * 8) + 5;

  for (let i = 0; i < numLeavePeriods; i++) {
    // Generate random start date
    const startDate = randomDate(yearStart, yearEnd);

    // Generate random duration between 1 and 14 days
    const durationDays = randomDuration(1, 14);

    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    // Create leave request
    leaveRequests.push(
      generateLeaveRequest(leaveId++, employee, startDate, endDate)
    );
  }
});

// Add some specific holiday periods to make testing easier
// Add public holidays and important dates
const holidays = [
  { name: "New Year's Day", date: new Date(2025, 0, 1) },
  { name: 'Martin Luther King Jr. Day', date: new Date(2025, 0, 20) },
  { name: "Valentine's Day", date: new Date(2025, 1, 14) },
  { name: "President's Day", date: new Date(2025, 1, 17) },
  { name: "St. Patrick's Day", date: new Date(2025, 2, 17) },
  { name: 'Easter', date: new Date(2025, 3, 20) },
  { name: 'Memorial Day', date: new Date(2025, 4, 26) },
  { name: 'Independence Day', date: new Date(2025, 6, 4) },
  { name: 'Labor Day', date: new Date(2025, 8, 1) },
  { name: 'Halloween', date: new Date(2025, 9, 31) },
  { name: 'Thanksgiving', date: new Date(2025, 10, 27) },
  { name: 'Christmas', date: new Date(2025, 11, 25) },
];

// Add company-wide holidays
holidays.forEach((holiday, index) => {
  // For each holiday, make it a company-wide event
  employees.slice(0, 20).forEach((employee, empIndex) => {
    leaveRequests.push(
      generateLeaveRequest(
        leaveId++,
        employee,
        holiday.date,
        holiday.date
      )
    );
  });
});

// Add some team outings/training days
const teamEvents = [
  {
    name: 'Q1 Team Building',
    date: new Date(2025, 2, 10),
    department: 1,
  },
  {
    name: 'Q2 Team Building',
    date: new Date(2025, 5, 15),
    department: 2,
  },
  {
    name: 'Q3 Team Building',
    date: new Date(2025, 8, 10),
    department: 3,
  },
  {
    name: 'Q4 Team Building',
    date: new Date(2025, 11, 8),
    department: 1,
  },
];

// Add department-specific events
teamEvents.forEach((event) => {
  // Get employees from the specific department
  const deptEmployees = employees
    .filter((emp) => emp.department.id === event.department)
    .slice(0, 8);

  deptEmployees.forEach((employee) => {
    // Create 2-day events
    const endDate = new Date(event.date);
    endDate.setDate(endDate.getDate() + 1);

    leaveRequests.push(
      generateLeaveRequest(leaveId++, employee, event.date, endDate)
    );
  });
});

// Add special events for today to make testing easier
const today = new Date();
const todayFormatted = formatDate(today);
const todayYear = today.getFullYear();
// Create today's date in 2025
const testToday = new Date(2025, today.getMonth(), today.getDate());

// Add multiple events for today's date in 2025 to make testing easier
employees.slice(0, 15).forEach((employee, index) => {
  leaveRequests.push(
    generateLeaveRequest(leaveId++, employee, testToday, testToday)
  );
});

// Add spring break period for many employees
const springBreakStart = new Date(2025, 2, 24); // March 24, 2025
const springBreakEnd = new Date(2025, 3, 7); // April 7, 2025

// Create 2-week spring break period for 20 employees
employees.slice(20, 40).forEach((employee, index) => {
  // Create week-long leaves distributed across the spring break period
  const leaveStart = new Date(springBreakStart);
  leaveStart.setDate(leaveStart.getDate() + Math.floor(index / 2)); // Stagger starts

  const leaveEnd = new Date(leaveStart);
  leaveEnd.setDate(leaveStart.getDate() + 3 + (index % 4)); // 4-7 day leaves

  leaveRequests.push(
    generateLeaveRequest(leaveId++, employee, leaveStart, leaveEnd)
  );
});

// Add special company event - quarterly planning
const quarterlyPlanning = new Date(2025, 2, 31); // March 31, 2025
employees.slice(40, 60).forEach((employee) => {
  leaveRequests.push(
    generateLeaveRequest(
      leaveId++,
      employee,
      quarterlyPlanning,
      quarterlyPlanning
    )
  );
});

// Add a fiscal year closing event
const fiscalYearEnd = new Date(2025, 3, 5); // April 5, 2025
employees
  .filter((e) => e.department.id === 6)
  .slice(0, 10)
  .forEach((employee) => {
    leaveRequests.push(
      generateLeaveRequest(
        leaveId++,
        employee,
        fiscalYearEnd,
        fiscalYearEnd
      )
    );
  });

// Add special events for each individual day to ensure complete coverage
for (let day = 24; day <= 31; day++) {
  const marchDate = new Date(2025, 2, day);
  // Add at least one leave for each day of March
  leaveRequests.push(
    generateLeaveRequest(
      leaveId++,
      employees[day],
      marchDate,
      marchDate
    )
  );
}

for (let day = 1; day <= 7; day++) {
  const aprilDate = new Date(2025, 3, day);
  // Add at least one leave for each day of April 1-7
  leaveRequests.push(
    generateLeaveRequest(
      leaveId++,
      employees[day + 50],
      aprilDate,
      aprilDate
    )
  );
}

// Transform leave requests into calendar items
const calendarItems = leaveRequests.map(
  transformLeaveRequestToCalendarItem
);

// Create a calendar day structure that maps dates to items occurring on each day
const calendarDays: Record<string, CalendarDay> = {};

// Helper to check if a date falls within a leave period
function isDateInRange(
  dateStr: string,
  startStr: string,
  endStr: string
): boolean {
  const date = new Date(dateStr);
  const start = new Date(startStr);
  const end = new Date(endStr);

  return date >= start && date <= end;
}

// Create a day entry for each day of the year
for (
  let d = new Date(yearStart);
  d <= yearEnd;
  d.setDate(d.getDate() + 1)
) {
  const dateStr = formatDate(d);

  // Find items that occur on this date
  const itemsOnDay = calendarItems.filter((item) =>
    isDateInRange(dateStr, item.startDate, item.endDate)
  );

  if (itemsOnDay.length > 0) {
    calendarDays[dateStr] = {
      date: dateStr,
      items: itemsOnDay,
    };
  }
}

// Add debug log to see sample of the data
export const mockCalendarData = {
  calendarItems,
  calendarDays,
};

export default mockCalendarData;
