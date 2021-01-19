import './DictionaryPage.css';
import React from 'react';
import { Table, Breadcrumb } from 'antd';

import data from './data.json';
import Dialog from './components/Dialog';
import DictionaryTable from './components/DictionaryTable'



class DictionaryPage extends React.Component {
  
  state = {
    columns: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Platform', dataIndex: 'platform', key: 'platform' },
      { title: 'Version', dataIndex: 'version', key: 'version' },
      { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      { title: 'Creator', dataIndex: 'creator', key: 'creator' },
      { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
      { title: 'Action', key: 'operation', render: () => <a>Publish</a> },
    ],
    data: data,
    tableDisplay: false,
    values: [],
    visible: false
  }

  // 点击当前行,获取当前行所有信息
  tableDisplay = (data) => {
    console.log('当前点击行的数据：', data)
    console.log(data.key)
    if(data.values && data.values.length > 0) {
      this.setState({ 
        tableDisplay: true,
        values: data.values
      })
    }else{
      this.setState({ 
        tableDisplay: false,
        valuse: []
      })
    }
  }
  
  // 双击行，关闭一级菜单下的二级菜单表格
  doubleClickClose = () => {
    this.setState({ tableDisplay: false })
  }

  render() {
    return (
      <div>
        <div className="clearfix">
          <Breadcrumb className="fl" style={{ marginBottom: '16px' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div className="fr" style={{ marginBottom: '16px' }}>
            <Dialog />
          </div>
        </div>
        <Table
          onRow={record => {
            return {
              onClick: this.tableDisplay.bind(this, record), // 点击行,获取当前行所有信息
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
            <DictionaryTable values={this.state.values} visible={this.state.visible}/>
          ) : null
        }
      </div>
    );
  }
}

export default DictionaryPage;