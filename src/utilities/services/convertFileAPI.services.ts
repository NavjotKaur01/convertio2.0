import axios from "axios";
export const rootUrl = import.meta.env.VITE_APP_BASE_API_URL;
export const ApiServices = {
  async getData(url: string) {
    return await axios.get(`${rootUrl}/${url}`);
  },

  async postData(url: string, data?: any) {
    return await axios.post(`${rootUrl}/${url}`, data ? data : null);
  },
};
