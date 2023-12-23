import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string): SafeResourceUrl {
    // Chuyển đổi thành SafeResourceUrl trực tiếp
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}
