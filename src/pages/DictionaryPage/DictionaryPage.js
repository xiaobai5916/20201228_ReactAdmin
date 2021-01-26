import './DictionaryPage.css';
import React from 'react';
import { Table, Breadcrumb, Button, Space } from 'antd';
import axios from 'axios';

import data from './data.json';
import Dialog from './components/Dialog';
import DictionaryTable from './components/DictionaryTable'

window.track = [];// 轨迹
class DictionaryPage extends React.Component {
  state = {
    columns: [
      { title: '字典名称', dataIndex: 'dictName', key: 'dictName' },
      { title: '字典key', dataIndex: 'dictKey', key: 'dictKey' },
      { title: '积分类型', dataIndex: 'dictPointType', key: 'dictPointType' },
      { title: '字典类型', dataIndex: 'dictType', key: 'dictType' },
      { title: '字典描述', dataIndex: 'desc_', key: 'desc_' },
      { title: '机构编码', dataIndex: 'orgCode', key: 'orgCode' },
      { 
        title: '操作', 
        key: 'operation', 
        render: (record) => (
          <Space size="middle">
            {/* <Button type="danger" onClick={event => {this.del(event, record)}}>
              删除
            </Button> */}
            <Button onClick={event => {this.edit(event, record)}}>
              编辑
            </Button>
          </Space>
        ),
      }
    ],
    data: data,
    tableDisplay: false,
    values: [],
    level: 0,
    idx: [0],
    list: []
  }

  del = (e, data) => {
    e.stopPropagation();
    console.log(e, data)
  }

  edit = (e, data) => {
    e.stopPropagation();
    console.log(e, data)
  }

  // 点击当前行,获取当前行所有信息
  tableDisplay = (data, index) => {
    localStorage.setItem('level', data.level)
    window.track = [];
    window.track.push({level: data.level, name: data.name, index});
    this.setState({idx: JSON.parse(JSON.stringify([index]))})
    if(data.values && data.values.length > 0) {
      this.setState({ 
        level: data.level,
        tableDisplay: true,
        values: data.values
      })
    }else{
      this.setState({ 
        level: data.level,
        tableDisplay: false,
        values: []
      })
    }
  }
  
  // 双击行，关闭一级菜单下的二级菜单表格
  doubleClickClose = () => {
    this.setState({ tableDisplay: false })
  }

  componentWillMount() {
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

  render() {
    console.log(localStorage.getItem('level'))
    return (
      <div>
        <div className="clearfix">
          <Breadcrumb className="fl" style={{ marginBottom: '16px' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div className="fr" style={{ marginBottom: '16px' }}>
            <Dialog 
              addHandle = {(data)=>{
                const newData = JSON.parse(JSON.stringify(data))
                let newValues = data[this.state.idx[0]].values.slice()
                this.setState({ data: newData, values: newValues })
              }}
            />
          </div>
        </div>
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
          columns={this.state.columns}
          selections={false}
          dataSource={this.state.data}
          pagination={{ 
            position: ['none', 'bottomRight'], 
            defaultCurrent: 1,
            defaultPageSize: 10,
            showTotal: total => `共 ${total} 条`
          }}
        />
        {
          this.state.tableDisplay ? (
            <DictionaryTable values={this.state.values} idx={this.state.idx} data={this.state.data} level={this.state.level} />
          ) : null
        }
      </div>
    );
  }
}

export default DictionaryPage;