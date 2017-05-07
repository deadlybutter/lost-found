import * as d3 from 'd3';
import randomColor from 'randomColor';

const colors = {};
const color = (title) => {
  if (!colors[title]) {
    colors[title] = randomColor();
  }

  return colors[title];
};

const row = r => ({
  title: r.title,
  category: r.category,
  count: parseInt(r.count),
  color: color(r.category),
});

const draw = data => {
  const width = window.innerWidth;
  const height = width;

  const radius = width * .3;
  const centerX = width / 2;
  const centerY = (height / 2) - (radius / 4);

  const barSpacing = 1.4;
  const barWidth = width / (data.length * barSpacing);
  const interval = (Math.PI * 2) / (data.length);
  const intervalDeg = interval * (180 / Math.PI);

  const chart = d3.select('#chart')
    .attr('width', width)
    .attr('height', height);

  const bar = chart.selectAll('bar')
    .data(data)
    .enter().append('g')
      .attr('class', 'bar');

  const quantityScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .range([0, width * .20])

  bar.append('rect')
    .attr('width', barWidth)
    .attr('height', d => quantityScale(d.count))
    .attr('fill', d => d.color)
    .attr('transform', (d, i) => {
      const angle = i * interval;
      const x = centerX + radius * (Math.cos(angle));
      const y = centerY + radius * (Math.sin(angle));
      return `translate(${x}, ${y}) rotate(${(intervalDeg * i) - 90})`;
    });

  const title = bar.append('text')
    .text(d => d.title)
    .attr('class', 'title')
    .attr('opacity', 0)
    .attr('transform', `translate(${centerX}, ${centerY})`);

  const category = bar.append('text')
    .text(d => d.category)
    .attr('class', 'sub-title')
    .attr('opacity', 0)
    .attr('transform', `translate(${centerX}, ${centerY + 18})`);

  bar.on('mouseover', function(d) {
    d3.select(this).selectAll('text').style('opacity', '1');
  });

  bar.on('mouseout', function(d) {
    d3.select(this).selectAll('text').style('opacity', '0');
  });
};

d3.csv('./data/export.csv', row, (data) => {
  window._data = data;
  draw(data);
});

window.onresize = () => {
  if (!window._data) return;

  d3.selectAll('svg > *').remove();
  draw(window._data);
};
