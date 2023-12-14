import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService } from '../blog.service';
import { OnInit } from '@angular/core';
import { BlogPost } from '../Interface/blogPost';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  blogs: BlogPost[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.blogService.getBlogs().subscribe((data: BlogPost[]) => {
      this.blogs = data;
    });
  }
}
