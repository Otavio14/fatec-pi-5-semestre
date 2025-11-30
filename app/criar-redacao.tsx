import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
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
import Swal from "sweetalert2";
import { ProvaService } from "../services/prova.service";
import { RedacaoReferenciaService } from "../services/redacao-referencia.service";
import { RedacaoService } from "../services/redacao.service";
import { ReferenciaService } from "../services/referencia.service";

const BLUE = "#4A82F8";
const ORANGE = "#FFA747";
const GREY_BG = "#dddddd";

interface IReferenciaForm {
  titulo: string;
  legenda: string;
  texto: string;
  url_imagem: string;
  informacao_acesso: string;
}

export default function CriarRedacaoScreen() {
  const [provas, setProvas] = useState<any[]>([]);
  const [idProvaSelecionada, setIdProvaSelecionada] = useState<number>(0);
  const [instrucoes, setInstrucoes] = useState<string>("");
  const [referencia1, setReferencia1] = useState<IReferenciaForm>({
    titulo: "",
    legenda: "",
    texto: "",
    url_imagem: "",
    informacao_acesso: "",
  });
  const [referencia2, setReferencia2] = useState<IReferenciaForm>({
    titulo: "",
    legenda: "",
    texto: "",
    url_imagem: "",
    informacao_acesso: "",
  });
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const router = useRouter();
  const provaService = new ProvaService();
  const redacaoService = new RedacaoService();
  const referenciaService = new ReferenciaService();
  const redacaoReferenciaService = new RedacaoReferenciaService();

  useEffect(() => {
    provaService
      .findAll()
      .then(({ data: { dados } }) => {
        setProvas(dados);
        if (dados.length > 0) {
          setIdProvaSelecionada(dados[0].id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar provas:", err);
        setLoading(false);
      });
  }, []);

  const handleSalvar = async () => {
    // Validações
    if (!idProvaSelecionada) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Selecione uma prova.",
      });
      return;
    }

    if (!instrucoes.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Preencha o tema da redação (instruções).",
      });
      return;
    }

    if (!referencia1.texto.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Preencha o texto auxiliar 1.",
      });
      return;
    }

    if (!referencia2.texto.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: "Preencha o texto auxiliar 2.",
      });
      return;
    }

    setSalvando(true);

    try {
      // 1. Criar a redação
      const redacaoResponse = await redacaoService.create({
        id_prova: idProvaSelecionada,
        instrucoes: instrucoes,
      });

      const idRedacao = redacaoResponse.data.dados;

      // 2. Criar primeira referência
      const ref1Response = await referenciaService.create({
        titulo: referencia1.titulo || "",
        legenda: referencia1.legenda || "",
        texto: referencia1.texto,
        url_imagem: referencia1.url_imagem || "",
        informacao_acesso: referencia1.informacao_acesso || "",
      });

      const idRef1 = ref1Response.data.dados;

      // 3. Criar segunda referência
      const ref2Response = await referenciaService.create({
        titulo: referencia2.titulo || "",
        legenda: referencia2.legenda || "",
        texto: referencia2.texto,
        url_imagem: referencia2.url_imagem || "",
        informacao_acesso: referencia2.informacao_acesso || "",
      });

      const idRef2 = ref2Response.data.dados;

      // 4. Associar referências à redação
      await redacaoReferenciaService.create({
        id_redacao: idRedacao,
        id_referencia: idRef1,
        ordem: 1,
      });

      await redacaoReferenciaService.create({
        id_redacao: idRedacao,
        id_referencia: idRef2,
        ordem: 2,
      });

      Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Redação criada com sucesso!",
      });

      // Limpar formulário
      setInstrucoes("");
      setReferencia1({
        titulo: "",
        legenda: "",
        texto: "",
        url_imagem: "",
        informacao_acesso: "",
      });
      setReferencia2({
        titulo: "",
        legenda: "",
        texto: "",
        url_imagem: "",
        informacao_acesso: "",
      });
    } catch (error) {
      console.error("Erro ao salvar redação:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao salvar a redação. Tente novamente.",
      });
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BLUE} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.title}>Criar Redação</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Prova</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={idProvaSelecionada}
                  onValueChange={(itemValue) =>
                    setIdProvaSelecionada(itemValue)
                  }
                  style={styles.picker}
                >
                  {provas.map((prova) => (
                    <Picker.Item
                      key={prova.id}
                      label={prova.nome}
                      value={prova.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Tema da Redação (Instruções)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite o tema da redação..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={instrucoes}
                onChangeText={setInstrucoes}
              />
            </View>

            <Text style={styles.sectionTitle}>Texto Auxiliar 1</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Título (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Título da referência 1..."
                placeholderTextColor="#999"
                value={referencia1.titulo}
                onChangeText={(text) =>
                  setReferencia1({ ...referencia1, titulo: text })
                }
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Legenda (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Legenda da referência 1..."
                placeholderTextColor="#999"
                value={referencia1.legenda}
                onChangeText={(text) =>
                  setReferencia1({ ...referencia1, legenda: text })
                }
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Texto *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite o texto auxiliar 1..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={referencia1.texto}
                onChangeText={(text) =>
                  setReferencia1({ ...referencia1, texto: text })
                }
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>URL da Imagem (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                placeholderTextColor="#999"
                value={referencia1.url_imagem}
                onChangeText={(text) =>
                  setReferencia1({ ...referencia1, url_imagem: text })
                }
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Informação de Acesso (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Fonte, data de acesso..."
                placeholderTextColor="#999"
                value={referencia1.informacao_acesso}
                onChangeText={(text) =>
                  setReferencia1({ ...referencia1, informacao_acesso: text })
                }
              />
            </View>

            <Text style={styles.sectionTitle}>Texto Auxiliar 2</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Título (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Título da referência 2..."
                placeholderTextColor="#999"
                value={referencia2.titulo}
                onChangeText={(text) =>
                  setReferencia2({ ...referencia2, titulo: text })
                }
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Legenda (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Legenda da referência 2..."
                placeholderTextColor="#999"
                value={referencia2.legenda}
                onChangeText={(text) =>
                  setReferencia2({ ...referencia2, legenda: text })
                }
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Texto *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite o texto auxiliar 2..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={referencia2.texto}
                onChangeText={(text) =>
                  setReferencia2({ ...referencia2, texto: text })
                }
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>URL da Imagem (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://..."
                placeholderTextColor="#999"
                value={referencia2.url_imagem}
                onChangeText={(text) =>
                  setReferencia2({ ...referencia2, url_imagem: text })
                }
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Informação de Acesso (Opcional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Fonte, data de acesso..."
                placeholderTextColor="#999"
                value={referencia2.informacao_acesso}
                onChangeText={(text) =>
                  setReferencia2({ ...referencia2, informacao_acesso: text })
                }
              />
            </View>

            <TouchableOpacity
              style={[styles.button, salvando && styles.buttonDisabled]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar Redação</Text>
              )}
            </TouchableOpacity>
          </View>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
    marginBottom: 24,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 8,
    backgroundColor: "#f7f7f7",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f7f7f7",
    color: "#000",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});
