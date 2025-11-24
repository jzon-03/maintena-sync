import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  avatar?: string;
}

interface SystemSettings {
  maintenanceReminders: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
}

interface MaintenanceSettings {
  defaultTaskDuration: number;
  workingHoursStart: string;
  workingHoursEnd: string;
  weekendMaintenance: boolean;
  autoScheduling: boolean;
  reminderDaysBefore: number;
  emergencyContactEmail: string;
  approvalRequired: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginAttempts: number;
  auditLogging: boolean;
  dataBackupFrequency: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  // Form groups
  profileForm!: FormGroup;
  systemForm!: FormGroup;
  maintenanceForm!: FormGroup;
  securityForm!: FormGroup;

  // Current settings
  userProfile: UserProfile = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    role: 'Maintenance Manager',
    department: 'Operations',
    phone: '+1 (555) 123-4567'
  };

  systemSettings: SystemSettings = {
    maintenanceReminders: true,
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false,
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy'
  };

  maintenanceSettings: MaintenanceSettings = {
    defaultTaskDuration: 2,
    workingHoursStart: '08:00',
    workingHoursEnd: '17:00',
    weekendMaintenance: false,
    autoScheduling: true,
    reminderDaysBefore: 3,
    emergencyContactEmail: 'emergency@company.com',
    approvalRequired: true
  };

  securitySettings: SecuritySettings = {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 3,
    auditLogging: true,
    dataBackupFrequency: 'daily'
  };

  // Options for dropdowns
  languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese' }
  ];

  timezones = [
    { value: 'America/New_York', label: 'Eastern Time (UTC-5)' },
    { value: 'America/Chicago', label: 'Central Time (UTC-6)' },
    { value: 'America/Denver', label: 'Mountain Time (UTC-7)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (UTC-8)' },
    { value: 'UTC', label: 'UTC' }
  ];

  currencies = [
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' }
  ];

  dateFormats = [
    { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy' },
    { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy' },
    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
    { value: 'dd-MMM-yyyy', label: 'dd-MMM-yyyy' }
  ];

  roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Maintenance Manager' },
    { value: 'technician', label: 'Technician' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'viewer', label: 'Viewer' }
  ];

  backupFrequencies = [
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  selectedTab = 0;
  isLoading = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadCurrentSettings();
  }

  private initializeForms(): void {
    // Profile form
    this.profileForm = this.fb.group({
      firstName: [this.userProfile.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.userProfile.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      role: [this.userProfile.role, Validators.required],
      department: [this.userProfile.department, Validators.required],
      phone: [this.userProfile.phone, [Validators.required, Validators.pattern(/^\+?[\d\s\(\)\-]+$/)]]
    });

    // System form
    this.systemForm = this.fb.group({
      maintenanceReminders: [this.systemSettings.maintenanceReminders],
      emailNotifications: [this.systemSettings.emailNotifications],
      smsNotifications: [this.systemSettings.smsNotifications],
      darkMode: [this.systemSettings.darkMode],
      language: [this.systemSettings.language, Validators.required],
      timezone: [this.systemSettings.timezone, Validators.required],
      currency: [this.systemSettings.currency, Validators.required],
      dateFormat: [this.systemSettings.dateFormat, Validators.required]
    });

    // Maintenance form
    this.maintenanceForm = this.fb.group({
      defaultTaskDuration: [this.maintenanceSettings.defaultTaskDuration, [Validators.required, Validators.min(0.5), Validators.max(24)]],
      workingHoursStart: [this.maintenanceSettings.workingHoursStart, Validators.required],
      workingHoursEnd: [this.maintenanceSettings.workingHoursEnd, Validators.required],
      weekendMaintenance: [this.maintenanceSettings.weekendMaintenance],
      autoScheduling: [this.maintenanceSettings.autoScheduling],
      reminderDaysBefore: [this.maintenanceSettings.reminderDaysBefore, [Validators.required, Validators.min(1), Validators.max(30)]],
      emergencyContactEmail: [this.maintenanceSettings.emergencyContactEmail, [Validators.required, Validators.email]],
      approvalRequired: [this.maintenanceSettings.approvalRequired]
    });

    // Security form
    this.securityForm = this.fb.group({
      twoFactorAuth: [this.securitySettings.twoFactorAuth],
      sessionTimeout: [this.securitySettings.sessionTimeout, [Validators.required, Validators.min(5), Validators.max(480)]],
      passwordExpiry: [this.securitySettings.passwordExpiry, [Validators.required, Validators.min(30), Validators.max(365)]],
      loginAttempts: [this.securitySettings.loginAttempts, [Validators.required, Validators.min(3), Validators.max(10)]],
      auditLogging: [this.securitySettings.auditLogging],
      dataBackupFrequency: [this.securitySettings.dataBackupFrequency, Validators.required]
    });
  }

  private loadCurrentSettings(): void {
    // In a real app, this would load from an API
    // For now, we'll just update the forms with current values
    this.profileForm.patchValue(this.userProfile);
    this.systemForm.patchValue(this.systemSettings);
    this.maintenanceForm.patchValue(this.maintenanceSettings);
    this.securityForm.patchValue(this.securitySettings);
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.userProfile = { ...this.userProfile, ...this.profileForm.value };
        this.isLoading = false;
        this.showSuccessMessage('Profile updated successfully!');
      }, 1000);
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  saveSystemSettings(): void {
    if (this.systemForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {
        this.systemSettings = { ...this.systemSettings, ...this.systemForm.value };
        this.isLoading = false;
        this.showSuccessMessage('System settings updated successfully!');
      }, 1000);
    } else {
      this.markFormGroupTouched(this.systemForm);
    }
  }

  saveMaintenanceSettings(): void {
    if (this.maintenanceForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {
        this.maintenanceSettings = { ...this.maintenanceSettings, ...this.maintenanceForm.value };
        this.isLoading = false;
        this.showSuccessMessage('Maintenance settings updated successfully!');
      }, 1000);
    } else {
      this.markFormGroupTouched(this.maintenanceForm);
    }
  }

  saveSecuritySettings(): void {
    if (this.securityForm.valid) {
      this.isLoading = true;
      
      setTimeout(() => {
        this.securitySettings = { ...this.securitySettings, ...this.securityForm.value };
        this.isLoading = false;
        this.showSuccessMessage('Security settings updated successfully!');
      }, 1000);
    } else {
      this.markFormGroupTouched(this.securityForm);
    }
  }

  resetToDefaults(): void {
    const confirmed = confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.');
    
    if (confirmed) {
      this.isLoading = true;
      
      setTimeout(() => {
        // Reset to default values
        this.loadCurrentSettings();
        this.isLoading = false;
        this.showSuccessMessage('Settings reset to defaults successfully!');
      }, 1000);
    }
  }

  exportSettings(): void {
    const settings = {
      profile: this.userProfile,
      system: this.systemSettings,
      maintenance: this.maintenanceSettings,
      security: this.securitySettings
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `maintenance-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    this.showSuccessMessage('Settings exported successfully!');
  }

  changePassword(): void {
    // This would typically open a password change dialog
    this.showSuccessMessage('Password change functionality would be implemented here.');
  }

  enable2FA(): void {
    // This would typically show QR code for 2FA setup
    this.showSuccessMessage('Two-factor authentication setup would be implemented here.');
  }

  downloadAuditLog(): void {
    // Mock audit log download
    this.showSuccessMessage('Audit log download would be implemented here.');
  }

  testNotifications(): void {
    this.showSuccessMessage('Test notification sent! Check your email and phone.');
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  getErrorMessage(formGroup: FormGroup, field: string): string {
    const control = formGroup.get(field);
    
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
    
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    if (control?.hasError('minlength')) {
      return `Minimum ${control.errors?.['minlength'].requiredLength} characters required`;
    }
    
    if (control?.hasError('min')) {
      return `Minimum value is ${control.errors?.['min'].min}`;
    }
    
    if (control?.hasError('max')) {
      return `Maximum value is ${control.errors?.['max'].max}`;
    }
    
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    
    return '';
  }
}