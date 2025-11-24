import { ICurso } from "../types/curso.type";
import { IApiResponse, ICrud } from "../types/index.type";
import { apiService } from "./api.service";

export class CursoService implements ICrud<ICurso, number> {
  private readonly rootUrl = "/cursos";

  create(data: Partial<ICurso>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<ICurso>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<ICurso>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: ICurso) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
