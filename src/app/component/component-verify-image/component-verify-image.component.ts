import { Component } from '@angular/core';
// import { calculate } from 'image-ssim';



@Component({
  selector: 'app-component-verify-image',
  templateUrl: './component-verify-image.component.html'
})
export class ComponentVerifyImageComponent {
  /*
  async calculateSSIM() {
    // Rutas de las imágenes que deseas comparar
    const image1Path = 'ruta/a/la/imagen1.jpg';
    const image2Path = 'ruta/a/la/imagen2.jpg';

    // Cargar las imágenes
    const image1 = await this.loadImage(image1Path);
    const image2 = await this.loadImage(image2Path);

    // Calcular el SSIM
    const ssim = calculate(image1, image2);

    console.log('El índice de similitud estructural (SSIM) es:', ssim);
  }

  // Función para cargar una imagen desde su ruta
  loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = path;
    });
  }
  */
}
