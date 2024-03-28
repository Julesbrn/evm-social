import {Directive, Input, HostBinding} from '@angular/core';

@Directive({
  selector: 'img[defaultImage]',
  host: {
    '(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src'
  }
})
export class ImagePreloadDirective {
  @Input() src: string = '';
  @Input() defaultImage: string = '/assets/pixels2.jpg';
  @HostBinding('class.default-image') defaultImageClass = false;
  
  updateUrl() {
    this.src = this.defaultImage;
    this.defaultImageClass = true;
  }
  
  load() {
    this.defaultImageClass = false;
  }
}
