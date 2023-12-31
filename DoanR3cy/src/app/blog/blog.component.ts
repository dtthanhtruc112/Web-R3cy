import { Component } from '@angular/core';
import { BlogService } from '../Service/blog.service';
import { OnInit } from '@angular/core';
import { BlogPost } from '../Interface/blogPost';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  blogs: BlogPost[] = [];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit() {
    this.blogService.getBlogs().subscribe((data: BlogPost[]) => {
      this.blogs = data;
    });
  }
  viewBlogDetail(blogId: string) {
    this.router.navigate(['/blog', blogId]);
    console.log(blogId)
  }


  // Hàm này để lấy một số câu đầu tiên của nội dung blog
  getSummary(content: string, sentenceCount: number = 2): string {
    // Tách thành từng câu
    const sentences = content.split('. ');

    // Lấy số câu đầu tiên
    const summary = sentences.slice(0, 1).join('. ');

    // Thêm dấu ba chấm nếu có nhiều hơn
    if (sentences.length > sentenceCount) {
      return `${summary}...`;
    }

    return summary;
  }
}
