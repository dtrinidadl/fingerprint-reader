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

  constructor() {
    const getListSampleFingerprints = localStorage.getItem('listSampleFingerprints');
    if (!getListSampleFingerprints) {
      localStorage.setItem('listSampleFingerprints', '[]');
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
      let fix_image = images;
      fix_image = await fix_image.replace(/_/g, "/");
      fix_image = await fix_image.replace(/-/g, "+");
      this.currentFingerprint = fix_image;
    }
  }

  async view_fingerprint_raw_no_funciona() {
    const file: File = this.listSampleFingerprints?.samples[0]?.Data;
    this.convertToBase64(file).then(base64 => {
      console.log(base64);
    });
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = error => reject(error);
    });
  }

  change_view(view: string) {
    this.view = view;
    this.star_device(this.diviceID);
  }

  async save_fingerprint() {
    this.$loading = true;
    const getListSampleFingerprints = await localStorage.getItem('listSampleFingerprints') || [];
    const listSampleFingerprints = await JSON.parse(getListSampleFingerprints!.toString());
    await listSampleFingerprints.push(this.currentFingerprint);
    await localStorage.setItem('listSampleFingerprints', JSON.stringify(listSampleFingerprints));

    setTimeout(() => {
      this.view = 'home';
      this.currentFingerprint = undefined;
      this.$loading = false;
    }, 1000);
  }

  async search_fingerprint() {
    this.$loading = true;
    const getListSampleFingerprints = await localStorage.getItem('listSampleFingerprints') || '[]';
    const listSampleFingerprints = await JSON.parse(getListSampleFingerprints!.toString());
    const validate = await listSampleFingerprints.includes(this.currentFingerprint);
    console.log(validate);

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
}


