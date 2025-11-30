import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiService } from "../services/api.service";

const BLUE = "#4A82F8";
const ORANGE = "#FFA747";
const GREY_BG = "#dddddd";

interface IQuestaoComReferencia {
  id: number;
  id_questao: number;
  id_referencia: number;
  prova: string;
  questao: any;
  referencia: any;
  alternativas: any[];
}

interface IRedacaoCompleta {
  id_redacao: number;
  redacaoInfo: any;
  provaInfo: any;
  referencias: any[];
}

export default function SimuladoScreen() {
  const [questoesComReferencias, setQuestoesComReferencias] = useState<
    IQuestaoComReferencia[]
  >([]);
  const [respostasSelecionadas, setRespostasSelecionadas] = useState<{
    [questaoId: number]: number;
  }>({});
  const [resultado, setResultado] = useState<{
    [questaoId: number]: boolean | null;
  }>({});
  const [essayText, setEssayText] = useState("");
  const [redacaoSorteada, setRedacaoSorteada] =
    useState<IRedacaoCompleta | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  function embaralhar<T>(array: T[]): T[] {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  }

  useEffect(() => {
    apiService.get("questoes-referencias").then(async (res) => {
      const questoesReferencias = res.data.dados;
      const questoesComReferencias = await Promise.all(
        questoesReferencias.map(async (questoesReferencias: any) => {
          const questoesInfo = await apiService.get(
            `/questoes/${questoesReferencias.id_questao}`,
          );
          const referenciasInfo = await apiService.get(
            `/referencias/${questoesReferencias.id_referencia}`,
          );
          const provaInfo = await apiService.get(
            `/provas/${questoesInfo.data.dados.id_prova}`,
          );
          const altRes = await apiService.get(
            `/alternativas?questaoId=${questoesInfo.data.dados.id}`,
          );

          return {
            ...questoesReferencias,
            prova: provaInfo.data.dados.nome,
            alternativas: altRes.data.dados || [],
            questao: questoesInfo.data.dados,
            referencia: referenciasInfo.data.dados,
          };
        }),
      );

      const questoesEmbaralhadas = embaralhar(questoesComReferencias).slice(
        0,
        10,
      );
      setQuestoesComReferencias(questoesEmbaralhadas);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    apiService
      .get("/redacoes-referencias")
      .then(async (res) => {
        const redacoes_referencias = res.data.dados;

        const idsRedacoes = [
          ...new Set(redacoes_referencias.map((r: any) => r.id_redacao)),
        ];

        const redacoesAgrupadas = await Promise.all(
          idsRedacoes.map(async (id_redacao: any) => {
            const referenciasDaRedacao = redacoes_referencias.filter(
              (r: any) => r.id_redacao === id_redacao,
            );

            const redacoesInfo = await apiService.get(
              `/redacoes/${id_redacao}`,
            );
            const provaInfo = await apiService.get(
              `/provas/${redacoesInfo.data.dados.id_prova}`,
            );

            const referencias = await Promise.all(
              referenciasDaRedacao.map(async (item: any) => {
                const referenciaInfo = await apiService.get(
                  `/referencias/${item.id_referencia}`,
                );
                return referenciaInfo.data.dados;
              }),
            );

            return {
              id_redacao: Number(id_redacao),
              redacaoInfo: redacoesInfo,
              provaInfo,
              referencias,
            };
          }),
        );

        const redacaoInicial =
          redacoesAgrupadas[
            Math.floor(Math.random() * redacoesAgrupadas.length)
          ];
        setRedacaoSorteada(redacaoInicial);
      })
      .catch((err) => {
        console.log("Erro ao buscar redações ou referências:", err);
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

  const handleResponderTodas = () => {
    const novoResultado: { [questaoId: number]: boolean } = {};

    questoesComReferencias.forEach((questao) => {
      const alternativaSelecionadaId = respostasSelecionadas[questao.id];
      const alternativa = questao.alternativas.find(
        (alt: any) => alt.id === alternativaSelecionadaId,
      );
      const correta = alternativa?.correta || false;
      novoResultado[questao.id] = correta;
    });

    setResultado(novoResultado);
  };

  if (loading || questoesComReferencias.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BLUE} />
          <Text style={styles.loadingText}>Gerando Simulado...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const redacao = redacaoSorteada;
  const todasRespondidas =
    Object.keys(respostasSelecionadas).length ===
    questoesComReferencias.length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={GREY_BG} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          {questoesComReferencias.map((questao) => {
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
                  <Text style={styles.provaBadgeText}>{questao.prova}</Text>
                </View>

                <View style={styles.referenciaBox}>
                  <Text style={styles.referenciaTitle}>
                    {questao.referencia.titulo}
                  </Text>
                  <Text style={styles.referenciaLegend}>
                    {questao.referencia.legenda}
                  </Text>
                  <Text style={styles.referenciaText}>
                    {questao.referencia.texto}
                  </Text>
                  {questao.referencia.url_imagem ? (
                    <Image
                      style={styles.referenciaImage}
                      source={{ uri: questao.referencia.url_imagem }}
                      resizeMode="contain"
                    />
                  ) : null}
                </View>

                <Text
                  style={[
                    styles.questaoText,
                    respondida && styles.questaoTextRespondida,
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
                          styles.alternativaRow,
                          respostasSelecionadas[questao.id] ===
                            alternativa.id && styles.alternativaRowSelected,
                          respondida && styles.alternativaRowDisabled,
                        ]}
                        onPress={() =>
                          !respondida &&
                          handleSelecionar(questao.id, alternativa.id)
                        }
                        disabled={respondida}
                      >
                        <View
                          style={[
                            styles.radioButton,
                            respostasSelecionadas[questao.id] ===
                              alternativa.id && styles.radioButtonSelected,
                          ]}
                        />
                        <Text style={styles.alternativaText}>
                          <Text style={styles.alternativaNome}>
                            ({alternativa.nome})
                          </Text>{" "}
                          {alternativa.texto}
                        </Text>
                      </TouchableOpacity>
                    ) : null,
                  )}
                </View>

                {resultado[questao.id] !== undefined &&
                  resultado[questao.id] !== null && (
                    <Text
                      style={[
                        styles.resultadoText,
                        resultado[questao.id]
                          ? styles.resultadoCorreto
                          : styles.resultadoIncorreto,
                      ]}
                    >
                      {resultado[questao.id]
                        ? "Resposta correta!"
                        : "Resposta incorreta."}
                    </Text>
                  )}
              </View>
            );
          })}

          {/* REDAÇÃO */}
          {redacao && (
            <View style={styles.redacaoCard}>
              <Text style={styles.provaInfoText}>
                {redacao?.provaInfo?.data?.dados?.nome}
              </Text>

              <View style={styles.badgeReferencias}>
                <Text style={styles.badgeReferenciasText}>
                  Textos de Referência
                </Text>
              </View>

              {redacao?.referencias?.map((referencia: any, index: number) => (
                <View key={index} style={styles.redacaoReferenciaBox}>
                  <Text style={styles.redacaoReferenciaTitle}>
                    {referencia.titulo}
                  </Text>
                  <Text style={styles.redacaoReferenciaLegend}>
                    {referencia.legenda}
                  </Text>
                  {referencia.url_imagem ? (
                    <Image
                      style={styles.redacaoReferenciaImage}
                      source={{ uri: referencia.url_imagem }}
                      resizeMode="contain"
                    />
                  ) : null}
                  <Text style={styles.redacaoReferenciaText}>
                    {referencia.texto}
                  </Text>
                </View>
              ))}

              <View style={styles.badgeTema}>
                <Text style={styles.badgeTemaText}>Tema da Redação</Text>
              </View>

              <View style={styles.temaBox}>
                <Text style={styles.temaIntro}>
                  A partir da coletânea apresentada, elabore um texto narrativo
                  ou um texto dissertativo-argumentativo explorando o seguinte
                  tema:
                </Text>
                <Text style={styles.temaTitle}>
                  {redacao?.redacaoInfo?.data?.dados?.instrucoes}
                </Text>
              </View>

              <View style={styles.orientacoesBox}>
                <Text style={styles.orientacoesTitle}>Orientações</Text>
                <Text style={styles.orientacoesText}>
                  • Narração – explore adequadamente os elementos desse gênero:
                  fato(s), personagem(ns), tempo e lugar.
                </Text>
                <Text style={styles.orientacoesText}>
                  • Dissertação – selecione, organize e relacione os
                  argumentos, fatos e opiniões para sustentar suas ideias e
                  pontos de vista.
                </Text>
                <Text style={styles.orientacoesSubtitle}>
                  Ao elaborar seu texto:
                </Text>
                <Text style={styles.orientacoesText}>
                  • Atribua um título para sua redação;
                </Text>
                <Text style={styles.orientacoesText}>
                  • Não o redija em versos;
                </Text>
                <Text style={styles.orientacoesText}>
                  • Organize-o em parágrafos;
                </Text>
                <Text style={styles.orientacoesText}>
                  • Empregue apenas a norma culta da língua portuguesa;
                </Text>
                <Text style={styles.orientacoesText}>
                  • Não copie os textos apresentados na coletânea e na prova;
                </Text>
              </View>

              <TextInput
                style={styles.redacaoInput}
                placeholder="Escreva sua redação aqui..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={15}
                textAlignVertical="top"
                value={essayText}
                onChangeText={setEssayText}
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !todasRespondidas && styles.submitButtonDisabled,
                ]}
                onPress={handleResponderTodas}
                disabled={!todasRespondidas}
              >
                <Text style={styles.submitButtonText}>Encerrar Simulado</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREY_BG,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  backButton: {
    backgroundColor: "#90EE90",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  questaoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 6,
  },
  questaoCardRespondida: {
    backgroundColor: "#d3d3d3",
  },
  provaBadge: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  provaBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  referenciaBox: {
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  referenciaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  referenciaLegend: {
    fontSize: 12,
    fontWeight: "700",
    color: BLUE,
    marginBottom: 8,
  },
  referenciaText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  referenciaImage: {
    width: "100%",
    height: 200,
    marginVertical: 8,
  },
  questaoText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  questaoTextRespondida: {
    color: "#666",
  },
  alternativasContainer: {
    gap: 8,
  },
  alternativaRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
  },
  alternativaRowSelected: {
    borderColor: BLUE,
    backgroundColor: "#e3f2fd",
  },
  alternativaRowDisabled: {
    opacity: 0.6,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: BLUE,
    backgroundColor: BLUE,
  },
  alternativaText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  alternativaNome: {
    fontWeight: "700",
  },
  resultadoText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  resultadoCorreto: {
    color: "#4caf50",
  },
  resultadoIncorreto: {
    color: "#f44336",
  },
  redacaoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 6,
  },
  provaInfoText: {
    fontSize: 12,
    color: "#777",
    marginBottom: 12,
  },
  badgeReferencias: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  badgeReferenciasText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  redacaoReferenciaBox: {
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  redacaoReferenciaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  redacaoReferenciaLegend: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  redacaoReferenciaImage: {
    width: "100%",
    height: 200,
    marginVertical: 8,
  },
  redacaoReferenciaText: {
    fontSize: 14,
    color: "#333",
  },
  badgeTema: {
    backgroundColor: "#e5e5e5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  badgeTemaText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  temaBox: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  temaIntro: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  temaTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  orientacoesBox: {
    marginBottom: 16,
  },
  orientacoesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  orientacoesText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  orientacoesSubtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
    marginBottom: 8,
  },
  redacaoInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: BLUE,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#999",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
