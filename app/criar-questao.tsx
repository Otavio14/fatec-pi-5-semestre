import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { AlternativaService } from "../services/alternativa.service";
import { ProvaService } from "../services/prova.service";
import { QuestaoService } from "../services/questao.service";

const BLUE = "#4A82F8";
const ORANGE = "#FFA747";
const GREY_BG = "#dddddd";

interface IAlternativaForm {
  nome: string;
  texto: string;
  correta: boolean;
}

export default function CriarQuestaoScreen() {
  const [provas, setProvas] = useState<any[]>([]);
  const [idProvaSelecionada, setIdProvaSelecionada] = useState<number>(0);
  const [numeroQuestao, setNumeroQuestao] = useState<string>("");
  const [textoQuestao, setTextoQuestao] = useState<string>("");
  const [alternativas, setAlternativas] = useState<IAlternativaForm[]>([
    { nome: "A", texto: "", correta: false },
    { nome: "B", texto: "", correta: false },
    { nome: "C", texto: "", correta: false },
    { nome: "D", texto: "", correta: false },
    { nome: "E", texto: "", correta: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const router = useRouter();
  const provaService = new ProvaService();
  const questaoService = new QuestaoService();
  const alternativaService = new AlternativaService();

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

  const handleAlternativaChange = (index: number, texto: string) => {
    const novasAlternativas = [...alternativas];
    novasAlternativas[index].texto = texto;
    setAlternativas(novasAlternativas);
  };

  const handleAlternativaCorretaChange = (index: number) => {
    const novasAlternativas = alternativas.map((alt, i) => ({
      ...alt,
      correta: i === index,
    }));
    setAlternativas(novasAlternativas);
  };

  const handleSalvar = async () => {
    // Validações
    if (!idProvaSelecionada) {
      Alert.alert("Atenção", "Selecione uma prova.");
      return;
    }

    if (!numeroQuestao || !textoQuestao) {
      Alert.alert("Atenção", "Preencha o número e o texto da questão.");
      return;
    }

    const alternativasPreenchidas = alternativas.filter(
      (alt) => alt.texto.trim() !== ""
    );

    if (alternativasPreenchidas.length < 2) {
      Alert.alert("Atenção", "Preencha pelo menos 2 alternativas.");
      return;
    }

    const temCorreta = alternativas.some((alt) => alt.correta);
    if (!temCorreta) {
      Alert.alert("Atenção", "Selecione qual alternativa é a correta.");
      return;
    }

    setSalvando(true);

    try {
      // Criar a questão
      const questaoResponse = await questaoService.create({
        id_prova: idProvaSelecionada,
        numero: parseInt(numeroQuestao),
        texto: textoQuestao,
      });

      const idQuestao = questaoResponse.data.dados;

      // Criar as alternativas
      const alternativasPromises = alternativasPreenchidas.map((alt) =>
        alternativaService.create({
          id_questao: idQuestao,
          nome: alt.nome,
          texto: alt.texto,
          correta: alt.correta,
        })
      );

      await Promise.all(alternativasPromises);

      Alert.alert("Sucesso", "Questão criada com sucesso!");

      // Limpar formulário
      setNumeroQuestao("");
      setTextoQuestao("");
      setAlternativas([
        { nome: "A", texto: "", correta: false },
        { nome: "B", texto: "", correta: false },
        { nome: "C", texto: "", correta: false },
        { nome: "D", texto: "", correta: false },
        { nome: "E", texto: "", correta: false },
      ]);
    } catch (error) {
      console.error("Erro ao salvar questão:", error);
      Alert.alert("Erro", "Erro ao salvar a questão. Tente novamente.");
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
            <Text style={styles.title}>Criar Questão</Text>

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
              <Text style={styles.label}>Número da Questão</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 1"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={numeroQuestao}
                onChangeText={setNumeroQuestao}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Texto da Questão</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite o enunciado da questão..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={textoQuestao}
                onChangeText={setTextoQuestao}
              />
            </View>

            <Text style={styles.sectionTitle}>Alternativas</Text>

            {alternativas.map((alternativa, index) => (
              <View key={index} style={styles.alternativaBlock}>
                <View style={styles.alternativaHeader}>
                  <Text style={styles.alternativaLabel}>
                    ({alternativa.nome})
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.radioButton,
                      alternativa.correta && styles.radioButtonSelected,
                    ]}
                    onPress={() => handleAlternativaCorretaChange(index)}
                  >
                    {alternativa.correta && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.corretaLabel}>Correta</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={`Digite a alternativa ${alternativa.nome}...`}
                  placeholderTextColor="#999"
                  value={alternativa.texto}
                  onChangeText={(text) => handleAlternativaChange(index, text)}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.button, salvando && styles.buttonDisabled]}
              onPress={handleSalvar}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Salvar Questão</Text>
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
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
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
    minHeight: 100,
    textAlignVertical: "top",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginTop: 12,
    marginBottom: 16,
  },
  alternativaBlock: {
    marginBottom: 16,
  },
  alternativaHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  alternativaLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginRight: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BLUE,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: BLUE,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BLUE,
  },
  corretaLabel: {
    fontSize: 14,
    color: "#666",
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
