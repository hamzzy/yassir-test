import axios, { AxiosResponse, AxiosError } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function IQRIClient<T>(
  method: HttpMethod,
  endpoint: string,
  params?: Record<string, any>,
): Promise<T> {
  try {
    const url = `${process.env.IQAIR_API_URL}${endpoint}`;
    const apiKey = process.env.IQAIR_API_KEY;    
    const options = {
      method,
      url,
      params: { ...params, key: apiKey },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const response: AxiosResponse<T> = await axios(options);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('Unexpected error occurred.');
    }
  }
}

function handleAxiosError(error: AxiosError) {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
    throw new Error(`Request failed with status code ${error.response.status}`);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('Request made but no response received');
    throw new Error('No response received from the server.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error setting up the request:', error.message);
    throw new Error('Error setting up the request.');
  }
}
