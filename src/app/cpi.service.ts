import { Injectable } from '@angular/core';
import Papa from 'papaparse';

const CPI_FILE_PATH = 'assets/cpi.tsv';
const COLUMN_NAME_COUNTRY_NAME = 'Country Name';
const COLUMN_NAME_COUNTRY_CODE = 'Country Code';
const COLUMN_NAME_CURRENCY_CODE = 'Currency Code';
const DATA_START_YEAR = 1960;
const DATA_END_YEAR = 2022;

export interface CountryData {
  countryCode: string;
  currencyCode: string;
  startYear: number;
  endYear: number;
  cpiList: number[];
}

@Injectable({
  providedIn: 'root',
})
export class CpiService {
  constructor() {}

  public getCountryDataMap(): Promise<Map<string, CountryData>> {
    const countryDataMap = new Map<string, CountryData>();
    return new Promise((resolve, reject) => {
      Papa.parse(CPI_FILE_PATH, {
        header: true,
        download: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        delimiter: '\t',
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(result.errors);
            return;
          }

          for (const item of result.data) {
            const countryName = (item as any)[COLUMN_NAME_COUNTRY_NAME];
            const countryData: CountryData = {
              countryCode: `${(item as any)[COLUMN_NAME_COUNTRY_CODE]}`,
              currencyCode: `${(item as any)[COLUMN_NAME_CURRENCY_CODE]}`,
              startYear: -1,
              endYear: -1,
              cpiList: [],
            };

            for (let year = DATA_START_YEAR; year <= DATA_END_YEAR; year++) {
              const value = +`${(item as any)[`${year}`]}`;
              if (Number.isNaN(value)) {
                continue;
              }

              if (countryData.startYear === -1) {
                countryData.startYear = year;
              }

              countryData.endYear = year;
              countryData.cpiList.push(value);
            }

            if (countryData.cpiList.length === 0) {
              continue;
            }

            countryDataMap.set(countryName, countryData);
          }

          resolve(countryDataMap);
        },
        error: (error: any) => {
          reject(error);
        },
      });
    });
  }

  public calculateValueWithCPI(
    value: number,
    countryData: CountryData,
    fromYear: number,
    toYear: number
  ): number {
    if (fromYear === toYear) {
      return value;
    }

    if (fromYear < toYear) {
      for (let i = 1; fromYear + i <= toYear; i++) {
        value *=
          (100 + countryData.cpiList[i + fromYear - countryData.startYear]) /
          100;
      }

      return value;
    }

    for (let i = 0; fromYear - i > toYear; i++) {
      value /=
        (100 + countryData.cpiList[fromYear - i - countryData.startYear]) / 100;
    }

    return value;
  }
}
