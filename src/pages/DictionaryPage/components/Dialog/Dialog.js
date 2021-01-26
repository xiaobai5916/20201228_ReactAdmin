import { Modal, Button, Input, message } from 'antd';
import React, { useEffect } from 'react';
import data from '../../data.json';
import axios from 'axios';

const Dialog = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [parentsEle, setParentsEle] = React.useState( [] );
  const [addData, setAddData] = React.useState({
    "desc_": '',
    "dictKey": '',
    "dictName": '',
    "dictPointType": '',
    "dictType": '',
    "level": '',
    "orgCode": ''
  });
  const [ trackArr, setTrackArr ] = React.useState( [] );
  const [ keyc, setKeyc ] = React.useState( "" );

  const showModal = () => {
    var parentsDom = [];
    let newTrackArr = [];
    let newAddData = JSON.parse(JSON.stringify(addData));
    if(window.track.length !== 0){
      window.track.map((item,key)=>{
        const lvCount = item.level === 0? "一" : item.level === 1? "二" :item.level === 2? "三" :item.level === 3? "四" : item.level === 4? "五" : parseInt(item.level)+1;
        parentsDom.push(<p key={key}>{lvCount}级名称:{item.name}</p>)
        newTrackArr.push(item.index);
      })
    }
    setParentsEle(parentsDom)
    setTrackArr(newTrackArr)
    newAddData.level = window.track.length;
    newAddData.key = new Date().getTime();
    setAddData(newAddData);
    setVisible(true);
  };

  useEffect(() =>{
    const kc = new Date().getTime();
    setKeyc(kc)
  },[visible])

  const handleOk = () => {
    console.log(addData)
    console.log(typeof addData)

    axios.post('http://192.168.43.254:8099/dict/addDict', {
      ...addData
    }).then((res) => {
      console.log('res', res)
      if(res.status === 0) {
        message.info('新增成功');
      }
    }).catch(function (error) {
      console.log(error);
    });

    let parentData = data;
    if(trackArr.length === 0){
      data.push(addData)
    }else{
      trackArr.forEach((item,index)=>{
        if(index === 0){
          parentData = parentData[item];
        }else if(index < trackArr.length){
          parentData = parentData.values[item]
        }
      })
      if(!parentData.values) parentData.values = [];
      parentData.values.push(addData);
    }
    props.addHandle(data,trackArr);
    setVisible(false);
    setConfirmLoading(false);

  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  const setValue = ( e, item ) =>{
    addData[item] = e.target.value;
    setAddData(addData);
  }

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        新增
      </Button>
      <Modal
        key = {keyc}
        title="新增"
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
            Object.keys(addData).map(( item, index )=>{
              if(item !== 'values'){
                return (
                  <p key={index} style={{display: "flex",flexDirection: "row", flexWrap: "nowrap", justifyContent: "flex-start"}}>
                    <span style={{width:100}}>{ item }：</span>
                    <Input onChange={e=>{setValue(e,item)}}/>
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