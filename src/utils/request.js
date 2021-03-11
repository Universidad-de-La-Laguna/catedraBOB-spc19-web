import { extend } from 'umi-request';
import { notification } from 'antd';

const codeMessage = {
  200: '200',
  201: '201',
  202: '202',
  204: '204',
  400: '400',
  401: '401',
  403: '403',
  404: '404',
  406: '406',
  410: '410',
  422: '422',
  500: '500',
  502: '502',
  503: '503',
  504: '504',
};

const errorHandler = (error) => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `Request Error ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      message: 'Network Anomaly',
      description: 'Your network is abnormal and you cannot connect to the server',
    });
  }

  return response;
};

const request = extend({ errorHandler });
export default request;
