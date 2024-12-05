import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, StatusBar } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#202124" />
      {/* App Title */}
      <Text style={styles.appTitle}>PYMETHEUS</Text>


      {/* Aesthetic button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Camera')}
      >
        <Text style={styles.buttonText}>SOLVE</Text>
      </TouchableOpacity>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202124', // Dark background color
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  appTitle: {
    color: '#ea80fc',
    fontSize: 32,
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },

  button: {
    backgroundColor: '#ea80fc', // Vibrant button color
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25, // Rounded corners
    borderWidth: 0,
    shadowColor: "#000", // Shadow for depth
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFF', // Text color that contrasts with the button
    fontSize: 20, // Larger font size
    fontFamily: 'Avenir', // Stylish font family
    textTransform: 'uppercase', // UPPERCASE letters for emphasis
    fontWeight: 'bold', // Bold font weight
  },
});

export default HomeScreen;
