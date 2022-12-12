import { commonApi } from '@/api/common';

export default {
  name: 'CommonMixin',
  data() {
    return {
      pageNum: 1,
      pageSize: 5,
      completed: false,
      loadStatus: 'more',
      unitData: [],
      custData: [],
      materialData: [],
      vehicleData: [],
      selectCache: {}
    }
  },

  methods: {
    // 客户信息检索
    searchCust($event) {
      commonApi.getCust({ spellCode: $event })
        .then(result => {
          if (!result.success) {
            this.custData = [];
            return;
          }
          this.custData = [
            ...result.list
          ]
        })
    },

    // 物资检索
    searchMaterial($event) {
      commonApi.getMaterial({ spellCode: $event })
        .then(result => {
          if (!result.success) {
            this.materialData = [];
            return;
          }
          this.materialData = [
            ...result.list
          ]
        })
    },
    
    searchVehicle($event) {
      commonApi.getVehicle({ vehicleNo: $event })
        .then(result => {
          if (!result.success) {
            this.vehicleData = [];
            return;
          }
    
          this.vehicleData = result.list;
        })
    },

    getUnit() {
      commonApi.getUnit()
        .then(result => {
          const params = this.convert(result.list);

          this.unitData = [
            ...params
          ]
        })
    },

    //  转换单位信息
    convert(nodes) {
      const result = [];
      const treeObj = params => {
        return {
          value: params.id,
          text: params.name,
          children: []
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].parentId === '0') {
          const obj = treeObj(nodes[i]);
          result.push(obj);
          nodes.splice(i, 1);
          i--;
        }
      }

      const _generate = (chiArr) => {
        if (!chiArr.length) {
          return;
        }
        for (let i = 0; i < chiArr.length; i++) {
          for (var j = 0; j < nodes.length; j++) {
            if (chiArr[i].value === nodes[j].parentId) {
              const obj = treeObj(nodes[j]);
              chiArr[i].children.push(obj);
              nodes.splice(j, 1);
              j--;
            }
          }

          _generate(chiArr[i].children);
        }
      }

      _generate(result);

      return result;
    },
  }
}
