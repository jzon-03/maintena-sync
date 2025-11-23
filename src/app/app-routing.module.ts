import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { MaintenanceTasksComponent } from './components/maintenance-tasks/maintenance-tasks.component';

const routes: Routes = [
  {
    path: '', component: RootComponent
  },
  {
    path: 'equipment', component: EquipmentComponent
  },
  {
    path: 'maintenance-tasks', component: MaintenanceTasksComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
