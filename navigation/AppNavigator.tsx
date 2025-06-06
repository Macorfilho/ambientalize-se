import React from 'react'; 
import { createStackNavigator } from '@react-navigation/stack';
import { Text, StyleSheet } from 'react-native'; 
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
                options={{
                    headerTitle: () => <Text style={styles.headerTitle}>Inserção de Dados</Text>,
                    headerBackTitleVisible: false
                }}
            />
            <Stack.Screen
                name="RiskVisualization"
                component={RiskVisualizationScreen}
                options={({ route }) => ({
                        headerTitle: () => (
                            <Text style={styles.headerTitle}>
                                {route.params?.data ? 'Análise do Registro' : 'Visualização de Riscos'}
                            </Text>
                        ),
                        headerBackTitleVisible: false
                })}
            />
            <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    headerTitle: () => <Text style={styles.headerTitle}>Histórico de Monitoramento</Text>,
                    headerBackTitleVisible: false
                }}
            />
            <Stack.Screen
                name="MitigationActions"
                component={MitigationActionsScreen}
                options={({ route }) => ({
                        headerTitle: () => (
                            <Text style={styles.headerTitle}>
                                {route.params?.data ? 'Ações para Registro' : 'Ações de Mitigação'}
                            </Text>
                        ),
                        headerBackTitleVisible: false
                })}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 18, 
        color: '#2F4F4F',
    },
});

export default AppNavigator;