import { useState } from "react";
import {
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

export default function LoginScreen() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    // empty
  };

  const handleNavigateSignUp = () => {
    // empty
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
            <Text style={styles.title}>Entrar na Plataforma</Text>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#1d4fa8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#1d4fa8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
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
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 6,
    paddingVertical: 56,
    paddingHorizontal: 36,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    maxWidth: 500,
    width: "100%",
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
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
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
