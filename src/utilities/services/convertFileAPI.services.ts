import axios from "axios";

export const ApiServices = {
  async getData(url: string) {
    return await axios.get(`http://convert-io.com/${url}`);
  },

  async postData(url: string, data?: any) {
    return await axios.post(`http://convert-io.com/${url}`, data ? data : null);
  },
};
