import config from '../../../../config.json';
import ResponseError, {ResponseCode} from "../../../models/ResponseError.ts";

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

  if (!response.ok) {
    throw new ResponseError(
        'Cannot reach server',
        ResponseCode.ServiceUnavailable
    )
  }

  const json = await response.json();

  if (json.errors) {
    const error = json.errors[0];

    let message = error.message;
    let code = error.extensions.code;

    if (!Object.values(ResponseCode).includes(code)) {
      message = "Unexpected server error";
      code = ResponseCode.ServerError;
    }

    throw new ResponseError(message, code);
  }
  return json;
};