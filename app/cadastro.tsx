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

import { useState } from "react";
import { UsuarioService } from "../services/usuario.service";
import { useRouter } from "expo-router";
import { authService } from "../services/auth.service";
import Swal from "sweetalert2";
import { useThemeColor } from "../hooks/use-theme-color";

interface IRegisterForm {
  email: string;
  nome: string;
  senha: string;
  senhaConfirmacao?: string;
}

export default function CadastroScreen() {
  const [registerForm, setRegisterForm] = useState<IRegisterForm>({
    email: "",
    nome: "",
    senha: "",
    senhaConfirmacao: "",
  });

  const router = useRouter();
  const usuarioService = new UsuarioService();

  const handleRegister = (e: GestureResponderEvent) => {
    e.preventDefault();

    if (registerForm.senha !== registerForm.senhaConfirmacao) {
      Swal.fire({
        icon: "warning",
        title: "Senhas não coincidem",
        text: "As senhas informadas não coincidem. Por favor, verifique e tente novamente.",
      });
      return;
    }

    usuarioService.create(registerForm).then(() => {
      usuarioService
        .login({ email: registerForm.email, senha: registerForm.senha })
        .then(async ({ data: { dados } }) => {
          localStorage.setItem("token", dados);

          if (await authService.isAuthenticatedAdmin()) {
            router.push("/admin");
          } else if (await authService.isAuthenticated()) {
            router.push("/aluno");
          }
        });
      // .catch(errorSwal);
    });
    // .catch(errorSwal);
  };

  const handleNavigateLogin = () => {
    router.push("/login");
  };

  return (
    <View style={styles.safe}>
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
            <Text style={styles.title}>Criar Conta</Text>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#111"
                value={registerForm.nome}
                onChangeText={(nome) =>
                  setRegisterForm({ ...registerForm, nome })
                }
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#111"
                value={registerForm.email}
                onChangeText={(email) =>
                  setRegisterForm({ ...registerForm, email })
                }
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                textContentType="emailAddress"
              />
            </View>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#111"
                value={registerForm.senha}
                onChangeText={(senha) =>
                  setRegisterForm({ ...registerForm, senha })
                }
                secureTextEntry
                returnKeyType="next"
                textContentType="password"
              />
            </View>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="Confirmar Senha"
                placeholderTextColor="#111"
                value={registerForm.senhaConfirmacao}
                onChangeText={(senhaConfirmacao) =>
                  setRegisterForm({ ...registerForm, senhaConfirmacao })
                }
                secureTextEntry
                returnKeyType="done"
                textContentType="password"
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={handleNavigateLogin}>
                <Text style={styles.loginLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const BLUE = "#4A82F8";
const ORANGE = "#FFA747";
const GREY_BG = "#dddddd";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREY_BG,
    display: "flex",
    width: "100%",
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
    display: "flex",
    elevation: 4,
    marginVertical: "auto",
    maxWidth: 500,
    paddingHorizontal: 36,
    paddingVertical: 20,
    width: "100%",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 40,
  },
  fieldBlock: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 8,
    paddingHorizontal: 20,
    height: 64,
    fontSize: 18,
    backgroundColor: "#fff",
    color: "#000",
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 8,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.15)",
    elevation: 3,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    flexWrap: "wrap",
  },
  loginText: {
    fontSize: 14,
    color: "#111",
    marginBottom: 2,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: BLUE,
  },
});
