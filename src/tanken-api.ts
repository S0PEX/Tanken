import { throws } from "assert/strict";
import axios, { AxiosResponse } from "axios";

export enum GasType {
  Benzin = "e5",
  Bezin_E10 = "E10",
  Diesel = "diesel",
  All = "all",
}

export enum SortType {
  Price = "price",
  Dist = "dist",
}

export interface BaseApiResponse {
  ok: boolean;
  license: string;
  data: string;
  status: string;
}

export interface Station {
  id: string;
  name: string;
  brand: string;
  street: string;
  place: string;
  lat: number;
  lng: number;
  dist: number;
  price?: number;
  diesel?: number;
  e5?: number;
  e10?: number;
  isOpen: boolean;
  houseNumber: number;
  postCode: number;
}

export interface MksStationsListResponse extends BaseApiResponse {
  stations: [Station];
}

export class TankKoenigApi {
  private apiKey = "4d687f07-5bc3-76fe-b9ec-9deeed4079c9";
  private api = axios.create({
    baseURL: `https://creativecommons.tankerkoenig.de/json/`,
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 303,
  });

  private async sendRequest<T>(url: string, params: {}) {
    return await this.api.get<T>(url, {
      params: {
        apikey: this.apiKey,
        ...params,
      },
    }).then(res => res.data);
  }

  public async getStationsByLocation(
    lat: number,
    lng: number,
    rad: number,
    sort: SortType,
    type: GasType
  ) {
    return await this.sendRequest<MksStationsListResponse>("list.php", {
      lat,
      lng,
      rad,
      sort: sort || print,
      type: type || GasType.Benzin,
    });
  }
}

export const tankKoenigApi = new TankKoenigApi();
