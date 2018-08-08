import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { of } from 'rxjs';

import { KeyErrorStateMatcher } from './key-error-state-matcher';

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
  badRoomName = false;
  badRoomPassword = false;

  connectingToServer = false;
  keyErrorStateMatcher: ErrorStateMatcher;
  serverErrorStateMatcher: ErrorStateMatcher;
  roomNameErrorStateMatcher: ErrorStateMatcher;
  roomPasswordErrorStateMatcher: ErrorStateMatcher;
  socket: any;
  timeoutMilliseconds = 500;
  viewer: boolean;

  constructor(private _formBuilder: FormBuilder) {
    // The Key in KeyErrorStateMatcher is a key on the scope, distinct from the
    // key being used to authenticate with the server
    this.keyErrorStateMatcher = new KeyErrorStateMatcher(this, 'badKey');
    this.serverErrorStateMatcher = new KeyErrorStateMatcher(this, 'badServer');
    this.roomNameErrorStateMatcher = new KeyErrorStateMatcher(this, 'badRoomName');
    this.roomPasswordErrorStateMatcher = new KeyErrorStateMatcher(this, 'badRoomPassword');
  }

  ngOnInit() {
    this.roleForm = this._formBuilder.group({
      completed: ['', Validators.required]
    });
    this.serverForm = this._formBuilder.group({
      serverAddress: ['', Validators.required],
      authenticationKey: ['']
    });
    this.roomForm = this._formBuilder.group({
      roomName: ['', Validators.required],
      roomPassword: ['']
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
      if (!messageEvent.data || typeof messageEvent.data !== 'string') {
        connectionFailHandler();
      } else if (messageEvent.data === 'soms requesting key') {
        // Send key if requested
        const baseKey = this.serverForm.controls.authenticationKey.value;
        const key = baseKey ? baseKey.trim() : '';
        socket.send(`soms-key: ${JSON.stringify({'key': key})}`);
      } else if (messageEvent.data === 'soms accept') {
        // Continue to rooms if connection completed
        this.socket = socket;
        this.stepper.next();
      } else if (messageEvent.data === 'soms deny') {
        // Display bad key message
        socket.onerror = () => {};
        this.badKey = true;
        this.connectingToServer = false;
        this.serverForm.patchValue({
          serverAddress: serverAddress.trim()
        });
      }
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

  handleRoomForm(): void { }
}
