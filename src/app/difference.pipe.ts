import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difference',
  standalone: true,
})
export class DifferencePipe implements PipeTransform {
  transform(a: number, b: number): number {
    return Math.abs(a - b);
  }
}
