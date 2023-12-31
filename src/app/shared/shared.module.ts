import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from './app-material/app-material.module';
import { CategoryPipe } from './pipes/category.pipe';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';



@NgModule({
    imports: [CommonModule, AppMaterialModule, ErrorDialogComponent, CategoryPipe, ConfirmationDialogComponent],
    exports: [ErrorDialogComponent, CategoryPipe, ConfirmationDialogComponent],
})
export class SharedModule {}
