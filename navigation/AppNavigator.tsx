import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import DataEntryScreen from '../screens/DataEntryScreen';
import RiskVisualizationScreen from '../screens/RiskVisualizationScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MitigationActionsScreen from '../screens/MitigationActionsScreen';
import { MonitoringData } from '../types/common';

export type RootStackParamList = {
    Welcome: undefined;
    DataEntry: undefined;
    RiskVisualization: { data?: MonitoringData } | undefined;
    MitigationActions: { data?: MonitoringData } | undefined;
    History: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DataEntry"
                component={DataEntryScreen}
                options={{ title: 'Inserção de Dados', headerBackTitleVisible: false }}
            />
            <Stack.Screen
                name="RiskVisualization"
                component={RiskVisualizationScreen}
                options={({ route }) => ({
                        title: route.params?.data ? 'Análise do Registro' : 'Visualização de Riscos',
                        headerBackTitleVisible: false
                })}
            />
            <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{ title: 'Histórico de Monitoramento', headerBackTitleVisible: false }}
            />
            <Stack.Screen
                name="MitigationActions"
                component={MitigationActionsScreen}
                options={({ route }) => ({
                        title: route.params?.data ? 'Ações para Registro' : 'Ações de Mitigação',
                        headerBackTitleVisible: false
                })}
            />
        </Stack.Navigator>
    );
}

export default AppNavigator;
