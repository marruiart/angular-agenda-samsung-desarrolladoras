import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { ApiService } from './services/api.service';
import { MatTableModule, MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'my-agenda';
  displayedColumns: string[] = ['socio', 'nombre', 'apellidos', 'dni', 'tel', 'sexo', 'accion'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private api: ApiService
  ) {
  };

  ngOnInit(): void {
    this.getAllPersons();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
      width: '100%'
    }).afterClosed().subscribe(val => {
      if (val === "guardar") {
        this.getAllPersons();
      }
    });
  }

  getAllPersons() {
    this.api.getPerson()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          alert("Error en la recogida de datos")
        }
      }
      );
  }

  editPerson(row: any) {
    this.dialog.open(DialogComponent, {
      data: row
    }).afterClosed().subscribe(val => {
      if (val === "modificar") {
        this.getAllPersons();
      }
    });
  }

  deletePerson(id: number) {
    this.api.deletePerson(id)
      .subscribe({
        next: (res) => {
          alert("Registro eliminado correctamente");
          this.getAllPersons();
        },
        error: () => {
          alert("Error al eliminar el registro. No se ha eliminado");
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
