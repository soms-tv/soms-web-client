import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';

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
  connectingToServer = false;
  socket: any;
  timeoutMilliseconds = 500;
  viewer: boolean;

  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.roleForm = this._formBuilder.group({
      completed: ['', Validators.required]
    });
    this.serverForm = this._formBuilder.group({
      serverAddress: ['', Validators.compose([Validators.required, () => { return this.badServer ? { 'badServer': true } : null; }])],
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
    if (this.serverForm.invalid) {
      return;
    }

    let serverAddress: string = this.serverForm.controls.serverAddress.value.trim();
    if (serverAddress.indexOf('http://') === 0) {
      serverAddress = 'ws://' + serverAddress.slice('http://'.length)
    } else if (serverAddress.indexOf('https://') === 0) {
      serverAddress = 'wss://' + serverAddress.slice('https://'.length)
    }
    if (serverAddress.indexOf('ws://') !== 0 && serverAddress.indexOf('wss://') !== 0) {
      serverAddress = 'ws://' + serverAddress;
    }

    const connectionFailHandler = () => {
      socket.onerror = () => {};
      this.badServer = true;
      this.connectingToServer = false;
      this.serverForm.patchValue({
        serverAddress: serverAddress.trim()
      });
    };

    const socket = new WebSocket(serverAddress);
    this.connectingToServer = true;
    socket.onmessage = (messageEvent) => {
      if (!messageEvent.data || typeof messageEvent.data !== 'string' || messageEvent.data.indexOf('soms') !== 0) {
        connectionFailHandler();
      }
      socket.send(this.serverForm.controls.authenticationKey.value.trim());
    };
    socket.onerror = connectionFailHandler;
    setTimeout(() => {
      if (!this.connectingToServer) {
        return;
      }
      this.timeoutMilliseconds *= 1.5;
      connectionFailHandler();
    }, this.timeoutMilliseconds);
  }
}
