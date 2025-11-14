import React, { useState } from "react";
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

const ORANGE = "#FFA747";
const GREY_BG = "#e4e4e4";
const DARK_GREY = "#8f8b8b";

export default function RedacaoScreen() {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleCapture = () => {
    // empty
  };

  const handleSubmit = () => {
    // empty
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={GREY_BG} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>REGISTRE SUA{"\n"}REDAÇÃO!</Text>

        <View style={styles.uploadOuter}>
          <View style={styles.uploadInner}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} />
            ) : (
              <Text style={styles.placeholderText}>
                Sua imagem aparecerá aqui
              </Text>
            )}
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.captureBtn}
            onPress={handleCapture}
            accessibilityLabel="Capturar redação"
          >
            <View style={styles.camCornerTL} />
            <View style={styles.camCornerTR} />
            <View style={styles.camCornerBL} />
            <View style={styles.camCornerBR} />
            <View style={styles.camBody}>
              <View style={styles.camLens} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel="Enviar redação"
          >
            <Text style={styles.submitText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const winH = Dimensions.get("window").height;
const TARGET_HEIGHT = Math.min(winH * 0.55, 520);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: GREY_BG,
  },
  content: {
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: "center",
    gap: 36,
  },
  title: {
    fontSize: 38,
    fontWeight: "900",
    color: "#000",
    textAlign: "center",
    lineHeight: 44,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 6,
  },
  uploadOuter: {
    width: "86%",
    height: TARGET_HEIGHT,
    borderRadius: 44,
    position: "relative",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: DARK_GREY,
  },
  uploadInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 44,
    borderWidth: 14,
    borderColor: ORANGE,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    resizeMode: "cover",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.6,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  actionsRow: {
    flexDirection: "row",
    width: "92%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  captureBtn: {
    width: 108,
    height: 108,
    backgroundColor: ORANGE,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  camBody: {
    width: 56,
    height: 40,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camLens: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 4,
    borderColor: "#fff",
  },
  camCornerTL: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#fff",
  },
  camCornerTR: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#fff",
  },
  camCornerBL: {
    position: "absolute",
    bottom: 10,
    left: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#fff",
  },
  camCornerBR: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: "#fff",
  },
  submitBtn: {
    flex: 1,
    marginLeft: 20,
    height: 108,
    backgroundColor: ORANGE,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
  },
  submitText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
});
