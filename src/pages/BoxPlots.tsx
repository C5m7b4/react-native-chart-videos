import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import BoxPlot from '../components/Boxplot';
import {boxData} from '../data';
import {IQR, mean, quartile} from '../components/Boxplot/math';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface IData {
  datename: string;
  cashier: number;
  voids: number;
}

interface IResult {
  cashier: number;
  cnt: number;
}

const BoxPlots = () => {
  const unique = (d: IData[]) => {
    const x_key = 'cashier';
    const newArray: number[] = [];
    d.forEach(r => {
      if (!newArray.includes(r[x_key])) {
        if (typeof r[x_key] !== 'undefined' && r[x_key] != null) {
          newArray.push(r[x_key]);
        }
      }
    });
    return newArray;
  };

  const count = (data: IData[], key: number) =>
    data.filter(c => c.cashier === key);

  const transactions = (data: IData[]) => {
    const newArray: number[] = [];
    const uniques = unique(data);
    uniques.map(c => {
      newArray.push(count(data, c).length);
    });
    return newArray;
  };

  const predicate = (data: IData[]) => {
    const uniques = unique(data);
    const transCounts = transactions(data);
    // console.log('transCounts', transCounts);
    // const avg = mean(transCounts);
    // console.log('avg', Math.floor(avg));
    const results: IResult[] = [];
    const q3 = quartile(transCounts, 0.75);
    // console.log('q3', q3);
    const iqr = IQR(transCounts);
    // console.log('iqr', iqr);
    uniques.map(c => {
      const cnt = count(data, c);
      // console.log('cnt', cnt.length);
      if (cnt.length > q3 + 1.5 * iqr) {
        results.push({cashier: c, cnt: cnt.length});
      }
    });
    console.log('returning', results);
    return results;
  };
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
        predicate={predicate}
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
