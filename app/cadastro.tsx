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

import { useState } from "react";

export default function CadastroScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    // empty
  };

  const handleNavigateLogin = () => {
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
            <Text style={styles.title}>Criar Conta</Text>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#111"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.fieldBlock}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#111"
                value={email}
                onChangeText={setEmail}
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
                value={password}
                onChangeText={setPassword}
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
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                returnKeyType="done"
                textContentType="password"
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
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
    flexDirection: "column",
    width: "100%",
  },
  flex: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    maxWidth: 800,
    width: "100%",
    display: "flex",
    flexDirection: "column",
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
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
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
