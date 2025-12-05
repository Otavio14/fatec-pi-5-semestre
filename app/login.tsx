import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../services/auth.service";
import { UsuarioService } from "../services/usuario.service";

interface ILoginForm {
  email: string;
  senha: string;
}

export default function LoginScreen() {
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    email: "",
    senha: "",
  });

  const router = useRouter();
  const usuarioService = new UsuarioService();

  const handleLogin = async (e: GestureResponderEvent) => {
    e.preventDefault();
    try {
      if (!loginForm.email || !loginForm.senha) {
        Alert.alert(
          "Atenção",
          "Por favor, preencha todos os campos do formulário.",
          [{ text: "OK" }]
        );
        return;
      }

      const {
        data: { dados },
      } = await usuarioService.login(loginForm);
      await authService.saveToken(dados);
      if (await authService.isAuthenticatedAdmin()) {
        router.push("/admin");
      } else if (await authService.isAuthenticated()) {
        router.push("/aluno");
      }
    } catch {
      Alert.alert(
        "Erro de Login",
        "Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.",
        [{ text: "OK" }]
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (await authService.isAuthenticatedAdmin()) {
          router.push("/admin");
        } else if (await authService.isAuthenticated()) {
          router.push("/aluno");
        }
      } catch {}
    }
    fetchData();
  }, [router]);

  const handleNavigateSignUp = () => {
    router.push("/cadastro");
  };

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
          <View style={styles.card}>
            <Text style={styles.title}>Entrar na Plataforma</Text>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#1d4fa8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={loginForm.email}
                onChangeText={(email) => setLoginForm({ ...loginForm, email })}
              />
            </View>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#1d4fa8"
                secureTextEntry
                value={loginForm.senha}
                onChangeText={(senha) => setLoginForm({ ...loginForm, senha })}
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Ainda não tem conta? </Text>
              <TouchableOpacity onPress={handleNavigateSignUp}>
                <Text style={styles.signupLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
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
    width: "100%",
  },
  topBar: {
    height: 72,
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  flex: {
    display: "flex",
    height: "100%",
  },
  scroll: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    paddingBottom: 40,
    paddingHorizontal: 28,
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    elevation: 4,
    marginVertical: "auto",
    maxWidth: 500,
    paddingHorizontal: 36,
    paddingVertical: 20,
    width: "auto",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
    marginBottom: 48,
    lineHeight: 40,
  },
  fieldBlock: {
    marginBottom: 28,
  },
  input: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 4,
    paddingHorizontal: 20,
    height: 68,
    fontSize: 20,
    backgroundColor: "#f7f7f7",
    color: "#000",
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 6,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.15)",
    elevation: 3,
  },
  buttonText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 36,
    flexWrap: "wrap",
  },
  signupText: {
    fontSize: 14,
    color: "#111",
    marginBottom: 2,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "700",
    color: BLUE,
  },
});
