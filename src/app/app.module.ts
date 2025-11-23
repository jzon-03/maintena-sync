import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RootComponent } from './components/root/root.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './shared/material.module';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { MaintenanceTasksComponent } from './components/maintenance-tasks/maintenance-tasks.component';
import { NewTaskDialogComponent } from './components/new-task-dialog/new-task-dialog.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { PartsInventoryComponent } from './components/parts-inventory/parts-inventory.component';

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    EquipmentComponent,
    MaintenanceTasksComponent,
    NewTaskDialogComponent,
    ScheduleComponent,
    PartsInventoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    LayoutModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
