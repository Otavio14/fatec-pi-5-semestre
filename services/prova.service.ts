import { IApiResponse, ICrud } from "../types/index.type";
import { IProva } from "../types/prova.type";
import { apiService } from "./api.service";

export class ProvaService implements ICrud<IProva, number> {
  private readonly rootUrl = "/provas";

  create(data: Partial<IProva>) {
    return apiService.post<IApiResponse<number>>(`${this.rootUrl}`, data);
  }

  delete(id: number) {
    return apiService.delete<IApiResponse<number>>(`${this.rootUrl}/${id}`);
  }

  findAll() {
    return apiService.get<IApiResponse<Array<IProva>>>(`${this.rootUrl}`);
  }

  findOne(id: number) {
    return apiService.post<IApiResponse<IProva>>(`${this.rootUrl}/${id}`);
  }

  update(id: number, data: IProva) {
    return apiService.put<IApiResponse<number>>(`${this.rootUrl}/${id}`, data);
  }

  extractPdf(pdf: File) {
    const formData = new FormData();
    formData.append("file", pdf);

    return apiService.post<IApiResponse<number>>(
      `${this.rootUrl}/extract-pdf`,
      formData,
    );
  }

  findAllByVestibularId(id: number) {
    return apiService.get<IApiResponse<Array<IProva>>>(
      `${this.rootUrl}/vestibulares/${id}`,
    );
  }
}
