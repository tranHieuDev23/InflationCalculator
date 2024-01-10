import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { CountryData, CpiService } from './cpi.service';
import { DifferencePipe } from './difference.pipe';
import { MultiplyPipe } from './multiply.pipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzGridModule,
    NzSelectModule,
    NzTypographyModule,
    NzButtonModule,
    FormsModule,
    NzInputNumberModule,
    NzFormModule,
    DifferencePipe,
    MultiplyPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public countryData: CountryData | undefined;
  public value = 0;
  public fromYear = 1960;
  public targetYear = 2022;
  public targetValue = 0;

  public countryAndCountryDataList: {
    country: string;
    countryData: CountryData;
  }[] = [];

  public currencyFormatter = (value: number | string): string | number => {
    return value;
  };

  public currencyParser = (value: string): string => {
    return value.replace(/[^0-9.-]+/g, '');
  };

  constructor(private readonly cpiService: CpiService) {}

  ngOnInit(): void {
    this.cpiService.getCountryDataMap().then((value) => {
      this.countryAndCountryDataList = Array.from(value.entries())
        .map((item) => {
          return {
            country: item[0],
            countryData: item[1],
          };
        })
        .sort((a, b) => {
          return a.country.localeCompare(b.country);
        });
    });
  }

  public onCountryDataUpdated(countryData: CountryData): void {
    this.fromYear = countryData.startYear;
    this.targetYear = countryData.endYear;
    this.currencyFormatter = (value: string | number): string => {
      const formatter = new Intl.NumberFormat(countryData.countryCode, {
        style: 'currency',
        currency: countryData.currencyCode,
        minimumFractionDigits: 2,
      });

      return formatter.format(+value);
    };
  }

  public onNumberInputUpdated(): void {
    if (!this.countryData) {
      return;
    }

    this.targetValue = this.cpiService.calculateValueWithCPI(
      this.value,
      this.countryData,
      this.fromYear,
      this.targetYear
    );
  }
}
