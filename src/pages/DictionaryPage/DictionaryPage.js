import './DictionaryPage.css';
import React from 'react';

import { 
    Table, 
    Badge, 
    Menu, 
    Dropdown, 
    Space, 
    Breadcrumb, 
    Button
} from 'antd';
import { DownOutlined } from '@ant-design/icons';

import data from './data.json';
import Dialog from './components/Dialog'

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);

function ExpandedRowRender(props) {
    const values = props.values
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
      { title: 'Address', dataIndex: 'address', key: 'address' },
      {
        title: 'Status',
        key: 'state',
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        ),
      },
      {
        title: 'Action',
        dataIndex: 'operation',
        key: 'operation',
        render: () => (
          <Space size="middle">
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown overlay={menu}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ];

    // const datas = [];
    // for (let i = 0; i < 120; ++i) {
    //   datas.push({
    //     key: i,
    //     date: '2014-12-24 23:12:00',
    //     name: 'This is production name',
    //     upgradeNum: 'Upgraded: 56',
    //   });
    // }

    function showTotal(total) {
      return `共 ${total} 条`;
    }

    return (
      <div>
        <Table
          columns={columns} 
          dataSource={values} 
          pagination={{ 
            position: ['none', 'bottomRight'], 
            defaultCurrent: 1,
            defaultPageSize: 10,
            // current: 4,
            // pageSize: 10,
            showTotal: showTotal
          }} 
        /> 
      </div>
    )
  };

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
    display: false,
    values: [],
    visible: false
  }

  // 点击当前行,获取当前行所有信息
  tableDisplay = (data) => {
    console.log('当前点击行的数据：', data)
    console.log(data.key)
    if(data.values && data.values.length > 0) {
      this.state.values = data.values
      this.setState({ display: true })
    }else{
      this.setState({ display: false })
    }
    // console.log(this.state.display)
  }
  
  // 双击行，关闭一级菜单下的二级菜单表格
  doubleClickClose = () => {
    this.setState({ display: false })
  }

  addMenu = () => {
    
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
          // expandable={{ expandedRowRender }}
          selections={false}
          dataSource={this.state.data}
          pagination={{ 
            position: ['none', 'bottomRight'], 
            defaultCurrent: 1,
            defaultPageSize: 10,
            // current: 3, 
            // pageSize: 5,
            showTotal: total => `共 ${total} 条`
          }}
        />
        <div style={{display: this.state.display ? 'block' : 'none'}}>
          <ExpandedRowRender values={this.state.values} />
        </div>
      </div>
    );
  }
}

export default DictionaryPage;