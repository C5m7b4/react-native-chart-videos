import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import BoxPlot from '../components/Boxplot';
import {boxData} from '../data';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const BoxPlots = () => {
  return (
    <View style={styles.container}>
      <Text>Box Plots</Text>
      <BoxPlot
        onPressItem={item => console.log(item)}
        data={boxData}
        x_key={'datename'}
        y_key={'voids'}
        height={300}
        width={SCREEN_WIDTH - 50}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BoxPlots;
