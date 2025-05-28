// App.tsx
import 'react-native-gesture-handler'; // Importante para o React Navigation, deve ser a primeira linha
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator'; // Importa o seu navegador

export default function App() {
  return (
    // NavigationContainer é o componente que gerencia o estado da navegação
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}