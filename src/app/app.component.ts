import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {WorkTaskDto} from "./models/work-task";
import {FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ApiWorkTaskService} from "./services/api/api-work-task.service";
import {HttpClientModule} from "@angular/common/http";
import {deserialize} from "class-transformer";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TaskManagmentClient';
  taskList: Array<WorkTaskDto> = [];
  createTaskForm: UntypedFormGroup;
  isLoading = true;
  idForUpdate: number | undefined = 0;
  selectedStatus: string | undefined;

  constructor(private apiWorkTask: ApiWorkTaskService) {
    this.createTaskForm = new UntypedFormGroup({
      ID: new UntypedFormControl(0),
      Name: new UntypedFormControl('', [Validators.required]),
      Description: new UntypedFormControl('', [Validators.required]),
      Status: new UntypedFormControl('', [Validators.required]),
      AssignedTo: new UntypedFormControl(null)
    });
  }

  ngOnInit(): void {
    this.apiWorkTask.getWorkTask().subscribe(
      workResult => {
        this.taskList = deserialize(Array<WorkTaskDto>, workResult);
      },
      (err) => {

      },
      () => {
        this.isLoading = false;
      });
  }

  get name() {
    return this.createTaskForm.get('Name');
  }

  get description() {
    return this.createTaskForm.get('Description');
  }

  get status() {
    return this.createTaskForm.get('Status');
  }

  get assignedTo() {
    return this.createTaskForm.get('AssignedTo');
  }

  createTask() {
    if (this.createTaskForm.valid) {
      this.isLoading = true;
      const task: WorkTaskDto = this.createTaskForm.value;
      this.apiWorkTask.createTask(task).subscribe(
        (response) => {
          const createdTask: WorkTaskDto = deserialize(WorkTaskDto, response);
          this.taskList.push(createdTask);
          this.createTaskForm.reset({
            ID: 0,
            Name: '',
            Description: '',
            Status: '',
            AssignedTo: null
          });
        },
        (err) => {

        },
        () => {
          this.isLoading = false;
        });
    } else {
      console.log('Form is invalid');
    }
  }

  formatStatus(status: any): string {
    return status.replace(/([a-z])([A-Z])/g, '$1 $2');
  }

  updateWorkTask(task: WorkTaskDto) {
    this.isLoading = true;
    const taskforUpdate: WorkTaskDto = new WorkTaskDto()
    taskforUpdate.ID = task.ID;
    taskforUpdate.Status = this.selectedStatus;
    this.apiWorkTask.updateTask(taskforUpdate).subscribe(
      () => {
        task.Status = this.selectedStatus;
        this.idForUpdate = 0;
      },
      () => {
      },
      () => {
        this.isLoading = false;
      });
  }
}
