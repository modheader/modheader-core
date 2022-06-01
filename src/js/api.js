async function makeRequest(path, params = {}) {
  const response = await fetch(`${process.env.URL_BASE}${path}`, {
    mode: 'cors',
    credentials: 'include',
    redirect: 'manual',
    ...params
  });
  if (response.ok) {
    return await response.json();
  }
  const err = new Error('Failed to make the request');
  err.statusCode = response.status;
  throw err;
}

export function getUserDetails() {
  return makeRequest(`/api/u/user-details`);
}

export function getProfile({ profileId }) {
  return makeRequest(`/api/profile/${profileId}`);
}

export function parseProfile({ data }) {
  return makeRequest(`/api/profile/parse`, {
    method: 'POST',
    body: JSON.stringify({ data })
  });
}

export function createProfile({ profile }) {
  return makeRequest(`/api/u/profile`, {
    method: 'POST',
    body: JSON.stringify({ profile, profileType: process.env.PROFILE_TYPE })
  });
}

export function updateProfile({ profileId, profile, visibility, allowedEmails }) {
  return makeRequest(`/api/u/profile`, {
    method: 'PUT',
    body: JSON.stringify({
      profileId,
      profile,
      visibility,
      allowedEmails,
      profileType: process.env.PROFILE_TYPE
    })
  });
}
