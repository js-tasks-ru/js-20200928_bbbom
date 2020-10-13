export default class ColumnChart {
  element;
  chart;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = ''
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  render() {
    const el = document.createElement('div');
    el.innerHTML = this.template();
    this.element = el.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.chart = this.element.querySelector('.column-chart__chart');
  }

  template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.value}
          </div>      
          <div data-element="body" class="column-chart__chart">
            ${this.getChart(this.data)}
          </div>
        </div> 
      </div>     
    `;
  }

  getLink() {
    const href = this.link;
    return href ? `<a class="column-chart__link" href="${href}">View all</a>` : '';
  }

  getChart(arr) {
    const max = Math.max(...arr);
    const scale = this.chartHeight / max;

    return arr.map(item => {
      const percent = Math.round(item * 100 / max);
      return `<div data-tooltip="${percent}%" style="--value: ${Math.floor(item* scale)}"></div>`;
    }).join('');
  }

  update(newData) {
    return this.chart.innerHTML = this.getChart(newData);
  }

  destroy() {
    this.remove();
    this.element = null;
    this.chart = '';
  }

  remove() {
    return this.element.remove();
  }
}
