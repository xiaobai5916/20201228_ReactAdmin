import './App.css';
import React from 'react';
import Head from './pages/Head'
import Side from './pages/Side'
import DictionaryPage from './pages/DictionaryPage'
import { Layout } from 'antd';

const { Content } = Layout;

function App() {
  return (
    <Layout>
      <Head />
      <Layout>
        <Side />
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <DictionaryPage />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App;