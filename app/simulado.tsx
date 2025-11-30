import { useRouter } from "expo-router";
import { useState } from "react";
import {
  GestureResponderEvent,
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
import { authService } from "../services/auth.service";
import { UsuarioService } from "../services/usuario.service";
import { IQuestao } from "../types/questao.type";

interface ILoginForm {
  email: string;
  senha: string;
}

export default function SimuladoScreen() {
  const [questoes, setQuestoes] = useState<Array<IQuestao>>([
    {
      id_prova: 1,
      id: 1,
      numero: 1,
      texto: "Sample question 1 text",
    },
    {
      id_prova: 1,
      id: 2,
      numero: 2,
      texto: "Sample question 2 text",
    },
    {
      id_prova: 1,
      id: 3,
      numero: 3,
      texto: "Sample question 3 text",
    },
  ]);

  const router = useRouter();
  const usuarioService = new UsuarioService();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Simulado</Text>
            <View style={styles.headerQuestoes}>
              {questoes.map((questao, index) => (
                <TouchableOpacity key={index} style={styles.headerQuestao}>
                  <Text>{questao.numero}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.questao}>
            <View style={styles.questionCard}>
              <Text style={styles.question}>{questoes[0].texto}</Text>
            </View>

            {/* <View style={styles.optionsBlock}>
              {OPTIONS.map((opt) => {
                const isSelected = opt === selected;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                    ]}
                    onPress={() => handleSelect(opt)}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar opção ${opt}`}
                  >
                    <View
                      style={[
                        styles.bullet,
                        isSelected && styles.bulletSelected,
                      ]}
                    />
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const BLUE = "#4A82F8";
const ORANGE = "#FFA747";
const GREY_BG = "#dddddd";

const styles = StyleSheet.create({
  safe: {
    display: "flex",
    flex: 1,
    backgroundColor: GREY_BG,
  },
  flex: {
    display: "flex",
    height: "100%",
  },
  scroll: {
    display: "flex",
    padding: 20,
    width: "100%",
    height: "100%",
  },
  header: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    padding: 10,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    elevation: 4,
    maxWidth: 500,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 40,
  },
  headerQuestoes: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  headerQuestao: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    borderRadius: "100%",
    backgroundColor: ORANGE,
  },
  questao: {},
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  questionCard: {
    marginTop: 28,
    backgroundColor: "#f5f5f5",
    borderRadius: 42,
    paddingVertical: 32,
    paddingHorizontal: 24,
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.25)",
    elevation: 6,
  },
  question: {
    fontSize: 34,
    fontWeight: "900",
    color: "#222",
    lineHeight: 40,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  optionsBlock: {
    marginTop: 48,
    gap: 22,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 44,
    paddingVertical: 20,
    paddingHorizontal: 22,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.25)",
    elevation: 4,
  },
  optionRowSelected: {
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.35)",
    elevation: 6,
  },
  bullet: {
    width: 72,
    height: 28,
    borderRadius: 20,
    borderWidth: 6,
    borderColor: ORANGE,
    backgroundColor: "#fff",
    marginRight: 24,
  },
  bulletSelected: {
    backgroundColor: ORANGE,
  },
  optionText: {
    fontSize: 34,
    fontWeight: "800",
    color: "#222",
    flexShrink: 1,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  confirmBtn: {
    marginTop: 40,
    backgroundColor: ORANGE,
    borderRadius: 44,
    paddingVertical: 26,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.3)",
    elevation: 6,
  },
  confirmText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
});
