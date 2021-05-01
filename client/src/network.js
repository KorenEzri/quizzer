import axios from "axios";
import Cookies from "js-cookie";

const network = axios.create({
  headers: {
    post: {
      "Content-Type": "application/json;charset=utf-8'",
      Authorization: `Berear ${Cookies.get("accessToken")}`,
    },
  },
});

export default network;
