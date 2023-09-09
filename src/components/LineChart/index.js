import React, {useState, useEffect} from 'react';
import {View, Dimensions} from 'react-native';
import Svg, {
  G,
  Rect,
  Path,
  Circle,
  Line,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import {quickSort} from '../../utils';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const LineChart = ({
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
  lineCircleRadius = 5,
  lineCircleStroke = '#000',
  lineCircleFill = 'red',
  lineCircleStrokeWidth = 1,
  lineStrokeWidth = 2,
  lineStroke = 'blue',
  curve = true,
  lineGradient = true,
  showHorizontalLines = false,
  horizontalLineOpacity = 0.2,
  showVerticalLines = false,
  verticalLineOpacity = 0.2,
  showTooltips = true,
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
  line_gradient_config = {
    stop1: {
      offset: 0,
      stopColor: '#648dd1',
      stopOpacity: 0.2,
    },
    stop2: {
      offset: 1,
      stopColor: '#3172de',
      stopOpacity: 0.9,
    },
  },
  tooltip_config = {
    tooltipHeight: 20,
    tooltipWidth: 40,
    tooltipFill: '#fff',
    tooltipBorderRadius: 7,
    fontSize: 12,
    fontWeight: '400',
    textAnchor: 'middle',
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
    const gap_between_ticks = chartWidth / (data.length - 1);
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

    return {yMax, yMin, gap_between_ticks, y_value_gap, min};
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
    const {gap_between_ticks} = calculateWidth();
    console.log('gap', gap_between_ticks);
    return data.map((item, index) => {
      const x = x_margin + gap_between_ticks * index;
      console.log('x', x);
      const y = containerHeight - y_margin;
      return (
        <G key={`x_axis_ticks-${index}`}>
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
    const {fontSize, textAnchor, fill, fontWeight, rotation} = x_axis_config;
    return data.map((item, index) => {
      const x = x_margin + gap_between_ticks * index;
      const y = containerHeight - y_margin + 10 + fontSize;
      return (
        <SvgText
          key={`x_axis_label-${index}`}
          x={x}
          y={y}
          fontSize={fontSize}
          textAnchor={textAnchor}
          fill={fill}
          fontWeight={fontWeight}
          origin={`${x}, ${y}`}
          rotation={rotation}>
          {item[x_key]}
        </SvgText>
      );
    });
  };

  const render_y_axis_ticks = () => {
    const {gap_between_ticks} = calculateHeight();
    return data.map((item, index) => {
      const y = containerHeight - y_margin - gap_between_ticks * index;
      return (
        <G key={`y_axis_ticks-${index}`}>
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
    const {fontSize, textAnchor, fill, fontWeight, rotation} = y_axis_config;
    const x = x_margin - 13;
    return yAxisLabels.map((item, index) => {
      const y = containerHeight - y_margin - gap_between_ticks * index;
      const dataPoints = data.length - 1;
      const textValue = min + (yMax / dataPoints) * index;
      return (
        <G key={`y_axis_labels-${index}`}>
          <SvgText
            x={x}
            y={y + fontSize / 3}
            textAnchor={textAnchor}
            fontWeight={fontWeight}
            fontSize={fontSize}
            fill={fill}
            origin={`${x}, ${y}`}
            rotation={rotation}>
            {textValue}
          </SvgText>
        </G>
      );
    });
  };

  const render_line_circles = () => {
    const {gap_between_ticks: x_gap} = calculateWidth();
    const {gap_between_ticks: y_gap, yMax, y_value_gap} = calculateHeight();
    const {
      tooltipWidth,
      tooltipHeight,
      tooltipFill,
      tooltipBorderRadius,
      fontSize,
      fontWeight,
      textAnchor,
    } = tooltip_config;
    return data.map((item, index) => {
      const x = x_margin + x_gap * index;
      const y = (yMax - item[y_key]) * (y_gap / y_value_gap) + y_margin;
      return (
        <G key={`chart-circles-${index}`}>
          <Circle
            cx={x}
            cy={y}
            r={lineCircleRadius}
            stroke={lineCircleStroke}
            strokeWidth={lineCircleStrokeWidth}
            fill={lineCircleFill}
            onPress={() => onPressItem(item)}
          />
          {showTooltips ? (
            <G key={`tooltip-${index}`}>
              <Line
                x1={x}
                y1={y - lineCircleRadius / 2}
                x2={x}
                y2={y - lineCircleRadius / 2 - 10}
                stroke={'#000'}
                strokeWidth={2}
                opacity={0.8}
              />
              <Rect
                x={x - tooltipWidth / 2}
                y={y - lineCircleRadius / 2 - tooltipHeight - 10}
                width={tooltipWidth}
                height={tooltipHeight}
                fill={tooltipFill}
                rx={tooltipBorderRadius}
                opacity={1}
                onPress={() => onPressItem(item)}
              />
              <SvgText
                x={x}
                y={y - lineCircleRadius / 2 - tooltipHeight / 2 - 5}
                fontSize={fontSize}
                fontWeight={fontWeight}
                textAnchor={textAnchor}>
                {item[y_key]}
              </SvgText>
            </G>
          ) : null}
        </G>
      );
    });
  };

  const getDPath = () => {
    const {gap_between_ticks: x_gap} = calculateWidth();
    const {gap_between_ticks: y_gap, yMax, y_value_gap} = calculateHeight();
    let dPath = '';
    let previousX = 0;
    let previousY = 0;
    data.map((item, index) => {
      let x = x_margin + x_gap * index;
      let y = (yMax - item[y_key]) * (y_gap / y_value_gap) + y_margin;
      if (curve) {
        if (index === 0) {
          dPath += `M ${x}, ${y}`;
          previousX = x;
          previousY = y;
        } else {
          const x_splitter = (x - previousX) / 4;
          const y_splitter = (y - previousY) / 2;
          dPath +=
            ` Q ${previousX + x_splitter}, ${previousY}, ${
              previousX + x_splitter * 2
            }, ${previousY + y_splitter}` +
            ` Q ${previousX + x_splitter * 3}, ${
              previousY + y_splitter * 2
            }, ${x}, ${y}`;
          previousX = x;
          previousY = y;
        }
      } else {
        if (index === 0) {
          dPath += `M ${x},${y}`;
        } else {
          dPath += ` L ${x}, ${y}`;
        }
      }
    });
    return dPath;
  };

  const render_line = () => {
    const dPath = getDPath();
    return (
      <Path
        d={dPath}
        strokeWidth={lineStrokeWidth}
        stroke={lineStroke}
        fill={'transparent'}
      />
    );
  };

  const render_line_gradient = () => {
    let dPath = getDPath();
    dPath += ` L ${containerWidth - x_margin}, ${
      containerHeight - y_margin
    } L ${x_margin}, ${containerHeight - y_margin} Z`;

    return <Path d={dPath} fill={'url(#fillshadow)'} strokeWidth={0} />;
  };

  const render_horizontal_lines = () => {
    const {gap_between_ticks} = calculateHeight();
    return data.map((item, index) => {
      const y = containerHeight - y_margin - gap_between_ticks * index;
      return (
        <G key={`horizontal_line_${index}`}>
          <Line
            x1={x_margin}
            y1={y}
            x2={containerWidth - x_margin}
            y2={y}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
            opacity={horizontalLineOpacity}
          />
        </G>
      );
    });
  };

  const render_vertical_lines = () => {
    const {gap_between_ticks} = calculateWidth();
    return data.map((item, index) => {
      const x = x_margin + gap_between_ticks * index;
      return (
        <G key={`vertical_line_${index}`}>
          <Line
            x1={x}
            y1={containerHeight - y_margin}
            x2={x}
            y2={y_margin}
            stroke={axisColor}
            strokeWidth={axisStrokeWidth}
            opacity={verticalLineOpacity}
          />
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
      <Svg height="100%" width="100%" style={svgContainer}>
        <Defs>
          <LinearGradient
            id="fillshadow"
            gradientUnits={'userSpaceOnUse'}
            x1={0}
            y1={0}
            x2={0}
            y2={containerHeight}>
            <Stop
              offset={line_gradient_config.stop1.offset}
              stopColor={line_gradient_config.stop1.stopColor}
              stopOpacity={line_gradient_config.stop1.stopOpacity}
            />
            <Stop
              offset={line_gradient_config.stop2.offset}
              stopColor={line_gradient_config.stop2.stopColor}
              stopOpacity={line_gradient_config.stop2.stopOpacity}
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
        {data && data.length > 0 && lineGradient && render_line_gradient()}
        {data &&
          data.length > 0 &&
          showHorizontalLines &&
          render_horizontal_lines()}
        {data &&
          data.length > 0 &&
          showVerticalLines &&
          render_vertical_lines()}
        {data && data.length > 0 && render_x_axis_ticks()}
        {data && data.length > 0 && render_x_axis_labels()}
        {data && data.length > 0 && render_y_axis_ticks()}
        {data && data.length > 0 && render_y_axis_labels()}
        {data && data.length > 0 && render_line_circles()}
        {data && data.length > 0 && render_line()}
      </Svg>
    </View>
  );
};

export default LineChart;
