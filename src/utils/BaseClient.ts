import { Logger } from '@nestjs/common';
import axios, { AxiosResponse, AxiosError } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
const logger = new Logger('IQRIClient');

export async function IQRIClient<T>(
  method: HttpMethod,
  endpoint: string,
  params?: Record<string, any>,
): Promise<T> {
  try {
    // Construct the base URL for the IQAir API
    const baseUrl = process.env.IQAIR_API_URL || 'http://api.airvisual.com/v2';
    const url = `${baseUrl}/${endpoint}`;
    
    // Get API key from environment variables
    const apiKey = process.env.IQAIR_API_KEY?.trim();
    
    if (!apiKey) {
      logger.error('IQAir API key is not configured');
      throw new Error('IQAir API key is not configured');
    }
    
    // Prepare request options
    const options = {
      method,
      url,
      params: { ...params, key: apiKey },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 10000, // 10 second timeout
    };

    logger.debug(`Making request to IQAir API: ${url}`, { 
      method,
      params: { ...params, key: '[REDACTED]' } // Don't log the actual API key
    });
    
    // Make the request
    const response: AxiosResponse<T> = await axios(options);
    
    // Check if the response has the expected structure
    if (response.data && typeof response.data === 'object') {
      logger.debug('IQAir API response received successfully', {
        status: response.status,
        statusText: response.statusText
      });
      return response.data;
    } else {
      logger.error('Unexpected response format from IQAir API', {
        data: response.data
      });
      throw new Error('Unexpected response format from IQAir API');
    }
  } catch (error) {
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logger.error(`IQAir API error: ${axiosError.response.status}`, {
          data: axiosError.response.data,
          status: axiosError.response.status,
          headers: axiosError.response.headers,
        });
        
        // Return the error response data if available
        if (axiosError.response.data) {
          return axiosError.response.data as T;
        }
        
        throw new Error(`IQAir API error: ${axiosError.response.status} - ${axiosError.response.statusText}`);
      } else if (axiosError.request) {
        // The request was made but no response was received
        logger.error('No response received from IQAir API', {
          request: {
            method: axiosError.request.method,
            url: axiosError.request.url,
          }
        });
        throw new Error('No response received from IQAir API - request timed out or network error');
      } else {
        // Something happened in setting up the request that triggered an Error
        logger.error(`Error setting up request to IQAir API: ${axiosError.message}`);
        throw new Error(`Error setting up request to IQAir API: ${axiosError.message}`);
      }
    } else {
      // Handle non-Axios errors
      logger.error(`Unexpected error in IQRIClient: ${error.message}`, {
        error: error
      });
      throw error;
    }
  }
}
