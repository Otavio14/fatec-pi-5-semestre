import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Cell, Row, Table, TableWrapper } from "react-native-table-component";
import { Swal, Toast } from "../../components/swal.shared";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";
import { IconSymbol } from "../../components/ui/icon-symbol";
import { Colors } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme.web";
import { errorSwal } from "../../services/api.service";
import { UsuarioService } from "../../services/usuario.service";
import { IUsuario, IUsuarioForm } from "../../types/usuario.type";

export default function AdminUsuariosScreen() {
  const [usuarios, setUsuarios] = useState<Array<IUsuario>>([]);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [id, setId] = useState(0);
  const [form, setForm] = useState<IUsuarioForm>({
    email: "",
    id: 0,
    nome: "",
    perfil: "",
    senha: "",
    senhaConfirmacao: "",
  });
  // const theme = useTheme();
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? "light"].tint;

  const usuarioService = useMemo(() => new UsuarioService(), []);
  const DialogRef = useRef<HTMLDialogElement>(null);

  const openModal = (id: number) => {
    setId(id);

    usuarioService
      .findOne(id)
      .then(({ data: { dados } }) => {
        setShowModal(true);
        setForm({ ...dados, senhaConfirmacao: "", senha: "" });
      })
      .catch(errorSwal);
  };

  const deletar = (id: number) => {
    Swal.fire({
      title: "Deseja deletar este usuário?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    }).then(({ isConfirmed }) => {
      if (isConfirmed)
        usuarioService
          .delete(id)
          .then(({ data: { icone, mensagem, titulo } }) => {
            setReload((r) => !r);
            Toast.fire({
              title: titulo,
              text: mensagem,
              icon: icone,
            });
          })
          .catch(errorSwal);
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setId(0);
    setForm({
      email: "",
      id: 0,
      nome: "",
      perfil: "",
      senha: "",
      senhaConfirmacao: "",
    });
  };

  const salvar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.senha !== form.senhaConfirmacao) {
      Swal.fire({
        title: "Aviso!",
        text: "As senhas não coincidem.",
        icon: "warning",
      });
      return;
    }

    const data = {
      email: form.email,
      nome: form.nome,
      perfil: form.perfil || "Aluno",
      senha: form.senha,
    };

    if (id) {
      usuarioService
        .update(id, data)
        .then(({ data: { icone, mensagem, titulo } }) => {
          closeModal();
          setReload((r) => !r);
          Toast.fire({
            title: titulo,
            text: mensagem,
            icon: icone,
          });
        });
    } else {
      usuarioService
        .create(data)
        .then(({ data: { icone, mensagem, titulo } }) => {
          closeModal();
          setReload((r) => !r);
          Toast.fire({
            title: titulo,
            text: mensagem,
            icon: icone,
          });
        });
    }
  };

  useEffect(() => {
    if (showModal && !DialogRef?.current?.hasAttribute("open"))
      DialogRef?.current?.showModal();
    else DialogRef?.current?.close();
  }, [showModal]);

  useEffect(() => {
    usuarioService
      .findAll()
      .then(({ data: { dados } }) => {
        setUsuarios(dados);
      })
      .catch(errorSwal);
  }, [usuarioService, reload]);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Usuários</ThemedText>
        <input
          type="search"
          style={styles.headerSearch}
          placeholder="Pesquisar"
        />
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowModal(true)}
        >
          Adicionar
        </TouchableOpacity>
      </View>
      <Table
        style={styles.table}
        borderStyle={{
          borderWidth: 1,
          borderColor: "#fff",
          borderRadius: 16,
        }}
      >
        <Row
          data={["Nome", "E-mail", "Perfil", "", ""]}
          textStyle={styles.tableCell}
        />
        {usuarios.map((usuario, index) => (
          <TableWrapper key={index} style={styles.tableRow}>
            <Cell textStyle={styles.tableCell} data={usuario["nome"]} />
            <Cell textStyle={styles.tableCell} data={usuario["email"]} />
            <Cell textStyle={styles.tableCell} data={usuario["perfil"]} />
            <Cell
              textStyle={styles.tableCellIcon}
              data={
                <TouchableOpacity
                  onPress={() => openModal(usuario.id)}
                  key={index}
                >
                  <IconSymbol size={20} name="pencil" color={iconColor} />
                </TouchableOpacity>
              }
            />
            <Cell
              textStyle={styles.tableCellIcon}
              data={
                <TouchableOpacity
                  onPress={() => openModal(usuario.id)}
                  key={index}
                >
                  <IconSymbol size={20} name="trash" color={iconColor} />
                </TouchableOpacity>
              }
            />
          </TableWrapper>
        ))}
      </Table>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 16,
    width: "100%",
    height: "100%",
  },
  header: {
    display: "flex",
    gap: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  headerTitle: {
    padding: 16,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    width: "100%",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: 700,
  },
  headerSearch: {
    padding: 8,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  headerButton: {
    display: "flex",
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    width: "auto",
    height: "auto",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#52627c",
    borderWidth: 0,
  },
  table: {
    backgroundColor: "#c3cfe2",
  },
  tableCell: {
    margin: 8,
  },
  tableCellIcon: {
    margin: 8,
    textAlign: "center",
    width: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
});
