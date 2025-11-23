import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RootComponent } from './components/root/root.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './shared/material.module';
import { EquipmentComponent } from './components/equipment/equipment.component';
import { MaintenanceTasksComponent } from './components/maintenance-tasks/maintenance-tasks.component';
import { NewTaskDialogComponent } from './components/new-task-dialog/new-task-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    EquipmentComponent,
    MaintenanceTasksComponent,
    NewTaskDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
