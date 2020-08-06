function validateOnlyNumber(date) {
  return /^([0-9])+/.test(date);
}

export default { validateOnlyNumber };