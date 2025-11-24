import { AxiosResponse } from "axios";
import { SweetAlertIcon } from "sweetalert2";

export interface IApiResponse<T = ""> {
  codigo: number; // Código HTTP
  dados: T; // Array com os dados de resposta, objeto com um registro ou true/false para rotas que necessitam de apenas confirmação
  icone: SweetAlertIcon; // Ícone que vai ser usado no Swal
  mensagem: string; // Mensagem resposta à requisição
  titulo: string; // Título que vai ser usado no Swal
  valido: boolean; // true quando a requisição tiver sucesso e false quando der erro
}

export interface ICrud<T, ID> {
  create: (data: Partial<T>) => Promise<AxiosResponse<IApiResponse<number>>>;
  delete: (id: ID) => Promise<AxiosResponse<IApiResponse<number>>>;
  findAll: () => Promise<AxiosResponse<IApiResponse<Array<Partial<T>>>>>;
  findOne: (
    id: ID,
  ) => Promise<AxiosResponse<IApiResponse<Partial<T> | object>>>;
  update: (id: ID, data: T) => Promise<AxiosResponse<IApiResponse<number>>>;
}

export type IPerfil = "Público" | "Aluno" | "Administrador";
