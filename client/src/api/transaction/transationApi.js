async function createTransaction(transaction) {
  const fetchResult = await fetch('/api/transaction', {
    method: 'POST',
    body: JSON.stringify(transaction),
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  
  return fetchResult;
}

async function getTransactionByUserId(userId) {
  const fetchResult = await fetch(`/api/transaction/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  
  return fetchResult;
}
  
async function updateTransaction(transaction) {
  const fetchResult = await fetch('/api/transaction', {
    method: 'PUT',
    body: JSON.stringify({ transaction }),
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  
  return fetchResult;
}
  
async function deleteTransaction(id) {
  const fetchResult = await fetch(`/api/transaction/${id.id}`, {
    method: 'DELETE',
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  
  return fetchResult;
}
  
export default {
  createTransaction,
  getTransactionByUserId,
  updateTransaction,
  deleteTransaction,
};