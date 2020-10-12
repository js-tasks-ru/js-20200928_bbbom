export default class ColumnChart {
  element;
  chart;
  chartHeight = 50;

  constructor(attr = {}) {
    const {data = [], label = '', value = '', link = ''} = attr;

    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.element =  document.createElement('div');
    this.render();
  }

  render() {
    const el = this.element;
    el.className = "column-chart";
    el.style.cssText = "--chart-height: 50";

    el.innerHTML = `
      <div class="column-chart__title">
        Total ${this.label}
        ${this.getLink()}
      </div>
      <div class="column-chart__container">
        ${this.getHeader()}        
      
        <div data-element="body" class="column-chart__chart">
          ${this.getChart(this.data)}
        </div>
      </div>      
    `;

    this.chart = this.element.querySelector('.column-chart__chart');
  }

  getLink() {
    const href = this.link;
    return href ? `<a class="column-chart__link" href="${href}">View all</a>` : '';
  }

  getHeader() {
    const val = typeof this.value === 'number' ? ('$' + this.value) : this.value;
    return `
      <div data-element="header" class="column-chart__header">
        ${val}
      </div>
    `;
  }

  getChart(arr) {
    if (!arr) return;
    if (arr.length === 0) {
      this.element.classList.add('column-chart_loading');
      return '';
    }

    return arr.reduce((acc, num) => {
      const val = parseInt(num * 50 / 100);
      return acc + `<div data-tooltip="${num}%" style="--value: ${val}"></div>`;
    }, "");
  }

  update(newData){
    this.element.classList.remove('column-chart_loading');
    return this.chart.innerHTML = this.getChart(newData);
  }

  destroy(){

  }

  remove(){
    return this.element.remove();
  }
}
