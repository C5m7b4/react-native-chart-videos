import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';

import MainPage from './src/pages/MainPage';
import LineCharts from './src/pages/LineCharts';
import BoxPlots from './src/pages/BoxPlots';

const Page2 = () => {
  return (
    <View style={styles.container}>
      <Text>Page2</Text>
    </View>
  );
};

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={MainPage} />
        <Drawer.Screen name="Page2" component={Page2} />
        <Drawer.Screen name="LineCharts" component={LineCharts} />
        <Drawer.Screen name="BoxPlots" component={BoxPlots} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
