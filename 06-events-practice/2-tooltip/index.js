class Tooltip {
  element;

  initialize() {
    const tooltips = document.querySelectorAll('[data-tooltip]');

    if (tooltips.length) {
      document.addEventListener('pointerover', this.render.bind(this));
      document.addEventListener('pointerout', this.hideTooltip.bind(this));
    }
  }

  render(event) {
    const target = event.target;

    let tooltipTemplate = `<div class="tooltip"></div>`;

    if (target) {
      if (!target.closest('[data-tooltip]')) return;

      tooltipTemplate = `
        <div class="tooltip" style="left:${event.clientX}px; top:${event.clientY}px;">
          ${target.dataset.tooltip}
        </div>
      `;
    }

    const div = document.createElement('div');
    div.innerHTML = tooltipTemplate;

    this.element = div.firstElementChild;

    return document.body.append(this.element);
  }

  hideTooltip (event) {
    if (!event.target.closest('[data-tooltip]')) return;
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
