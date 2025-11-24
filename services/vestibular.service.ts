import { IApiResponse, ICrud } from "../types/index.type";
import { IVestibular } from "../types/vestibular.type";
import { apiService } from "./api.service";

export class VestibularService implements ICrud<IVestibular, number> {
  private readonly rootUrl = "/vestibulares";

  create(data: Partial<IVestibular>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IVestibular>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.get<IApiResponse<IVestibular>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: IVestibular) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }
}
