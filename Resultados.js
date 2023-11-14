import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default class Resultados extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultados: [],
      dataSource: [],
      currentIndex: 0, // Índice del acuerdo actual
    };
  }

  componentDidMount() {
    // Carga de datos desde el archivo JSON
    var xhttp = new XMLHttpRequest();
    _this=this;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         console.log(xhttp.responseText);
         var Temporal = JSON.parse(xhttp.responseText);
         _this.setState({dataSource: Temporal});
      }
    };
    xhttp.open("GET", "https://proyectogcm.000webhostapp.com/ProyectoVotacion/acuerdos1.json", true);
    xhttp.send();

    // Suscripción a la colección de Firestore
    this.unsubscribe = firestore()
      .collection('votos')
      .onSnapshot(this.onCollectionUpdate);
  }

  onCollectionUpdate = (querySnapshot) => {
    const resultados = [];
    querySnapshot.forEach((doc) => {
      const { Favor, Contra, Abstenerse } = doc.data();
      resultados.push({ Favor, Contra, Abstenerse, id: doc.id }); // Agregamos el id del documento
    });
    this.setState({ resultados });
  };

  componentWillUnmount() {
    // Desuscribirse para evitar pérdida de memoria
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  resetearValores = () => {
    // Actualizar los valores en la base de datos y reiniciar en el estado local
    const batch = firestore().batch();

    this.state.resultados.forEach((resultado) => {
      const { id } = resultado;
      batch.update(firestore().collection('votos').doc(id), {
        Favor: 0,
        Contra: 0,
        Abstenerse: 0,
      });
    });

    batch.commit().then(() => {
      // Después de la actualización exitosa en la base de datos, actualiza el estado local
      this.setState({
        resultados: this.state.resultados.map((resultado) => ({
          ...resultado,
          Favor: 0,
          Contra: 0,
          Abstenerse: 0,
        })),
      });
    });
  };

  showNextAgreement = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex + 1, 
    }));
  };

  render() {
    const { dataSource, currentIndex, selectedOption } = this.state;
    const currentAgreement = dataSource[currentIndex];
    const showNextButton = currentIndex < dataSource.length - 1;

    return (
    <ImageBackground
    source={require('./Imagenes/fondo.png')} // Ruta a tu imagen en assets
    style={styles.background}
    >
      <ScrollView style={styles.modalContainer}>
        <View style={styles.container}>
          <View>
            {currentAgreement && (
              <View>
                <Text style={{color:"#ffffff", fontSize:40, textAlign:"center"}}>{currentAgreement.numeroIdentificacion}</Text>
                <View style={{ width: "100%", height: 6, backgroundColor: "black", marginTop: 10, marginBottom:10}}></View>
              </View>
            )}
          </View>
      
          <Text style={{ color: '#ffffff', textAlign:"center", fontSize:20}}>Resultados</Text>
          {this.state.resultados.map((resultado, index) => (
            <View key={index}>
              <Text style={{ color: "#ffffff", textAlign:"center", fontSize:20}}>{`Favor: ${resultado.Favor}`}</Text>
              <Text style={{ color: "#ffffff", textAlign:"center", fontSize:20 }}>{`Contra: ${resultado.Contra}`}</Text>
              <Text style={{ color: "#ffffff", textAlign:"center", fontSize:20 }}>{`Abstenerse: ${resultado.Abstenerse}`}</Text>
            </View>
          ))}
          <View style={{alignItems:"center", marginTop:30}}>
            {showNextButton && (
              <TouchableOpacity style={styles.button} onPress={() => { this.resetearValores(); this.showNextAgreement();}}>
                <Text style={{alignContent:"center", fontSize:20, color:"#ffffff"}}>Siguiente</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', // Opciones: 'cover', 'contain', 'stretch', etc.
      },
      container: {
        height: "100%",
        width: "100%",
      },
      texto: {
        color: "#ffffff",
        textAlign: "center",
        fontFamily:"Roboto",
        fontSize: 20,
      },
      modalContainer: {
        padding: 20,
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