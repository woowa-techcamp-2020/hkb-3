class Observable {
  constructor() {
    this.observers = new Set();
  }

  addSubscribe(observer) {
    this.observers.add(observer);
  }

  addAllSubscribe(...observers) {
    observers.forEach((observer) => {
      this.observers.add(observer);
    });
  }

  deleteSubscribe(observer) {
    this.observers = [...this.observers].filter((subscriber) => subscriber !== observer);
  }

  notify(data) {
    this.observers.forEach((observer) => (
      observer.update ? observer.update(data) : observer(data)
    ));
  }
}

export default Observable;