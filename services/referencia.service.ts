import { IApiResponse, ICrud } from "../types/index.type";
import { IReferencia } from "../types/referencia.type";
import { apiService } from "./api.service";

export class ReferenciaService implements ICrud<IReferencia, number> {
  private readonly rootUrl = "/referencias";

  create(data: Partial<IReferencia>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IReferencia>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IReferencia>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: IReferencia) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
