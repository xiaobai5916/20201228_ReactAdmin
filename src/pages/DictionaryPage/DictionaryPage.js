import './DictionaryPage.css';
import React from 'react';
import { Table, Breadcrumb, Button, Space, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import data from './data.json';
import Dialog from './components/Dialog';
import DictionaryTable from './components/DictionaryTable'


const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);

class DictionaryPage extends React.Component {
  
  state = {
    columns: [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Platform', dataIndex: 'platform', key: 'platform' },
      { title: 'Version', dataIndex: 'version', key: 'version' },
      { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
      { title: 'Creator', dataIndex: 'creator', key: 'creator' },
      { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
      { 
        title: 'Action', 
        key: 'operation', 
        render: () => (
          <Space size="middle">
            <Button onClick={this.del}>
              删除
            </Button>
            <Button onClick={this.edit}>
              编辑
            </Button>
            <Dropdown overlay={menu}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      }
    ],
    data: data,
    tableDisplay: false,
    values: [],
    level: 0
  }

  del = (params) => {
    console.log(params)
  }

  edit = (params) => {
    console.log(params)
  }

  // 点击当前行,获取当前行所有信息
  tableDisplay = (data) => {
    console.log('当前点击行的数据data：', data)
    localStorage.setItem('level', data.level)
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

  render() {
    console.log('page this.state', this.state)
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
            <DictionaryTable values={this.state.values} level={this.state.level} />
          ) : null
        }
      </div>
    );
  }
}

export default DictionaryPage;