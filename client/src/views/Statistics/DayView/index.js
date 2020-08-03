class DayWarp {
  render = (state) => {
    const { wrap } = state;
    wrap.innerHTML = `
        <h1>Day Section</h1>
    `;
  }
}

export default DayWarp;