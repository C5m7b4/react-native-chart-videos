import React, {useState, useEffect} from 'react';
import {View, Dimensions, Animated, Easing} from 'react-native';
import Svg, {
  G,
  Circle,
  Line,
  Rect,
  LinearGradient,
  Defs,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {quickSort} from '../../utils';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const Barchart = ({
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
  animated = true,
  barColor = 'green',
  barOpacity = 0.8,
  useBarGradient = true,
  showTooltips = true,
  tooltip_config = {
    tooltipFill: '#000',
    tooltipBorderRadius: 7,
    fontSize: 12,
    fontWeight: '400',
    textAnchor: 'middle',
  },
  bar_gradient_config = {
    stop1: {
      offset: 0,
      stopColor: '#3172de',
      stopOpacity: 0.8,
    },
    stop2: {
      offset: 1,
      stopColor: '#648dd1',
      stopOpacity: 0.3,
    },
  },
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

  const calculateWidth = () => {
    const chartWidth = containerWidth - x_margin * 2;
    const gap_between_ticks = chartWidth / (data.length + 1);
    return {
      chartWidth,
      gap_between_ticks,
    };
  };

  const calculateHeight = () => {
    const yMax = data.reduce((acc, cur) => {
      return cur[y_key] > acc ? cur[y_key] : acc;
    }, 0);
    const yMin = data.reduce((acc, cur) => {
      return cur[y_key] < acc ? cur[y_key] : acc;
    }, yMax);

    let min = 0;
    const actual_chart_height = containerHeight - y_margin * 2;
    const gap_between_ticks = actual_chart_height / (data.length - 1);
    const y_value_gap = (yMax - min) / (data.length - 1);
    return {yMax, yMin, min, gap_between_ticks, y_value_gap};
  };

  const render_background = () => {
    return (
      <Rect
        x={0}
        y={0}
        height={containerHeight}
        width={containerWidth}
        fill={'url(#gradientback)'}
        rx={backgroundBorderRadius}
      />
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
    const {gap_between_ticks} = calculateWidth();
    return data.map((item, index) => {
      const x = x_margin * 2 + gap_between_ticks * index;
      const y = containerHeight - y_margin;
      return (
        <G key={`x_axis_ticks_${index}`}>
          <Line
            x1={x}
            y1={y}
            x2={x}
            y2={y + 10}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
          />
        </G>
      );
    });
  };

  const render_x_axis_labels = () => {
    const {gap_between_ticks} = calculateWidth();
    const {fontSize, rotation, fontColor, textAnchor, fontWeight} =
      x_axis_config;
    return data.map((item, index) => {
      const x = x_margin * 2 + gap_between_ticks * index;
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
            {item[x_key]}
          </SvgText>
        </G>
      );
    });
  };

  const render_y_axis_ticks = () => {
    const {gap_between_ticks} = calculateHeight();
    return data.map((item, index) => {
      const y = containerHeight - y_margin - gap_between_ticks * index;
      return (
        <G key={`y_axis_ticks_${index}`}>
          <Line
            x1={x_margin}
            y1={y}
            x2={x_margin - 10}
            y2={y}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
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
      const dataPoints = data.length - 1;
      const textValue = min + (yMax / dataPoints) * index;
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
            {textValue}
          </SvgText>
        </G>
      );
    });
  };

  const render_barchart = () => {
    const {gap_between_ticks: y_gap, yMax, y_value_gap} = calculateHeight();
    const {gap_between_ticks: x_gap} = calculateWidth();
    const y = containerHeight - y_margin;

    return data.map((item, index) => {
      const x = x_margin * 2 + x_gap * index;
      const height = (yMax - item[y_key]) * (y_gap / y_value_gap) + y_margin;
      const barHeight = containerHeight - y_margin - height;

      let animatedHeight = new Animated.Value(0);
      Animated.timing(animatedHeight, {
        toValue: -barHeight,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();

      if (useBarGradient) {
        return (
          <G key={`bars-${index}`}>
            <AnimatedRect
              x={x - barWidth / 2}
              y={y}
              height={animated ? animatedHeight : -barHeight}
              width={barWidth}
              fill={'url(#barGradient)'}
              opacity={barOpacity}
              onPress={() => onPressItem(item)}
            />
          </G>
        );
      } else {
        return (
          <G key={`bars-${index}`}>
            <AnimatedRect
              x={x - barWidth / 2}
              y={y}
              height={animated ? animatedHeight : -barHeight}
              width={barWidth}
              fill={barColor}
              opacity={barOpacity}
              onPress={() => onPressItem(item)}
            />
          </G>
        );
      }
    });
  };

  const render_tooltips = () => {
    const {gap_between_ticks: y_gap, yMax, y_value_gap} = calculateHeight();
    const {gap_between_ticks: x_gap} = calculateWidth();
    const animatedOpacity = new Animated.Value(0);
    Animated.timing(animatedOpacity, {
      toValue: 1,
      delay: 500,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return data.map((item, index) => {
      const x = x_margin * 2 + x_gap * index;
      const y = (yMax - item[y_key]) * (y_gap / y_value_gap) + y_margin;
      return (
        <G key={`tooltip_${index}`}>
          <AnimatedSvgText
            x={x}
            y={y - 5}
            textAnchor={tooltip_config.textAnchor}
            fontWeight={tooltip_config.fontWeight}
            fontSize={tooltip_config.fontSize}
            fill={tooltip_config.tooltipFill}
            opacity={animated ? animatedOpacity : 1}>
            {item[y_key]}
          </AnimatedSvgText>
        </G>
      );
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
      <Svg style={svgContainer}>
        <Defs>
          <LinearGradient
            id="barGradient"
            gradientUnits={'userSpaceOnUse'}
            x1={0}
            y1={0}
            x2={0}
            y2={containerHeight}>
            <Stop
              offset={bar_gradient_config.stop1.offset}
              stopColor={bar_gradient_config.stop1.stopColor}
              stopOpacity={bar_gradient_config.stop1.stopOpacity}
            />
            <Stop
              offset={bar_gradient_config.stop2.offset}
              stopColor={bar_gradient_config.stop2.stopColor}
              stopOpacity={bar_gradient_config.stop2.stopOpacity}
            />
          </LinearGradient>
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
        {data && data.length > 0 && render_barchart()}
        {data && data.length > 0 && showTooltips && render_tooltips()}
      </Svg>
    </View>
  );
};

export default Barchart;
