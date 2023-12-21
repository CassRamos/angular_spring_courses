import { Component, ViewChild } from '@angular/core';
import { Course } from '../../models/course';
import { Observable, catchError, of, tap } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { CoursePage } from '../../models/course-page';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent {
  courses$: Observable<CoursePage> | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageIndex = 0;
  pageSize = 2;

  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.refresh();
  }

  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    this.courses$ = this.coursesService
      .list(pageEvent.pageIndex, pageEvent.pageSize)
      .pipe(
        tap(() => {
          this.pageIndex = pageEvent.pageIndex;
          this.pageSize = pageEvent.pageSize;
        }),
        catchError((error) => {
          this.onError('Error loading page');
          return of({ courses: [], totalElements: 0, totalPages: 0 });
        })
      );
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg,
    });
  }

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(course: Course) {
    this.router.navigate(['edit', course._id], { relativeTo: this.route });
  }

  onRemove(course: Course) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: 'Are you sure you want to delete this course?',
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.coursesService.remove(course._id).subscribe(
          () => {
            this.refresh();
            this.snackBar.open('Course successfully removed!', 'X', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
          },
          () => this.onError('Error when trying to delete course')
        );
      }
    });
  }
}
