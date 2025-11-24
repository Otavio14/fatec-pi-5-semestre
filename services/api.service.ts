import axios from "axios";
import Swal from "sweetalert2";
import { IApiResponse } from "../types/index.type";
import { authService } from "./auth.service";

export const apiService = axios.create({
  // baseURL: window.location.hostname.includes("localhost")
  baseURL: true
    ? "http://localhost:3000"
    : "https://fatec-pi-4-semestre-latest.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

apiService.interceptors.request.use(
  async function (config) {
    const token = await authService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const errorSwal = ({
  response: {
    data: { mensagem, icone, titulo },
  },
}: {
  response: { data: IApiResponse };
}) => {
  Swal.fire({
    icon: icone,
    title: titulo,
    text: mensagem,
  });
};
