class Tooltip {
  element;
  static tooltipInstance;

  constructor () {
    if (!Tooltip.tooltipInstance) {
      Tooltip.tooltipInstance = this;
    }
  }

  initialize() {
    const tooltips = document.querySelectorAll('[data-tooltip]');

    if (tooltips.length) {
      document.addEventListener('pointerover', this.showTooltip);
      document.addEventListener('pointerout', this.hideTooltip.bind(this));
    }
  }

  showTooltip = event => {
    const target = event.target;
    if (!target.closest('[data-tooltip]')) return;

    this.render(event);
    this.moveTooltip(event);

    document.addEventListener('mousemove', this.moveTooltip);
  };

  moveTooltip = event => {
    this.element.style = `left:${event.clientX + 10}px; top: ${event.clientY + 10}px;`;
  };

  render(event) {
    const tooltipTemplate = `
      <div class="tooltip">
        ${event.target ? event.target.dataset.tooltip : ''}
      </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = tooltipTemplate;
    this.element = div.firstElementChild;

    return document.body.append(this.element);
  }

  hideTooltip (event) {
    if (!event.target.closest('[data-tooltip]')) return;
    document.removeEventListener('mousemove', this.moveTooltip);
    this.destroy();
  }

  destroy () {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}

const tooltip = new Tooltip();

export default tooltip;
