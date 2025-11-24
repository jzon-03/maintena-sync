import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

interface MaintenanceReport {
  id: number;
  equipmentName: string;
  taskType: string;
  completedDate: Date;
  technician: string;
  duration: number;
  cost: number;
  status: string;
}

interface CostAnalysis {
  month: string;
  preventiveCost: number;
  correctiveCost: number;
  totalCost: number;
}

interface EfficiencyMetric {
  equipmentId: string;
  equipmentName: string;
  uptime: number;
  mtbf: number; // Mean Time Between Failures
  mttr: number; // Mean Time To Repair
  availability: number;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Data sources
  maintenanceDataSource = new MatTableDataSource<MaintenanceReport>();
  costAnalysisData: CostAnalysis[] = [];
  efficiencyMetrics: EfficiencyMetric[] = [];

  // Table columns
  displayedColumns: string[] = ['equipmentName', 'taskType', 'completedDate', 'technician', 'duration', 'cost', 'status'];
  mobileColumns: string[] = ['equipmentName', 'taskType', 'cost', 'status'];

  // Report filters
  selectedReportType = 'maintenance';
  selectedPeriod = 'month';
  dateFrom = new Date(2024, 0, 1);
  dateTo = new Date();

  // Analytics data
  totalMaintenanceCost = 0;
  averageDowntime = 0;
  completionRate = 0;
  costSavings = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.generateMockData();
    this.calculateAnalytics();
  }

  ngAfterViewInit(): void {
    this.maintenanceDataSource.paginator = this.paginator;
    this.maintenanceDataSource.sort = this.sort;
  }

  private generateMockData(): void {
    // Generate maintenance reports
    const maintenanceData: MaintenanceReport[] = [];
    const taskTypes = ['Preventive', 'Corrective', 'Emergency', 'Inspection', 'Calibration'];
    const technicians = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Brown', 'David Wilson'];
    const statuses = ['Completed', 'In Progress', 'Pending', 'Overdue'];

    for (let i = 1; i <= 50; i++) {
      const completedDate = new Date();
      completedDate.setDate(completedDate.getDate() - Math.floor(Math.random() * 90));
      
      maintenanceData.push({
        id: i,
        equipmentName: `Equipment-${String(i).padStart(3, '0')}`,
        taskType: taskTypes[Math.floor(Math.random() * taskTypes.length)],
        completedDate: completedDate,
        technician: technicians[Math.floor(Math.random() * technicians.length)],
        duration: Math.floor(Math.random() * 8) + 1,
        cost: Math.floor(Math.random() * 2000) + 100,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }

    this.maintenanceDataSource.data = maintenanceData;

    // Generate cost analysis
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.costAnalysisData = months.map(month => ({
      month,
      preventiveCost: Math.floor(Math.random() * 15000) + 5000,
      correctiveCost: Math.floor(Math.random() * 10000) + 2000,
      totalCost: 0
    }));

    this.costAnalysisData.forEach(data => {
      data.totalCost = data.preventiveCost + data.correctiveCost;
    });

    // Generate efficiency metrics
    this.efficiencyMetrics = Array.from({length: 10}, (_, i) => ({
      equipmentId: `EQ-${String(i + 1).padStart(3, '0')}`,
      equipmentName: `Equipment ${i + 1}`,
      uptime: Math.floor(Math.random() * 20) + 80,
      mtbf: Math.floor(Math.random() * 200) + 100,
      mttr: Math.floor(Math.random() * 6) + 2,
      availability: Math.floor(Math.random() * 15) + 85
    }));
  }

  private calculateAnalytics(): void {
    const data = this.maintenanceDataSource.data;
    
    this.totalMaintenanceCost = data.reduce((sum, item) => sum + item.cost, 0);
    this.averageDowntime = data.reduce((sum, item) => sum + item.duration, 0) / data.length;
    this.completionRate = (data.filter(item => item.status === 'Completed').length / data.length) * 100;
    this.costSavings = Math.floor(this.totalMaintenanceCost * 0.15); // Estimated 15% savings from preventive maintenance
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.maintenanceDataSource.filter = filterValue.trim().toLowerCase();

    if (this.maintenanceDataSource.paginator) {
      this.maintenanceDataSource.paginator.firstPage();
    }
  }

  onReportTypeChange(): void {
    // Refresh data based on report type
    this.generateMockData();
    this.calculateAnalytics();
  }

  exportReport(): void {
    // Mock export functionality
    const reportData = {
      type: this.selectedReportType,
      period: this.selectedPeriod,
      dateRange: `${this.dateFrom.toDateString()} - ${this.dateTo.toDateString()}`,
      data: this.maintenanceDataSource.data
    };
    
    console.log('Exporting report:', reportData);
    // In a real app, this would trigger a download or API call
  }

  printReport(): void {
    window.print();
  }

  getCostTrendColor(index: number): string {
    if (index === 0) return 'primary';
    
    const current = this.costAnalysisData[index].totalCost;
    const previous = this.costAnalysisData[index - 1].totalCost;
    
    return current > previous ? 'warn' : 'primary';
  }

  getEfficiencyColor(value: number, type: string): string {
    if (type === 'uptime' || type === 'availability') {
      return value >= 95 ? 'primary' : value >= 90 ? 'accent' : 'warn';
    } else if (type === 'mttr') {
      return value <= 3 ? 'primary' : value <= 5 ? 'accent' : 'warn';
    } else { // mtbf
      return value >= 200 ? 'primary' : value >= 150 ? 'accent' : 'warn';
    }
  }
}