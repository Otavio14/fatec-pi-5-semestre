import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#FFA747";
const GREY_BG = "#dedede";

const QUESTION_TEXT =
  "Um número perpendicular a bissetriz como cosseno corresponde a 4x^9.\n\nDito isto, qual a cor do cavalo branco de napoleão?";

const OPTIONS = ["Azul", "Amarelo", "Branco", "Marrom", "Dodge Charger"];

export default function QuestaoScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (opt: string) => {
    // empty
    setSelected(opt);
  };

  const handleConfirm = () => {
    // empty
  };

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={GREY_BG} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.questionCard}>
          <Text style={styles.question}>{QUESTION_TEXT}</Text>
        </View>

        <View style={styles.optionsBlock}>
          {OPTIONS.map((opt) => {
            const isSelected = opt === selected;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionRow,
                  isSelected && styles.optionRowSelected,
                ]}
                onPress={() => handleSelect(opt)}
                accessibilityRole="button"
                accessibilityLabel={`Selecionar opção ${opt}`}
              >
                <View
                  style={[styles.bullet, isSelected && styles.bulletSelected]}
                />
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleConfirm}
          accessibilityRole="button"
          accessibilityLabel="Confirmar resposta"
        >
          <Text style={styles.confirmText}>Responder</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  questionCard: {
    marginTop: 28,
    backgroundColor: "#f5f5f5",
    borderRadius: 42,
    paddingVertical: 32,
    paddingHorizontal: 24,
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.25)",
    elevation: 6,
  },
  question: {
    fontSize: 34,
    fontWeight: "900",
    color: "#222",
    lineHeight: 40,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  optionsBlock: {
    marginTop: 48,
    gap: 22,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 44,
    paddingVertical: 20,
    paddingHorizontal: 22,
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.25)",
    elevation: 4,
  },
  optionRowSelected: {
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.35)",
    elevation: 6,
  },
  bullet: {
    width: 72,
    height: 28,
    borderRadius: 20,
    borderWidth: 6,
    borderColor: ORANGE,
    backgroundColor: "#fff",
    marginRight: 24,
  },
  bulletSelected: {
    backgroundColor: ORANGE,
  },
  optionText: {
    fontSize: 34,
    fontWeight: "800",
    color: "#222",
    flexShrink: 1,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  confirmBtn: {
    marginTop: 40,
    backgroundColor: ORANGE,
    borderRadius: 44,
    paddingVertical: 26,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.3)",
    elevation: 6,
  },
  confirmText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
});
