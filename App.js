import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';

export default function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    setChat(prev => [...prev, { from: 'user', text: message }]);

    try {
      const response = await fetch('http://192.168.56.23:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setChat(prev => [...prev, { from: 'user', text: message }, { from: 'bot', text: data.reply }]);
      setMessage('');
    } catch (error) {
      setChat(prev => [...prev, { from: 'bot', text: 'Error: Could not connect to server.' }]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatBox}>
        {chat.map((msg, index) => (
          <Text
            key={index}
            style={msg.from === 'user' ? styles.userText : styles.botText}>
            {msg.from === 'user' ? 'You: ' : 'Bot: '}
            {msg.text}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  chatBox: { flex: 1, marginBottom: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, padding: 10, marginRight: 10 },
  userText: { textAlign: 'right', marginVertical: 2, color: '#0066cc' },
  botText: { textAlign: 'left', marginVertical: 2, color: '#333' },
});
