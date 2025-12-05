import { useRouter } from 'expo-router';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../../services/auth.service';

// Cores do tema
const BLUE = '#4A82F8';
const GREY_BG = '#f5f5f5';

// Imagens para os botões
const imgQuestao = require('../../assets/images/criar-questao-simulado.png');
const imgRedacao = require('../../assets/images/redacao.png');
const imgSimulado = require('../../assets/images/vestibular-completo.png'); // Reutilizando imagem existente
const imgUsers = require('../../assets/images/avatar.png'); // Reutilizando imagem existente

export default function AdminHomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.deleteToken();
    router.replace('/login');
  };

  const menuItems = [
    {
      title: 'Criar Questão',
      description: 'Adicione novas questões ao banco',
      route: '/criar-questao',
      image: imgQuestao,
    },
    {
      title: 'Criar Redação',
      description: 'Cadastre novos temas de redação',
      route: '/criar-redacao',
      image: imgRedacao,
    },
    {
      title: 'Criar Simulado',
      description: 'Monte simulados completos',
      route: '/criar-simulado',
      image: imgSimulado,
    },
    {
      title: 'Gerenciar Usuários',
      description: 'Administre os alunos cadastrados',
      route: '/admin/usuarios',
      image: imgUsers,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={GREY_BG}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>
            Bem-vindo,
          </Text>
          <Text style={styles.headerTitle}>
            Administrador
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>
          O que deseja fazer hoje?
        </Text>

        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={item.image}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>
                  {item.title}
                </Text>
                <Text style={styles.cardDescription}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GREY_BG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BLUE,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F0F6FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardImage: {
    width: 35,
    height: 35,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#888',
  },
});
