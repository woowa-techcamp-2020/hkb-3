async function getCategoryByState(state) {
  const fetchResult = await fetch(`/api/category/${state}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
    
  return fetchResult;
}

export default { getCategoryByState };