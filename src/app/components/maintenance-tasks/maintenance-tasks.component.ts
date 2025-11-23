import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskDialogComponent, NewTaskData } from '../new-task-dialog/new-task-dialog.component';

export interface MaintenanceTask {
  id: number;
  title: string;
  description: string;
  equipmentId: number;
  equipmentName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled';
  assignedTo: string;
  createdDate: Date;
  scheduledDate: Date;
  completedDate?: Date;
  estimatedDuration: number; // in hours
  actualDuration?: number; // in hours
  taskType: 'Preventive' | 'Corrective' | 'Emergency' | 'Inspection' | 'Calibration';
  location: string;
  notes?: string;
  cost?: number;
}

@Component({
  selector: 'app-maintenance-tasks',
  templateUrl: './maintenance-tasks.component.html',
  styleUrl: './maintenance-tasks.component.scss'
})
export class MaintenanceTasksComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'equipmentName', 'priority', 'status', 'assignedTo', 'scheduledDate', 'taskType', 'estimatedDuration', 'actions'];
  dataSource = new MatTableDataSource<MaintenanceTask>();
  selectedStatus = 'all';
  selectedPriority = 'all';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  statusOptions = ['all', 'Pending', 'In Progress', 'Completed', 'Overdue', 'Cancelled'];
  priorityOptions = ['all', 'Low', 'Medium', 'High', 'Critical'];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.data = this.generateRandomTasks(50);
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyStatusFilter() {
    this.updateFilters();
  }

  applyPriorityFilter() {
    this.updateFilters();
  }

  private updateFilters() {
    const filterValue = JSON.stringify({
      status: this.selectedStatus,
      priority: this.selectedPriority
    });
    this.dataSource.filter = filterValue;
  }

  private createFilter(): (data: MaintenanceTask, filter: string) => boolean {
    return (data: MaintenanceTask, filter: string): boolean => {
      try {
        const filterObj = JSON.parse(filter);
        const statusMatch = filterObj.status === 'all' || data.status === filterObj.status;
        const priorityMatch = filterObj.priority === 'all' || data.priority === filterObj.priority;
        return statusMatch && priorityMatch;
      } catch {
        // Regular text search
        const searchStr = filter.toLowerCase();
        return data.title.toLowerCase().includes(searchStr) ||
               data.description.toLowerCase().includes(searchStr) ||
               data.equipmentName.toLowerCase().includes(searchStr) ||
               data.assignedTo.toLowerCase().includes(searchStr) ||
               data.location.toLowerCase().includes(searchStr);
      }
    };
  }

  markAsCompleted(task: MaintenanceTask) {
    task.status = 'Completed';
    task.completedDate = new Date();
    task.actualDuration = task.estimatedDuration + (Math.random() * 2 - 1); // Random variance
    this.dataSource.data = [...this.dataSource.data]; // Trigger change detection
  }

  markAsInProgress(task: MaintenanceTask) {
    task.status = 'In Progress';
    this.dataSource.data = [...this.dataSource.data];
  }

  getTasksStats() {
    const tasks = this.dataSource.data;
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      overdue: tasks.filter(t => t.status === 'Overdue').length,
      pending: tasks.filter(t => t.status === 'Pending').length
    };
  }

  openNewTaskDialog() {
    const dialogData: NewTaskData = {
      equipmentList: this.getEquipmentList(),
      technicians: this.getTechniciansList(),
      locations: this.getLocationsList()
    };

    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: dialogData,
      disableClose: false,
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addNewTask(result);
      }
    });
  }

  private addNewTask(taskData: Partial<MaintenanceTask>) {
    const newTask: MaintenanceTask = {
      ...taskData,
      id: this.getNextId()
    } as MaintenanceTask;

    const currentData = this.dataSource.data;
    this.dataSource.data = [newTask, ...currentData];
  }

  private getNextId(): number {
    const currentTasks = this.dataSource.data;
    return currentTasks.length > 0 ? Math.max(...currentTasks.map(t => t.id)) + 1 : 1;
  }

  private getEquipmentList() {
    return [
      { id: 1, name: 'Excavator 001' },
      { id: 2, name: 'Bulldozer 002' },
      { id: 3, name: 'Crane 003' },
      { id: 4, name: 'Forklift 004' },
      { id: 5, name: 'Generator 005' },
      { id: 6, name: 'Compressor 006' },
      { id: 7, name: 'Drill Press 007' },
      { id: 8, name: 'Lathe 008' },
      { id: 9, name: 'CNC Machine 009' },
      { id: 10, name: 'Welding Station 010' },
      { id: 11, name: 'Conveyor Belt 011' },
      { id: 12, name: 'Pump Unit 012' },
      { id: 13, name: 'Motor Assembly 013' },
      { id: 14, name: 'Transformer 014' },
      { id: 15, name: 'Boiler 015' },
      { id: 16, name: 'Chiller 016' },
      { id: 17, name: 'HVAC Unit 017' },
      { id: 18, name: 'Press Machine 018' }
    ];
  }

  private getTechniciansList() {
    return [
      'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis',
      'Chris Brown', 'Jessica Garcia', 'David Miller', 'Lisa Anderson',
      'Robert Taylor', 'Jennifer Martinez', 'Kevin White', 'Amanda Clark',
      'Daniel Rodriguez', 'Michelle Lewis', 'Brian Hall', 'Rachel Green'
    ];
  }

  private getLocationsList() {
    return [
      'Workshop A', 'Workshop B', 'Workshop C', 'Factory Floor 1', 'Factory Floor 2',
      'Factory Floor 3', 'Warehouse North', 'Warehouse South', 'Warehouse East',
      'Warehouse West', 'Production Line 1', 'Production Line 2', 'Production Line 3',
      'Assembly Area', 'Quality Control', 'Shipping Dock', 'Receiving Dock',
      'Maintenance Shop', 'Tool Room', 'Storage Area A', 'Storage Area B',
      'Outdoor Yard', 'Testing Lab', 'R&D Department', 'Utilities Room'
    ];
  }

  private generateRandomTasks(count: number): MaintenanceTask[] {
    const taskTitles = [
      'Oil Change', 'Filter Replacement', 'Belt Inspection', 'Brake Check',
      'Hydraulic Fluid Check', 'Battery Maintenance', 'Tire Rotation',
      'Engine Tune-up', 'Cooling System Flush', 'Transmission Service',
      'Air Filter Replacement', 'Spark Plug Replacement', 'Fuel System Cleaning',
      'Exhaust Inspection', 'Safety System Check', 'Electrical Inspection',
      'Lubrication Service', 'Calibration Check', 'Sensor Cleaning',
      'Bearing Replacement', 'Seal Replacement', 'Pump Maintenance',
      'Valve Adjustment', 'Chain Tensioning', 'Alignment Check',
      'Welding Repair', 'Paint Touch-up', 'Gasket Replacement',
      'Hose Replacement', 'Coupling Inspection', 'Motor Repair',
      'Gear Box Service', 'Control Panel Update', 'Software Update',
      'Cleaning Service', 'Performance Test', 'Vibration Analysis',
      'Temperature Check', 'Pressure Test', 'Load Test'
    ];

    const descriptions = [
      'Routine maintenance to ensure optimal performance',
      'Preventive maintenance to avoid equipment failure',
      'Inspection and replacement as needed',
      'Critical safety check and maintenance',
      'Performance optimization and adjustment',
      'Emergency repair due to equipment failure',
      'Scheduled calibration for accuracy',
      'Cleaning and maintenance service',
      'Component replacement due to wear',
      'System upgrade and improvement'
    ];

    const technicians = [
      'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis',
      'Chris Brown', 'Jessica Garcia', 'David Miller', 'Lisa Anderson',
      'Robert Taylor', 'Jennifer Martinez', 'Kevin White', 'Amanda Clark',
      'Daniel Rodriguez', 'Michelle Lewis', 'Brian Hall', 'Rachel Green'
    ];

    const equipmentNames = [
      'Excavator 001', 'Bulldozer 002', 'Crane 003', 'Forklift 004',
      'Generator 005', 'Compressor 006', 'Drill Press 007', 'Lathe 008',
      'CNC Machine 009', 'Welding Station 010', 'Conveyor Belt 011',
      'Pump Unit 012', 'Motor Assembly 013', 'Transformer 014',
      'Boiler 015', 'Chiller 016', 'HVAC Unit 017', 'Press Machine 018'
    ];

    const locations = [
      'Workshop A', 'Workshop B', 'Factory Floor 1', 'Factory Floor 2',
      'Warehouse North', 'Warehouse South', 'Production Line 1',
      'Production Line 2', 'Assembly Area', 'Quality Control',
      'Maintenance Shop', 'Outdoor Yard', 'Storage Area'
    ];

    const priorities: Array<'Low' | 'Medium' | 'High' | 'Critical'> = ['Low', 'Medium', 'High', 'Critical'];
    const statuses: Array<'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Cancelled'> = 
      ['Pending', 'In Progress', 'Completed', 'Overdue', 'Cancelled'];
    const taskTypes: Array<'Preventive' | 'Corrective' | 'Emergency' | 'Inspection' | 'Calibration'> = 
      ['Preventive', 'Corrective', 'Emergency', 'Inspection', 'Calibration'];

    const tasks: MaintenanceTask[] = [];

    for (let i = 1; i <= count; i++) {
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90));
      
      const scheduledDate = new Date(createdDate);
      scheduledDate.setDate(scheduledDate.getDate() + Math.floor(Math.random() * 30) + 1);
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const completedDate = status === 'Completed' ? 
        new Date(scheduledDate.getTime() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000) : undefined;
      
      const estimatedDuration = Math.floor(Math.random() * 8) + 1;
      const actualDuration = completedDate ? estimatedDuration + (Math.random() * 2 - 1) : undefined;

      tasks.push({
        id: i,
        title: taskTitles[Math.floor(Math.random() * taskTitles.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        equipmentId: Math.floor(Math.random() * 18) + 1,
        equipmentName: equipmentNames[Math.floor(Math.random() * equipmentNames.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: status,
        assignedTo: technicians[Math.floor(Math.random() * technicians.length)],
        createdDate: createdDate,
        scheduledDate: scheduledDate,
        completedDate: completedDate,
        estimatedDuration: estimatedDuration,
        actualDuration: actualDuration,
        taskType: taskTypes[Math.floor(Math.random() * taskTypes.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        notes: Math.random() > 0.7 ? 'Additional notes for this task' : undefined,
        cost: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 50 : undefined
      });
    }

    return tasks;
  }
}
