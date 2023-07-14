import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  newContactForm: FormGroup;
  isFormModalOpen= false;

  constructor(private formBuilder: FormBuilder) {
    this.newContactForm = this.formBuilder.group({
      name: ['', Validators.required],
      id: ['', Validators.required]
   });
  }

  openFormModal(){
    this.isFormModalOpen = true;
  }

  closeFormModal(){
    this.isFormModalOpen = false;
  }

  saveForm(){
    if(this.newContactForm.valid){
      console.log(this.newContactForm.value);
      this.closeFormModal();
    }
  }


}
