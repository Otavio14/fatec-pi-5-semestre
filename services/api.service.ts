import axios from "axios";
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

export const errorSwal = (value: any) => {
  console.log(value?.message);

  // const { mensagem, icone, titulo } = response?.data || {
  //   mensagem: "Erro desconhecido",
  //   icone: "error",
  //   titulo: "Erro",
  // };

  // Swal.fire({
  //   icon: icone,
  //   title: titulo,
  //   text: mensagem,
  // });
};
