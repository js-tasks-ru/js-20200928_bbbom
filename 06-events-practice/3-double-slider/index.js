export default class DoubleSlider {
  element;
  currentThumb;
  progress;
  slider;
 // root = document.getElementById('test');

  position = {
    shiftX: 0,
    left: 0,
    right: 0,
  };

  constructor ({min = 0, max = 100, formatValue = x => x, selected = {}} = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.render();
    //console.log(this.selected); console.log(this.formatValue(50));
  }

  render () {
    const div = document.createElement('div');
    div.innerHTML = this.template();

    this.element = div.firstElementChild;
    this.progress = this.element.querySelector('.range-slider__progress');
    this.slider = this.element.querySelector('[data-element=slider]');
    const thumbs = this.element.querySelectorAll('[data-thumb]');
    thumbs.forEach((thumb, idx)=> {
      thumb.addEventListener('pointerdown', this.onMouseDown);
     // console.log(thumb.dataset.thumb);
      //thumb.style[thumb.dataset.thumb] = this.selected[idx]; console.log(thumb);
    });
  }

  onMouseDown = event => {
    event.preventDefault();

    const { target, clientX } = event;
    const param = target.dataset.thumb;

    this.position.shiftX = clientX - target.getBoundingClientRect()[param];
    this.currentThumb = target;

    document.addEventListener('pointermove', this.onMouseMove);
    document.addEventListener('pointerup', this.onMouseUp);
  };

  onMouseMove = (event) => {
    const direction = {
      'left': 1,
      'right': -1,
    };
    const toggleParam = (arg) => {
      const object = {
        left: 'right',
        right: 'left',
      };
      return object[arg];
    };
    const param = this.currentThumb.dataset.thumb;
    let newPos = direction[param] * (event.clientX - this.slider.getBoundingClientRect()[param]) - this.position.shiftX;
    const rightEdge = this.slider.offsetWidth - this.position[toggleParam(param)];

    if (newPos < 0) newPos = 0;

    if (newPos > rightEdge) newPos = rightEdge;

    this.position[param] = newPos;
    this.currentThumb.style[param] = `${newPos}px`;
    this.progress.style[param] = `${newPos}px`;

    // this.root.innerHTML = ` ${param1}
    //   edge: ${rightEdge} ${this.position[param1]}
    //  |  right ${this.position.right}  : left ${this.position.left} |
    //  ${this.slider.getBoundingClientRect()[param]}   |
    //
    // `;
  };

  onMouseUp = () => {
    this.removeListeners();
  };

  removeListeners () {
    document.removeEventListener('pointermove', this.onMouseMove);
    document.removeEventListener('pointerup', this.onMouseUp);
  }


  template = () => {
    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.min)}</span>
        <div data-element="slider" class="range-slider__inner">
          <span class="range-slider__progress"></span>
          <span data-thumb="left" class="range-slider__thumb-left"></span>
          <span data-thumb="right" class="range-slider__thumb-right"></span>
        </div>
        <span data-element="to">${this.formatValue(this.max)}</span>
      </div>
    `;
  };

  destroy () {
    this.element.remove();
    this.removeListeners();
  }
}
