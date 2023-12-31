import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-chinhsach',
  templateUrl: './chinhsach.component.html',
  styleUrl: './chinhsach.component.css'
})
export class ChinhsachComponent implements OnInit {
  selectedContent: string | null = 'chinh-sach-ban-hang';

  showContent(contentId: string): void {
    this.selectedContent = contentId;
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedContent = params['id'] || 'chinh-sach-ban-hang'; // Set a default value if 'id' is not present
    });
  }

  
}
