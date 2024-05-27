import {
  OnInit,
  Component,
  OnDestroy,
  AfterContentInit
} from '@angular/core';

import {
  FingerprintReader,
  SampleFormat,
  DeviceConnected,
  DeviceDisconnected,
  SamplesAcquired,
  AcquisitionStarted,
  AcquisitionStopped
} from "@digitalpersona/devices"

import '../../core/modules/WebSdk';

import * as CryptoJS from 'crypto-js';
import { VerifyImageService } from '../../service/verify-image.service';


@Component({
  selector: 'app-component-test-2',
  templateUrl: './component-test-2.component.html'
})
// export class ComponentTest2Component {
export class ComponentTest2Component implements OnInit, OnDestroy, AfterContentInit {
  private reader: FingerprintReader = new FingerprintReader();
  public $error: any;
  public $loading: any;
  public message_type: number = 0;
  public message: string = '';
  public view: string = 'home';
  public image_default: string = '../../../assets/images/demuestran-vulnerabilidad-lectores-huella-digital.jpg';
  public diviceID: any;
  public currentFingerprint: any;
  public listSampleFingerprints: any;

  constructor(
    private verifyImageService: VerifyImageService
  ) {
    const getListHashFingerprints = localStorage.getItem('listHashFingerprints');
    const getListSampleFingerprints = localStorage.getItem('listSampleFingerprints');
    if (!getListSampleFingerprints) {
      localStorage.setItem('listSampleFingerprints', '[]');
    }
    if (!getListHashFingerprints) {
      localStorage.setItem('listHashFingerprints', '[]');
    }
  }

  ngOnInit() {
    this.reader = new FingerprintReader();
    this.reader.on("DeviceConnected", this.onDeviceConnected)
    this.reader.on("AcquisitionStarted", this.onAcquisitionStarted)
    this.reader.on("SamplesAcquired", this.onSamplesAcquired)
  }

  async ngAfterContentInit() {
    try {
      const list_devices: any = await this.list_devices();
      const star_device: any = await this.star_device(list_devices[0]);
    } catch (error) {
      this.$error = error;
      console.error(error);
    };
  }

  ngOnDestroy() {
    this.reader = new FingerprintReader();
    this.reader.off("DeviceConnected", this.onDeviceConnected)
    this.reader.off("DeviceDisconnected", this.onDeviceDisconnected)
    this.reader.off("AcquisitionStarted", this.onAcquisitionStarted)
    this.reader.off("AcquisitionStopped", this.onAcquisitionStopped)
    this.reader.off("SamplesAcquired", this.onSamplesAcquired)
  }

  //Funciones Fingerprinter
  private onDeviceConnected = (event: DeviceConnected) => {
    // console.log('(DeviceConnected):', event);
  };

  private onDeviceDisconnected = (event: DeviceDisconnected) => {
    // console.log('(DeviceDisconnected):', event);
  };

  private onAcquisitionStarted = (event: AcquisitionStarted) => {
    // console.log('(AcquisitionStarted):', event);
  };

  private onAcquisitionStopped = (event: AcquisitionStopped) => {
    // console.log('(AcquisitionStopped):', event);
  };

  private onSamplesAcquired = (event: SamplesAcquired) => {
    console.log('(SamplesAcquired):', event);
    this.listSampleFingerprints = event;
    this.view_fingerprint();
  };

  // Listar Dispositivos Conectados
  list_devices() {
    return new Promise((resolve, reject) => {
      this.reader.enumerateDevices()
        .then(
          (result) => {
            this.diviceID = result[0];
            resolve(result)
          })
        .catch((error) => {
          reject(error);
        })
    });
  }

  // Iniciar Device Para Lectura
  star_device(deviceID: any) {
    return new Promise((resolve, reject) => {
      this.reader.startAcquisition(SampleFormat.PngImage, deviceID) // Raw, Compressed, Intermediate, PngImage
        .then(
          (result) => {
            resolve(result)
          })
        .catch((error) => {
          reject(error);
        })
    });
  }

  //Mostrar Captura
  async view_fingerprint() {
    const images = this.listSampleFingerprints?.samples[0];
    if (images != null && images != undefined && images.length > 0) {
      // let fix_image = images;
      // fix_image = await fix_image.replace(/_/g, "/");
      // fix_image = await fix_image.replace(/-/g, "+");
      let fix_image = images.replace(/-/g, '+').replace(/_/g, '/');

      while (fix_image.length % 4 !== 0) {
        fix_image += '=';
      };

      this.currentFingerprint = fix_image;
    }
  }
  ////////////////////////////

  //Cambiar de vista
  change_view(view: string) {
    this.view = view;
    this.star_device(this.diviceID);
  }

  //Guardar el base 64 en localstorge
  async save_fingerprint() {
    try {
      this.$loading = true;

      //Guardar Base64
      const getListSampleFingerprints = await localStorage.getItem('listSampleFingerprints') || '[]';
      const listSampleFingerprints = await JSON.parse(getListSampleFingerprints!.toString());
      await listSampleFingerprints.push(this.currentFingerprint);
      await localStorage.setItem('listSampleFingerprints', JSON.stringify(listSampleFingerprints));

      //Guardar Hash
      const imageHash = await this.base64ToHash(this.currentFingerprint);
      const getListHashFingerprints = await localStorage.getItem('listHashFingerprints') || '[]';
      const listHashFingerprints = await JSON.parse(getListHashFingerprints!.toString());
      await listHashFingerprints.push(imageHash);
      await localStorage.setItem('listHashFingerprints', JSON.stringify(listHashFingerprints));

      /*Servicio // this.listSampleFingerprints?.samples[0]; this.currentFingerprint; listSampleFingerprints; listHashFingerprints
      this.verifyImageService.saveFingerprinter(listSampleFingerprints).then(
        (response) => {
          console.log(response);
        },
        error => {
          console.log(error);
        }).finally(() => {
          this.$loading = false
        });
      //*/

      setTimeout(() => {
        this.view = 'home';
        this.currentFingerprint = undefined;
        this.$loading = false;
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  }

  //Buscar coincidencia
  async search_fingerprint() {
    try {
      this.$loading = true;
      const getListSampleFingerprints = await localStorage.getItem('listSampleFingerprints') || '[]';
      const listSampleFingerprints = await JSON.parse(getListSampleFingerprints!.toString());
      const validate = await listSampleFingerprints.includes(this.currentFingerprint);
      console.log(validate);

      /* Servicio // this.listSampleFingerprints?.samples[0]; this.currentFingerprint 
      this.verifyImageService.saveFingerprinter(this.currentFingerprint).then(
        (response) => {
          console.log(response);
        },
        error => {
          console.log(error);
        }).finally(() => {
          this.$loading = false
        });
      //*/

      // const isMatch = await digitalPersona.match(fingerprint, storedFingerprint);

      setTimeout(() => {
        this.$loading = false;
        if (validate) {
          this.message_type = 1;
          this.message = 'Huella encontrada';
        } else {
          this.message_type = 0;
          this.message = 'No hay coincidencias';
        }
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  //Buscar coincidencia con hash
  async search_hash_fingerprint() {
    this.$loading = true;

    const getListHashFingerprints = await localStorage.getItem('listHashFingerprints') || '[]';
    const listHashFingerprints = await JSON.parse(getListHashFingerprints!.toString());
    const imageHash = await this.base64ToHash(this.currentFingerprint);
    console.log('imageHash:', imageHash);
    const validate = await listHashFingerprints.includes(imageHash);
    console.log('Coincidencia:', validate);

    setTimeout(() => {
      this.$loading = false;
      if (validate) {
        this.message_type = 1;
        this.message = 'Huella encontrada';
      } else {
        this.message_type = 0;
        this.message = 'No hay coincidencias';
      }
    }, 2000);
  }

  async base64ToHash(base64String: string): Promise<string> {
    // Eliminar el prefijo de datos si existe
    const base64Data = base64String; // base64String.replace(/^data:image\/\w+;base64,/, "");

    // Decodificar base64 a ArrayBuffer
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Calcular el hash usando SHA-256
    const wordArray = CryptoJS.lib.WordArray.create(bytes);
    const hash = CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex);

    return hash;
  }
}