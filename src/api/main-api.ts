import axiosClient from "./axios-client";
import {IComment} from "@/types/main";
import axiosServer from "@/api/axios-server";

export const mainApi = {
  getLocationHot({server = false}: { server?: boolean }) {
    const url = "/api/v1/entertainment-spots/type-newest/all";
    return server ? axiosServer.get(url) : axiosClient.get(url);
  },
  getEatHot({server = false}: { server?: boolean }) {
    const url = "/api/v1/entertainment-spots/type-newest/an";
    return server ? axiosServer.get(url) : axiosClient.get(url);
  },
  getPlayHot({server = false}: { server?: boolean }) {
    const url = "/api/v1/entertainment-spots/type-newest/choi";
    return server ? axiosServer.get(url) : axiosClient.get(url);
  },
  getAllLocationHot({server = false}: { server?: boolean }) {
    const url = "/api/v1/entertainment-spots";
    return server ? axiosServer.get(url) : axiosClient.get(url);

  },
  getAllEatHot({server = false}: { server?: boolean }) {
    const url = "/api/v1/entertainment-spots/type/an";
    return server ? axiosServer.get(url) : axiosClient.get(url);

  },
  getAllPlayHot({server = false}: { server?: boolean }) {
    const url = "/api/v1/entertainment-spots/type/choi";
    return server ? axiosServer.get(url) : axiosClient.get(url);

  },
  getLocData(loc: string) {
    const url = `/api/v1/entertainment-spots/search/dia-diem-${loc}`;
    return axiosClient.get(url);
  },
  getDetailLoc({param, slug, server = false}: { param: string, slug: string, server?: boolean }) {
    const url = `/api/v1/entertainment-spots/value-search-detail/${param}/${slug}`;
    return server ? axiosServer.get(url) : axiosClient.get(url);
  },
  getDetailBlog({slug, server}: { slug: string, server?: boolean }) {
    const url = `/api/v1/blogs/${slug}`;
    return server ? axiosServer.get(url) : axiosClient.get(url);
  },
  getBlogs({server}: { server?: boolean }) {
    const url = `/api/v1/blogs`;
    return server ? axiosServer.get(url) : axiosClient.get(url);
  },
  getRelate({id, server = false}: { id: string, server?: boolean }) {
    const url = `/api/v1/entertainment-spots/related/${id}`;
    return server ? axiosServer.get(url) : axiosClient.get(url);
  },
  createMessage(data: IComment | any) {
    const url = "api/v1/comments";
    return axiosClient.post(url, data);
  },
  getMessages(idSpot: number) {
    const url = `api/v1/comments/${idSpot}`;
    return axiosClient.get(url);
  },
};
