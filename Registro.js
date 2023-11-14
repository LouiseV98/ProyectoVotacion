import React, { Component, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Registro extends Component {
  constructor(props) {
    super(props);
    this.state = {
        date: new Date(),
        open: false,
        selectedDateText: 'Fecha de Nacimiento',
        isPasswordVisible: false,
        nombre:"",
        numeroid:"",
        direccion:"",
        telefono:"",
        correo:"",
        password:"",
    };
  }

  handleOpenDatePicker = () => {
    this.setState({ open: true });
  };

  handleDateChange = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Añade 1 ya que los meses comienzan en 0
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.setState({ date, open: false, selectedDateText: formattedDate });
  }

  render() {
    const cierraRegistro=() => {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            console.log(xhttp.responseText);
            if(xhttp.responseText === "1"){
                Alert.alert(
                    'Aviso',
                    'Se registró con éxito.',
                    [{
                        text: 'Aceptar',
                      },
                    ],
                    {
                      cancelable: true,
                    },
                  );
            }else{
                Alert.alert(
                    'Aviso',
                    'Error en el registro.',
                    [{
                        text: 'Aceptar',
                      },
                    ],
                    {
                      cancelable: true,
                    },
                  );
            }
        }
        };
        xhttp.open("GET", "https://proyectogcm.000webhostapp.com/ProyectoVotacion/datos.php?nombre="+this.state.nombre+"&numeroid="+this.state.numeroid+"&direccion="+this.state.direccion+"&telefono="+this.state.telefono+"&correo="+this.state.correo+"&password="+this.state.password, true);
        xhttp.send();
        this.props.navigation.navigate('Inicio')
    }
    return (
        <ImageBackground
        source={require('./Imagenes/fondo.png')} // Ruta a tu imagen en assets
        style={styles.background}
        >
            <View style={styles.container}>
                <Text style={{textAlign:"center", fontSize:40, marginBottom:30, color:"#ffffff"}}>Registro</Text>
                <View style={styles.loginBox}>
                    <View style={styles.inputContainer}>
                        <TextInput
                        style={styles.input}
                        placeholder="Nombre Completo"
                        onChangeText={nombre => this.setState({nombre})}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        placeholder="Numero de Identificación"
                        onChangeText={numeroid => this.setState({numeroid})}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                        style={styles.input}
                        placeholder="Domicilio"
                        onChangeText={direccion => this.setState({direccion})}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.input} onPress={this.handleOpenDatePicker}>{this.state.selectedDateText}</Text>
                            <DatePicker
                                modal
                                mode='date'
                                open={this.state.open}
                                date={this.state.date}
                                onConfirm={this.handleDateChange}
                                onCancel={() => {
                                this.setState({ open: false });
                                }}
                            />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                        style={styles.input}
                        keyboardType='numeric'
                        placeholder="Teléfono"
                        onChangeText={telefono => this.setState({telefono})}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        onChangeText={correo => this.setState({correo})}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            secureTextEntry={!this.state.isPasswordVisible}
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                        />
                        <TouchableOpacity
                            onPress={() => this.setState({ isPasswordVisible: !this.state.isPasswordVisible })}
                            style={styles.iconContainer}
                        >
                            <Icon name={this.state.isPasswordVisible ? 'eye' : 'eye-slash'} size={20} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={cierraRegistro}>
                        <Text style={styles.buttonText}>Registrarse</Text>
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
        marginBottom:50,
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
        height:45,
        flexDirection: 'row',
    },
    iconContainer: {
        backgroundColor: 'rgba(158, 75, 153, 255)',
        padding: 10,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
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
});