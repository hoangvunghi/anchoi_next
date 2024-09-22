import axiosClient from "./axios-client";
import axiosServer from "@/api/axios-server";

export const searchApi = {
  getTypes({server = false}: { server?: boolean }) {
    const url = "/api/v1/entertainment-types";
    return server ? axiosServer.get(url) : axiosClient.get(url);
  },
  getProvinces() {
    const url = "/api/v1/provinces";
    return axiosClient.get(url);
  },
  getDistrict(provinceId: string) {
    const url = `/api/v1/districts/province/${provinceId}`;
    return axiosClient.get(url);
  },
  getWard(districtId: string) {
    const url = `/api/v1/wards/district/${districtId}`;
    return axiosClient.get(url);
  },
  search({slug, server = false}: { slug: string, server?: boolean }) {
    const url = `/api/v1/entertainment-spots/value-search/${slug}`;
    return server ? axiosServer.get(url) : axiosClient.get(url);
  },
  findNear({lat, lon}: { lat: number, lon: number }) {
    const url = `/api/v1/entertainment-spots/find-nearest/${lat}/${lon}`;
    return axiosClient.get(url);
  },
  findNearWithType(lat: number, lon: number, type: string) {
    const url = `/api/v1/entertainment-spots/find-nearest-by-type/${lat}/${lon}/${type}`;
    return axiosClient.get(url);
  }
};
