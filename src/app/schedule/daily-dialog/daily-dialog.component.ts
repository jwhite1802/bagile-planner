import {Component, Inject, Input, OnInit} from '@angular/core';
import {PlannerDate} from '../../domain/planner-date';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-daily-dialog',
  templateUrl: './daily-dialog.component.html',
  styleUrls: ['./daily-dialog.component.scss']
})
export class DailyDialogComponent implements OnInit {
  plannerDate: PlannerDate;
  constructor(
    public dialogRef: MatDialogRef<DailyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { plannerDate: PlannerDate }
  ) { }

  ngOnInit(): void {
    this.plannerDate = this.data.plannerDate;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
