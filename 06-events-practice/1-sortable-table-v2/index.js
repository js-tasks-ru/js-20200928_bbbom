export default class SortableTable {
  element;
  subElements = {};
  sortedItem;
  sortDirection;
  sortDefault = {
    field: 'title',
    order: 'asc',
  };
  arrow = `
      <span data-element='arrow' class="sortable-table__sort-arrow">
        <span class="sort-arrow"/>
      </span>
  `;

  constructor(header = [], { data = [] } = {}) {
    this.header = header;
    this.data = data;
    this.render();
  }

  render() {
    const el = document.createElement('div');
    el.innerHTML = this.template();

    this.element = el.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.subElements.header.addEventListener('click', this.sortHandler.bind(this));
    this.sortTable(this.sortDefault.field, this.sortDefault.order);
  }

  sortHandler(event) {
    const currentSortItem = event.target.closest('[data-sortable=true]');

    if (!currentSortItem) return;

    if (this.sortedItem) {
      if (this.sortedItem.dataset.id === currentSortItem.dataset.id) {
        this.sortDirection = (this.sortedItem.dataset.order === 'desc') ? 'asc' : 'desc';
      } else {
        this.sortedItem.dataset.order = '';
        let arrow = this.sortedItem.querySelector('[data-element=arrow]');
        if(arrow) {
          arrow.remove();
        }
        this.sortDirection = this.sortDefault.order;
      }
    }

    if (!this.sortedItem || this.sortedItem.dataset.id !== currentSortItem.dataset.id) {
      currentSortItem.insertAdjacentHTML('beforeend', this.arrow);
    }

    currentSortItem.dataset.order = this.sortDirection;
    this.sortedItem = currentSortItem;
    this.sortTable(currentSortItem.dataset.id, this.sortDirection);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((acc, item) => {
      acc[item.dataset.element] = item;
      return acc;
    }, {});
  }

  template() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table" style="max-width: 1000px; margin: 20px auto;">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getHeader(this.header, this.sortDefault)}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.getTable(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  getHeader (arr, {field, order}) {
    return arr.map(({title, id, sortable}) => {
      const item = ` 
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${field === id ? order : ''}">
          <span>${title}</span>
          ${id === field ? this.arrow : ''}
        </div>`;
      if (id === field) {
        const div = document.createElement('div');
        div.innerHTML = item;
        this.sortedItem = div.firstElementChild;
        this.sortDirection = order;
      }
      return item;
    }).join('');
  }

  getTable (products) {
    return products.reduce((acc, product) => [...acc, this.getTableRow(product)], []).join('');
  }

  getTableRow (product) {
    return `
      <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
        ${
            this.header.map(
              item => (item.template) ? item.template(product[item.id]) : `<div class="sortable-table__cell">${product[item.id]}</div>`
            ).join('')
        }
      </a>
    `;
  }

  sortTable(field, order) {
    const sortTable = [...this.data];
    const currentHeaderItem = this.header.find(item => item.id === field);
    const sortType = currentHeaderItem ? currentHeaderItem.sortType : '';

    sortTable.sort((item1, item2) => {
      const a = item1[field];
      const b = item2[field];
      const sortDirection = (order === 'desc') ? -1 : 1;

      switch (sortType) {
      case 'number':
        return sortDirection * (a - b);
      case 'string':
        return sortDirection * a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
      default:
        break;
      }
    });
    return this.subElements.body.innerHTML = this.getTable(sortTable);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
    // additionally needed to remove all listeners...
  }
}
