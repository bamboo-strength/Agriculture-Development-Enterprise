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
};

/**
 * 通过id来获取派车单信息
 */
const getDispatchById = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/dispatch/getDispatch',
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
    data: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

/**
 * 散户销售派车单申请表
 */
const insertSaleRetail = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/dispatch/saleRetailAdd',
    method: 'POST',
    data: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
};

/**
 * 删除派车单信息
 */
const deleteDispatch = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/dispatch/delete',
    method: 'GET',
    data: params
  })
};

/**
 * 修改派车单信息
 */
const updateDispatch = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/dispatch/update',
    method: 'POST',
    data: params,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export const truckingOrderApi = {
  getDispatch,
  getDispatchById,
  insertCustomOrder,
  insertSaleRetail,
  deleteDispatch,
  updateDispatch
}
