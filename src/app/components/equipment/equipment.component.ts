import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface Equipment {
  id: number;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'Operational' | 'Maintenance' | 'Out of Order' | 'Retired';
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
}

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'type', 'manufacturer', 'model', 'serialNumber', 'location', 'status', 'lastMaintenanceDate', 'nextMaintenanceDate'];
  dataSource = new MatTableDataSource<Equipment>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource.data = this.generateRandomEquipment(142);
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

  private generateRandomEquipment(count: number): Equipment[] {
    const equipmentTypes = [
      'Excavator', 'Bulldozer', 'Crane', 'Forklift', 'Generator', 'Compressor',
      'Drill Press', 'Lathe', 'CNC Machine', 'Welding Machine', 'Conveyor Belt',
      'Pump', 'Motor', 'Transformer', 'Boiler', 'Chiller', 'HVAC Unit',
      'Printing Press', 'Packaging Machine', 'Assembly Robot', 'Paint Booth',
      'Quality Scanner', 'Injection Molding Machine', 'Press Brake', 'Shear',
      'Grinder', 'Polisher', 'Mixer', 'Reactor', 'Centrifuge'
    ];

    const manufacturers = [
      'Caterpillar', 'Komatsu', 'John Deere', 'Volvo', 'Liebherr', 'Hitachi',
      'Siemens', 'GE', 'ABB', 'Schneider Electric', 'Honeywell', 'Emerson',
      'Rockwell Automation', 'Mitsubishi', 'Fanuc', 'KUKA', 'Toyota',
      'Crown', 'Yale', 'Hyster', 'Doosan', 'Bobcat', 'Case', 'New Holland',
      'Atlas Copco', 'Ingersoll Rand', 'Gardner Denver', 'Sullair'
    ];

    const locations = [
      'Workshop A', 'Workshop B', 'Workshop C', 'Factory Floor 1', 'Factory Floor 2',
      'Factory Floor 3', 'Warehouse North', 'Warehouse South', 'Warehouse East',
      'Warehouse West', 'Production Line 1', 'Production Line 2', 'Production Line 3',
      'Assembly Area', 'Quality Control', 'Shipping Dock', 'Receiving Dock',
      'Maintenance Shop', 'Tool Room', 'Storage Area A', 'Storage Area B',
      'Outdoor Yard', 'Testing Lab', 'R&D Department', 'Utilities Room'
    ];

    const statuses: Array<'Operational' | 'Maintenance' | 'Out of Order' | 'Retired'> = [
      'Operational', 'Maintenance', 'Out of Order', 'Retired'
    ];

    const equipment: Equipment[] = [];

    for (let i = 1; i <= count; i++) {
      const type = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
      const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const lastMaintenanceDate = new Date();
      lastMaintenanceDate.setDate(lastMaintenanceDate.getDate() - Math.floor(Math.random() * 365));
      
      const nextMaintenanceDate = new Date(lastMaintenanceDate);
      nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + Math.floor(Math.random() * 180 + 30));

      equipment.push({
        id: i,
        name: `${type} ${i.toString().padStart(3, '0')}`,
        type: type,
        manufacturer: manufacturer,
        model: `${manufacturer.substr(0, 3).toUpperCase()}-${Math.floor(Math.random() * 9000) + 1000}`,
        serialNumber: `SN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        location: location,
        status: status,
        lastMaintenanceDate: lastMaintenanceDate,
        nextMaintenanceDate: nextMaintenanceDate
      });
    }

    return equipment;
  }
}
