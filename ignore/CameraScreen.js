import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const CameraScreen = () => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photoUri, setPhotoUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    Alert.alert("No Access", "No access to camera");
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setPhotoUri(data.uri); // Save the photo URI to state
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to take picture.");
      }
    }
  };

  const retakePicture = () => {
    setPhotoUri(null); // Reset the photo URI, allowing the user to take another picture
  };

  const handleUsePicture = () => {
    // Pass the photo URI as an image message
    navigation.navigate('Chat', { message: { id: Date.now().toString(), type: 'image', content: photoUri } });
  };

  return (
    <View style={{ flex: 1 }}>
      {photoUri ? (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: photoUri }} style={{ flex: 1 }} />
          <View style={styles.previewButtonContainer}>
            <TouchableOpacity onPress={retakePicture} style={styles.button}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUsePicture} style={styles.button}>
              <Text style={styles.buttonText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.button}>
              <Text style={styles.buttonText}>SNAP</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
};

  const styles = StyleSheet.create({
    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
      justifyContent: 'space-between',
    },
    previewButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'transparent',
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },
    button: {
      flex: 0,
      alignSelf: 'flex-end',
      alignItems: 'center',
      backgroundColor: '#202124',
      padding: 15,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 14,
      color: '#ea80fc',
    },
  });
  
  export default CameraScreen;