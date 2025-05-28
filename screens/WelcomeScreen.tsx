import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Ionicons from '@expo/vector-icons/Ionicons';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
    navigation: WelcomeScreenNavigationProp;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
    const handleStart = () => {
        navigation.navigate('DataEntry');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="leaf-outline" size={120} color="#4682B4" style={styles.icon} />
                <Text style={styles.title}>Ambientalize-se</Text>
                <Text style={styles.subtitle}>Monitore riscos de deslizamentos e proteja sua comunidade.</Text>
                <TouchableOpacity style={styles.button} onPress={handleStart}>
                    <Text style={styles.buttonText}>Começar Agora</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F8FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 25,
    },
    icon: {
        marginBottom: 40,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#34628C',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        color: '#4F4F4F',
        textAlign: 'center',
        lineHeight: 28,
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#4682B4',
        paddingVertical: 18,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
