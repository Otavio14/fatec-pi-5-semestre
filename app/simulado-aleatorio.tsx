import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SimuladoAleatorioScreen() {
  const handleCreate = () => {
    // empty
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#dfdfdf" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>DESEJA CRIAR UM SIMULADO?</Text>

        <View style={styles.illustrationWrap}>
          {/* Replace the image path if needed */}
          <Image
            source={require("@/assets/images/simulado-aleatorio.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          style={styles.cta}
          onPress={handleCreate}
          accessibilityRole="button"
        >
          <Text style={styles.ctaText}>Criar</Text>
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
