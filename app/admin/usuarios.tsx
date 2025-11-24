import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { errorSwal } from "../../services/api.service";
import { IUsuario, IUsuarioForm } from "../../types/usuario.type";
import { UsuarioService } from "../../services/usuario.service";
import { Swal, Toast } from "../../components/swal.shared";
import { useTheme } from "@react-navigation/native";
import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

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
  const theme = useTheme();

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
      <View style={styles.table}>
        <Text style={styles.tableCell}>Nome</Text>
        <Text style={styles.tableCell}>E-mail</Text>
        <Text style={styles.tableCell}>Perfil</Text>
        <Text style={styles.tableCell}></Text>
        <Text style={styles.tableCell}></Text>
        {usuarios.map((usuario, index) => (
          <Fragment key={index}>
            <Text style={styles.tableCell}>{usuario.nome}</Text>
            <Text style={styles.tableCell}>{usuario.email}</Text>
            <Text style={styles.tableCell}>{usuario.perfil}</Text>
            <Text style={styles.tableCell}>
              <TouchableOpacity onPress={() => openModal(usuario?.id)}>
                {/* <PencilIcon size={20} /> */}
                <Text>Edit</Text>
              </TouchableOpacity>
            </Text>
            <Text style={styles.tableCell}>
              <TouchableOpacity
                onPress={() => {
                  deletar(usuario?.id);
                }}
              >
                {/* <TrashIcon size={20} /> */}
                <Text>Delete</Text>
              </TouchableOpacity>
            </Text>
          </Fragment>
        ))}
        {/* <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario, index) => (
              <tr key={index}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.perfil}</td>
                <td>
                  <button onClick={() => openModal(usuario?.id)}></button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      deletar(usuario?.id);
                    }}
                  ></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
      </View>
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
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tableCell: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: `${100 / 5}%`,
  },
});
