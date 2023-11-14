import React, { Component} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, ImageBackground, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CheckBox, Button } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

export default class Screen1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      currentIndex: 0, // Índice del acuerdo actual
      selectedOption: '', // Opción seleccionada (A favor, En contra, Abstención)
      isModalVisible: false,
    };
  }

  componentDidMount() {
    var xhttp = new XMLHttpRequest();
    _this=this;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         // Typical action to be performed when the document is ready:
         console.log(xhttp.responseText);
         var Temporal = JSON.parse(xhttp.responseText);
         _this.setState({dataSource:Temporal});
      }
    };
    xhttp.open("GET", "https://proyectogcm.000webhostapp.com/ProyectoVotacion/acuerdos1.json", true);
    xhttp.send();
  }

  showNextAgreement = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex + 1, 
    }));
  };

  showPreviousAgreement = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex - 1,
    }));
  };

  handleVote = (option) => {
    this.setState({ selectedOption: option });
  
    const voteRef = firestore().collection('votos').doc('DVRMlsWD7k0oMFw7OqcS');
  
    let updateVote = {};
  
    // Según la opción seleccionada, actualiza el campo correspondiente en Firestore
    if (option === 'A favor') {
      updateVote = { Favor: firestore.FieldValue.increment(1) };
    } else if (option === 'En contra') {
      updateVote = { Contra: firestore.FieldValue.increment(1) };
    } else if (option === 'Abstención') {
      updateVote = { Abstenerse: firestore.FieldValue.increment(1) };
    }
  
    // Actualiza el voto en Firestore
    voteRef.update(updateVote);
  };

  handleVoteConfirmation = () => {
    this.setState({ isModalVisible: true });
  };

  confirmVote = () => {
    this.setState({ confirmedVote: true });
    this.setState({ isModalVisible: false });

    // Enviar voto a la base de datos
    if (this.state.confirmedVote) {
      this.handleVote(this.state.selectedOption);
    }
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };
  

  render() {
    const { dataSource, currentIndex, selectedOption } = this.state;
    const currentAgreement = dataSource[currentIndex];
    const showNextButton = currentIndex < dataSource.length - 1;

    return (
      <ScrollView contentContainerStyle={styles.modalContainer}>
      <View style={styles.container}>
        <View>
          {currentAgreement && (
            <View>
              <Text style={{color:"#000000", fontSize:40, textAlign:"center"}}>{currentAgreement.numeroIdentificacion}</Text>
              <View style={{ width: "100%", height: 6, backgroundColor: "black", marginTop: 10, marginBottom:10}}></View>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>{currentAgreement.id}</Text>
                <Text style={styles.modalText}>{currentAgreement.numeroIdentificacion}</Text>
                <Text style={styles.modalText}>{currentAgreement.titulo}</Text>
                <Text style={styles.modalText}>{currentAgreement.descripcion}</Text>
                <Text style={styles.modalText}>{currentAgreement.fechaCreacion}</Text>
                <Text style={styles.modalText}>{currentAgreement.partesInvolucradas}</Text>
                <Text style={styles.modalText}>{currentAgreement.firmaUsuario}</Text>
                <Text style={styles.modalText}>{currentAgreement.firmaEmpresa}</Text>
                <Text style={styles.modalText}>{currentAgreement.clausulas}</Text>
                <Text style={styles.modalText}>{currentAgreement.tipoAcuerdo}</Text>
                <Text style={styles.modalText}>{currentAgreement.jurisdiccion}</Text>
                <Text style={styles.modalText}>{currentAgreement.leyAplicable}</Text>
                <Text style={styles.modalText}>{currentAgreement.notas}</Text>
              </View>
            </View>
          )}
          {/*<View style={styles.iconContainer}>
            {showPreviousButton && (
                <TouchableOpacity onPress={this.showPreviousAgreement}>
                <Icon name='arrow-back-outline' color={"black"} size={50} />
                </TouchableOpacity>
            )}
            </View>*/}
            {/* Agregar las opciones de checklist */}
          <CheckBox
            title="A favor"
            checked={selectedOption === 'A favor'}
            onPress={() => this.setState({ selectedOption: 'A favor' }, this.handleVoteConfirmation)}
            size={30}
          />
          <CheckBox
            title="En contra"
            checked={selectedOption === 'En contra'}
            onPress={() => this.setState({ selectedOption: 'En contra' }, this.handleVoteConfirmation)}
            size={30}
          />
          <CheckBox
            title="Abstención"
            checked={selectedOption === 'Abstención'}
            onPress={() => this.setState({ selectedOption: 'Abstención' }, this.handleVoteConfirmation)}
            size={30}
          />
          <View style={{alignItems:"center", marginTop:40}}>
            {showNextButton && (
                <TouchableOpacity style={styles.button} onPress={this.showNextAgreement}>
                  <Text style={{alignContent:"center", fontSize:20, color:"#ffffff"}}>Siguiente</Text>
                </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      <Modal
            visible={this.state.isModalVisible}
            animationType="slide"
            transparent={true}
          >
          <View style={styles.centeredModal}>
            <View style={styles.modalContainer2}>
              <Text style={{color:"#ffffff", fontSize:15}}>¿Está seguro de su selección?</Text>
              <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={this.confirmVote}>
                <Text style={{color:"#ffffff", fontSize:20, fontWeight:"bold"}}>Ok</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })}>
                <Text style={{color:"#ffffff", fontSize:20, fontWeight:"bold"}}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            </View>
            </View>
          </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Opciones: 'cover', 'contain', 'stretch', etc.
  },
  container: {
    flex: 1,
    padding: 5,
  },
  texto: {
    color: "#ffffff",
    textAlign: "center",
    fontFamily:"Roboto",
    fontSize: 20,
  },
  iconContainer: {
    flexDirection: 'row', // Alinea los iconos en la misma fila
    justifyContent: 'space-between', // Alinea uno a la izquierda y otro a la derecha
    alignItems: 'center', // Alinea verticalmente al centro
    paddingHorizontal: 10, // Espacio entre los iconos
    marginBottom:5
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  modalContainer2: {
    backgroundColor: 'rgba(158,75,153,255)',
    
    padding: 20,
    borderRadius:30,
  },
  centeredModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    color: "black",
    fontSize: 16,
    marginBottom: 10,
    textAlign:"justify",
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: 'rgba(184,23,91,255)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
});
