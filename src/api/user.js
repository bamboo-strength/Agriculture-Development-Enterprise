import { request } from '@/utils/http';
import Func from '@/utils/Func';
import { stringify } from 'qs';

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
    methods: 'POST',
    data: Func.toFormData(params)
  })
}

const updatePwd = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/mobileUser/updatePassword',
    methods: 'POST',
    data: Func.toFormData(params)
  });
}

export const userApi = {
  accountLogin,
  accountRegieter,
  updatePwd
}
