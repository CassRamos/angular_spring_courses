import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models/course';
import { first, tap } from 'rxjs';
import { CoursePage } from '../models/course-page';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private readonly API = '/api/courses';

  constructor(private httpClient: HttpClient) {}

  list(page = 0, pageSize = 2) {
    return this.httpClient
      .get<CoursePage>(this.API, { params: { page, pageSize } })
      .pipe(
        first(), //after first response is received, the subscription is completed
        tap((courses) => console.log(courses))
      );
  }

  loadById(id: string) {
    return this.httpClient.get<Course>(`${this.API}/${id}`);
  }

  private create(record: Partial<Course>) {
    return this.httpClient.post<Course>(this.API, record).pipe(first());
  }

  private update(record: Partial<Course>) {
    return this.httpClient
      .put<Course>(`${this.API}/${record._id}`, record)
      .pipe(first());
  }

  save(record: Partial<Course>) {
    if (record._id) {
      return this.update(record);
    }
    return this.create(record);
  }

  remove(id: string) {
    return this.httpClient.delete(`${this.API}/${id}`).pipe(first());
  }
}
