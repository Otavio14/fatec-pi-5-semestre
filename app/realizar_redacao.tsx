import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { apiService } from "../services/api.service";

const GREY_BG = "#f5f7fa";
const BLUE = "#4A82F8";
const GREEN = "#10b981";
const ORANGE = "#FFA747";

export default function RealizarRedacaoScreen() {
  const params = useLocalSearchParams();
  const [essayText, setEssayText] = useState("");
  const [redacoesComReferencias, setRedacoesComReferencias] = useState<any[]>(
    []
  );
  const [redacaoSorteada, setRedacaoSorteada] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redacaoEnviada, setRedacaoEnviada] = useState(false);

  const router = useRouter();

  // Recuperar estado quando voltar de redacao-recebida
  useEffect(() => {
    if (params.redacaoEnviada === 'true') {
      setRedacaoEnviada(true);
    }
  }, [params]);

  const sortearNovaRedacao = () => {
    if (
      !Array.isArray(redacoesComReferencias) ||
      redacoesComReferencias.length <= 1
    )
      return;

    let nova;
    do {
      nova =
        redacoesComReferencias[
          Math.floor(Math.random() * redacoesComReferencias.length)
        ];
    } while (nova.id_redacao === redacaoSorteada.id_redacao);

    setRedacaoSorteada(nova);
    setEssayText("");
    setRedacaoEnviada(false);
  };

  useEffect(() => {
    apiService
      .get("/redacoes-referencias")
      .then(async (res) => {
        const redacoes_referencias = res.data.dados;

        const idsRedacoes = [
          ...new Set(redacoes_referencias.map((r: any) => r.id_redacao)),
        ];

        const redacoesAgrupadas = await Promise.all(
          idsRedacoes.map(async (id_redacao) => {
            const referenciasDaRedacao = redacoes_referencias.filter(
              (r: any) => r.id_redacao === id_redacao
            );

            const redacoesInfo = await apiService.get(
              `/redacoes/${id_redacao}`
            );
            const provaInfo = await apiService.get(
              `/provas/${redacoesInfo.data.dados.id_prova}`
            );

            const referencias = await Promise.all(
              referenciasDaRedacao.map(async (item: any) => {
                const referenciaInfo = await apiService.get(
                  `/referencias/${item.id_referencia}`
                );
                return referenciaInfo.data.dados;
              })
            );

            return {
              id_redacao,
              redacaoInfo: redacoesInfo,
              provaInfo,
              referencias,
            };
          })
        );

        setRedacoesComReferencias(redacoesAgrupadas);

        const redacaoInicial =
          redacoesAgrupadas[
            Math.floor(Math.random() * redacoesAgrupadas.length)
          ];
        setRedacaoSorteada(redacaoInicial);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Erro ao buscar redações ou referências:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !redacaoSorteada) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={GREY_BG} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BLUE} />
          <Text style={styles.loadingText}>Carregando tema de redação...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const redacao = redacaoSorteada;

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
        <View style={styles.card}>
          <Text style={styles.provaInfo}>
            {redacao.provaInfo.data.dados.nome}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Textos de Referência</Text>
          </View>

          {redacao?.referencias?.map((referencia: any, index: number) => (
            <View key={index} style={styles.referenciaCard}>
              <Text style={styles.referenciaTitle}>{referencia.titulo}</Text>
              <Text style={styles.referenciaLegenda}>{referencia.legenda}</Text>
              {referencia.url_imagem ? (
                <Image
                  source={{ uri: referencia.url_imagem }}
                  style={styles.referenciaImagem}
                  resizeMode="contain"
                />
              ) : null}
              <Text style={styles.referenciaTexto}>{referencia.texto}</Text>
            </View>
          ))}

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Tema da Redação</Text>
          </View>

          <View style={styles.temaCard}>
            <Text style={styles.temaIntro}>
              A partir da coletânea apresentada, elabore um texto narrativo ou
              um texto dissertativo-argumentativo explorando o seguinte tema:
            </Text>
            <Text style={styles.temaTitle}>
              {redacao.redacaoInfo.data.dados.instrucoes}
            </Text>
          </View>

          <View style={styles.orientacoesContainer}>
            <Text style={styles.orientacoesTitle}>Orientações</Text>
            <Text style={styles.orientacoesText}>
              • Narração – explore adequadamente os elementos desse gênero:
              fato(s), personagem(ns), tempo e lugar.
            </Text>
            <Text style={styles.orientacoesText}>
              • Dissertação – selecione, organize e relacione os argumentos, fatos
              e opiniões para sustentar suas ideias e pontos de vista.
            </Text>
            <Text style={styles.orientacoesSubtitle}>
              Ao elaborar seu texto:
            </Text>
            <Text style={styles.orientacoesText}>
              • Atribua um título para sua redação;
            </Text>
            <Text style={styles.orientacoesText}>• Não o redija em versos;</Text>
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

          <TouchableOpacity
            style={[
              styles.enviarRedacaoButton,
              redacaoEnviada && styles.enviarRedacaoButtonEnviado,
            ]}
            onPress={() => {
              router.push({
                pathname: "/redacao",
                params: {
                  fromRealizarRedacao: 'true'
                }
              });
            }}
            accessibilityRole="button"
          >
            <Text style={styles.enviarRedacaoButtonText}>
              {redacaoEnviada ? "✓ Redação Enviada" : "📝 Enviar Redação"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortearButton,
              redacaoEnviada && styles.sortearButtonDisabled,
            ]}
            onPress={sortearNovaRedacao}
            disabled={redacaoEnviada}
            accessibilityRole="button"
          >
            <Text style={styles.sortearButtonText}>Sortear outro tema</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  provaInfo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  badgeText: {
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
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  referenciaLegenda: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  referenciaImagem: {
    width: "100%",
    height: 200,
    marginVertical: 12,
    borderRadius: 8,
  },
  referenciaTexto: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  temaCard: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  temaIntro: {
    fontSize: 16,
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 22,
  },
  temaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    lineHeight: 24,
  },
  orientacoesContainer: {
    marginBottom: 16,
  },
  orientacoesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 12,
  },
  orientacoesSubtitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 8,
    marginBottom: 8,
  },
  orientacoesText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
    lineHeight: 20,
  },
  enviarRedacaoButton: {
    backgroundColor: ORANGE,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
    marginBottom: 16,
  },
  enviarRedacaoButtonEnviado: {
    backgroundColor: "#4caf50",
  },
  enviarRedacaoButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  sortearButton: {
    backgroundColor: BLUE,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
  },
  sortearButtonDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.6,
  },
  sortearButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
