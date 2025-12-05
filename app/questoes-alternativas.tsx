import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiService } from "../services/api.service";

interface Alternativa {
  correta: boolean;
  id: number;
  id_questao: number;
  nome: string;
  texto: string;
}

interface Questao {
  id: number;
  id_prova: number;
  prova: string;
  texto: string;
  alternativas: Alternativa[];
}

const BLUE = "#4A82F8";
const ORANGE = "#FFA747";
const GREY_BG = "#f5f7fa";
const GREEN = "#10b981";
const RED = "#ef4444";

export default function QuestoesAlternativasScreen() {
  const [questoesComReferencias, setQuestoesComReferencias] = useState<any[]>(
    []
  );
  const [respostasSelecionadas, setRespostasSelecionadas] = useState<{
    [questaoId: number]: number;
  }>({});
  const [resultado, setResultado] = useState<{
    [questaoId: number]: boolean | null;
  }>({});
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  function embaralhar<T>(array: T[]): T[] {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  useEffect(() => {
    apiService
      .get("questoes-referencias")
      .then(async (res) => {
        const questoesReferencias = res.data.dados;
        const questoesComReferencias = await Promise.all(
          questoesReferencias.map(async (questoesReferencias: any) => {
            const questoesInfo = await apiService.get(
              `/questoes/${questoesReferencias.id_questao}`
            );
            const referenciasInfo = await apiService.get(
              `/referencias/${questoesReferencias.id_referencia}`
            );
            const provaInfo = await apiService.get(
              `/provas/${questoesInfo.data.dados.id_prova}`
            );
            const altRes = await apiService.get(
              `/alternativas?questaoId=${questoesInfo.data.dados.id}`
            );

            return {
              ...questoesReferencias,
              prova: provaInfo.data.dados.nome,
              alternativas: altRes.data.dados || [],
              questao: questoesInfo.data.dados,
              referencia: referenciasInfo.data.dados,
            };
          })
        );

        const questoesEmbaralhadas = embaralhar(questoesComReferencias).slice(
          0,
          10
        );
        setQuestoesComReferencias(questoesEmbaralhadas);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar questões:", err);
        setLoading(false);
      });
  }, []);

  const handleSelecionar = (questaoId: number, alternativaId: number) => {
    setRespostasSelecionadas((prev) => ({
      ...prev,
      [questaoId]: alternativaId,
    }));
    setResultado((prev) => ({
      ...prev,
      [questaoId]: null,
    }));
  };

  const handleResponder = (questao: Questao) => {
    const alternativaSelecionada = questao.alternativas.find(
      (alt) => alt.id === respostasSelecionadas[questao.id]
    );
    const correta = alternativaSelecionada?.correta || false;
    setResultado((prev) => ({
      ...prev,
      [questao.id]: correta,
    }));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={GREY_BG} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BLUE} />
          <Text style={styles.loadingText}>Carregando questões...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={GREY_BG} />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {questoesComReferencias?.map((questao) => {
          const respondida =
            resultado.hasOwnProperty(questao.id) &&
            resultado[questao.id] !== null;

          return (
            <View
              key={questao.id}
              style={[
                styles.questaoCard,
                respondida && styles.questaoCardRespondida,
              ]}
            >
              <View style={styles.provaBadge}>
                <Text style={styles.provaText}>{questao.prova}</Text>
              </View>

              {questao.referencia && (
                <View style={styles.referenciaCard}>
                  {questao.referencia.titulo && (
                    <Text style={styles.referenciaTitle}>
                      {questao.referencia.titulo}
                    </Text>
                  )}
                  {questao.referencia.legenda && (
                    <Text style={styles.referenciaLegenda}>
                      {questao.referencia.legenda}
                    </Text>
                  )}
                  {questao.referencia.texto && (
                    <Text style={styles.referenciaTexto}>
                      {questao.referencia.texto}
                    </Text>
                  )}
                  {questao.referencia.url_imagem && (
                    <Image
                      source={{ uri: questao.referencia.url_imagem }}
                      style={styles.referenciaImagem}
                      resizeMode="contain"
                    />
                  )}
                </View>
              )}

              <Text
                style={[
                  styles.questaoTexto,
                  respondida && styles.questaoTextoRespondida,
                ]}
              >
                {questao.questao.texto}
              </Text>

              <View style={styles.alternativasContainer}>
                {questao.alternativas.map((alternativa: any) =>
                  alternativa.id_questao === questao.id ? (
                    <TouchableOpacity
                      key={alternativa.id}
                      style={[
                        styles.alternativaButton,
                        respostasSelecionadas[questao.id] === alternativa.id &&
                          styles.alternativaSelecionada,
                        respondida && styles.alternativaDesabilitada,
                      ]}
                      onPress={() =>
                        !respondida &&
                        handleSelecionar(questao.id, alternativa.id)
                      }
                      disabled={respondida}
                      accessibilityRole="radio"
                      accessibilityState={{
                        checked:
                          respostasSelecionadas[questao.id] === alternativa.id,
                        disabled: respondida,
                      }}
                    >
                      <View
                        style={[
                          styles.radioButton,
                          respostasSelecionadas[questao.id] ===
                            alternativa.id && styles.radioButtonSelected,
                        ]}
                      >
                        {respostasSelecionadas[questao.id] ===
                          alternativa.id && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                      <Text style={styles.alternativaTexto}>
                        <Text style={styles.alternativaNome}>
                          ({alternativa.nome})
                        </Text>{" "}
                        {alternativa.texto}
                      </Text>
                    </TouchableOpacity>
                  ) : null
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.responderButton,
                  (respondida ||
                    respostasSelecionadas[questao.id] === undefined) &&
                    styles.responderButtonDisabled,
                ]}
                onPress={() => handleResponder(questao)}
                disabled={
                  respondida || respostasSelecionadas[questao.id] === undefined
                }
                accessibilityRole="button"
                accessibilityLabel="Responder"
              >
                <Text style={styles.responderButtonText}>Responder</Text>
              </TouchableOpacity>

              {resultado[questao.id] !== undefined &&
                resultado[questao.id] !== null && (
                  <View style={styles.resultadoContainer}>
                    <Text
                      style={[
                        styles.resultadoText,
                        resultado[questao.id]
                          ? styles.resultadoCorreto
                          : styles.resultadoIncorreto,
                      ]}
                    >
                      {resultado[questao.id]
                        ? "✓ Resposta correta!"
                        : "✗ Resposta incorreta."}
                    </Text>
                  </View>
                )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREY_BG,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    backgroundColor: "#d1fae5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#065f46",
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  questaoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questaoCardRespondida: {
    backgroundColor: "#d1d5db",
  },
  provaBadge: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  provaText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  referenciaCard: {
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  referenciaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  referenciaLegenda: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e3a8a",
    marginBottom: 8,
  },
  referenciaTexto: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 8,
  },
  referenciaImagem: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  questaoTexto: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 16,
    lineHeight: 26,
  },
  questaoTextoRespondida: {
    color: "#4b5563",
  },
  alternativasContainer: {
    gap: 12,
  },
  alternativaButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  alternativaSelecionada: {
    borderColor: BLUE,
    backgroundColor: "#dbeafe",
  },
  alternativaDesabilitada: {
    opacity: 0.7,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: BLUE,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BLUE,
  },
  alternativaTexto: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
    lineHeight: 22,
  },
  alternativaNome: {
    fontWeight: "700",
  },
  responderButton: {
    backgroundColor: BLUE,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  responderButtonDisabled: {
    opacity: 0.5,
  },
  responderButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultadoContainer: {
    marginTop: 12,
  },
  resultadoText: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultadoCorreto: {
    color: GREEN,
  },
  resultadoIncorreto: {
    color: RED,
  },
});
