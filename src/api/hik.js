import { request } from '@/utils/http';
import * as uuid from 'node-uuid';
import CryptoJS from 'crypto-js';
import defaultSettings from '@/utils/defaultSettings';

const { appKey, appSecret } = defaultSettings;
const defaultHeader = {
  Accept: '*/*',
  'Content-Type': 'application/json',
}

/**
 * 获取token 信息
 */
const getToken = () => {
  const method = 'POST';
  const accept = '*/*';
  const contentType = 'application/json';
  const timestamp = Date.now();
  const nonce = uuid.v4();
  const secret = method + '\n' +
    accept + '\n' +
    contentType + '\n' +
    'x-ca-key:' + appKey + '\n' +
    'x-ca-nonce:' + nonce + '\n' +
    'x-ca-timestamp:' + timestamp + '\n' +
    '/artemis/api/v1/oauth/token';
  const sign = CryptoJS.HmacSHA256(secret, appSecret).toString(CryptoJS.enc.Base64);

  return request({
    url: process.env.VUE_APP_HIK_APP + '/artemis/api/v1/oauth/token',
    method,
    body: null,
    header: {
      ...defaultHeader,
      'x-ca-timestamp': timestamp,
      'x-ca-nonce': nonce,
      'x-ca-key': appKey,
      'x-ca-signature-headers': 'x-ca-key,x-ca-nonce,x-ca-timestamp',
      'x-ca-signature': sign
    }
  })
}

/**
 * 获取摄像头视频流
 */
const getStreaning = params => {
  const accessToken = uni.getStorageSync('accessToken');
  return request({
    url: process.env.VUE_APP_HIK_APP + '/artemis/api/video/v2/cameras/previewURLs',
    method: 'POST',
    data: params,
    header: {
      ...defaultHeader,
      'access_token': accessToken
    }
  })
}

/**
 * 分页获取监控点资源
 */
const getCanvas = params => {
  const accessToken = uni.getStorageSync('accessToken');
  return request({
    url: process.env.VUE_APP_HIK_APP + '/artemis/api/resource/v1/cameras',
    method: 'POST',
    data: params,
    header: {
      ...defaultHeader,
      'access_token': accessToken
    }
  })
}

export const hikApi = {
  getToken,
  getCanvas,
  getStreaning
}
