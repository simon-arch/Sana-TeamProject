import config from '../../../../config.json'

export const sendRequest = async (query: string, token: string) => {
  const response = await fetch(`${config.apiEndpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: query
    })
  });
  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }
  
  return json;
};