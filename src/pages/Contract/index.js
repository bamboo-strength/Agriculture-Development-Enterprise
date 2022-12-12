import { formatDate } from '@/utils/date';

const formatType = 'yyyy-mm-dd HH:MM:SS';

const today = new Date();
const lastMonth = today.getTime() - 1000 * 60 * 60 * 24 * 30;

const searchForm = {
  custNo: null,
  materialCode: null,
  organizationId: null,
  startDate: formatDate(new Date(lastMonth), formatType), // 开始时间
  endDate: formatDate(today, formatType), // 结束时间
};

const contractItem = [
  { title: '主合同号', prop: 'orderId' },
  { title: '子合同号', prop: 'orderNo' },
  { title: '所属单位', prop: 'organizationName' },
  { title: '物资名称', prop: 'materialName' },
  { title: '客户名称', prop: 'custName' },
  { title: '开始时间', prop: 'startDate' },
  { title: '结束时间', prop: 'endDate' }
]

export const Contract = {
  searchForm,
  contractItem
}
