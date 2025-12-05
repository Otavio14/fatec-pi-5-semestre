import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Importando as imagens estáticas
const successImage = require('../assets/images/houve-sucesso.png');
const errorImage = require('../assets/images/houve-erro.png');

interface CustomStatusModalProps {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export function CustomStatusModal({
  visible,
  type,
  message,
  onClose,
}: CustomStatusModalProps) {
  const imageSource =
    type === 'success' ? successImage : errorImage;
  const title =
    type === 'success' ? 'Sucesso!' : 'Algo deu errado...';
  const buttonColor =
    type === 'success' ? '#4A82F8' : '#FF6B6B';

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: buttonColor },
            ]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 15,
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    width: '100%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
