import React from 'react';
import { 
    Table, 
    Space, 
    Button
} from 'antd';
// import axios from 'axios';

class DictionaryTable extends React.Component {
  state = {
    tableFlag: this.props.tableFlag,
    values: [],
    columns: [
      { title: '字典名称', dataIndex: 'dictName', key: 'dictName' },
      { title: '字典key', dataIndex: 'dictKey', key: 'dictKey' },
      { 
        title: '操作', 
        key: 'operation', 
        render: (record) => (
          <Space size="middle">
            <Button type="danger" onClick={event => {this.del(event, record)}}>
              删除
            </Button>
            <Button onClick={event => {this.edit(event, record)}}>
              编辑
            </Button>
          </Space>
        ),
      }
    ],
    dataBackUp:'',
    idx:[]
  }

  del = (e, data) => {
    e.stopPropagation();
    console.log(e, data)
  }

  edit = (e, data) => {
    e.stopPropagation();
    console.log(e, data)
  }

  showTotal = (total) => {
    return `共 ${total} 条`;
  }

  tableDisplay = (data, index) => {
    localStorage.setItem('level', data.level)
    let idx = [];
    for(let i = 0; i< window.track.length; i++){
      if( window.track[i].level >= data.level){
        window.track.splice( i, 1 )
        idx.splice( i, 1 )
        i--;
      }
    }
    window.track.push({level: data.level, name: data.name, index});
    for(var i = 0;i<window.track.length;i++){
      idx.push(window.track[i].index);
    }
    this.setState({ idx })
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

  componentDidMount(){
    this.setState({dataBackUp: JSON.stringify(this.props.data), idx: JSON.parse(JSON.stringify(this.props.idx))})
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.idx.length>this.state.idx.length) this.setState({idx: JSON.parse(JSON.stringify(nextProps.idx))})
    if(JSON.stringify(nextProps.data) !== this.state.dataBackUp){
      let newValues = nextProps.data;
      if(this.state.idx.length !== 0){
        this.state.idx.forEach((item, index)=>{
          if(index < this.state.idx.length){
            newValues = newValues[item].values
          }})
        if(this.state.tableFlag) this.setState({values:JSON.parse(JSON.stringify(newValues))})
      }
    }
  }
  render () {
    const { values } = this.props;
    return (
      <div>
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
            <DictionaryTable values={this.state.values} idx={this.state.idx} data={this.props.data} level={this.state.level} />
          ) : null
        }
      </div>
    )
  }
};

export default DictionaryTable;