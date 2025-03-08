import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Define an interface for the Fashion item
export interface Fashion {
  _id: string; 
  title: string;
  details: string;
  thumbnail: string;
  style: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FashionService {
  // Cập nhật đường dẫn API để khớp với server.js
  private apiUrl = environment.apiUrl + '/api/fashions';

  constructor(private http: HttpClient) {
    console.log('API URL being used:', this.apiUrl);
  }

  // Lấy tất cả fashion
  getAllFashion(): Observable<Fashion[]> {
    return this.http.get<Fashion[]>(this.apiUrl);
  }

  // Lấy fashion theo ID
  getFashionById(id: string): Observable<Fashion> {
    return this.http.get<Fashion>(`${this.apiUrl}/${id}`);
  }

  // Lấy fashion theo style
  getFashionByStyle(style: string): Observable<Fashion[]> {
    return this.http.get<Fashion[]>(`${this.apiUrl}/style/${style}`);
  }

  // Thêm fashion mới
  addFashion(fashion: Fashion): Observable<Fashion> {
    return this.http.post<Fashion>(this.apiUrl, fashion);
  }

  // Cập nhật fashion
  updateFashion(id: string, fashion: Fashion): Observable<Fashion> {
    return this.http.put<Fashion>(`${this.apiUrl}/${id}`, fashion);
  }

  // Xóa fashion
  deleteFashion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Lấy danh sách các style duy nhất từ dữ liệu
  getUniqueStyles(): Observable<string[]> {
    return new Observable<string[]>(observer => {
      this.getAllFashion().subscribe(
        fashions => {
          const styles = [...new Set(fashions.map((item: Fashion) => item.style))];
          observer.next(styles);
          observer.complete();
        },
        error => {
          observer.error(error);
        }
      );
    });
  }
}