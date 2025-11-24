import { IPerfil } from "./index.type";

export interface IUsuario {
  email: string;
  id: number;
  nome: string;
  perfil: IPerfil;
  senha: string;
}

export interface IUsuarioForm {
  email: string;
  id: number;
  nome: string;
  perfil: IPerfil | "";
  senha: string;
  senhaConfirmacao: string;
}
