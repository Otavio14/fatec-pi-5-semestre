import { useRouter } from 'expo-router';
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
  redButton: '#FF0000',
  white: '#FFFFFF',
  greyLight: '#F0F0F0',
  greyDark: '#2A2A2A',
};

export default function RedacaoTemaScreen() {
  const router = useRouter();

  const handleStart = () => {
    // Navega para a tela de câmera existente
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
          lightColor={COLORS.greyLight}
          darkColor={COLORS.greyDark}
        >
          <ThemedText style={styles.themeText}>
            Tema da redação
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

        <View style={{ flex: 1, minHeight: 40 }} />

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
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
    flexGrow: 1,
  },
  screenTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  themeCard: {
    width: '100%',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderRadius: 8,
  },
  themeText: {
    fontSize: 22,
    textAlign: 'center',
  },
  auxButtonsContainer: {
    width: '100%',
    gap: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  auxButton: {
    backgroundColor: COLORS.redButton,
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
