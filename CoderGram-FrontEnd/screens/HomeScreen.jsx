import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
    const { logout } = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to CoderGram</Text>
            <Text style={styles.subtitle}>Feed content will appear here.</Text>
            <TouchableOpacity style={styles.button} onPress={() => logout()}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#aaa',
        marginBottom: 40,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#C70039',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
