import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ServiceService } from 'src/app/services/service.service';
import { FormBuilder } from '@angular/forms';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AdminAddSpotlightDeleteComponent } from '../admin-add-spotlight-delete/admin-add-spotlight-delete.component'; 
import { AdminSportlightFormComponent } from '../admin-sportlight-form/admin-sportlight-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminSpotlightViewComponent } from '../admin-spotlight-view/admin-spotlight-view.component';
import { HttpServiceService } from 'src/app/services/http-service.service';


@Component({
  selector: 'app-admin-add-spoltlight',
  templateUrl: './admin-add-spoltlight.component.html',
  styleUrls: ['./admin-add-spoltlight.component.scss']
})
export class AdminAddSpoltlightComponent implements OnInit, AfterViewInit {
  spotLightId: number = 0;
  filteredData:any= '';
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['No', 'Title', 'Content', 'Image', 'Action'];
  public faCircleDot = faCircleDot;

  formData = {
    title: '',
    content: '',
    image: null as File | null,
    videoUrl:''
  };


  sportLightData: any[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public http: ServiceService,
    public serverUrl : HttpServiceService,
     private formbuilder: FormBuilder,
     private snackBar: MatSnackBar,
      public dialog: MatDialog) {}

  addSpotlight() {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<AdminSportlightFormComponent> = this.dialog.open(
      AdminSportlightFormComponent, {
      width: '50%',
      height:'80vh'
      // data: { data: 'john' }
    });

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

 

  ngOnInit(): void {
    this.getNews();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getNews() {
    this.http.getSpotlight().subscribe(
      (data) => {
        this.dataSource.data = data.payload;
         
        console.log("Content",this.dataSource.data)
      }
    );
  }
  openDialogue(id:number): void{    
    let findedData = this.dataSource.data.find(i => i.id === id); 
    this.filteredData = findedData
    this.dialog.open(AdminSpotlightViewComponent,{
      data:{
        name:this.filteredData
      }
    })
  }

  modalClose(){
    var myModal = document.getElementById('myModal')
    if (myModal!=null) {
      myModal.style.display = 'none';
    }
  }
  


  deleterRecord(recordId: Number ): void{
    const dialogRef = this.dialog.open(AdminAddSpotlightDeleteComponent);
    
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked 'Yes', proceed with deletion
        this.http.deletspotlightUpdate(recordId).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter((item) => item.id !== recordId);
          console.log('Record deleted successfully.');
          this.snackBar.open('Spotlight deleted successfully', 'close'),{duration:2000}
        });
      } else {
        // User clicked 'No', do nothing
        console.log('Deletion cancelled by the user.');
      }
    });
  }
  onSubmit() {
    this.http.postSpotlight(this.formData).subscribe(
      (res) => {
        console.log(res);
      }
    );
  }

  updateRecord(recordId: number): void {
    const newsItem = this.dataSource.data.find((item) => item.id === recordId);

    if (newsItem) {
      const dialogRef = this.dialog.open(AdminSportlightFormComponent, {
        width: '50%',
      });

      dialogRef.afterClosed().subscribe((updatedData) => {
        if (updatedData) {
          console.log('Updated data:', updatedData);
          // Update the record directly in the table data source
          const index = this.dataSource.data.findIndex((item) => item.id === recordId);
          if (index !== -1) {
            this.dataSource.data[index] = updatedData;

            this.dataSource._updateChangeSubscription();
          }
        }
      });
    }
  }

  


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
      this.formData.image = input.files[0];
    }
  }
}






