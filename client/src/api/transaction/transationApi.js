
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

async function updateTransaction(transaction) {
  const fetchResult = await fetch('/api/transaction', {
    method: 'PUT',
    body: JSON.stringify(transaction),
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  
  return fetchResult;
}
  
async function deleteTransaction(id) {
  const fetchResult = await fetch(`/api/transaction/${id}`, {
    method: 'DELETE',
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  return fetchResult;
}

async function getTransactionByUserId(userId) {
  const fetchResult = await fetch(`/api/transaction/user/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  
  return fetchResult;
}

async function getTransactionById(id) {
  const fetchResult = await fetch(`/api/transaction/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  
  return fetchResult;
}

async function getTransactionByUserIdAndDate(userId, date) {
  const query = `${userId}&${date}`;
  const fetchResult = await fetch(`/api/transaction/user/date/${query}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  
  return fetchResult;
}
  
export default {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionByUserId,
  getTransactionByUserIdAndDate,
};