import './DictionaryPage.css';
import React from 'react';
// 在需要用到的 组件文件中引入中文语言包
import zhCN from 'antd/es/locale/zh_CN'; 
// 引入国际化配置
import { Table, Select, ConfigProvider  } from 'antd';
import axios from 'axios';

import data from './data.json';
import Dialog from './components/Dialog';
import DictionaryTable from './components/DictionaryTable';

const { Option } = Select;

window.track = [];// 轨迹
class DictionaryPage extends React.Component {
  state = {
    columns: [
      { width: 150,title: '字典key', dataIndex: 'dictKey', key: 'dictKey' },
      { width: 150,title: '字典名称', dataIndex: 'dictName', key: 'dictName' },
      { width: 150,title: '字典类别', dataIndex: 'dictType', key: 'dictType' },
      // { width: 150,title: '积分类别', dataIndex: 'dictPointType', key: 'dictPointType' },
      { width: 100,title: '排序', dataIndex: 'order', key: 'order' },
      { width: 150,title: '字典描述', dataIndex: 'desc_', key: 'desc_' },
      { width: 150,title: '机构编码', dataIndex: 'orgCode', key: 'orgCode' },
    ],
    jsonData: data,
    tableDisplay: false,
    values: [],
    level: 0,
    idx: [0],
    list: [],
    dictValue: '0',
    local: zhCN,
    currentData: {}
  }

  add = (e, data) => {
    e.stopPropagation();
    console.log(e, data)
  }

  edit = (e, data) => {
    e.stopPropagation();
    console.log(e, data)
  }

  // del = (e, data) => {
  //   e.stopPropagation();
  //   console.log(e, data)
  // }

  // 点击当前行,获取当前行所有信息
  tableDisplay = (data, index) => {
    console.log('page:', data)
    localStorage.setItem('level', data.level)
    window.track = [];
    window.track.push({level: data.level, name: data.dictName, index});
    this.setState({idx: JSON.parse(JSON.stringify([index]))})
    if(data.values && data.values.length > 0) {
      this.setState({ 
        level: data.level,
        tableDisplay: true,
        values: data.values,
        currentData: data
      })
    }else{
      this.setState({ 
        level: data.level,
        tableDisplay: false,
        values: [],
        currentData: data
      })
    }
  }
  
  // 双击行，关闭一级菜单下的二级菜单表格
  doubleClickClose = () => {
    this.setState({ tableDisplay: false })
  }

  handleChange = (item) => {
    console.log('dictValue:', item)
  }

  onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
  }

  onChange = (page) => {
    console.log(page);
  }

  getDictList = () => {
    console.log('调用查询接口：/dict/getParentDict')
    axios.get('http://192.168.43.254:8099/dict/getParentDict?current=1&pageSize=10')
      .then((res) => {
        console.log('res', res)
        this.setState({
          list: res.data.data.list,
          total: res.data.data.total
        })
        console.log('list', this.state.list)
      })
  }

  componentWillMount() {
    this.getDictList()
  }

  render() {
    const { columns, local, values, idx, jsonData, level } = this.state
    console.log(localStorage.getItem('level'))
    return (
      <div>
        <div className="clearfix">
          <div className="fl">
            字典类别：
            <Select defaultValue={this.state.dictValue} style={{ width: 120 }} onChange={this.handleChange}>
              <Option value="0">规则类</Option>
              <Option value="1">系统工具类</Option>
              <Option value="2">其他类</Option>
            </Select>
          </div>
          <div className="fr" style={{ marginBottom: '16px' }}>
            <Dialog 
              currentData={this.state.currentData}
              getDictList={this.getDictList}
              addHandle = {(data)=>{
                const newData = JSON.parse(JSON.stringify(data))
                let newValues = data[this.state.idx[0]].values.slice()
                this.setState({ data: newData, values: newValues })
              }}
            />
          </div>
        </div>
        <ConfigProvider locale={local}>
          <Table
            rowKey={record => record.dictKey}
            onRow={(record, index) => {
              return {
                onClick: this.tableDisplay.bind(this, record, index), // 点击行,获取当前行所有信息
                onDoubleClick: this.doubleClickClose,  // 双击行，关闭二级菜单
                // onContextMenu: event => {},
                // onMouseEnter: event => {}, // 鼠标移入行
                // onMouseLeave: event => {},
              };
            }}
            className="components-table-demo-nested"
            showHeader="false"
            columns={columns}
            selections={false}
            dataSource={jsonData}
            pagination={{ 
              size: 'small',
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showQuickJumper: true,
              onShowSizeChange: this.onShowSizeChange,
              onChange: this.onChange,
              position: ['none', 'bottomLeft'], 
              defaultCurrent: 1,
              defaultPageSize: 10,
              showTotal: total => `共 ${total} 条`
            }}
          />
        </ConfigProvider>
        {
          this.state.tableDisplay ? (
            <DictionaryTable values={values} idx={idx} data={jsonData} level={level} />
          ) : null
        }
      </div>
    );
  }
}

export default DictionaryPage;