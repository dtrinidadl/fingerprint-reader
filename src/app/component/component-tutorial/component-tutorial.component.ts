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
  selector: 'app-component-tutorial',
  templateUrl: './component-tutorial.component.html'
})
export class ComponentTutorialComponent  implements OnInit, OnDestroy, AfterContentInit {
  // @ContentChild('someContent') content: any;
  // <p #someContent>Contenido proyectado</p>

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
    console.log("En vento: onAcquisitionStarted");
    console.log(event);
  };

  private onAcquisitionStopped = (event: AcquisitionStopped) => {
    console.log("En vento: AcquisitionStopped");
    console.log(event);

  };

  private onSamplesAcquired = (event: SamplesAcquired) => {
    console.log("En vento: SamplesAcquired");
    console.log("En el vento: Adquisicion de Imagen");
    console.log(event);
    this.ListaSampleFingerPrints = event;
  };

  ngOnInit() {
    this.reader = new FingerprintReader();
    this.reader.on("DeviceConnected", this.onDeviceConnected)
    this.reader.on("DeviceDisconnected", this.onDeviceDisconnected)
    this.reader.on("AcquisitionStarted", this.onAcquisitionStarted)
    this.reader.on("AcquisitionStopped", this.onAcquisitionStopped)
    this.reader.on("SamplesAcquired", this.onSamplesAcquired)
  }

  async ngAfterContentInit() {
    const enumerateDevices = await this.reader.enumerateDevices();

  }

  ngOnDestroy() {
    this.reader = new FingerprintReader();
    this.reader.off("DeviceConnected", this.onDeviceConnected)
    this.reader.off("DeviceDisconnected", this.onDeviceDisconnected)
    this.reader.off("AcquisitionStarted", this.onAcquisitionStarted)
    this.reader.off("AcquisitionStopped", this.onAcquisitionStopped)
    this.reader.off("SamplesAcquired", this.onSamplesAcquired)
  }

  //Listar Dispositivos Conectados
  fn_ListaDispositivos() {
    Promise.all([
      this.reader.enumerateDevices()
    ])
      .then(results => {
        this.ListaFingerprintReader = results[0];
        console.log("Dato dispositivos");
        console.log(this.ListaFingerprintReader);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  //Obtener Informacion de Dispositivo
  fn_DeviceInfo() {
    Promise.all([
      this.reader.getDeviceInfo(this.ListaFingerprintReader[0])
    ])
      .then(results => {
        this.InfoFingerprintReader = results[0];
        console.log("Info InfoFingerprintReader");
        console.log(this.InfoFingerprintReader);
      })
      .catch((error) => {
        console.error(error);
      })
  }

  //Iniciar Device Para Lectura
  fn_StarCapturaFP() {
    console.log('DeviceID', this.InfoFingerprintReader['DeviceID']);

    Promise.all([
      // this.reader.startAcquisition(SampleFormat.Raw, this.InfoFingerprintReader['DeviceID'])
      this.reader.startAcquisition(SampleFormat.PngImage, this.InfoFingerprintReader['DeviceID'])
    ])
      .then((response) => {
        console.log("You can start capturing.");
        console.log('response', response);
      })
      .catch((error) => {
        console.error(error);
      })
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
    var ListImages = this.ListaSampleFingerPrints['samples']; var lsize = Object.keys(ListImages).length;

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
