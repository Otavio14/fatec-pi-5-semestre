import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CustomStatusModal } from '../../components/CustomStatusModal';
import { UsuarioService } from '../../services/usuario.service';
import { IUsuario } from '../../types/usuario.type';

const BLUE = '#4A82F8';
const ORANGE = '#FFA747';
const GREY_BG = '#f5f5f5';
const RED = '#FF6B6B';

export default function AdminUsuariosScreen() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<
    IUsuario[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Estados do Modal de Formulário
  const [modalFormVisible, setModalFormVisible] =
    useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados do Formulário
  const [formId, setFormId] = useState<number>(0);
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPerfil, setFormPerfil] = useState('Aluno');
  const [formSenha, setFormSenha] = useState('');
  const [formSenhaConfirm, setFormSenhaConfirm] =
    useState('');

  // Estados do Modal de Status (Sucesso/Erro)
  const [statusModalVisible, setStatusModalVisible] =
    useState(false);
  const [statusType, setStatusType] = useState<
    'success' | 'error'
  >('success');
  const [statusMessage, setStatusMessage] = useState('');

  const usuarioService = new UsuarioService();

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredUsuarios(usuarios);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = usuarios.filter(
        (u) =>
          u.nome.toLowerCase().includes(lowerSearch) ||
          u.email.toLowerCase().includes(lowerSearch),
      );
      setFilteredUsuarios(filtered);
    }
  }, [search, usuarios]);

  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const response = await usuarioService.findAll();
      setUsuarios(response.data.dados);
      setFilteredUsuarios(response.data.dados);
    } catch (error) {
      console.error('Erro ao carregar usuários', error);
      showStatus(
        'error',
        'Não foi possível carregar a lista de usuários.',
      );
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (
    type: 'success' | 'error',
    message: string,
  ) => {
    setStatusType(type);
    setStatusMessage(message);
    setStatusModalVisible(true);
  };

  const handleOpenCreate = () => {
    setFormId(0);
    setFormNome('');
    setFormEmail('');
    setFormPerfil('Aluno');
    setFormSenha('');
    setFormSenhaConfirm('');
    setIsEditing(false);
    setModalFormVisible(true);
  };

  const handleOpenEdit = (usuario: IUsuario) => {
    setFormId(usuario.id);
    setFormNome(usuario.nome);
    setFormEmail(usuario.email);
    setFormPerfil(usuario.perfil);
    setFormSenha(''); // Não preenche senha na edição por segurança
    setFormSenhaConfirm('');
    setIsEditing(true);
    setModalFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    // Em um app real, idealmente teríamos um modal de confirmação "Sim/Não" nativo aqui
    // Para simplificar, vamos assumir a ação direta ou implementar um Alert nativo
    try {
      await usuarioService.delete(id);
      showStatus(
        'success',
        'Usuário removido com sucesso!',
      );
      loadUsuarios();
    } catch (error) {
      showStatus('error', 'Erro ao remover usuário.');
    }
  };

  const handleSave = async () => {
    if (!formNome || !formEmail) {
      showStatus('error', 'Preencha nome e e-mail.');
      return;
    }

    if (!isEditing && !formSenha) {
      showStatus(
        'error',
        'Senha é obrigatória para novos usuários.',
      );
      return;
    }

    if (formSenha && formSenha !== formSenhaConfirm) {
      showStatus('error', 'As senhas não coincidem.');
      return;
    }

    setSaving(true);
    try {
      const data: any = {
        nome: formNome,
        email: formEmail,
        perfil: formPerfil,
      };

      if (formSenha) {
        data.senha = formSenha;
      }

      if (isEditing) {
        await usuarioService.update(formId, data);
        showStatus(
          'success',
          'Usuário atualizado com sucesso!',
        );
      } else {
        await usuarioService.create(data);
        showStatus(
          'success',
          'Usuário criado com sucesso!',
        );
      }

      setModalFormVisible(false);
      loadUsuarios();
    } catch (error) {
      console.error(error);
      showStatus('error', 'Erro ao salvar usuário.');
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }: { item: IUsuario }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {item.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.nome}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.badge,
                item.perfil === 'Administrador'
                  ? styles.badgeAdmin
                  : styles.badgeAluno,
              ]}
            >
              <Text style={styles.badgeText}>
                {item.perfil}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleOpenEdit(item)}
        >
          <Ionicons name="pencil" size={20} color={BLUE} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={RED}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={GREY_BG}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            Gerenciar Usuários
          </Text>
          <Text style={styles.headerSubtitle}>
            {usuarios.length} usuários cadastrados
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleOpenCreate}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BLUE} />
        </View>
      ) : (
        <FlatList
          data={filteredUsuarios}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhum usuário encontrado.
              </Text>
            </View>
          }
        />
      )}

      {/* Form Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFormVisible}
        onRequestClose={() => setModalFormVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios' ? 'padding' : 'height'
          }
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing
                  ? 'Editar Usuário'
                  : 'Novo Usuário'}
              </Text>
              <TouchableOpacity
                onPress={() => setModalFormVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={formNome}
                onChangeText={setFormNome}
                placeholder="Nome completo"
              />

              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={formEmail}
                onChangeText={setFormEmail}
                placeholder="email@exemplo.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Perfil</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formPerfil}
                  onValueChange={(itemValue) =>
                    setFormPerfil(itemValue)
                  }
                  style={styles.picker}
                >
                  <Picker.Item
                    label="Aluno"
                    value="Aluno"
                  />
                  <Picker.Item
                    label="Administrador"
                    value="Administrador"
                  />
                </Picker>
              </View>

              <Text style={styles.label}>
                {isEditing
                  ? 'Nova Senha (Opcional)'
                  : 'Senha'}
              </Text>
              <TextInput
                style={styles.input}
                value={formSenha}
                onChangeText={setFormSenha}
                secureTextEntry
                placeholder={
                  isEditing
                    ? 'Deixe em branco para manter'
                    : 'Senha'
                }
              />

              {(!!formSenha || !isEditing) && (
                <>
                  <Text style={styles.label}>
                    Confirmar Senha
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={formSenhaConfirm}
                    onChangeText={setFormSenhaConfirm}
                    secureTextEntry
                    placeholder="Confirme a senha"
                  />
                </>
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  saving && styles.disabledButton,
                ]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    Salvar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Status Modal */}
      <CustomStatusModal
        visible={statusModalVisible}
        type={statusType}
        message={statusMessage}
        onClose={() => setStatusModalVisible(false)}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: BLUE,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 50,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: BLUE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeAdmin: {
    backgroundColor: '#FFEBEE',
  },
  badgeAluno: {
    backgroundColor: '#E8F5E9',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    marginLeft: 10,
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  saveButton: {
    backgroundColor: BLUE,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: '#9FB3E0',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
