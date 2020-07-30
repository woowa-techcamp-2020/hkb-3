async function createUser(user) {
  const fetchResult = await fetch('/api/user', {
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
  const fetchResult = await fetch('/api/user', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });

  return fetchResult;
}
  
async function getUserById(id) {
  const fetchResult = await fetch(`/api/user/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });

  return fetchResult;
}

async function updateUser(user) {
  const fetchResult = await fetch('/api/user', {
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
  const fetchResult = await fetch(`/api/user/${id.id}`, {
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