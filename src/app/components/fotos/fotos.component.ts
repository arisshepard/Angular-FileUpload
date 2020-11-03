import { Component, OnInit } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Imagen } from '../../models/imagen';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styles: [],
})
export class FotosComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Imagen>;
  items: Observable<Imagen[]>;

  constructor(private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Imagen>('img');
    this.items = this.itemsCollection.valueChanges();
  }

  ngOnInit(): void {}
}
