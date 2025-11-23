import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export interface InventoryPart {
  id: number;
  partNumber: string;
  name: string;
  description: string;
  category: 'Engine' | 'Hydraulic' | 'Electrical' | 'Mechanical' | 'Safety' | 'Filters' | 'Belts' | 'Bearings';
  manufacturer: string;
  supplier: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  totalValue: number;
  location: string;
  lastRestocked: Date;
  expiryDate?: Date;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired' | 'Discontinued';
  usageRate: number; // parts used per month
  leadTime: number; // days to restock
  notes?: string;
}

export interface StockMovement {
  id: number;
  partId: number;
  partName: string;
  movementType: 'In' | 'Out' | 'Adjustment';
  quantity: number;
  reason: string;
  date: Date;
  user: string;
  reference?: string;
}

@Component({
  selector: 'app-parts-inventory',
  templateUrl: './parts-inventory.component.html',
  styleUrl: './parts-inventory.component.scss'
})
export class PartsInventoryComponent implements OnInit {
  displayedColumns: string[] = ['partNumber', 'name', 'category', 'currentStock', 'status', 'unitPrice', 'totalValue', 'location', 'actions'];
  displayedColumnsMobile: string[] = ['name', 'currentStock', 'status', 'actions'];
  displayedColumnsTablet: string[] = ['partNumber', 'name', 'currentStock', 'status', 'unitPrice', 'actions'];
  
  dataSource = new MatTableDataSource<InventoryPart>();
  
  selectedCategory = 'all';
  selectedStatus = 'all';
  searchTerm = '';
  
  // Responsive properties
  isMobile = false;
  isTablet = false;
  currentColumns: string[] = [];
  
  categories = ['all', 'Engine', 'Hydraulic', 'Electrical', 'Mechanical', 'Safety', 'Filters', 'Belts', 'Bearings'];
  statusOptions = ['all', 'In Stock', 'Low Stock', 'Out of Stock', 'Expired', 'Discontinued'];
  
  recentMovements: StockMovement[] = [];
  lowStockParts: InventoryPart[] = [];
  expiringParts: InventoryPart[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(private breakpointObserver: BreakpointObserver) {
    this.updateDisplayedColumns();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateDisplayedColumns();
  }
  
  ngOnInit(): void {
    this.generateInventoryData();
    this.generateStockMovements();
    this.updateAlerts();
    this.dataSource.filterPredicate = this.createFilter();
    
    // Set up responsive breakpoint observation
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium
    ]).subscribe(result => {
      this.updateDisplayedColumns();
    });
  }
  
  private updateDisplayedColumns() {
    const isXSmall = this.breakpointObserver.isMatched(Breakpoints.XSmall);
    const isSmall = this.breakpointObserver.isMatched(Breakpoints.Small);
    const isMedium = this.breakpointObserver.isMatched(Breakpoints.Medium);
    
    if (isXSmall) {
      this.isMobile = true;
      this.isTablet = false;
      this.currentColumns = this.displayedColumnsMobile;
    } else if (isSmall || isMedium) {
      this.isMobile = false;
      this.isTablet = true;
      this.currentColumns = this.displayedColumnsTablet;
    } else {
      this.isMobile = false;
      this.isTablet = false;
      this.currentColumns = this.displayedColumns;
    }
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyTextFilter(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.updateFilters();
  }
  
  applyCategoryFilter() {
    this.updateFilters();
  }
  
  applyStatusFilter() {
    this.updateFilters();
  }
  
  private updateFilters() {
    const filterValue = JSON.stringify({
      category: this.selectedCategory,
      status: this.selectedStatus,
      search: this.searchTerm.toLowerCase()
    });
    this.dataSource.filter = filterValue;
  }
  
  private createFilter(): (data: InventoryPart, filter: string) => boolean {
    return (data: InventoryPart, filter: string): boolean => {
      const filterObj = JSON.parse(filter);
      
      const categoryMatch = filterObj.category === 'all' || data.category === filterObj.category;
      const statusMatch = filterObj.status === 'all' || data.status === filterObj.status;
      const searchMatch = !filterObj.search || 
        data.name.toLowerCase().includes(filterObj.search) ||
        data.partNumber.toLowerCase().includes(filterObj.search) ||
        data.description.toLowerCase().includes(filterObj.search) ||
        data.manufacturer.toLowerCase().includes(filterObj.search);
      
      return categoryMatch && statusMatch && searchMatch;
    };
  }
  
  updateAlerts() {
    const allParts = this.dataSource.data;
    
    this.lowStockParts = allParts.filter(part => 
      part.currentStock <= part.minimumStock && part.status !== 'Discontinued'
    ).slice(0, 5);
    
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    this.expiringParts = allParts.filter(part => 
      part.expiryDate && part.expiryDate <= thirtyDaysFromNow
    ).slice(0, 5);
  }
  
  getInventoryStats() {
    const parts = this.dataSource.data;
    const totalValue = parts.reduce((sum, part) => sum + part.totalValue, 0);
    
    return {
      totalParts: parts.length,
      totalValue: totalValue,
      lowStock: parts.filter(p => p.currentStock <= p.minimumStock).length,
      outOfStock: parts.filter(p => p.status === 'Out of Stock').length,
      categories: new Set(parts.map(p => p.category)).size
    };
  }
  
  adjustStock(part: InventoryPart, adjustment: number, reason: string) {
    const oldStock = part.currentStock;
    part.currentStock = Math.max(0, part.currentStock + adjustment);
    part.totalValue = part.currentStock * part.unitPrice;
    
    // Update status based on new stock level
    if (part.currentStock === 0) {
      part.status = 'Out of Stock';
    } else if (part.currentStock <= part.minimumStock) {
      part.status = 'Low Stock';
    } else {
      part.status = 'In Stock';
    }
    
    // Add stock movement record
    const movement: StockMovement = {
      id: this.recentMovements.length + 1,
      partId: part.id,
      partName: part.name,
      movementType: adjustment > 0 ? 'In' : 'Out',
      quantity: Math.abs(adjustment),
      reason: reason,
      date: new Date(),
      user: 'Current User',
      reference: `ADJ-${Date.now()}`
    };
    
    this.recentMovements.unshift(movement);
    this.recentMovements = this.recentMovements.slice(0, 10);
    
    this.updateAlerts();
    this.dataSource.data = [...this.dataSource.data];
  }
  
  private generateInventoryData(): void {
    const parts: InventoryPart[] = [];
    
    const partData = [
      { name: 'Engine Oil Filter', category: 'Filters', partNumber: 'OF-001' },
      { name: 'Hydraulic Pump', category: 'Hydraulic', partNumber: 'HP-002' },
      { name: 'Starter Motor', category: 'Electrical', partNumber: 'SM-003' },
      { name: 'Drive Belt', category: 'Belts', partNumber: 'DB-004' },
      { name: 'Ball Bearing', category: 'Bearings', partNumber: 'BB-005' },
      { name: 'Safety Valve', category: 'Safety', partNumber: 'SV-006' },
      { name: 'Fuel Injector', category: 'Engine', partNumber: 'FI-007' },
      { name: 'Hydraulic Cylinder', category: 'Hydraulic', partNumber: 'HC-008' },
      { name: 'Control Module', category: 'Electrical', partNumber: 'CM-009' },
      { name: 'Transmission Gear', category: 'Mechanical', partNumber: 'TG-010' },
      { name: 'Air Filter', category: 'Filters', partNumber: 'AF-011' },
      { name: 'Timing Belt', category: 'Belts', partNumber: 'TB-012' },
      { name: 'Emergency Stop', category: 'Safety', partNumber: 'ES-013' },
      { name: 'Pressure Sensor', category: 'Electrical', partNumber: 'PS-014' },
      { name: 'Hydraulic Hose', category: 'Hydraulic', partNumber: 'HH-015' },
      { name: 'Carburetor', category: 'Engine', partNumber: 'CB-016' },
      { name: 'Roller Bearing', category: 'Bearings', partNumber: 'RB-017' },
      { name: 'Cooling Fan', category: 'Mechanical', partNumber: 'CF-018' },
      { name: 'Circuit Breaker', category: 'Electrical', partNumber: 'CB-019' },
      { name: 'Oil Seal', category: 'Mechanical', partNumber: 'OS-020' }
    ];
    
    const manufacturers = ['Caterpillar', 'John Deere', 'Komatsu', 'Volvo', 'Hitachi', 'Bosch', 'SKF', 'Parker'];
    const suppliers = ['Industrial Supply Co', 'MRO Direct', 'Parts Express', 'Equipment Central', 'ProParts Inc'];
    const locations = ['Warehouse A-1', 'Warehouse A-2', 'Warehouse B-1', 'Warehouse B-2', 'Storage Room 1', 'Storage Room 2'];
    
    partData.forEach((item, index) => {
      const currentStock = Math.floor(Math.random() * 100) + 5;
      const minStock = Math.floor(Math.random() * 20) + 5;
      const maxStock = minStock + Math.floor(Math.random() * 50) + 20;
      const unitPrice = Math.floor(Math.random() * 500) + 10;
      
      let status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired' | 'Discontinued';
      if (currentStock === 0) {
        status = 'Out of Stock';
      } else if (currentStock <= minStock) {
        status = 'Low Stock';
      } else {
        status = 'In Stock';
      }
      
      // Randomly set some parts as expired or discontinued
      if (Math.random() < 0.05) status = 'Expired';
      if (Math.random() < 0.03) status = 'Discontinued';
      
      const lastRestocked = new Date();
      lastRestocked.setDate(lastRestocked.getDate() - Math.floor(Math.random() * 90));
      
      const expiryDate = Math.random() < 0.3 ? (() => {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + Math.floor(Math.random() * 365) + 30);
        return expiry;
      })() : undefined;
      
      parts.push({
        id: index + 1,
        partNumber: item.partNumber,
        name: item.name,
        description: `High-quality ${item.name.toLowerCase()} for industrial equipment`,
        category: item.category as any,
        manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
        supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
        currentStock: currentStock,
        minimumStock: minStock,
        maximumStock: maxStock,
        unitPrice: unitPrice,
        totalValue: currentStock * unitPrice,
        location: locations[Math.floor(Math.random() * locations.length)],
        lastRestocked: lastRestocked,
        expiryDate: expiryDate,
        status: status,
        usageRate: Math.floor(Math.random() * 10) + 1,
        leadTime: Math.floor(Math.random() * 14) + 3,
        notes: Math.random() > 0.7 ? 'Critical spare part' : undefined
      });
    });
    
    this.dataSource.data = parts;
  }
  
  private generateStockMovements(): void {
    const movements: StockMovement[] = [];
    const reasons = [
      'Maintenance replacement', 'Emergency repair', 'Routine service',
      'Stock replenishment', 'Equipment upgrade', 'Preventive maintenance',
      'Stock adjustment', 'Return from repair', 'New equipment installation'
    ];
    
    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      movements.push({
        id: i + 1,
        partId: Math.floor(Math.random() * 20) + 1,
        partName: this.dataSource.data[Math.floor(Math.random() * this.dataSource.data.length)]?.name || 'Unknown Part',
        movementType: Math.random() > 0.6 ? 'In' : 'Out',
        quantity: Math.floor(Math.random() * 10) + 1,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        date: date,
        user: 'System User',
        reference: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      });
    }
    
    this.recentMovements = movements.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  scrollToAlerts() {
    const alertsElement = document.querySelector('.alert-card');
    if (alertsElement) {
      alertsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
