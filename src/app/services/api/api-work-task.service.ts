import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WorkTaskDto} from "../../models/work-task";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiWorkTaskService {
  constructor(private http: HttpClient) {
  }

  createTask(workTaskDto: WorkTaskDto): Observable<any> {
    return this.http.post(`${environment.apiUrl}/`, workTaskDto);
  }

  updateTask(workTaskDto: WorkTaskDto): Observable<any> {
    return this.http.put(`${environment.apiUrl}/`, workTaskDto);
  }

  getWorkTask(): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/`,);
  }
}
