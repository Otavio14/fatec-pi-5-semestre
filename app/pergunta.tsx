import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

// Importando seus componentes personalizados
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const COLORS = {
  orange: '#FFA747',
  white: '#FFFFFF',
  greyLight: '#F0F0F0',
  greyDark: '#2A2A2A', // Cor de fundo do card para modo escuro
};

export default function QuestaoScreen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<
    number | null
  >(null);

  // Mock de dados
  const questao = {
    numero: 'N',
    texto: 'Texto da questão',
    alternativas: [
      { id: 1, texto: 'Texto da resposta' },
      { id: 2, texto: 'Texto da resposta' },
      { id: 3, texto: 'Texto da resposta' },
      { id: 4, texto: 'Texto da resposta' },
      { id: 5, texto: 'Texto da resposta' },
      { id: 6, texto: 'Texto da resposta' },
    ],
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >
        {/* Título da Tela */}
        <ThemedText type="title" style={styles.screenTitle}>
          Questão {questao.numero}
        </ThemedText>

        {/* Card da Questão - Usando ThemedView para adaptar o fundo */}
        <ThemedView
          style={styles.questionCard}
          lightColor={COLORS.greyLight}
          darkColor={COLORS.greyDark}
        >
          <ThemedText style={styles.questionText}>
            {questao.texto}
          </ThemedText>
        </ThemedView>

        {/* Lista de Alternativas */}
        <View style={styles.optionsContainer}>
          {questao.alternativas.map((alt) => {
            const isSelected = selectedOption === alt.id;
            return (
              <TouchableOpacity
                key={alt.id}
                style={styles.optionRow}
                onPress={() => setSelectedOption(alt.id)}
                activeOpacity={0.7}
              >
                {/* Círculo do Radio Button */}
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioSelected,
                  ]}
                />

                {/* Texto da Alternativa usando seu componente */}
                <ThemedText style={styles.optionText}>
                  {alt.texto}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Botão Próxima */}
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
        >
          <ThemedText
            type="defaultSemiBold"
            style={styles.actionButtonText}
          >
            Próxima
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  screenTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  questionCard: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderRadius: 8,
  },
  questionText: {
    fontSize: 22,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 40,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  radioCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0', // Manteve-se fixo ou pode usar themeColor se preferir
  },
  radioSelected: {
    backgroundColor: COLORS.orange,
  },
  optionText: {
    fontSize: 18,
    flex: 1, // Garante que o texto ocupe o espaço e quebre linha se precisar
  },
  actionButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 20,
  },
});
