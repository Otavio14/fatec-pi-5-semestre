import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { UsuarioService } from "../services/usuario.service";
import { authService } from "../services/auth.service";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserCard() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const usuarioService = new UsuarioService();

  useEffect(() => {
    async function fetchUser() {
      const token = await authService.getToken();
      if (token) {
        const { id } = require("jose").decodeJwt(token);
        usuarioService.findOne(id).then(res => {
          if(res.data.valido) setNome(res.data.dados.nome);
        });
      }
    }
    fetchUser();
  }, []);

  const handleHome = () => {
    router.push("/");
  };
  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#dedede" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Image
            source={require("@/assets/images/avatar.png")}
            style={styles.avatarImg}
            resizeMode="contain"
          />
          <Text style={styles.userName}>{nome ? nome : "Carregando..."}</Text>
          {/* falta escrever a lógica de extraçao do nome do usuário */}
        </View>
        <TouchableOpacity style={styles.cta} onPress={handleHome}>
          <Text style={styles.ctaText}>Home</Text>
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
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    alignItems: "center",
    width: 270,
    paddingVertical: 36,
    borderRadius: 18,
    marginBottom: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarImg: {
    width: 120,
    height: 120,
    marginBottom: 18,
    borderRadius: 60,
  },
  userName: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 22,
    color: "#222",
    textAlign: "center",
  },
  cta: {
    width: 220,
    height: 60,
    backgroundColor: ORANGE,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  ctaText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.17)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});