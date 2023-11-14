import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Inicio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      
    };
  }

  handleEmailChange = (text) => {
    this.setState({ email: text });
  };

  handlePasswordChange = (text) => {
    this.setState({ password: text });
  };

  procesarRespuesta = (respuesta) => {
    // Realiza las acciones necesarias según la respuesta
    if (respuesta === "admin") {
      this.props.navigation.navigate("Resultados", { nombre: respuesta });
    } else if (respuesta === "user") {
      this.props.navigation.navigate("Screen1", { nombre: respuesta });
    } else {
      // Otras acciones según la respuesta
    }
  };

  render() {
    const ir_a_datos = () => {
      this.setState({ modalVentanaCorreo: false });
      const self = this;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          // Typical action to be performed when the document is ready:
          console.log(xhttp.responseText);
          if (xhttp.responseText === "3") {
            Alert.alert(
              'Aviso',
              'Correo no registrado.',
              [{
                  text: 'Aceptar',
                },
              ],
              {
                cancelable: true,
              },
            );
          } else {
            if (xhttp.responseText === "0") {
              Alert.alert(
                'Aviso',
                'Contraseña incorrecta, vuelve a intentar.',
                [{
                    text: 'Aceptar',
                  },
                ],
                {
                  cancelable: true,
                },
              );
            } else {
              // Redirigir a la pantalla según la respuesta
              self.procesarRespuesta(xhttp.responseText);
            }
          }
        }
      };
      xhttp.open("GET", "https://proyectogcm.000webhostapp.com/ProyectoVotacion/verifica.php?correo=" + this.state.email + "&password=" + this.state.password, true);
      xhttp.send();
      
    };
    
    
    return (
      <ImageBackground
        source={require('./Imagenes/fondo.png')} // Ruta a tu imagen en assets
        style={styles.background}
      >
        <View style={styles.container}>
          <View style={styles.loginBox}>
            <Image style={styles.imagen} source={require("./Imagenes/login.png")} />
            <Text style={{ fontSize: 25, marginBottom: 20, fontWeight: "bold", color: "#ffffff" }}> Bienvenido</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={this.state.email}
                onChangeText={this.handleEmailChange}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry={!this.state.isPasswordVisible}
                value={this.state.password}
                onChangeText={this.handlePasswordChange}
              />
              <TouchableOpacity
                onPress={() => this.setState({ isPasswordVisible: !this.state.isPasswordVisible })}
                style={styles.iconContainer}
              >
                <Icon name={this.state.isPasswordVisible ? 'eye' : 'eye-slash'} size={20} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={ir_a_datos}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover', // Opciones: 'cover', 'contain', 'stretch', etc.
  },
  loginBox: {
    backgroundColor: 'rgba(158,75,153,255)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 15, // Esto funciona en Android
    shadowColor: 'rgba(0, 0, 0, 0.9)', // Color de sombra más oscuro
    shadowOffset: { width: 0, height: 5 }, // Desplazamiento de la sombra
    shadowOpacity: 1, // Opacidad de la sombra
    shadowRadius: 5, // Radio de la sombra
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(158,75,153,255)',
    marginBottom: 20,
    padding: 10,
    borderRadius: 20,
    borderColor: '#ffffff',
    flex: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1, // Ancho del borde
    borderColor: 'white', // Color del borde
    borderRadius: 20,
    height: 45,
    flexDirection: 'row',
  },
  button: {
    width: '80%',
    height: 40,
    backgroundColor: 'rgba(184,23,91,255)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  imagen: {
    marginBottom: 10
  },
  iconContainer: {
    backgroundColor: 'rgba(158, 75, 153, 255)',
    padding: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});
