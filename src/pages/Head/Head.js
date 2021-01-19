import React from 'react';
import './Head.css';
import logo from '../../logo.svg';
import { Layout, Menu } from 'antd';

const { Header } = Layout;

function Head () {
    return (
        <Header className="header clearfix">
            <div className="logo fl">
                <img src={logo} className="App-logo" alt="logo" />
                <span>综合积分系统</span>
            </div>
            <Menu className="fl" theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item key="1">nav 1</Menu.Item>
                <Menu.Item key="2">nav 2</Menu.Item>
                <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
        </Header>
    )
}

export default Head;