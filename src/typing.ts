import type { StopListEntry } from "hk-bus-eta"
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface WarnUpMessageData {
  type: "WARN_UP_MAP_CACHE";
  retinaDisplay: boolean;
  zoomLevels: number[];
  stopList?: StopListEntry[];
}

export interface GeoLocation {
  lat: number;
  lng: number;
}
