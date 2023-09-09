const asc = data => data.sort((a, b) => a - b);

const desc = data =>
  data.sort((a, b) => {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    return 0;
  });

const sum = data => data.reduce((a, c) => a + c, 0);

const max = data => data.reduce((a, c) => (a > c ? a : c), 0);

const min = data => data.reduce((a, c) => (a < c ? a : c), 99999999);

const mean = data => sum(data) / data.length;

const range = data => max(data) - min(data);

const median = data => {
  const sorted = asc([...data]);
  const half = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[half]
    : (sorted[half - 1] + sorted[half]) / 2;
};

const quartile = (data, percent) => {
  const sorted = asc([...data]);
  let pos = (sorted.length - 1) * percent;
  if (pos % 1 === 0) {
    return sorted[pos];
  }

  pos = percent > 0.5 ? Math.ceil(pos) : Math.floor(pos);
  if (sorted[pos + 1] !== undefined && sorted.length - (1 % 2) === 0) {
    return (sorted[pos] + sorted[pos + 1]) / 2;
  }

  return sorted[pos];
};

const IQR = data => {
  return quartile(data, 0.75) - quartile(data, 0.25);
};

const Outliers = data => {
  const iqr = IQR(data);
  const maxValuetoQualify = quartile(data, 0.75) + 1.5 * iqr;
  const minValuetoQualify = quartile(data, 0.25) - 1.5 * iqr;
  const newarray = [];
  data.map(v =>
    v > maxValuetoQualify || v < minValuetoQualify ? newarray.push(v) : null,
  );
  return newarray;
};

const maxWithoutOutliers = data => {
  const outliers = Outliers(data);
  return data.reduce((a, c) => {
    return outliers.includes(c) ? a : a > c ? a : c;
  }, 0);
};

const minWithoutOutliers = data => {
  const outliers = Outliers(data);
  return data.reduce((a, c) => {
    return outliers.includes(c) ? a : a < c ? a : c;
  }, 999999);
};

export {
  asc,
  desc,
  max,
  min,
  range,
  IQR,
  median,
  mean,
  maxWithoutOutliers,
  minWithoutOutliers,
  quartile,
  Outliers,
};
