import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

export default function HomeSimulado() {
  const router = useRouter()
  const handleNovaQuestao = () => {
    router.push("/criar-questao")
  };

  const handleNovoTemaRedacao = () => {
    router.push("/criar-redacao")
  };

  const handleNovoSimulado = () => {
    router.push("/criar-simulado")
  };

  const handleHome = () => {
    router.push("/")
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#dedede" />
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.botao} onPress={handleNovaQuestao}>
          <Text style={styles.botaoTexto}>Criar nova Questão</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={handleNovoTemaRedacao}>
          <Text style={styles.botaoTexto}>Criar novo Tema de Redação</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={handleNovoSimulado}>
          <Text style={styles.botaoTexto}>Criar novo Simulado</Text>
        </TouchableOpacity>

        <Image
          source={require("@/assets/images/criar-questao-simulado.png")}
          style={styles.image}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.botaoHome} onPress={handleHome}>
          <Text style={styles.botaoHomeTexto}>Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const ORANGE = "#FFA747";
const GREY_BG = "#dedede";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREY_BG,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  botao: {
    width: "88%",
    backgroundColor: ORANGE,
    borderRadius: 18,
    marginVertical: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.17,
    shadowRadius: 6,
    elevation: 5,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.13)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  image: {
    width: 190,
    height: 160,
    marginVertical: 30,
  },
  botaoHome: {
    width: "88%",
    backgroundColor: ORANGE,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.17,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 15,
  },
  botaoHomeTexto: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.13)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});