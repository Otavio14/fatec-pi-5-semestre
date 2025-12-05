import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const COLORS = {
  orange: '#FFA747',
  red: '#D32F2F',
  white: '#FFFFFF',
  cardBg: '#E0E0E0',
  darkCardBg: '#2A2A2A', // Cor escura para o card em dark mode
};

export default function RedacaoTemaScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/redacao');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedText type="title" style={styles.screenTitle}>
          Redação
        </ThemedText>

        {/* Card do Tema */}
        <ThemedView
          style={styles.themeCard}
          lightColor={COLORS.cardBg}
          darkColor={COLORS.darkCardBg}
        >
          <ThemedText style={styles.themeText}>
            O impacto da inteligência artificial no mercado
            de trabalho
          </ThemedText>
        </ThemedView>

        {/* Botões Auxiliares */}
        <View style={styles.auxButtonsContainer}>
          <TouchableOpacity
            style={styles.auxButton}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.auxButtonText}>
              Visualizar texto auxiliar 1
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.auxButton}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.auxButtonText}>
              Visualizar texto auxiliar 2
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Espaçador para empurrar o botão para baixo */}
        <View style={styles.spacer} />

        {/* Botão Iniciar */}
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.8}
          onPress={handleStart}
        >
          <ThemedText
            type="defaultSemiBold"
            style={styles.actionButtonText}
          >
            Iniciar
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
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  screenTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  themeCard: {
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderRadius: 8,
  },
  themeText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '500',
  },
  auxButtonsContainer: {
    width: '100%',
    gap: 20,
    alignItems: 'center',
  },
  auxButton: {
    backgroundColor: COLORS.red,
    width: '90%',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 4,
    elevation: 2,
  },
  auxButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  actionButton: {
    backgroundColor: COLORS.orange,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 20,
  },
});
