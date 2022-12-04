import { formatDate } from '@/utils/date';

const formatType = 'yyyy-mm-dd HH:MM:SS';

const today = new Date();
const yesterday = today.getTime() - 1000 * 60 * 60 * 24 * 3;

const truckingOrderForm = {
  custNo: null, // 客户编号
  organizationId: null, // 所属单位编号
  materialNo: null, // 物资编号
  startDate: formatDate(new Date(yesterday), formatType), // 开始时间
  endDate: formatDate(today, formatType), // 结束时间
  vehicleNo: null, // 车号
  businessType: null, // 业务类型
  vehicleStatus: null // 车辆状态
};

const orderItem = [
  { title: '所属单位', prop: 'organizationName' },
  { title: '业务类型', prop: 'businessTypeName' },
  { title: '客户', prop: 'custName' },
  { title: '物资编号', prop: 'materialName' },
  { title: '发运类型', prop: 'shipmentTypeName' },
  { title: '车辆状态', prop: 'vehicleStatusName' },
  { title: '创建时间', prop: 'createDate' }
]
const businessTypes = [
  { value: '01', text: '销售' },
  { value: '02', text: '采购' }
];

const vehicleStatus = [
  { value: '0', text: '已派车' },
  { value: '2', text: '第一次过磅' },
  { value: '4', text: '第二次过磅' },
  { value: '5', text: '出门岗' },
];

// 大客户销售派车单申请表信息
const mApplyForm = {
  custNo: null, // 客户编号
  materialNo: null, // 物资编号
  vehicleNo: null, // 车号
  orderMainNo: null, // 主合同号
  orderSubNo: null, // 子合同号
  preamount: null, // 预装量
  driverName: null, // 司机姓名
  idCard: null, // 司机身份证号
  shipmentNum: null, // 发运次数  0：不限制 >0：具体次数
  isOverLenghFlag: null, // 超长车标志0否1是
  organizationId: null, //组织单位id
  appcreateBy: null // app创建者
};

// 散户销售派车单申请表信息
const rApplyForm = {
  custNo: null, // 客户编号
  materialNo: null, // 物资编号
  vehicleNo: null, // 车号
  preamount: null, // 预装量
  driverName: null, // 司机姓名
  idCard: null, // 司机身份证号
  shipmentNum: null, // 发运次数  0：不限制 >0：具体次数
  cycleTime: null, // 循环结束时间
  isOverLenghFlag: null, // 超长车标志
  organizationId: null, //组织单位id
  appcreateBy: null // app创建者
}

export const truckingOrder = {
  truckingOrderForm,
  mApplyForm,
  rApplyForm,
  orderItem,
  businessTypes,
  vehicleStatus
}
