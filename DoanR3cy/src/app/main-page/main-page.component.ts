import { Component } from '@angular/core';
import { BlogPost } from '../Interface/blogPost';
import { BlogService } from '../Service/blog.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProductService } from '../Service/product.service';
import { product } from '../Interface/product';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {
  selectedCategory: string = 'cham-soc';

  showContent(contentId: string): void {
    this.selectedCategory = contentId;
  }

  visibleAnswers: { [key: string]: boolean } = {};

  
  toggleAnswer(questionId: string): void {
    this.visibleAnswers[questionId] = !this.visibleAnswers[questionId];
}

  isAnswerVisible(questionId: string): boolean {
    return this.visibleAnswers[questionId] || false;
  }

  blog: BlogPost | undefined;
  blogs: BlogPost[] = [];
  product: any;
  selectedCode: any;
  productsHighlight: product[] = [];
  productsSuggestion: product[] = [];

  constructor(
    private productService: ProductService,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe((data: BlogPost[]) => {
      this.blogs = data.slice(0, 4);
    });
  
    this.productService.getData().subscribe((data: product[]) => {
      // Lấy tất cả sản phẩm từ DB
      const allProducts = data;
  
      // Kiểm tra xem có ít nhất 8 sản phẩm (4 sản phẩm nổi bật và 4 sản phẩm gợi ý) trong DB không
      if (allProducts.length >= 8) {
        // Lấy 4 sản phẩm đầu tiên làm sản phẩm nổi bật
        this.productsHighlight = this.getFirstNProducts(allProducts, 4);
  
        // Lấy 4 sản phẩm cuối cùng làm sản phẩm gợi ý
        this.productsSuggestion = this.getLastNProducts(allProducts, 4);
      } else {
        console.error('Không đủ sản phẩm trong cơ sở dữ liệu.');
      }
    });
  }
  viewBlogDetail(blogId: string) {
    this.router.navigate(['/blog', blogId]);
    console.log(blogId)
  }

  // Hàm lấy n sản phẩm đầu tiên từ mảng sản phẩm
  private getFirstNProducts(products: product[], n: number): product[] {
    return products.slice(0, n);
  }

  // Hàm lấy n sản phẩm cuối cùng từ mảng sản phẩm
  private getLastNProducts(products: product[], n: number): product[] {
    return products.slice(-n);
  }
  
}