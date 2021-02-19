import React, { useEffect } from 'react';
import { Modal, Button, Input, message } from 'antd';
import axios from 'axios';

import './Dialog.css'
// import data from '../../data.json';

const Dialog = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [titleType, seTtitleType] = React.useState(null);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [parentsEle, setParentsEle] = React.useState( [] );
  const [addBtnDisabled, setAddBtnDisabled] = React.useState(false);
  const [editBtnDisabled, setEditBtnDisabled] = React.useState(false);
  const [delBtnDisabled, setDelBtnDisabled] = React.useState(false);
  const [addData, setAddData] = React.useState({
    "dictKey": '',
    "dictName": '',
    "dictDesc": '',
    "level": '',
    "orgCode": '',
    "sortOrder": ''
  });
  const [ trackArr, setTrackArr ] = React.useState( [] );
  const [ keyc, setKeyc ] = React.useState( "" );

  // 设置所有父辈字典名称
  const parentLevel = () => {
    console.log('props.currentNode:',props.currentNode)
    // if(props.currentNode) {
      var parentsDom = [];
      let newTrackArr = [];
      let newAddData = JSON.parse(JSON.stringify(addData));
      if(window.track.length !== 0){
        window.track.map((item,key)=>{
          console.log(item)
          const lvCount = item.level === 0? "一" : item.level === 1? "二" :item.level === 2? "三" :item.level === 3? "四" : item.level === 4? "五" : parseInt(item.level)+1;
          parentsDom.push(<p key={key}>{lvCount}级名称：{item.name}</p>)
          newTrackArr.push(item.index);
        })
      }
      setParentsEle(parentsDom)
      setTrackArr(newTrackArr)
      setAddData(newAddData);
    // }else{
    //   setParentsEle([])
    // }
  }

  const addModal = () => {
    setAddBtnDisabled(true)
    seTtitleType('add')
    setAddData({
      "dictKey": '',
      "dictName": '',
      "dictDesc": '',
      "level": '',
      "orgCode": '',
      "sortOrder": ''
    })
    parentLevel()
    setVisible(true);
  };

  const editModal = () => {
    setEditBtnDisabled(true)
    seTtitleType('edit')
    parentLevel()
    for (const key in addData) {
      if (Object.hasOwnProperty.call(addData, key)) {
        addData[key] = window.currentData[key]
      }
    }
    setAddData(addData)
    console.log(addData)
    setVisible(true);
  }
  
  const deleModal = () => {
    setDelBtnDisabled(true)
    console.log('deleModal')
    let {id, level} = window.currentData
    console.log('window.currentData', window.currentData)
    axios.delete('http://192.168.43.254:8099/dict/deleteDict', {
      params: {
        id: id,
        level: level
      }
    }).then((res) => {
        console.log('res', res)
        if(res.data.status === 0) {
          message.info('删除成功');
          setDelBtnDisabled(false)
          props.getDictList();
        }
      }).catch(function (error) {
        console.log(error);
        setDelBtnDisabled(false)
      });
  }

  useEffect(() =>{
    const kc = new Date().getTime();
    setKeyc(kc)
  },[visible])

  // 新增/编辑 ok确认
  const handleOk = () => {
    for (const key in addData) {
      if (Object.hasOwnProperty.call(addData, key)) {
        if(addData[key] === '') {
          return message.info(`${key}不能为空`);
        }
      }
    }
    if(titleType === 'add') {
      let {id} = window.currentData
      let params = {
        childrenParaentId: id,
        dictParentId: id,
        ...addData
      }
      let url = '';
      if(params.level === '0') {
        url = 'http://192.168.43.254:8099/dict/addDict'
      }else{
        url = 'http://192.168.43.254:8099/dict/addDictChild'
      }
      console.log('调用新增接口：', url)
      axios.post(url, params)
        .then((res) => {
          console.log('res', res)
          if(res.data.status === 0) {
            message.info('新增成功');
            props.getDictList();
            setAddBtnDisabled(false);
            setConfirmLoading(false);
            setAddData({
              "dictKey": '',
              "dictName": '',
              "dictDesc": '',
              "level": '',
              "orgCode": '',
              "sortOrder": ''
            })
            setVisible(false);
          }
        }).catch(function (error) {
          console.log(error);
        });
    }else{
      let {id} = window.currentData
      let params = {
        id: id,
        ...addData
      }
      console.log('调用编辑接口：/dict/editAddDict')
      axios.put('http://192.168.43.254:8099/dict/editAddDict', params)
        .then((res) => {
          console.log('res', res)
          if(res.data.status === 0) {
            message.info('编辑成功');
            props.getDictList();
            setEditBtnDisabled(false);
            setConfirmLoading(false);
            setAddData({
              "dictKey": '',
              "dictName": '',
              "dictDesc": '',
              "level": '',
              "orgCode": '',
              "sortOrder": ''
            })
            setVisible(false);
          }
        }).catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleCancel = () => {
    setAddBtnDisabled(false);
    setEditBtnDisabled(false)
    console.log('Clicked cancel button');
    setVisible(false);
    setAddData({
      "dictKey": '',
      "dictName": '',
      "dictDesc": '',
      "level": '',
      "orgCode": '',
      "sortOrder": ''
    })
  };

  const setValue = ( e, item ) =>{
    addData[item] = e.target.value;
    setAddData(addData);
  }

  return (
    <div className="dialog-btn">
      <Button type="primary" disabled={addBtnDisabled} onClick={addModal}>
        新增
      </Button>
      <Button type="primary" disabled={editBtnDisabled} onClick={editModal}>
        编辑
      </Button>
      <Button type="primary" disabled={delBtnDisabled} onClick={deleModal}>
        删除
      </Button>
      <Modal
        key = {keyc}
        title={titleType === 'add' ? '新增':'编辑'}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        cancelText = "取消"
        okText = "确定"
        onCancel={handleCancel}
      >
        <div>
          { parentsEle.length > 0 ? 
            <div style={{borderBottom: '1px solid #d9d9d9', marginBottom: 20, padding: 5}}>
              {parentsEle}
            </div>: "" }
          {
            Object.keys(addData).map(( item )=>{
              if(item !== 'values' && item !== 'key'){
                // switch(item) {
                //   case 'dictKey':
                //     item= '字典key'
                //     break;
                //   case 'dictName':
                //     item= '字典名称'
                //     break;
                //   case 'dictDesc':
                //     item= '字典描述'
                //     break;
                //   case 'level':
                //     item= '级别'
                //     break;
                //   case 'orgCode':
                //     item= '机构编码'
                //     break;
                //   case 'sortOrder':
                //     item= '排序'
                //     break;
                //   default:
                //     break;
                // }
                return (
                  <p key={item} style={{display: "flex",flexDirection: "row", flexWrap: "nowrap", justifyContent: "flex-start"}}>
                    <span style={{width:100}}>{ item }：</span>
                    <Input allowClear="true" defaultValue={addData[item] === ''? '': addData[item]} onChange={e=>{setValue(e,item)}}/>
                  </p>
                )
              }
            })
          }
          
        </div>
      </Modal>
    </div>
  );
};

export default Dialog;