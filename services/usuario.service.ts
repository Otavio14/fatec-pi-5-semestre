import { IApiResponse, ICrud } from "../types/index.type";
import { IUsuario } from "../types/usuario.type";
import { apiService } from "./api.service";

export class UsuarioService implements ICrud<IUsuario, number> {
  private readonly rootUrl = "/usuarios";

  create(data: Partial<IUsuario>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IUsuario>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IUsuario>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: Partial<IUsuario>) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }

  login(data: Partial<IUsuario>) {
    return apiService.post<IApiResponse<string>>(`${this.rootUrl}/login`, data);
  }
}
