import { IApiResponse, ICrud } from "../types/index.type";
import { IRedacao } from "../types/redacao.type";
import { apiService } from "./api.service";

export class RedacaoService implements ICrud<IRedacao, number> {
  private readonly rootUrl = "/redacoes";

  create(data: Partial<IRedacao>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IRedacao>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IRedacao>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: IRedacao) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }

  findOneByProvaId(id: number) {
    return apiService.get<IApiResponse<IRedacao>>(
      `${this.rootUrl}/provas/${id}`,
    );
  }
}
