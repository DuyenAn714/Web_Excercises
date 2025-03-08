import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FashionService, Fashion } from '../../services/fashion.service';

@Component({
  selector: 'app-fashion-detail',
  templateUrl: './fashion-detail.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class FashionDetailComponent implements OnInit {
  fashionItem: Fashion | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fashionService: FashionService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadFashionDetail(id);
    }
  }

  loadFashionDetail(id: string): void {
    this.fashionService.getFashionById(id).subscribe(data => {
      this.fashionItem = data;
    });
  }

  editFashion(id?: string): void {
    if (id) {
      this.router.navigate(['/fashion/edit', id]);
    }
  }
  
  deleteFashion(id?: string): void {
    if (id && confirm('Bạn có chắc chắn muốn xóa mục này?')) {
      this.fashionService.deleteFashion(id).subscribe(() => {
        this.goBack();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/fashion']);
  }
}