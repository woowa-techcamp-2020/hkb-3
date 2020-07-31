async function createUser(user) {
  const fetchResult = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ userId: user.userId, password: user.password }),
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });

  return fetchResult;
}
  
async function getAllUsers() {
  console.log('heello!!???????????????');
  const fetchResult = await fetch('/api/users', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  console.log('api', fetchResult);

  return fetchResult;
}
  
async function getUserById(id) {
  const fetchResult = await fetch(`/api/users/${id.id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });

  return fetchResult;
}

async function updateUser(user) {
  const fetchResult = await fetch('/api/users', {
    method: 'PUT',
    body: JSON.stringify({ user }),
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });

  return fetchResult;
}

async function deleteUser(id) {
  const fetchResult = await fetch(`/api/users/${id.id}`, {
    method: 'DELETE',
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });

  return fetchResult;
}
export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};