import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileItem } from '../models/file-item';
import { Imagen } from '../models/imagen';
import * as firebase from 'firebase';

import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CargaImagenesService {
  private CARPETA_IMAGENES = 'img';
  // public uploadPercent: Observable<number>;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // cargarImagenesFirebase(imagenes: FileItem[]): void {
  //   const storageRef = firebase.storage().ref();

  //   for (const item of imagenes) {
  //     item.estaSubiendo = true;
  //     if (item.progreso >= 100) {
  //       continue;
  //     }

  //     const uploadTask: firebase.storage.UploadTask = storageRef
  //       .child(`${this.CARPETA_IMAGENES}/${item.nombreArchivo}`)
  //       .put(item.archivo);

  //     uploadTask.on(
  //       firebase.storage.TaskEvent.STATE_CHANGED,
  //       (snapshop: firebase.storage.UploadTaskSnapshot) =>
  //         (item.progreso =
  //           (snapshop.bytesTransferred / snapshop.totalBytes) * 100),
  //       (error) => console.log('Error al subir: ', error),
  //       () => {
  //         console.log('Imagen cargada correctamente');
  //         item.url = uploadTask.snapshot.downloadURL;
  //         item.estaSubiendo = false;
  //         this.guardarImagen({
  //           nombre: item.nombreArchivo,
  //           url: item.url,
  //         });
  //       }
  //     );
  //   }
  // }

  cargarImagenesFirebase(imagenes: FileItem[]): void {
    for (const item of imagenes) {
      item.estaSubiendo = true;
      if (item.progreso >= 100) {
        continue;
      }

      const file = item.archivo;
      const filePath = `${this.CARPETA_IMAGENES}/${item.nombreArchivo}`;
      const ref = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.catch((error) => {
        console.log('ERROR: ', error);
      });

      task
        .percentageChanges()
        .subscribe((porcentaje) => (item.progreso = porcentaje));

      task
        .snapshotChanges()
        .pipe(
          finalize(() =>
            ref.getDownloadURL().subscribe((url) => {
              item.url = url;
              item.estaSubiendo = false;
              this.guardarImagen({
                nombre: item.nombreArchivo,
                url: item.url,
              });
            })
          )
        )
        .subscribe();

      // console.log('Item: ', item);

      // task.catch((error) => console.log(error));
    }
  }

  private guardarImagen(imagen: Imagen): void {
    // console.log('Imagen: ', imagen);

    this.db.collection(`/${this.CARPETA_IMAGENES}`).add(imagen);
  }
}
