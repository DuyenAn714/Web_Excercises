import { Component, OnInit, ViewEncapsulation, Pipe, PipeTransform, Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FashionService, Fashion } from '../../services/fashion.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml',
  standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

@Directive({
  selector: '[intersectionObserver]',
  standalone: true
})
export class IntersectionObserverDirective {
  @Input() intersectionObserverInit: IntersectionObserverInit = {};
  @Output() intersectionObserver = new EventEmitter<IntersectionObserverEntry[]>();

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          this.intersectionObserver.emit(entries);
        }
      },
      this.intersectionObserverInit
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}

@Component({
  selector: 'app-fashion-list',
  templateUrl: './fashion-list.component.html',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    HttpClientModule, 
    SanitizeHtmlPipe,
    IntersectionObserverDirective
  ]
})
export class FashionListComponent implements OnInit {
  fashionItems: Fashion[] = [];
  filteredItems: Fashion[] = [];
  searchText: string = '';
  filterStyle: string = '';
  uniqueStyles: string[] = [];
  
  // Lazy loading
  pageSize: number = 10;
  currentPage: number = 1;
  hasMoreItems: boolean = false;
  isLoading: boolean = false;
  
  constructor(
    private router: Router,
    private fashionService: FashionService
  ) { }

  ngOnInit(): void {
    this.loadInitialFashionItems();
  }

  loadInitialFashionItems() {
    this.isLoading = true;
    this.fashionService.getAllFashion()
      .subscribe({
        next: (data: Fashion[]) => {
          this.fashionItems = data;
          this.extractUniqueStyles();
          this.applyFilter();
          // Giả định rằng nếu có nhiều hơn pageSize items, thì có thể tải thêm
          this.hasMoreItems = data.length >= this.pageSize;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Lỗi:', error);
          this.isLoading = false;
        }
      });
  }
  
  loadMoreItems() {
    if (this.isLoading || !this.hasMoreItems) return;
    
    this.isLoading = true;
    const offset = this.fashionItems.length;
    
    // Mô phỏng việc tải thêm dữ liệu
    // Thay thế bằng API thực tế khi có (ví dụ: getFashionItems(offset, this.pageSize))
    setTimeout(() => {
      this.fashionService.getAllFashion().subscribe({
        next: (allData: Fashion[]) => {
          // Giả lập phân trang từ dữ liệu đã tải về
          const newItems = allData.slice(offset, offset + this.pageSize);
          
          if (newItems.length > 0) {
            this.fashionItems = [...this.fashionItems, ...newItems];
            this.applyFilter();
          }
          
          this.hasMoreItems = newItems.length === this.pageSize;
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Lỗi khi tải thêm dữ liệu:', error);
          this.isLoading = false;
        }
      });
    }, 500);
  }
  
  extractUniqueStyles(): void {
    const styles = new Set(this.fashionItems.map(item => item.style));
    this.uniqueStyles = Array.from(styles);
  }
  
  applyFilter(): void {
    let result = [...this.fashionItems];
    
    // Apply search filter
    if (this.searchText.trim() !== '') {
      const searchLower = this.searchText.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.details.toLowerCase().includes(searchLower) ||
        item.style.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply style filter
    if (this.filterStyle !== '') {
      result = result.filter(item => item.style === this.filterStyle);
    }
    
    this.filteredItems = result;
  }
  
  clearSearch(): void {
    this.searchText = '';
    this.filterStyle = '';
    this.applyFilter();
  }

  viewDetail(id: string): void {
    this.router.navigate(['/fashion/detail', id]);
  }
  
  editFashion(id: string): void {
    this.router.navigate(['/fashion/edit', id]);
  }
  
  deleteFashion(id: string): void {
    if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      this.fashionService.deleteFashion(id).subscribe(() => {
        this.loadInitialFashionItems();
      });
    }
  }

  addNewFashion(): void {
    this.router.navigate(['/fashion/create']);
  }
}