import React from 'react';
import { Table } from 'antd';
import axios from 'axios';

class DictionaryTable extends React.Component {
  state = {
    tableFlag: this.props.tableFlag,
    values: [],
    columns: [
      { width: 150, title: '字典key', dataIndex: 'dictKey', key: 'dictKey' },
      { width: 150, title: '字典名称', dataIndex: 'dictName', key: 'dictName' },
      { width: 150, title: '上级字典名称', dataIndex: 'parentDictName', key: 'parentDictName' },
      { width: 100, title: '排序', dataIndex: 'sortOrder', key: 'sortOrder' },
      { width: 150, title: '字典描述', dataIndex: 'dictDesc', key: 'dictDesc' },
      { width: 150, title: '机构编码', dataIndex: 'orgCode', key: 'orgCode' },
    ],
    dataBackUp:'',
    idx:[],
    loading: false,
    rowId: ''
  }

  add = (e, data) => {
    e.stopPropagation();
    console.log(e, data)
  }

  edit = (e, data) => {
    e.stopPropagation();
    console.log(e, data)
  }

  del = (e, data) => {
    e.stopPropagation();
    console.log(e, data)
  }

  tableDisplay = (data, index) => {
    return () => {
      let deleteEle = document.querySelectorAll(`tr[class*="clickRowStyl"]`);
      console.log(deleteEle)
      deleteEle.forEach(item => {
        item.classList.remove('clickRowStyl')
      })
      this.setState({loading: true});
      console.log('table', data)
      localStorage.setItem('level', data.level)
      window.currentData = { ...data };
      console.log('调用查询接口：/dict/getDict')
      axios.get(`http://192.168.43.254:8099/dict/getDict?page=1&pageSize=10&parentId=${data.id}`)
      .then(res => {
        let idx = [];
        let childData = res.data.data.list;
        console.log(res)
        for(let i = 0; i< window.track.length; i++){
          if( window.track[i].level >= data.level){
            window.track.splice( i, 1 )
            idx.splice( i, 1 )
            i--;
          }
        }
        window.track.push({level: data.level, name: data.dictName, index});
        for(var i = 0;i<window.track.length;i++){
          idx.push(window.track[i].index);
        }
        this.setState({ idx })  
        if(childData && childData.length > 0) {
          this.setState({
            level: data.level,
            values: childData,
            tableFlag: true,
            rowId: data.id
          })
        }else{
          this.setState({
            level: data.level,
            values: [],
            tableFlag: false,
            rowId: data.id
          })
        }
        this.setState({loading: false});
      }).catch(err => {
        this.setState({loading: false});
      })
    }
  }

  doubleClickClose = () => {
    this.setState({ tableFlag: false });
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
    const { values, data } = this.props;
    const { columns, idx, level, tableFlag, loading } = this.state;
    return (
      <div>
        <Table
          rowKey={record => record.dictKey}
          onRow={(record, index) => {
            return {
              onClick: this.tableDisplay(record, index), // 点击行,获取当前行所有信息
              onDoubleClick: this.doubleClickClose,  // 双击行，关闭二级菜单
            };
          }}
          rowClassName={this.setRowClassName}
          columns={columns} 
          dataSource={values} 
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
          tableFlag && localStorage.getItem('level') >= level ? (
            <DictionaryTable values={this.state.values} idx={idx} data={data} level={level} />
          ) : null
        }
      </div>
    )
  }
};

export default DictionaryTable;