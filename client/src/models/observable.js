class Observable {
  constructor() {
    this.observers = new Set();
  }

  addSubscribe(observer) {
    this.observers.add(observer);
  }

  deleteSubscribe(observer) {
    this.observers = [...this.observers].filter((subscriber) => subscriber !== observer);
  }

  notify(data) {
    console.log(this);
    this.observers.forEach((observer) => (
      observer.update ? observer.update(data) : observer(data)
    ));
  }
}

export default Observable;