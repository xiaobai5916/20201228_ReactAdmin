import './DictionaryPage.css';
import React from 'react';
// 在需要用到的 组件文件中引入中文语言包
import zhCN from 'antd/es/locale/zh_CN'; 
// 引入国际化配置
import { Table, Select, ConfigProvider, Button  } from 'antd';
import axios from 'axios';

import data from './data.json';
import Dialog from './components/Dialog';
import DictionaryTable from './components/DictionaryTable';

const { Option } = Select;

window.track = []; // 轨迹
window.currentData = {}; // 当前行数据
class DictionaryPage extends React.Component {
  state = {
    columns: [
      { width: 150,title: '字典key', dataIndex: 'dictKey', key: 'dictKey' },
      { width: 150,title: '字典名称', dataIndex: 'dictName', key: 'dictName' },
      { width: 150,title: '字典类别', dataIndex: 'dictType', key: 'dictType' },
      // { width: 150,title: '积分类别', dataIndex: 'dictPointType', key: 'dictPointType' },
      { width: 100,title: '排序', dataIndex: 'sortOrder', key: 'sortOrder' },
      { width: 150,title: '字典描述', dataIndex: 'dictDesc', key: 'dictDesc' },
      { width: 150,title: '机构编码', dataIndex: 'orgCode', key: 'orgCode' },
    ],
    jsonData: data,
    tableDisplay: false,
    values: [],
    level: '0',
    idx: [0],
    list: [],
    dictValue: '0',
    local: zhCN,
    currentData: {},
    loading: false,
    rowId: '',
    currentNode: false
  }

  // 初始化字典类型
  getDictList = () => {
    this.setState({ loading: true });
    console.log('调用查询接口：/dict/getParentDict')
    axios.get('http://192.168.43.254:8099/dict/getParentDict?current=1&pageSize=10')
      .then((res) => {
        console.log('/dict/getParentDict接口res', res)
        this.setState({
          list: res.data.data.list,
          total: res.data.data.total,
          tableDisplay: false,
          loading: false
        })
      }).catch(() => {
        this.setState({loading: false});
      })
  }

  // 点击当前行,获取当前行所有信息
  tableDisplay = (data, index) => {
    return () => {
      let deleteEle = document.querySelectorAll(`tr[class*="clickRowStyl"]`);
      console.log(deleteEle)
      deleteEle.forEach(item => {
        item.classList.remove('clickRowStyl')
      })
      console.log('page:', data);
      localStorage.setItem('level', data.level);
      // 请求二级字典
      console.log('调用查询接口：/dict/getChildDict')
      axios.get(`http://192.168.43.254:8099/dict/getChildDict?current=1&pageSize=10&parentId=${data.id}`)
      .then(res => {
        window.track = [];
        window.currentData = { ...data };
        window.track.push({level: data.level, name: data.dictName, index});
        this.setState({idx: JSON.parse(JSON.stringify([index]))})
        let childData = res.data.data.list;
        console.log(childData)
        if(childData && childData.length > 0) {
          this.setState({ 
            level: data.level,
            tableDisplay: true,
            values: childData,
            rowId: data.id
          })
        }else{
          this.setState({ 
            level: data.level,
            tableDisplay: false,
            values: [],
            rowId: data.id
          })
        }
      })
      .catch(err => {
        console.log(err)
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

  setRowClassName = (record) => {
    return record.id === this.state.rowId ? 'clickRowStyl' : '';
  }

  handleCurrentNode = (event) => {
    // let node = event.target.nodeName.toLowerCase();
    // if(node === 'td') {
    //   this.setState({currentNode: true})
    // }else{
    //   this.setState({currentNode: false})
    // }
  }

  render() {
    const { columns, local, values, idx, jsonData, level, list, tableDisplay, loading, dictValue } = this.state
    return (
      <div onClick={this.handleCurrentNode}>
        <div className="clearfix">
          <div className="fl">
            字典类别：
            <Select defaultValue={dictValue} style={{ width: 120 }} onChange={this.handleChange}>
              <Option value="0">规则类</Option>
              <Option value="1">系统工具类</Option>
              <Option value="2">其他类</Option>
            </Select>
          </div>
          <div className="fr">
            <Button type="primary" onClick={this.getDictList}>
              初始化字典类型
            </Button>
          </div>
          <div className="fr" style={{ marginBottom: '16px' }}>
            <Dialog
              getDictList={this.getDictList}
              currentNode={this.state.currentNode}
            />
          </div>
        </div>
        <ConfigProvider locale={local}>
          <Table
            rowKey={record => record.id}
            onRow={(record, index) => {
              return {
                onClick: this.tableDisplay(record, index), // 点击行,获取当前行所有信息
                onDoubleClick: this.doubleClickClose,  // 双击行，关闭二级菜单
              };
            }}
            rowClassName={this.setRowClassName}
            className="components-table-demo-nested"
            showHeader="false"
            columns={columns}
            dataSource={list}
            loading={loading}
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
          {
            tableDisplay ? (
              <DictionaryTable values={values} idx={idx} data={jsonData} level={level} />
            ) : null
          }
        </ConfigProvider>
      </div>
    );
  }
}

export default DictionaryPage;