import { Component, OnInit } from '@angular/core';
import { FashionService } from '../../services/fashion.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-fashion-list',
  standalone: true,
  templateUrl: './fashion-list.component.html',
  styleUrls: ['./fashion-list.component.css'],
  imports: [CommonModule]
})
export class FashionListComponent implements OnInit {
  fashionList: any[] = [];
  styles: string[] = [];
  selectedStyle: string = '';
  isLoading: boolean = true;

  constructor(
    private fashionService: FashionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFashionList();
    this.loadStyles();
  }

  loadFashionList(): void {
    this.isLoading = true;
    this.fashionService.getAllFashion().subscribe(data => {
      this.fashionList = data;
      this.isLoading = false;
    }, error => {
      console.error('Lỗi khi tải dữ liệu:', error);
      this.isLoading = false;
    });
  }

  loadStyles(): void {
    this.fashionService.getUniqueStyles().subscribe(styles => {
      this.styles = styles;
    }, error => {
      console.error('Lỗi khi tải danh sách style:', error);
    });
  }

  filterByStyle(style: string): void {
    this.selectedStyle = style;
    this.isLoading = true;
    
    if (style) {
      this.fashionService.getFashionByStyle(style).subscribe(data => {
        this.fashionList = data;
        this.isLoading = false;
      }, error => {
        console.error('Lỗi khi lọc theo style:', error);
        this.isLoading = false;
      });
    } else {
      this.loadFashionList();
    }
  }

  viewDetails(id: string): void {
    this.router.navigate(['/fashion', id]);
  }

  getImagePath(filename: string): string {
    // Nếu không có hình ảnh
    if (!filename) {
      return 'assets/images/no-image.jpg'; // Tạo một hình ảnh mặc định
    }
    
    // Nếu đường dẫn là URL đầy đủ (http hoặc https)
    if (filename.startsWith('http')) {
      return filename;
    }
    
    // Nếu đường dẫn là đường dẫn tương đối đến thư mục uploads của server
    if (filename.startsWith('uploads/')) {
      return `${environment.apiUrl}/${filename}`;
    }
    
    // Nếu chỉ là tên file, giả định ở trong thư mục assets/images
    return `assets/images/${filename}`;
  }

}