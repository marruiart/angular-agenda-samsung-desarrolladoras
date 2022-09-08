import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  minDate: Date;
  maxDate: Date;
  personForm!: UntypedFormGroup;
  actionBtn: string = "Guardar";

  constructor(
    private formBuilder: UntypedFormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>,
  ) {
    const CURRENTYEAR = new Date().getFullYear();
    const CURRENTMONTH = new Date().getMonth();
    const CURRENTDAY = new Date().getDate();

    this.minDate = new Date(CURRENTYEAR - 125, CURRENTMONTH, CURRENTDAY);
    this.maxDate = new Date(CURRENTYEAR, CURRENTMONTH, CURRENTDAY);
  }

  ngOnInit(): void {
    this.personForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.minLength(9), Validators.pattern("[0-9]{8}[A-Za-z]{1}")]],
      tel: ['', Validators.required],
      sexo: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = "Modificar"
      this.personForm.controls['nombre'].setValue(this.editData.nombre);
      this.personForm.controls['apellidos'].setValue(this.editData.apellidos);
      this.personForm.controls['dni'].setValue(this.editData.dni);
      this.personForm.controls['tel'].setValue(this.editData.tel);
      this.personForm.controls['sexo'].setValue(this.editData.sexo);
    }
  };

  addPerson(): void {

    if (!this.editData) {
      if (this.personForm.valid) {
        this.api.postPerson(this.personForm.value)
          .subscribe({
            next: (res) => {
              alert("Persona añadida correctamente");
              this.personForm.reset();
              this.dialogRef.close('save');
              location.reload();
            },
            error: () => {
              alert("No se ha podido añadir a la persona")
            }
          }
          );
      }
    } else {
      this.updatePerson();
    }
  }

  updatePerson() {
    this.api.putPerson(this.personForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          alert("Se ha modificado el registro correctamente");
          this.personForm.reset();
          this.dialogRef.close("modificar");
        },
        error: () => {
          alert("Error al modificar el registro")
        }
      })
  }

}
