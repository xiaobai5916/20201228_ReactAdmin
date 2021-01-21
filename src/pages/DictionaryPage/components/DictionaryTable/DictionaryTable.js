import React from 'react';
import { 
    Table, 
    Badge, 
    Menu, 
    Dropdown, 
    Space, 
} from 'antd';
import { DownOutlined } from '@ant-design/icons';

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);


class DictionaryTable extends React.Component {
  state = {
    tableFlag: this.props.tableFlag,
    values: [],
    columns: [
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
    ]
  }

  showTotal = (total) => {
    return `共 ${total} 条`;
  }

  tableDisplay = (data) => {
    console.log('点击当前行data', data);
    localStorage.setItem('level', data.level)
    if(data.values && data.values.length > 0 ) {
      this.setState({
        level: data.level,
        values: data.values,
        tableFlag: true
      })
    }else{
      this.setState({
        level: data.level,
        values: [],
        tableFlag: false
      })
    }
  }

  doubleClickClose = () => {
    this.setState({ tableFlag: false })
  }

  render () {
    const { values } = this.props;
    console.log('table this.props', this.props)
    console.log('table this.state', this.state)
    console.log(localStorage.getItem('level'))
    return (
      <div>
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
          columns={this.state.columns} 
          dataSource={values} 
          pagination={{ 
            position: ['none', 'bottomRight'], 
            defaultCurrent: 1,
            defaultPageSize: 10,
            showTotal: this.showTotal
          }} 
        /> 
        {
          this.state.tableFlag && localStorage.getItem('level') >= this.state.level ? (
            <DictionaryTable values={this.state.values} level={this.state.level} />
          ) : null
        }
      </div>
    )
  }
};

export default DictionaryTable;