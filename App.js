import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AudioList from './components/AudioList';
import themes from './style/themes';

export default function App() {
  return (
    <View style={styles.container} >
        <AudioList/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themes.BACKGROUND_COLOR,
  },
});
