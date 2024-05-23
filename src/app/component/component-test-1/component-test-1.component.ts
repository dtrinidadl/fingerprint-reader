import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ContentChild,
  ChangeDetectorRef,
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

@Component({
  selector: 'app-component-test-1',
  templateUrl: './component-test-1.component.html'
})
export class ComponentTest1Component implements OnInit, OnDestroy, AfterContentInit {
  // @ContentChild('someContent') content: any;
  // <p #someContent>Contenido proyectado</p>

  $error: any;
  title = 'fingerprint-reader';
  ListaFingerprintReader: any;
  InfoFingerprintReader: any;
  ListaSampleFingerPrints: any;
  currentImageFinger: any;
  currentImageFingerFixed: any;

  private reader: FingerprintReader;

  constructor() {
    this.reader = new FingerprintReader();
  }

  private onDeviceConnected = (event: DeviceConnected) => { };

  private onDeviceDisconnected = (event: DeviceDisconnected) => { };

  private onAcquisitionStarted = (event: AcquisitionStarted) => {
    console.log("En evento onAcquisitionStarted:", event);
    // console.log(event);
  };

  // private onAcquisitionStopped = (event: AcquisitionStopped) => {
  //   console.log("En vento: AcquisitionStopped:", event);
  //   // console.log(event);
  // };

  private onSamplesAcquired = (event: SamplesAcquired) => {
    console.log("En el vento: Adquisicion de Imagen");
    this.ListaSampleFingerPrints = event;
  };

  ngOnInit() {
    this.reader = new FingerprintReader();
    this.reader.on("DeviceConnected", this.onDeviceConnected)
    this.reader.on("DeviceDisconnected", this.onDeviceDisconnected)
    this.reader.on("AcquisitionStarted", this.onAcquisitionStarted)
    // this.reader.on("AcquisitionStopped", this.onAcquisitionStopped)
    this.reader.on("SamplesAcquired", this.onSamplesAcquired)
  }

  async ngAfterContentInit() {
    // const enumerateDevices = await this.reader.enumerateDevices();

    try {
      const enumerateDevices: any = await this.fn_ListaDispositivos();
      console.log(enumerateDevices);
      // const getDeviceInfo: any = await this.fn_DeviceInfo(enumerateDevices);
      // console.log(getDeviceInfo);
      // const startAcquisition: any = await this.fn_StarCapturaFP(getDeviceInfo[0]['DeviceID']);
      // const startAcquisition: any = await this.fn_StarCapturaFP(enumerateDevices);
      this.fn_StarCapturaFP(enumerateDevices);



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
    // this.reader.off("AcquisitionStopped", this.onAcquisitionStopped)
    this.reader.off("SamplesAcquired", this.onSamplesAcquired)
  }

  //Listar Dispositivos Conectados
  fn_ListaDispositivos() {
    return new Promise((resolve, reject) => {
      this.reader.enumerateDevices()
        .then(
          (result) => {
            console.log('enumerateDevices:', result);
            resolve(result[0])
          })
        .catch((error) => {
          reject(error);
        })
    });
  }

  //Obtener Informacion de Dispositivo
  fn_DeviceInfo(deviceID: any) {
    return new Promise((resolve, reject) => {
      this.reader.getDeviceInfo(deviceID)
        .then(
          (result) => {
            console.log('getDeviceInfo:', result);
            resolve(result)
          })
        .catch((error) => {
          reject(error);
        })
    });
  }

  //Iniciar Device Para Lectura
  fn_StarCapturaFP(deviceID: any) {
    return new Promise((resolve, reject) => {
      this.reader.startAcquisition(SampleFormat.PngImage, deviceID)
        .then(
          (result) => {
            resolve(result)
            console.log('Aca deberia estar la huella: ', result);
            // console.log('startAcquisition al leer la huella: ', result);
          })
        .catch((error) => {
          reject(error);
        })
    });
  }

  //Detener Device Para Lectura
  fn_EndCapturaFP() {
    Promise.all([
      this.reader.stopAcquisition(this.InfoFingerprintReader['DeviceID'])
    ])
      .then((response) => {
        console.log("You can stop capturing.");
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  //Mostrar Captura
  fn_CapturaFP() {
    // console.log(this.ListaSampleFingerPrints);
    var ListImages = this.ListaSampleFingerPrints['samples'];
    var lsize = Object.keys(ListImages).length;

    if (ListImages != null && ListImages != undefined) {
      if (lsize > 0) {
        this.currentImageFinger = ListImages[0];
        this.currentImageFingerFixed = this.fn_fixFormatImageBase64(this.currentImageFinger);
      }
    }
  }

  //Corregir Formato Base4 (revisar correcion en linea)
  fn_fixFormatImageBase64(prm_imagebase: any) {
    var strImage = '';
    strImage = prm_imagebase;
    //Reemplazar caracteres no validos
    strImage = strImage.replace(/_/g, "/");
    strImage = strImage.replace(/-/g, "+");
    return strImage;
  }
}
