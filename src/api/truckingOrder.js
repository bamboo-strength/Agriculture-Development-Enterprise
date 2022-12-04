import { request } from '@/utils/http';

/**
 * 分页查询派车单信息
 */
const getDispatch = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/dispatch/query',
    method: 'GET',
    data: params
  })
}

/**
 * 大客户销售派车添加接口
 */
const insertCustomOrder = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/dispatch/saleKeyAdd',
    method: 'POST',
    data: params
  })
}

export const truckingOrderApi = {
  getDispatch,
  insertCustomOrder
}
