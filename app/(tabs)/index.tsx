import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GREY_BG = "#dedede";
const CARD_BG = "#ffffff";
const BLUE = "#4A82F8";
const ORANGE = "#FFA747";

export default function HomeScreen() {
  const router = useRouter();

  const handleGoAlternativas = () => {
    router.push("/questoes-alternativas");
  };

  const handleGoRedacao = () => {
    router.push("/realizar_redacao");
  };

  const handleGoVestibularCompleto = () => {
    router.push("/simulado");
  };

  const handleBanner = () => {
    // empty
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={GREY_BG} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.hero}>Prepare-se com eficiência</Text>
        <View style={styles.square} />

        <View style={styles.cardsGroup}>
          <View style={styles.card}>
            <View style={styles.cardIconWrap}>
              <Image
                source={require("@/assets/images/alternativas.png")}
                style={styles.cardIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Questões Alternativas</Text>
              <Text style={styles.cardDesc}>
                Treine com questões de múltipla escolha de vestibulares
                passados.
              </Text>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={handleGoAlternativas}
              >
                <Text style={styles.cardButtonText}>➜</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconWrap}>
              <Image
                source={require("@/assets/images/redacao.png")}
                style={styles.cardIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Temas de Redação</Text>
              <Text style={styles.cardDesc}>
                Explore temas anteriores e escreva redações como nos
                vestibulares.
              </Text>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={handleGoRedacao}
              >
                <Text style={styles.cardButtonText}>➜</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIconWrap}>
              <Image
                source={require("@/assets/images/vestibular-completo.png")}
                style={styles.cardIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Vestibular Completo</Text>
              <Text style={styles.cardDesc}>
                Simule a última prova completa até o momento com tempo
                cronometrado.
              </Text>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={handleGoVestibularCompleto}
              >
                <Text style={styles.cardButtonText}>➜</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.banner}
          onPress={handleBanner}
          activeOpacity={0.85}
        >
          <Image
            source={require("@/assets/images/banner-fatec.png")}
            style={styles.bannerImg}
            resizeMode="cover"
          />
          <View style={styles.bannerOverlay} />
          <View style={styles.bannerTextWrap}>
            <Text style={styles.bannerTitle}>
              Inscreva-se no Vestibular da Fatec!
            </Text>
            <Text style={styles.bannerDesc}>
              Utilize todo seu treinamento na prática por meio do processo
              seletivo!
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.footer}>Todos os Direitos Reservados</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREY_BG,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  hero: {
    marginTop: 40,
    fontSize: 32,
    fontWeight: "800",
    color: BLUE,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  cardsGroup: {
    marginTop: 60,
    gap: 46,
  },
  card: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 20,
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.18)",
    elevation: 5,
  },
  cardIconWrap: {
    width: 92,
    height: 92,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
    boxShadow: "0px 3px 4px rgba(0, 0, 0, 0.15)",
    elevation: 3,
  },
  cardIcon: {
    width: "100%",
    height: "100%",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: "#222",
    lineHeight: 18,
    marginBottom: 14,
  },
  cardButton: {
    alignSelf: "flex-start",
    backgroundColor: BLUE,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.25)",
    elevation: 4,
  },
  cardButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  banner: {
    marginTop: 70,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: ORANGE,
  },
  bannerImg: {
    width: "100%",
    height: 240,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bannerTextWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  bannerDesc: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    marginTop: 38,
    fontSize: 12,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
  circle: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 100,
    zIndex: -1,
  },
  square: {
    backgroundColor: "#F3F3F3",
    height: 130,
    left: 0,
    position: "absolute",
    top: 0,
    width: Dimensions.get("window").width,
    zIndex: -1,
    // clipPath: "inset(0px -10px 0px 0px)",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
