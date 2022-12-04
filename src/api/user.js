import { request } from '@/utils/http';
import Func from '@/utils/Func';

/**
 * 用户登录
 */
const accountLogin = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/mobileUser/login',
    data: params
  })
};

/**
 * 用户注册
 */
const accountRegieter = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/mobileUser/register',
    method: 'POST',
    data: params
  })
}

const updatePwd = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/mobileUser/updatePassword',
    method: 'POST',
    data: params
  });
}

export const userApi = {
  accountLogin,
  accountRegieter,
  updatePwd
}
