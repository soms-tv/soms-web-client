import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-choose',
  templateUrl: './choose.component.html',
  styleUrls: ['./choose.component.css']
})
export class ChooseComponent implements OnInit {
  roleForm: FormGroup;
  serverForm: FormGroup;
  roomForm: FormGroup;

  @ViewChild('stepper') stepper: any;

  badKey = false;
  badServer = false;
  viewer: boolean;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.roleForm = this._formBuilder.group({
      completed: ['', Validators.required]
    });
    this.serverForm = this._formBuilder.group({
      serverAddress: ['', Validators.required],
      authenticationKey: ['']
    });
    this.roomForm = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
  }

  chooseRole(viewer: boolean) {
    this.viewer = viewer;
    this.roleForm.reset({ completed: 'completed' });
    this.stepper.next();
  }

  connectToServer() {
    const serverAddress: string = this.serverForm.controls.serverAddress;
  }
}
