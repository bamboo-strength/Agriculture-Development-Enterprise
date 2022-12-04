export default {
  props: {
    localdata: {
      type: [Array, Object],
      default () {
        return []
      }
    },
    value: {
      type: [Array, String, Number],
      default () {
        return []
      }
    },
    modelValue: {
      type: [Array, String, Number],
      default () {
        return []
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    map: {
      type: Object,
      default () {
        return {
          text: "text",
          value: "value"
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      errorMessage: '',
      loadMore: {
        contentdown: '',
        contentrefresh: '',
        contentnomore: ''
      },
      dataList: [],
      selected: [],
      selectedIndex: 0
    }
  },
  computed: {
    isLocalData() {
      return true;
    },
    dataValue() {
      let isModelValue = Array.isArray(this.modelValue) ? (this.modelValue.length > 0) : (this.modelValue !== null ||
        this.modelValue !== undefined);
      return isModelValue ? this.modelValue : this.value;
    },
    hasValue() {
      if (typeof this.dataValue === 'number') {
        return true
      }
      return (this.dataValue != null) && (this.dataValue.length > 0)
    }
  },
  created() {
    this.$watch(() => {
      var al = [];
      [
        'value',
        'modelValue',
        'localdata'
      ].forEach(key => {
        al.push(this[key])
      });
      return al
    }, () => {
      this.onPropsChange()
    })
    this._treeData = []
  },
  methods: {
    onPropsChange() {
      this._treeData = [];
    },

    // 加载本地数据
    async loadLocalData() {
      this._treeData = [];
      this._extractTree(this.localdata, this._treeData);

      let inputValue = this.dataValue;
      if (inputValue === undefined) {
        return;
      }

      if (Array.isArray(inputValue)) {
        inputValue = inputValue[inputValue.length - 1];
        if (typeof inputValue === 'object' && inputValue[this.map.value]) {
          inputValue = inputValue[this.map.value];
        }
      }

      this.selected = this._findNodePath(inputValue, this.localdata);
      this._updateBindData();
    },

    _updateBindData(node) {
      const {
        dataList,
        hasNodes
      } = this._filterData(this._treeData, this.selected)

      let isleaf = this._stepSearh === false && !hasNodes

      if (node) {
        node.isleaf = isleaf
      }

      this.dataList = dataList
      this.selectedIndex = dataList.length - 1

      if (!isleaf && this.selected.length < dataList.length) {
        this.selected.push({
          value: null,
          text: "请选择"
        })
      }

      return {
        isleaf,
        hasNodes
      }
    },

    _filterData(data, paths) {
      let dataList = []
      let hasNodes = true

      dataList.push(data.filter((item) => {
        return (item.parent_value === null || item.parent_value === undefined || item.parent_value === '')
      }))
      for (let i = 0; i < paths.length; i++) {
        let value = paths[i].value
        let nodes = data.filter((item) => {
          return item.parent_value === value
        })

        if (nodes.length) {
          dataList.push(nodes)
        } else {
          hasNodes = false
        }
      }

      return {
        dataList,
        hasNodes
      }
    },

    _extractTree(nodes, result, parent_value) {
      let list = result || []
      let valueField = this.map.value
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]

        let child = {}
        for (let key in node) {
          if (key !== 'children') {
            child[key] = node[key]
          }
        }
        if (parent_value !== null && parent_value !== undefined && parent_value !== '') {
          child.parent_value = parent_value
        }
        result.push(child)

        let children = node.children
        if (children) {
          this._extractTree(children, result, node[valueField])
        }
      }
    },

    _findNodePath(key, nodes, path = []) {
      let textField = this.map.text
      let valueField = this.map.value
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        let children = node.children
        let text = node[textField]
        let value = node[valueField]

        path.push({
          value,
          text
        })

        if (value === key) {
          return path
        }

        if (children) {
          const p = this._findNodePath(key, children, path)
          if (p.length) {
            return p
          }
        }

        path.pop()
      }
      return []
    }
  }
}
