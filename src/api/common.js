import { request } from '@/utils/http';

/**
 * 获取客户信息
 * 用于实现注册、查询页面的客户拼音检索
 */
const getCust = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/custinfo/query',
    method: 'GET',
    data: params
  })
};

/**
 * 物资拼音码接口
 * 用于实现注册、查询页面的物资拼音检索
 */
const getMaterial = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/material/query',
    method: 'GET',
    data: params
  })
};

/**
 * 获取单位信息
 */
const getUnit = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/organization/query',
    method: 'GET',
    data: params
  })
};

/**
 * 查询合同信息
 */
const getSaleOrder = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/saleOrder/query',
    method: 'GET',
    data: params
  })
};

/**
 * 查询车辆信息
 */
const getVehicle = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/vehicle/query',
    method: 'GET',
    data: params
  })
}

export const commonApi = {
  getCust,
  getMaterial,
  getUnit,
  getSaleOrder,
  getVehicle
}
