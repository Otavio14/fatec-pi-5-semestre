import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RedacaoRecebidaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Redirecionar automaticamente após 3 segundos se veio do simulado
  useEffect(() => {
    if (params.fromSimulado === 'true' && params.respostas) {
      const timer = setTimeout(() => {
        router.push({
          pathname: "/simulado",
          params: {
            respostas: params.respostas as string,
            redacaoEnviada: 'true'
          }
        });
      }, 3000);

      return () => clearTimeout(timer);
    } else if (params.fromRealizarRedacao === 'true') {
      const timer = setTimeout(() => {
        router.push({
          pathname: "/realizar_redacao",
          params: {
            redacaoEnviada: 'true'
          }
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [params, router]);
  
  const handleContinue = () => {
    router.push("/");
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#dfdfdf" />
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>RECEBEMOS SUA REDAÇÃO!</Text>

        <View style={styles.illustrationWrap}>
          <Image
            source={require("@/assets/images/houve-sucesso2.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {params.fromSimulado !== 'true' && params.fromRealizarRedacao !== 'true' && (
          <TouchableOpacity
            style={styles.cta}
            onPress={handleContinue}
            accessibilityRole="button"
          >
            <Text style={styles.ctaText}>Home</Text>
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    alignSelf: "flex-start",
    marginTop: 24,
    fontSize: 36,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 0.5,
    lineHeight: 44,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  illustrationWrap: {
    width: "100%",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: "90%",
    height: undefined,
    aspectRatio: 1,
  },
  cta: {
    width: "92%",
    height: 84,
    backgroundColor: ORANGE,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 8,
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.18)",
    elevation: 6,
  },
  ctaText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
