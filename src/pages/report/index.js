import { formatDate } from '@/utils/date';

const formatType = 'yyyy-mm-dd HH:MM:SS';

const today = new Date();
const lastMonth = today.getTime() - 1000 * 60 * 60 * 24 * 30;

const searchForm = {
  itemname: null,
  projectNo: null,
  startDate: formatDate(new Date(lastMonth), formatType), // 开始时间
  endDate: formatDate(today, formatType) // 结束时间
};

const reportItem = [
  { title: '项目名称', prop: 'itemname' },
  { title: '项目地址', prop: 'address' },
  { title: '项目状态', prop: 'itemcase', dict: {
    '0': '未开工',
    '1': '已开工'
  } },
  { title: '处置金额', prop: 'projectScale' },
  { title: '评估单位', prop: 'evaluationunit' },
  { title: '单价', prop: 'price', suffix: '元' },
  { title: '处置单位', prop: 'winunit' },
  { title: '运输单位', prop: 'transportunit' },
  { title: '转让单位', prop: 'transferunit' },
  { title: '中标单价', prop: 'unitprice', suffix: '元' }
]

export const report = {
  searchForm,
  reportItem
}
