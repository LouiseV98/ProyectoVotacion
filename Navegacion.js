import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import INICIO from "./Inicio";
import SCREEN1 from "./Screen1";
import REGISTRO from "./Registro";
import RESULTADOS from "./Resultados"

export default class Navegacion extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Inicio" component={INICIO} options={{headerShown:false}}/>
          <Stack.Screen name="Screen1" component={SCREEN1} options={{headerShown:false}}/>
          <Stack.Screen name="Registro" component={REGISTRO} options={{headerShown:false}}/>
          <Stack.Screen name="Resultados" component={RESULTADOS} options={{headerShown:false}}/>
          </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
