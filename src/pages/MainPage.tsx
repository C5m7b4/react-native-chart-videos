import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {newShade} from '../utils';

const MainPage = () => {
  const [color, setColor] = useState('#ff0000');

  const box = {
    backgroundColor: color,
    borderRadius: 8,
    elevation: 5,
    width: 100,
    height: 100,
    marginBottom: 10,
  };

  const handlePress = () => {
    const newColor = newShade(color, 50);
    setColor(newColor);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Main Page</Text>
      <View style={box}>
        <Text>&nbsp;</Text>
      </View>
      <TextInput value={color} onChangeText={setColor} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Go</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    fontSize: 22,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 25,
    width: '100%',
    textAlign: 'center',
  },
});

export default MainPage;
