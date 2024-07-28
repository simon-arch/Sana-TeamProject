import config from '../../../../config.json'

export const sendRequest = (query: string, token: string) => {
    return fetch(`${config.apiEndpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: query
      })
    })
};