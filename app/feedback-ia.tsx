import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { apiService } from "../services/api.service";

const ORANGE = "#FFA747";
const GREY_BG = "#dedede";

export default function FeedbackIAScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  
  const textoRedacao = params.textoRedacao as string;
  const fromSimulado = params.fromSimulado === 'true';
  const respostas = params.respostas as string | undefined;
  const fromRealizarRedacao = params.fromRealizarRedacao === 'true';

  useEffect(() => {
    const obterFeedback = async () => {
      if (!textoRedacao) {
        setFeedback("Nenhum texto de redação disponível.");
        setLoading(false);
        return;
      }

      try {
        console.log("Enviando requisição para /deepseek/corrigir com texto:", textoRedacao.substring(0, 50) + "...");
        
        const response = await apiService.post<{
          valido: boolean;
          dados: string;
          mensagem: string;
          codigo: number;
          icone: string;
          titulo: string;
        }>("/deepseek/corrigir", { texto: textoRedacao });

        console.log("Resposta recebida:", {
          valido: response.data.valido,
          codigo: response.data.codigo,
          mensagem: response.data.mensagem,
          dadosLength: response.data.dados?.length || 0,
        });

        if (response.data.valido && response.data.dados) {
          setFeedback(response.data.dados);
        } else {
          const errorMsg = response.data.mensagem || "Erro desconhecido ao obter feedback.";
          console.error("Resposta inválida:", response.data);
          setFeedback(`Erro ao obter feedback da IA: ${errorMsg}`);
        }
      } catch (error: any) {
        console.error("Erro completo ao obter feedback:", error);
        console.error("Erro response:", error.response?.data);
        console.error("Erro status:", error.response?.status);
        console.error("Erro message:", error.message);
        
        const errorMessage = error.response?.data?.mensagem 
          || error.message 
          || "Erro ao obter feedback da IA. Tente novamente mais tarde.";
        
        setFeedback(`Erro: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    obterFeedback();
  }, [textoRedacao]);

  const handleVoltarHome = () => {
    if (fromSimulado && respostas) {
      router.push({
        pathname: "/simulado",
        params: {
          respostas: respostas,
          redacaoEnviada: 'true'
        }
      });
    } else if (fromRealizarRedacao) {
      router.push({
        pathname: "/realizar_redacao",
        params: {
          redacaoEnviada: 'true'
        }
      });
    } else {
      router.push("/");
    }
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={GREY_BG} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>FEEDBACK DA IA</Text>

        <View style={styles.feedbackBox}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={ORANGE} />
              <Text style={styles.loadingText}>Gerando feedback da IA...</Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.feedbackScroll}
              contentContainerStyle={styles.feedbackContent}
            >
              <Text style={styles.feedbackText}>{feedback}</Text>
            </ScrollView>
          )}
        </View>

        <TouchableOpacity
          style={styles.cta}
          onPress={handleVoltarHome}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Voltar para Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREY_BG,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    alignSelf: "flex-start",
    marginTop: 24,
    fontSize: 36,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 0.5,
    lineHeight: 44,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
    marginBottom: 24,
  },
  feedbackBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    minHeight: 400,
    maxHeight: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  feedbackScroll: {
    flex: 1,
  },
  feedbackContent: {
    paddingBottom: 10,
  },
  feedbackText: {
    fontSize: 16,
    color: "#000",
    lineHeight: 24,
    textAlign: "left",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  cta: {
    width: "92%",
    height: 84,
    backgroundColor: ORANGE,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.18)",
    elevation: 6,
  },
  ctaText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});

