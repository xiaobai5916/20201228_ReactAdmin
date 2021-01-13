import './Side.css';
import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

class Side extends React.Component {

    state = {
      data: [
        {
          "key": '1',
          "title": "测试",
          "children": [
            {
              "key": '4',
              "title": "测试4",
              "children": [
                {
                  "key": '7',
                  "title": "测试7"
                },
                {
                  "key": '8',
                  "title": "测试8"
                }
              ]
            }
          ]
        },
        {
          "key": '2',
          "title": "测试2",
          "children": [
            {
              "key": '5',
              "title": "测试5",
            }
          ]
        },
        {
          "key": '3',
          "title": "测试3",
          "children": [
            {
              "key": '6',
              "title": "测试6",
              "children": [
                {
                  "key": '9',
                  "title": "测试9",
                },
                {
                  "key": '10',
                  "title": "测试10",
                }
              ]
            }
          ]
        }
      ]
    }
  
    recursion(dataSource) {
      return (
        dataSource.map((menu, index) => {
          if (menu.children) {
            return (
              <SubMenu key={menu.key} title={menu.title}>
                {this.recursion(menu.children)}
              </SubMenu>
            )
          } else {
            return (<Menu.Item key={menu.key}>{menu.title}</Menu.Item>)
          }
        })
      )
    }
  
    render() {
      return (
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            style={{ width: 200 }}
          >
            { this.recursion(this.state.data) }
          </Menu>
        </Sider>
      );
    }
  }
export default Side;