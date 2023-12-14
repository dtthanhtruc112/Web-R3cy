import { Component } from '@angular/core';
import { BlogPost } from '../Interface/blogPost';
import { BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
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
  relatedBlogs: BlogPost[] = [];

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.blogService.getBlogById(id).pipe(
        switchMap(blog => this.blogService.getBlogs().pipe(
          map(blogs => ({
            blog,
            relatedBlogs: blogs
              .filter(b => b.id !== id)
              .sort((a, b) => b.id - a.id) // Sắp xếp theo id giảm dần
              .slice(0, 4) // Lấy 4 bài viết đầu tiên
          }))
        ))
      ))
    ).subscribe(data => {
      this.blog = data.blog;

      if (Array.isArray(data.relatedBlogs)) {
        this.relatedBlogs = data.relatedBlogs;
      } else if (typeof data.relatedBlogs === 'object' && data.relatedBlogs !== null) {
        this.relatedBlogs = [data.relatedBlogs as BlogPost];
      } else {
        console.error('Invalid related blogs data:', data.relatedBlogs);
        this.relatedBlogs = [];
      }
    });
  }
}
