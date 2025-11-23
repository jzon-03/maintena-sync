import { Component, OnInit } from '@angular/core';

export interface ScheduledTask {
  id: number;
  title: string;
  equipmentName: string;
  technician: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue';
  type: 'Preventive' | 'Corrective' | 'Emergency' | 'Inspection';
  location: string;
}

export interface CalendarDay {
  date: Date;
  tasks: ScheduledTask[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  currentDate = new Date();
  currentView: 'month' | 'week' | 'day' = 'month';
  selectedDate = new Date();
  
  calendarDays: CalendarDay[] = [];
  weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  scheduledTasks: ScheduledTask[] = [];
  todaysTasks: ScheduledTask[] = [];
  upcomingTasks: ScheduledTask[] = [];
  
  ngOnInit(): void {
    this.generateScheduledTasks();
    this.generateCalendarDays();
    this.updateTaskLists();
  }
  
  generateCalendarDays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    this.calendarDays = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayTasks = this.scheduledTasks.filter(task => 
        this.isSameDate(task.date, date)
      );
      
      this.calendarDays.push({
        date: date,
        tasks: dayTasks,
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isSameDate(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
  }
  
  updateTaskLists(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.todaysTasks = this.scheduledTasks.filter(task => 
      this.isSameDate(task.date, today)
    );
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    this.upcomingTasks = this.scheduledTasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate > today && taskDate <= nextWeek;
    }).slice(0, 5);
  }
  
  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendarDays();
  }
  
  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendarDays();
  }
  
  goToToday(): void {
    this.currentDate = new Date();
    this.selectedDate = new Date();
    this.generateCalendarDays();
    this.updateTaskLists();
  }
  
  selectDate(day: CalendarDay): void {
    this.selectedDate = new Date(day.date);
  }
  
  getSelectedDayTasks(): ScheduledTask[] {
    return this.scheduledTasks.filter(task => 
      this.isSameDate(task.date, this.selectedDate)
    );
  }
  
  isSameDate(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }
  
  getTasksCount(): any {
    return {
      today: this.todaysTasks.length,
      thisWeek: this.scheduledTasks.filter(task => {
        const taskDate = new Date(task.date);
        const today = new Date();
        const weekFromNow = new Date();
        weekFromNow.setDate(today.getDate() + 7);
        return taskDate >= today && taskDate <= weekFromNow;
      }).length,
      total: this.scheduledTasks.length,
      overdue: this.scheduledTasks.filter(task => 
        task.date < new Date() && task.status !== 'Completed'
      ).length
    };
  }
  
  private generateScheduledTasks(): void {
    const tasks: ScheduledTask[] = [];
    const equipmentNames = [
      'Excavator 001', 'Bulldozer 002', 'Crane 003', 'Forklift 004',
      'Generator 005', 'Compressor 006', 'Drill Press 007', 'Lathe 008'
    ];
    
    const technicians = [
      'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis',
      'Chris Brown', 'Jessica Garcia', 'David Miller', 'Lisa Anderson'
    ];
    
    const taskTitles = [
      'Oil Change', 'Filter Replacement', 'Brake Inspection', 'Battery Check',
      'Hydraulic Service', 'Belt Replacement', 'Calibration', 'Safety Check',
      'Cleaning Service', 'Lubrication', 'Pressure Test', 'Motor Repair'
    ];
    
    const locations = [
      'Workshop A', 'Workshop B', 'Factory Floor 1', 'Factory Floor 2',
      'Warehouse North', 'Production Line 1', 'Assembly Area'
    ];
    
    // Generate tasks for the next 30 days
    for (let i = 0; i < 45; i++) {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 5);
      
      const startHour = 8 + Math.floor(Math.random() * 8); // 8 AM to 4 PM
      const duration = [1, 2, 3, 4, 6, 8][Math.floor(Math.random() * 6)];
      
      tasks.push({
        id: i + 1,
        title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        equipmentName: equipmentNames[Math.floor(Math.random() * equipmentNames.length)],
        technician: technicians[Math.floor(Math.random() * technicians.length)],
        date: date,
        startTime: `${startHour.toString().padStart(2, '0')}:00`,
        endTime: `${(startHour + duration).toString().padStart(2, '0')}:00`,
        duration: duration,
        priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)] as any,
        status: ['Scheduled', 'In Progress', 'Completed'][Math.floor(Math.random() * 3)] as any,
        type: ['Preventive', 'Corrective', 'Emergency', 'Inspection'][Math.floor(Math.random() * 4)] as any,
        location: locations[Math.floor(Math.random() * locations.length)]
      });
    }
    
    this.scheduledTasks = tasks.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
