import { Picker } from "@react-native-picker/picker";
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
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../services/auth.service";
import { UsuarioService } from "../services/usuario.service";

interface ILoginForm {
  email: string;
  senha: string;
}

export default function CriarSimuladoScreen() {
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    email: "",
    senha: "",
  });

  const router = useRouter();
  const usuarioService = new UsuarioService();

  const handleLogin = (e: GestureResponderEvent) => {
    e.preventDefault();

    usuarioService.login(loginForm).then(async ({ data: { dados } }) => {
      console.log("Passou");

      await authService.saveToken(dados);

      if (await authService.isAuthenticatedAdmin()) {
        router.push("/admin");
      } else if (await authService.isAuthenticated()) {
        router.push("/aluno");
      }
    });
    // .catch((e) => {
    //   console.log(e);
    // });
    // .catch(errorSwal);
  };

  // useEffect(() => {
  //   if (authService.isAuthenticatedAdmin()) {
  //     router.push("/admin");
  //   } else if (authService.isAuthenticated()) {
  //     router.push("/aluno");
  //   }
  // }, [router]);

  const handleNavigateSignUp = () => {
    router.push("/cadastro");
  };

  const [selectedValue, setSelectedValue] = useState("");

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
            <Text style={styles.title}>Criar Simulado</Text>

            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
            >
              <Picker.Item label="Select..." value="" />
              <Picker.Item label="JavaScript" value="js" />
              <Picker.Item label="TypeScript" value="ts" />
            </Picker>

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
  line: {
    height: 5,
    backgroundColor: ORANGE,
    borderRadius: 2,
  },
  logoWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 42,
    height: 42,
  },
  brand: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1d4fa8",
    letterSpacing: 0.5,
  },
  flex: {
    display: "flex",
    height: "100%",
  },
  scroll: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
    width: "100%",
    height: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    paddingVertical: 20,
    paddingHorizontal: 36,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
    elevation: 4,
    maxWidth: 500,
    width: "auto",
    marginVertical: "auto",
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
