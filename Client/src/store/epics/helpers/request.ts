import config from '../../../../config.json'

export const sendRequest = async (query: string) => {
  const response = await fetch(config.apiEndpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({
      query: query
    })
  });
  
  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].extensions.code);
  }
  
  return json;
};