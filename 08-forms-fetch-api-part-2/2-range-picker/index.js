
export default class RangePicker {
  element;
  subElements;
  beginSelecting = true;

  constructor ({from = new Date(), to = new Date()} = {}) {
    this.selected = {
      from: from,
      to: to,
      currentMonth: from
    };

    this.render();
  }

  render() {
    const div = document.createElement('div');
    div.innerHTML = this.template();

    this.element = div.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.subElements.selector.addEventListener('click', this.onClickHandler);
    this.subElements.input.addEventListener('click', this.onClickInputHandler);
  }

  getSubElements (element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((acc, item) => {
      acc[item.dataset.element] = item;
      return acc;
    }, {});
  }

  onClickInputHandler = () => {
    const { selector } = this.subElements;

    if (!selector.hasChildNodes()) {
      selector.innerHTML = this.selectorTemplate(this.selected.from);
      this.calendarHighlight();
    }
    this.close();
  }

  close = () => {
    this.element.classList.toggle("rangepicker_open");
  }

  onClickHandler = (event) => {
    const prevMonthBtn = event.target.closest(".rangepicker__selector-control-left");

    if (prevMonthBtn)
      return this.updateSelector('prev');

    const nextMonthBtn = event.target.closest(".rangepicker__selector-control-right");

    if (nextMonthBtn)
      return this.updateSelector('next');

    const currentCell = event.target.closest('button');

    if (currentCell) {
      if (this.beginSelecting) {
        this.selected.from = new Date(currentCell.dataset.value);
        this.selected.to = null;
        this.beginSelecting = false;
        this.calendarHighlight();
      } else {
        this.selected.to = new Date(currentCell.dataset.value);
        this.beginSelecting = true;
        this.calendarHighlight();
      }

      if (this.selected.from && this.selected.to){
        this.subElements.from.innerHTML = this.dateFormat(this.selected.from);
        this.subElements.to.innerHTML = this.dateFormat(this.selected.to);
        this.close();
      }
    }
  }

  updateSelector = (direction) => {
    const { selector } = this.subElements;
    const { currentMonth } = this.selected;
    const go = {
      'prev': -1,
      'next': 1
    };

    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + go[direction], 1);
    this.selected.currentMonth = newDate;

    selector.innerHTML = this.selectorTemplate(newDate);
    this.calendarHighlight();
  }

  calendarHighlight = () => {
    const { selector } = this.subElements;
    const { from, to } = this.selected;
    const cells = selector.querySelectorAll(".rangepicker__cell");

    cells.forEach( cell => {
      cell.classList.remove("rangepicker__selected-between", "rangepicker__selected-from", "rangepicker__selected-to");

      const cellDate = cell.dataset.value;
      let classCss = '';

      if (from && cellDate === from.toISOString()) {
        classCss = "rangepicker__selected-from";
      } else if (to && cellDate === to.toISOString()) {
        classCss = "rangepicker__selected-to";
      } else if (from && to && cellDate > from.toISOString() && cellDate < to.toISOString()) {
        classCss = "rangepicker__selected-between";
      }
      if (classCss) {
        cell.classList.add(classCss);
      }
    });
  }

  dateFormat = date => date.toLocaleString("ru", {dateStyle: "short"});

  template () {
    const { from, to } = this.selected;

    return `
    <div class="rangepicker">
      <div class="rangepicker__input" data-element="input">
        <span data-element="from">${ this.dateFormat(from) }</span> -
        <span data-element="to">${ this.dateFormat(to) }</span>
      </div>
      <div class="rangepicker__selector" data-element="selector"></div>
    </div>
    `;
  }

  selectorTemplate (date) {
    const date1 = new Date(date);
    const date2 = new Date(date);
    date2.setMonth(date2.getMonth() + 1);

    return `
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      ${ this.calendarTemplate(date1) }
      ${ this.calendarTemplate(date2) }
    `;
  }

  calendarTemplate = (date) => {
    date.setDate(1);
    const monthName = date.toLocaleString('ru', {month: 'long'});
    const startFrom = date.getDay() === 0 ? 7 : date.getDay();
    const totalDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const showDays = () => {
      let days = '';
      const style = ` style="--start-from: ${ startFrom }"`;

      for (let i = 1; i <= totalDays; i++) {
        //const date = new Date(year, month, i);
        date.setDate(i);
        days += `
          <button type="button" class="rangepicker__cell" data-value="${ date.toISOString() }" ${ i === 1 ? style : '' }>
            ${ i }
          </button>
        `;
      }
      return days;
    };

    return `
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${monthName}">${monthName}</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
          ${ showDays() }
        </div>
      </div>
    `;
  };

  remove () {
    this.element = null;
    this.subElements = [];
  }

  destroy () {
    this.remove();

  }
}
