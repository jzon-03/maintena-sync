import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaintenanceTask } from '../maintenance-tasks/maintenance-tasks.component';

export interface NewTaskData {
  equipmentList: Array<{id: number, name: string}>;
  technicians: string[];
  locations: string[];
}

@Component({
  selector: 'app-new-task-dialog',
  templateUrl: './new-task-dialog.component.html',
  styleUrl: './new-task-dialog.component.scss'
})
export class NewTaskDialogComponent implements OnInit {
  taskForm: FormGroup;
  
  priorities = ['Low', 'Medium', 'High', 'Critical'];
  taskTypes = ['Preventive', 'Corrective', 'Emergency', 'Inspection', 'Calibration'];
  
  equipmentList: Array<{id: number, name: string}> = [];
  technicians: string[] = [];
  locations: string[] = [];
  
  minDate = new Date();
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewTaskData
  ) {
    this.taskForm = this.createForm();
    
    if (data) {
      this.equipmentList = data.equipmentList || this.getDefaultEquipmentList();
      this.technicians = data.technicians || this.getDefaultTechnicians();
      this.locations = data.locations || this.getDefaultLocations();
    } else {
      this.equipmentList = this.getDefaultEquipmentList();
      this.technicians = this.getDefaultTechnicians();
      this.locations = this.getDefaultLocations();
    }
  }
  
  ngOnInit(): void {
    // Set default scheduled date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.taskForm.patchValue({
      scheduledDate: tomorrow
    });
  }
  
  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      equipmentId: ['', Validators.required],
      priority: ['Medium', Validators.required],
      taskType: ['Preventive', Validators.required],
      assignedTo: ['', Validators.required],
      location: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      estimatedDuration: [1, [Validators.required, Validators.min(0.5), Validators.max(24)]],
      notes: [''],
      estimatedCost: [0, [Validators.min(0)]]
    });
  }
  
  private getDefaultEquipmentList() {
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
  
  private getDefaultTechnicians() {
    return [
      'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis',
      'Chris Brown', 'Jessica Garcia', 'David Miller', 'Lisa Anderson',
      'Robert Taylor', 'Jennifer Martinez', 'Kevin White', 'Amanda Clark',
      'Daniel Rodriguez', 'Michelle Lewis', 'Brian Hall', 'Rachel Green'
    ];
  }
  
  private getDefaultLocations() {
    return [
      'Workshop A', 'Workshop B', 'Workshop C', 'Factory Floor 1', 'Factory Floor 2',
      'Factory Floor 3', 'Warehouse North', 'Warehouse South', 'Warehouse East',
      'Warehouse West', 'Production Line 1', 'Production Line 2', 'Production Line 3',
      'Assembly Area', 'Quality Control', 'Shipping Dock', 'Receiving Dock',
      'Maintenance Shop', 'Tool Room', 'Storage Area A', 'Storage Area B',
      'Outdoor Yard', 'Testing Lab', 'R&D Department', 'Utilities Room'
    ];
  }
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const selectedEquipment = this.equipmentList.find(eq => eq.id === formValue.equipmentId);
      
      const newTask: Partial<MaintenanceTask> = {
        title: formValue.title,
        description: formValue.description,
        equipmentId: formValue.equipmentId,
        equipmentName: selectedEquipment?.name || 'Unknown Equipment',
        priority: formValue.priority,
        status: 'Pending',
        assignedTo: formValue.assignedTo,
        createdDate: new Date(),
        scheduledDate: formValue.scheduledDate,
        estimatedDuration: formValue.estimatedDuration,
        taskType: formValue.taskType,
        location: formValue.location,
        notes: formValue.notes || undefined,
        cost: formValue.estimatedCost > 0 ? formValue.estimatedCost : undefined
      };
      
      this.dialogRef.close(newTask);
    } else {
      this.markFormGroupTouched();
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
  
  private markFormGroupTouched(): void {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }
  
  getFieldError(fieldName: string): string {
    const control = this.taskForm.get(fieldName);
    if (control?.errors && control?.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (control.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${this.getFieldDisplayName(fieldName)} must be at most ${control.errors['max'].max}`;
      }
    }
    return '';
  }
  
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: {[key: string]: string} = {
      title: 'Task Title',
      description: 'Description',
      equipmentId: 'Equipment',
      priority: 'Priority',
      taskType: 'Task Type',
      assignedTo: 'Assigned Technician',
      location: 'Location',
      scheduledDate: 'Scheduled Date',
      estimatedDuration: 'Estimated Duration',
      estimatedCost: 'Estimated Cost'
    };
    return displayNames[fieldName] || fieldName;
  }
}
