class View {
  constructor() {
    this.handlers = [];
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  notifyHandlers() {
    this.handlers.forEach((handler) => {
      handler();
      this.handlers = [];
    });
  }
}

export default View;