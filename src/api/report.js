import { request } from '@/utils/http';

const getProject = params => {
  return request({
    url: process.env.VUE_APP_COMMON_API + '/nfjt/app/project/query',
    method: 'GET',
    data: params
  })
}
export const reportApi = {
  getProject
}
