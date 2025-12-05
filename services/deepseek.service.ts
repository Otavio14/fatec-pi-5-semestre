import { IApiResponse } from "../types/index.type";
import { apiService } from "./api.service";

export class DeepseekService {
  async corrigirRedacao(texto: string): Promise<string> {
    try {
      const response = await apiService.post<IApiResponse<string>>(
        "/deepseek/corrigir",
        { texto }
      );
      
      if (response.data.valido && response.data.dados) {
        return response.data.dados;
      }
      
      return "Erro ao obter feedback da IA.";
    } catch (error) {
      console.error("Erro ao chamar serviço de correção:", error);
      return "Erro ao obter feedback da IA. Tente novamente.";
    }
  }
}

export const deepseekService = new DeepseekService();

