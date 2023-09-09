import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LineChart from '../components/LineChart';
import Barchart from '../components/BarChart';
import {testData} from '../data';

const LineCharts = () => {
  return (
    <View style={styles.container}>
      <Text>Line Charts</Text>
      <LineChart
        data={testData}
        onPressItem={item => console.log(item)}
        x_key="month"
        y_key="value"
        backgroundColor={'transparent'}
        svgBackgroundColor={'transparent'}
        useGradientBackground={true}
        gradient_background_config={{
          stop1: {
            offset: 0,
            stopColor: '#6491d9',
            stopOpacity: 0.4,
          },
          stop2: {
            offset: 1,
            stopColor: '#35578f',
            stopOpacity: 0.8,
          },
        }}
      />
      <Barchart
        onPressItem={item => console.log(item)}
        data={testData}
        x_key="month"
        y_key="value"
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

export default LineCharts;
