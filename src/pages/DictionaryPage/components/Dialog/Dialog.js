import { Modal, Button, Input } from 'antd';
import React from 'react';
import data from '../../data.json';

const Dialog = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [parentsEle, setParentsEle] = React.useState('Content of the modal');
  const [addData, setAddData] = React.useState({
    "level": '1',
    "name": "",
    "age": '',
    "address": "",
    "key": "-1",
    "values":[]
  });
  const [ trackArr, setTrackArr ] = React.useState( [] );

  const showModal = () => {
    console.log('新增轨迹',window.track)
    var parentsDom = [];
    let newTrackArr = [];
    let newAddData = JSON.parse(JSON.stringify(addData));
    if(window.track.length != 0){
      window.track.map((item,key)=>{
        const lvCount = item.level == 0? "一" : item.level == 1? "二" :item.level == 2? "三" :item.level == 3? "四" : item.level == 4? "五" : parseInt(item.level)+1;
        parentsDom.push(<p key={key}>{lvCount}级名称:{item.name}</p>)
        newTrackArr.push(item.index);
      })
    }
    setParentsEle(parentsDom)
    setTrackArr(newTrackArr)
    addData.level = window.track.length;
    setAddData(newAddData);
    setVisible(true);
  };

  const handleOk = () => {
    setParentsEle('The modal will be closed after two seconds');
    console.log(addData,789)
    console.log(trackArr,999)
    let parentData = data;
    if(trackArr.length === 0){
      data.push(addData)
    }else{
      trackArr.forEach((item,index)=>{
        console.log(item,index)
        if(index == 0){
          parentData = parentData[item];
        }else if(index < trackArr.length){
          parentData = parentData.values[item]
        }
      })
      parentData.values.push(addData);
      window.parentDataValue = parentData.values;
      window.parentData = parentData;
    }
    props.addHandle(data,trackArr);

    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };



  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  const setValue = ( e, item ) =>{
    console.log(e.target.value,item,213123)
    addData[item] = e.target.value;
    setAddData(addData);
  }

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        新增
      </Button>
      <Modal
        title="新增"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        cancelText = "取消"
        okText = "确定"
        onCancel={handleCancel}
      >
        <div>
          {parentsEle}
          <hr/>
          {
            Object.keys(addData).map(( item, index )=>{
              if(item != 'level' && item != 'values' && item != 'key'){
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