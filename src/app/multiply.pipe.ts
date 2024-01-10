import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multiply',
  standalone: true,
})
export class MultiplyPipe implements PipeTransform {
  transform(a: number, b: number): number {
    if (a > b) {
      return a / b;
    }

    return b / a;
  }
}
