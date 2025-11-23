import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { MaintenanceTasksComponent } from './components/maintenance-tasks/maintenance-tasks.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { PartsInventoryComponent } from './components/parts-inventory/parts-inventory.component';

const routes: Routes = [
  {
    path: '', component: RootComponent
  },
  {
    path: 'equipment', component: EquipmentComponent
  },
  {
    path: 'maintenance-tasks', component: MaintenanceTasksComponent
  },
  {
    path: 'schedule', component: ScheduleComponent
  },
  {
    path: 'inventory', component: PartsInventoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
