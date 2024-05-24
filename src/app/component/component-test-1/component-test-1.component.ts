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

@Component({
  selector: 'app-component-test-1',
  templateUrl: './component-test-1.component.html'
})
export class ComponentTest1Component implements OnInit, OnDestroy, AfterContentInit {
  private reader: FingerprintReader = new FingerprintReader();

  public $error: any;
  public currentFingerprint: any;
  public listSampleFingerprints: any;

  constructor() {
    // this.reader = new FingerprintReader();
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
    // console.log('(SamplesAcquired):', event);
    this.listSampleFingerprints = event;
  };
  
  // Listar Dispositivos Conectados
  list_devices() {
    return new Promise((resolve, reject) => {
      this.reader.enumerateDevices()
        .then(
          (result) => {
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
      this.reader.startAcquisition(SampleFormat.PngImage, deviceID)
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
  view_fingerprint() {
    const images = this.listSampleFingerprints?.samples[0];
    if (images != null && images != undefined && images.length > 0) {
      let fix_image;
      fix_image = images.replace(/_/g, "/");
      fix_image = images.replace(/-/g, "+");
      this.currentFingerprint = fix_image;
    }
  }
}
