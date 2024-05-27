import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class VerifyImageService {
  public url: string = '';
  private params: HttpParams;
  private headers: HttpHeaders;
  private options: { headers: HttpHeaders, params?: HttpParams };

  constructor(
    private _http: HttpClient,
  ) {
    this.params = new HttpParams();
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('accept', 'application/json');
    this.headers = this.headers.set('Content-Type', 'application/json');
    this.options = { headers: this.headers };
  }

  saveFingerprinter(data: string): Promise<any> {
    this.params = new HttpParams();
    this.options = { headers: this.headers, params: this.params };
    return this._http.post(`${this.url}ruta/`, data, this.options).toPromise();
  }

  searchFingerprinter(data: string): Promise<any> {
    this.params = new HttpParams();
    this.options = { headers: this.headers, params: this.params };
    return this._http.post(`${this.url}ruta/`, data, this.options).toPromise();
  }

  sendFormData(formData: FormData): Promise<any> {
    this.params = new HttpParams();
    this.options = {
      headers: new HttpHeaders({
        // 'x-access-token': sessionStorage.getItem('Token')!.toString()
      }),
      params: this.params
    };
    return this._http.post(`${this.url}ruta/`, formData, this.options).toPromise();
  }

}
