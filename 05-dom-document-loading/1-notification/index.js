
const notifications = document.getElementsByClassName('notification');

export default class NotificationMessage {
  element;

  constructor(message, {duration = 1000, type = 'success'} = {}){
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  render() {
    const el = document.createElement('div');
    el.innerHTML = this.template();
    this.element = el.firstElementChild;
  }

  show(target = document.body) {
    if (notifications.length > 0) {
      [...notifications].forEach( item => item.remove() );
    }
    target.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">success</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }

  destroy() {
    this.remove();
  }
}
