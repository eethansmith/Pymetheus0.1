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

//   useEffect(() => {
//     if (Platform.OS === 'android') {
//       requestCameraPermission();
//     }
//     // Set a timeout to navigate if the camera isn't ready
//     const cameraTimeout = setTimeout(() => {
//       if (!cameraReady) {
//         Alert.alert("Camera Error", "Camera initialisation taking too long.");
//         navigation.navigate('Chat');
//       }
//     }, 5000); // 10 seconds timeout

//     return () => clearTimeout(cameraTimeout);
//   }, [cameraReady]);

//   const requestCameraPermission = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: "Camera Permission",
//           message: "This app needs access to your camera",
//           buttonNeutral: "Ask Me Later",
//           buttonNegative: "Cancel",
//           buttonPositive: "OK"
//         }
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("Camera permission denied");
//         navigation.navigate('ChatScreen');
//       }
//     } catch (err) {
//       console.warn(err);
//       navigation.navigate('ChatScreen');
//     }
//   };

//   const onCameraReady = () => {
//     setCameraReady(true); // Camera is ready
//   };

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const options = { quality: 0.5, base64: true };
//       try {
//         const data = await cameraRef.current.takePictureAsync(options);
//         console.log(data.uri);
//         setTakenPhotoUri(data.uri); // Save the taken photo's URI
//       } catch (error) {
//         console.error(error);
//         Alert.alert("Error", "Failed to take picture.");
//       }
//     }
//   };

//   const handleUsePicture = () => {
//     navigation.navigate('ChatScreen', { photoUri: takenPhotoUri });
//   };

//   // Function to reset the taken photo URI and return to camera view
//   const retakePicture = () => {
//     setTakenPhotoUri(null);
//   };

//   // Include onCameraReady prop in RNCamera
//   return (
//     <View style={{ flex: 1 }}>
//       <RNCamera
//         ref={cameraRef}
//         style={{ flex: 1 }}
//         type={RNCamera.Constants.Type.back}
//         autoFocus={RNCamera.Constants.AutoFocus.on}
//         onCameraReady={onCameraReady}
//         onStatusChange={({ cameraStatus }) => {
//           if (cameraStatus !== 'READY') {
//             Alert.alert("Camera Error", "There was an issue with the camera.");
//             navigation.navigate('ChatScreen');
//           }
//         }}
//       >
//         <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
//           <TouchableOpacity onPress={takePicture} style={styles.button}>
//             <Text style={styles.buttonText}>SNAP</Text>
//           </TouchableOpacity>
//         </View>
//       </RNCamera>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     backgroundColor: '#202124',
//     padding: 15,
//     paddingHorizontal: 20,
//     alignSelf: 'center',
//     margin: 20,
//     borderRadius: 5,
//   },
//   buttonText: {
//     fontSize: 14,
//     color: '#ea80fc',
//   }
// });

// export default CameraScreen;