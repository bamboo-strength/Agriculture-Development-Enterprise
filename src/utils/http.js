import axios from 'axios';

class http {
  static create(config) {
    const request = axios.create(config);
    const cancelToken = axios.CancelToken;

    const source = cancelToken.source();

    request.interceptors.response.use(
      response => {

        if (response.request.responseType === 'blob') {
          return Promise.resolve(response.data);
        }

        return response.data.data;
      },
      error => {
        return Promise.reject(error);
      }
    );

    request.interceptors.request.use(
      request => {
        request.headers = {
          ...request.headers,
          'Cache-Control': 'no-cache'
        };
        return request;
      },
      error => {
        return Promise.reject(error);
      }
    );
    return request;
  }
}

export default http;
