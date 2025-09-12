import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

import { AppComponent } from './app/app';

const firebaseConfig = {
  apiKey: 'AIzaSyD-7jn7sMHsN9MGH51LhJLTxCLCDEMx7mI',
  authDomain: 'angular-workshop-95795.firebaseapp.com',
  databaseURL: 'https://angular-workshop-95795-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'angular-workshop-95795',
  storageBucket: 'angular-workshop-95795.firebasestorage.app',
  messagingSenderId: '92874982361',
  appId: '1:92874982361:web:6350cc9f5c2da5eaf38fc8',
  measurementId: 'G-YN9PPMP87R',
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([]),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideDatabase(() => getDatabase()),
  ],
}).catch((err) => console.error(err));
