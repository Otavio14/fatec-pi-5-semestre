import { Href, useRouter } from "expo-router";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { authService } from "../services/auth.service";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type IRota = {
  rota: Href;
  nome: string;
};

export function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] =
    useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const translateX = useRef(new Animated.Value(-300)).current;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const rotasAdmin: Array<IRota> = [
    { rota: "/admin", nome: "Home" },
    { rota: "/admin/usuarios", nome: "Usuários" },
    { rota: "/criar-questao-simulado", nome: "Criar Questão Simulado" },
    { rota: "/criar-questao", nome: "Criar Questão" },
    { rota: "/criar-redacao", nome: "Criar Redação" },
  ];
  const rotasAluno: Array<IRota> = [
    { rota: "/aluno", nome: "Home" },
    { rota: "/user", nome: "Seu Perfil" },
  ];
  const rotasPublicas: Array<IRota> = [
    { rota: "/login", nome: "Login" },
    { rota: "/cadastro", nome: "Cadastro" },
    { rota: "/redacao-ocr", nome: "Redação OCR" },
    { rota: "/simulado", nome: "Simulado" },
    // { rota: "/criar-simulado", nome: "Criar Simulado" },
    // { rota: "/error", nome: "Error" },
    // { rota: "/pergunta", nome: "Pergunta" },
    // { rota: "/questao", nome: "Questão" },
    // { rota: "/realizar_redacao", nome: "Realizar Redação" },
    // { rota: "/redacao-recebida", nome: "Redação Recebida" },
    // { rota: "/redacao", nome: "Redação" },
    // { rota: "/simulado-aleatorio", nome: "Simulado Aleatório" },
    // { rota: "/simulado-criado", nome: "Simulado Criado" },
  ];

  useEffect(() => {
    async function fetchData() {
      setIsAuthenticatedAdmin(await authService.isAuthenticatedAdmin());
      setIsAuthenticated(await authService.isAuthenticated());
    }

    fetchData();
  }, []);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isSidebarOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isSidebarOpen, translateX]);

  return (
    <>
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX }],
            top: 60 + insets.top,
            height: Dimensions.get("window").height - 60 - insets.top,
          },
        ]}
      >
        {isAuthenticatedAdmin ? (
          <Fragment>
            {rotasAdmin.map((m, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setIsSidebarOpen(false);
                  router.push(m.rota);
                }}
              >
                <Text style={styles.text}>{m.nome}</Text>
              </TouchableOpacity>
            ))}
          </Fragment>
        ) : isAuthenticated ? (
          <Fragment>
            {rotasAluno.map((m, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setIsSidebarOpen(false);
                  router.push(m.rota);
                }}
              >
                <Text style={styles.text}>{m.nome}</Text>
              </TouchableOpacity>
            ))}
          </Fragment>
        ) : (
          <Fragment>
            {rotasPublicas.map((m, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setIsSidebarOpen(false);
                  router.push(m.rota);
                }}
              >
                <Text style={styles.text}>{m.nome}</Text>
              </TouchableOpacity>
            ))}
          </Fragment>
        )}
      </Animated.View>
      {isSidebarOpen ? (
        <Pressable
          onPress={() => {
            setIsSidebarOpen(false);
          }}
        >
          <View
            style={[
              styles.backdrop,
              {
                top: 60 + insets.top,
                height: Dimensions.get("window").height - 60 - insets.top,
              },
            ]}
          />
        </Pressable>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    width: 300,
    height: Dimensions.get("window").height - 60,
    paddingHorizontal: 25,
    justifyContent: "center",
    zIndex: 1000,
    boxShadow: "2px 4px 3.84px rgba(0, 0, 0, 0.25)",
    elevation: 5,
    backgroundColor: "#F3F3F3",
    gap: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0c2d57",
  },
  backdrop: {
    position: "fixed",
    top: 60,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 60,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
});
