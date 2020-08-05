
async function getGitAuth() {
  const fetchResult = await fetch('/auth/github', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }).then(async (response) => {
    const result = await response.json();
    return result;
  });
  return fetchResult;
}

export default {
  getGitAuth,
};