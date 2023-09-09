import React, {useState, useEffect} from 'react';
import {View, Dimensions} from 'react-native';
import Svg, {
  G,
  Circle,
  Rect,
  Line,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {quickSort} from '../../utils';
import {
  median,
  quartile,
  Outliers,
  IQR,
  maxWithoutOutliers,
  minWithoutOutliers,
} from './math';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const BoxPlot = ({
  data = [],
  x_key = '',
  y_key = '',
  onPressItem,
  height: containerHeight = 300,
  width: containerWidth = SCREEN_WIDTH - 50,
  backgroundColor = 'transparent',
  svgBackgroundColor = 'transparent',
  useGradientBackground = true,
  backgroundBorderRadius = 20,
  axisColor = '#000',
  axisCircleFillColor = '#000',
  axisCircleStrokeColor = 'red',
  axisStrokeWidth = 1,
  axisCircleRadius = 5,
  axisCircleOpacity = 0.7,
  barWidth = 20,
  gradient_background_config = {
    stop1: {
      offset: 0,
      stopColor: '#6491d9',
      stopOpacity: 0.3,
    },
    stop2: {
      offset: 1,
      stopColor: '#35578f',
      stopOpacity: 0.8,
    },
  },
  x_axis_config = {
    fontSize: 12,
    textAnchor: 'middle',
    fill: '#000',
    fontWeight: '400',
    rotation: 0,
  },
  y_axis_config = {
    fontSize: 12,
    textAnchor: 'end',
    fill: '#000',
    fontWeight: '400',
    rotation: 0,
  },
}) => {
  const [yAxisLabels, setYAxisLabels] = useState([]);
  const x_margin = 50;
  const y_margin = 50;

  useEffect(() => {
    const yKeys = data.map(item => item[y_key]);
    const yAxisData = quickSort(yKeys);
    setYAxisLabels(yAxisData);
  }, []);

  const unique = d => {
    const newArray = [];
    d.forEach(r => {
      if (!newArray.includes(r[x_key])) {
        if (typeof r[x_key] !== 'undefined' && r[x_key] != null) {
          newArray.push(r[x_key]);
        }
      }
    });
    return newArray;
  };

  const calculateWidth = () => {
    if (!data && data.length === 0) {
      return;
    }

    const uniques = unique(data);
    const chartWidth = containerWidth - x_margin * 2;
    const gap_betwen_ticks = chartWidth / (uniques.length / 2);
    return {
      chartWidth,
      gap_betwen_ticks,
    };
  };

  const calculateHeight = () => {
    const yMax = data.reduce((acc, cur) => {
      return acc > parseFloat(cur[y_key]) ? acc : parseFloat(cur[y_key]);
    }, 0);

    let min = 0;
    const actual_chart_height = containerHeight - y_margin * 2;
    const data_points = data.length - 1;
    const gap_between_ticks = actual_chart_height / data_points;
    const y_value_gap = (yMax - min) / data_points;
    return {yMax, min, gap_between_ticks, y_value_gap};
  };

  const render_background = () => {
    return (
      <G>
        <Rect
          x={0}
          y={0}
          rx={backgroundBorderRadius}
          height={containerHeight}
          width={containerWidth}
          fill={'url(#gradientback)'}
        />
      </G>
    );
  };

  const render_x_axis = () => {
    return (
      <G key="x_axis">
        <Circle
          cx={x_margin}
          cy={containerHeight - y_margin}
          r={axisCircleRadius}
          fill={axisCircleFillColor}
          stroke={axisCircleStrokeColor}
          strokeWidth={axisStrokeWidth}
          opacity={axisCircleOpacity}
        />
        <Circle
          cx={containerWidth - x_margin}
          cy={containerHeight - y_margin}
          r={axisCircleRadius}
          fill={axisCircleFillColor}
          stroke={axisCircleStrokeColor}
          strokeWidth={axisStrokeWidth}
          opacity={axisCircleOpacity}
        />
        <Line
          x1={x_margin}
          y1={containerHeight - y_margin}
          x2={containerWidth - x_margin}
          y2={containerHeight - y_margin}
          strokeWidth={axisStrokeWidth}
          stroke={axisColor}
        />
      </G>
    );
  };

  const render_y_axis = () => {
    return (
      <G key="y_axis">
        <Circle
          cx={x_margin}
          cy={y_margin}
          r={axisCircleRadius}
          fill={axisCircleFillColor}
          stroke={axisCircleStrokeColor}
          strokeWidth={axisStrokeWidth}
          opacity={axisCircleOpacity}
        />
        <Line
          x1={x_margin}
          y1={containerHeight - y_margin}
          x2={x_margin}
          y2={y_margin}
          strokeWidth={axisStrokeWidth}
          stroke={axisColor}
        />
      </G>
    );
  };

  const render_x_axis_ticks = () => {
    const {gap_betwen_ticks} = calculateWidth();
    const uniques = unique(data);
    return uniques.map((item, index) => {
      const x = x_margin * 2 + gap_betwen_ticks * index;
      const y = containerHeight - y_margin;
      return (
        <G key={`x_axis_ticks_${index}`}>
          <Line
            x1={x}
            y1={y}
            x2={x}
            y2={y + 10}
            strokeWidth={axisStrokeWidth}
            stroke={axisColor}
          />
        </G>
      );
    });
  };

  const render_x_axis_labels = () => {
    const {gap_betwen_ticks} = calculateWidth();
    const {rotation, fontSize, fontColor, textAnchor, fontWeight} =
      x_axis_config;
    const uniques = unique(data);
    return uniques.map((item, index) => {
      const x = x_margin * 2 + gap_betwen_ticks * index;
      const y = containerHeight - y_margin + 10 + fontSize;
      return (
        <G key={`x_axis_label_${index}`}>
          <SvgText
            x={x}
            y={y}
            origin={`${x}, ${y}`}
            rotation={rotation}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fontColor}>
            {item}
          </SvgText>
        </G>
      );
    });
  };

  const render_y_axis_ticks = () => {
    const {gap_between_ticks} = calculateHeight();
    return yAxisLabels.map((item, index) => {
      const y = containerHeight - y_margin - gap_between_ticks * index;
      return (
        <G key={`y_axis_ticks_${index}`}>
          <Line
            x1={x_margin}
            y1={y}
            x2={x_margin - 10}
            y2={y}
            strokeWidth={axisStrokeWidth}
            stroke={axisColor}
          />
        </G>
      );
    });
  };

  const render_y_axis_labels = () => {
    const {gap_between_ticks, min, yMax} = calculateHeight();
    const {rotation, fontSize, fontWeight, fontColor, textAnchor} =
      y_axis_config;
    const x = x_margin - 10;
    return yAxisLabels.map((item, index) => {
      const y = containerHeight - y_margin - gap_between_ticks * index;
      const data_points = data.length - 1;
      const textValue = min + (yMax / data_points) * index;
      return (
        <G key={`y_axis_labels_${index}`}>
          <SvgText
            x={x}
            y={y + fontSize / 3}
            origin={`${x}, ${y}`}
            rotation={rotation}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fontColor}>
            {textValue.toFixed(0)}
          </SvgText>
        </G>
      );
    });
  };

  const gatherData = d => {
    const currentData = d.map(r => r[y_key]);
    const m = median(currentData);
    const q1 = quartile(currentData, 0.25);
    const q3 = quartile(currentData, 0.75);
    const iqr = IQR(currentData);
    const outliers = Outliers(currentData);
    const maxwo = maxWithoutOutliers(currentData);
    const minwo = minWithoutOutliers(currentData);
    return {m, q1, q3, iqr, outliers, maxwo, minwo};
  };

  const render_rect = (q1, q3, index, x, m, outliers, maxwo, minwo) => {
    const {gap_between_ticks: y_gap, yMax, y_value_gap} = calculateHeight();
    console.log('q1', q1, 'q3', q3);
    const y = (yMax - q1) * (y_gap / y_value_gap) + y_margin;
    console.log('y', y);
    const height = q3 - q1;
    const boxHeight = height * (y_gap / y_value_gap);
    const lineY = (yMax - m) * (y_gap / y_value_gap) + y_margin;
    const maxHorizontalLineY =
      (yMax - maxwo) * (y_gap / y_value_gap) + y_margin;
    const minHorizontalLineY =
      (yMax - minwo) * (y_gap / y_value_gap) + y_margin;
    return (
      <G key={`rect-g-${index}`}>
        <Rect
          x={x - barWidth / 2}
          y={y}
          width={barWidth}
          height={-boxHeight}
          stroke={'#000'}
          strokeWidth={1}
          fill={'transparent'}
        />
        <Line
          x1={x - barWidth / 2}
          y1={lineY}
          x2={x + barWidth / 2}
          y2={lineY}
          stroke={'#000'}
          strokeWidth={1}
        />
        <Line
          x1={x}
          y1={y - boxHeight}
          x2={x}
          y2={maxHorizontalLineY}
          stroke={'#000'}
          strokeWidth={1}
        />
        <Line
          x1={x - barWidth / 2}
          y1={maxHorizontalLineY}
          x2={x + barWidth / 2}
          y2={maxHorizontalLineY}
          stroke={'#000'}
          strokeWidth={1}
        />
        <Line
          x1={x}
          y1={y}
          x2={x}
          y2={minHorizontalLineY}
          stroke={'#000'}
          strokeWidth={1}
        />
        <Line
          x1={x - barWidth / 2}
          y1={minHorizontalLineY}
          x2={x + barWidth / 2}
          y2={minHorizontalLineY}
          stroke={'#000'}
          strokeWidth={1}
        />
      </G>
    );
  };

  const render_box = (record, index, x) => {
    // record is a single day
    const dayData = [];

    data.map(r => {
      if (r[x_key] === record) {
        dayData.push(r);
      }
    });
    const {m, q1, q3, outliers, maxwo, minwo} = gatherData(dayData);
    return render_rect(q1, q3, index, x, m, outliers, maxwo, minwo);
  };

  const render_boxes = () => {
    const {gap_betwen_ticks} = calculateWidth();
    const uniques = unique(data);

    return uniques.map((r, i) => {
      const x = x_margin * 2 + gap_betwen_ticks * i;
      return render_box(r, i, x);
    });
  };

  const mainContainer = {
    height: containerHeight,
    width: containerWidth,
    backgroundColor: backgroundColor,
  };

  const svgContainer = {
    backgroundColor: svgBackgroundColor,
  };
  return (
    <View style={mainContainer}>
      <Svg height="100%" width="100%" style={svgContainer}>
        <Defs>
          <LinearGradient
            id="gradientback"
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={0}
            y2={containerHeight}>
            <Stop
              offset={gradient_background_config.stop1.offset}
              stopColor={gradient_background_config.stop1.stopColor}
              stopOpacity={gradient_background_config.stop1.stopOpacity}
            />
            <Stop
              offset={gradient_background_config.stop2.offset}
              stopColor={gradient_background_config.stop2.stopColor}
              stopOpacity={gradient_background_config.stop2.stopOpacity}
            />
          </LinearGradient>
        </Defs>
        {useGradientBackground && render_background()}
        {render_x_axis()}
        {render_y_axis()}
        {data && data.length > 0 && render_x_axis_ticks()}
        {data && data.length > 0 && render_x_axis_labels()}
        {data && data.length > 0 && render_y_axis_ticks()}
        {data && data.length > 0 && render_y_axis_labels()}
        {data && data.length > 0 && render_boxes()}
      </Svg>
    </View>
  );
};

export default BoxPlot;
