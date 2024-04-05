import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, FlatList, Image } from 'react-native';
import { interpretAndSolveProgrammingProblem } from './gptApiCall';

import { Asset } from 'expo-asset';

import * as FileSystem from 'expo-file-system';

function ChatScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [typingAnimationText, setTypingAnimationText] = useState("");
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const imagePath = route.params.imagePath;

  useEffect(() => {
    if (route.params?.message) {
      setMessages(previousMessages => [route.params.message, ...previousMessages]);
    }
  }, [route.params?.message]);

  const renderMessageItem = ({item}) => {
    if (item.type === 'image') {
      // Check if we haven't started the typing animation yet
      if (!hasStartedTyping) {
        startBotTypingAnimation();
        setHasStartedTyping(true); // Prevent future triggers for this image
      }
  
      return (
        <View style={styles.imageMessageBubble}>
          <Image source={{ uri: item.content }} style={styles.messageImage} />
        </View>
      );
    } else {
      const isUserMessage = item.sender === 'user';
      return (
        <View style={[
          isUserMessage ? styles.userMessageBubble : styles.botMessageBubble,
          { alignSelf: isUserMessage ? 'flex-start' : 'flex-end' }
        ]}>
          <Text style={isUserMessage ? styles.userMessageText : styles.botMessageText}>{item.text}</Text>
        </View>
      );
    }
  };

  const startBotTypingAnimation = async () => {
  setIsBotTyping(true);
  const animationFrames = ["● ○ ○", "○ ● ○", "○ ○ ●"];
  let currentFrame = 0;

  // Start typing animation
  const animationInterval = setInterval(() => {
    setTypingAnimationText(animationFrames[currentFrame]);
    currentFrame = (currentFrame + 1) % animationFrames.length;
  }, 400);

  // Fetch GPT response
  try {
    // This converts your local image asset to a file URI that can be read
    const asset = Asset.fromModule(require('IMG_4823.jpeg'));
    await asset.downloadAsync(); // This ensures the asset is downloaded to the device
    const imageBase64 = await FileSystem.readAsStringAsync(asset.localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const botResponse = await interpretAndSolveProgrammingProblem(imageBase64);
    clearInterval(animationInterval);
    setTypingAnimationText("");
    setIsBotTyping(false);
    addBotMessage(botResponse);
  } catch (error) {
    console.error("Failed to fetch GPT response", error);
    clearInterval(animationInterval);
    setTypingAnimationText("");
    setIsBotTyping(false);
    addBotMessage("Sorry, I couldn't process that.");
  }
};

const addBotMessage = (text) => {
  const botMessage = { id: `bot_${Date.now()}`, text, sender: 'bot', type: 'text' }; // Ensure unique ID and type 'text'
  setMessages(previousMessages => [botMessage, ...previousMessages]);
};


  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
      keyboardVerticalOffset={Platform.select({ios: 60, android: 500})}
    >
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        inverted
      />

      {isBotTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>{typingAnimationText}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202124',
  },
  userMessageBubble: {
    backgroundColor: '#333',
    padding: 10,
    margin: 5,
    borderRadius: 15,
    maxWidth: '80%',
    alignSelf: 'flex-start', 
  },
  userMessageText: {
    color: '#fff',
    fontSize: 16,
  },

  imageMessageBubble: {
    alignSelf: 'flex-start', // or 'flex-end' if it's from the bot
    margin: 5,
    borderRadius: 15,
    overflow: 'hidden', // This makes the borderRadius apply to the image as well
  },
  messageImage: {
    width: 150, // or any size you want
    height: 100, // or any size you want
    resizeMode: 'cover',
  },

  botMessageBubble: {
    backgroundColor: '#ea80fc', 
    padding: 10,
    margin: 5,
    borderRadius: 15,
    maxWidth: '80%',
    alignSelf: 'flex-start', 
  },
  botMessageText: { 
    color: '#202124',
    fontSize: 16,
  },
  typingIndicator: {
    padding: 10,
    
    backgroundColor: '#ea80fc', // Use a subtle color or animation
    margin: 5,
    borderRadius: 15,
    maxWidth: '80%',
    alignSelf: 'flex-end', // Or 'flex-end' depending on where you want it
  },
  typingText: {
    color: '#202124',
    fontSize: 16,
  },


  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  attachButton: {
    marginRight: 10,
    backgroundColor: '#ea80fc',
    borderRadius: 20,
    padding: 10,
  },
  attachButtonText: {
    color: '#202124',
    fontSize: 24,
    fontFamily: 'Avenir', // Ensure this font is available or choose another
  },
  textInput: {
    flex: 1,
    backgroundColor: '#444',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#ea80fc',
    borderRadius: 20,
    padding: 10,
  },
  sendButtonText: {
    color: '#202124',
    fontSize: 16,
    fontFamily: 'Avenir', // Ensure this font is available or choose another
  },
});

export default ChatScreen;