import { axiosInstance } from "@/network/axiosInstance";

export const fetcher = async (url: string) =>
  axiosInstance.get(url).then((res) => res.data);
