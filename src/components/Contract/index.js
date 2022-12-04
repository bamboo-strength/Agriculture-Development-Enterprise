const searchForm = {
  custNo: null,
  materialCode: null,
  organizationId: null,
  startDate: null,
  endDate: null
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
