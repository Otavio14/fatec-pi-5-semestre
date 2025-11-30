import { useRouter } from "expo-router";
import { Fragment, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { authService } from "../services/auth.service";

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
  const router = useRouter();

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
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        {isAuthenticatedAdmin ? (
          <Fragment>
            <TouchableOpacity
              onPress={() => {
                setIsSidebarOpen(false);
                router.push("/admin");
              }}
            >
              <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsSidebarOpen(false);
                router.push("/admin/usuarios");
              }}
            >
              <Text>Usuários</Text>
            </TouchableOpacity>
          </Fragment>
        ) : isAuthenticated ? (
          <Fragment>
            <TouchableOpacity
              onPress={() => {
                router.push("/aluno");
              }}
            >
              <Text>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/aluno");
              }}
            >
              <Text>Seus Simulados</Text>
            </TouchableOpacity>
          </Fragment>
        ) : null}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 60,
    left: 0,
    width: 300,
    height: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    boxShadow: "2px 0px 3.84px rgba(0, 0, 0, 0.25)",
    elevation: 5,
  },
  toggleButton: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 1001,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
});
