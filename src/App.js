import React,{useState,useEffect} from 'react';
import {Button,TextField,Checkbox,IconButton} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { red } from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import './App.css';
function App() {
  //正在做的
  const [doing, setDoing] = React.useState(0);
  //已完成的
  const [finished, setFinished] = React.useState(0);
  //对话框
  const [open, setOpen] = React.useState(false);
  //消息框
  const [toast, setToast] = React.useState(false);
  //tab
  const [tab, setTab] = React.useState(0);
  const tabChange = (event, newValue) => {
    setTab(newValue);
  }
  //对话框关闭
  const handleClose = () => {
    setOpen(false);
  };
  //消息框关闭
  const toastClose = () => {
    setToast(false);
  };
  //列表
  const [list,setList]=useState([]);
  //备份列表，用于撤销
  const [baklist,setBaklist]=useState([]);
  //输入的内容
  const [value,setValue]=useState([]);
  const change = e => {
    setValue(e.target.value);
  }
  //添加事项
  const add = () => {
    let arr = [...list];
    arr.push({
      title:value,
      checked:false,
      finished:false
    });
    setList(arr);
    setValue('');
    setOpen(false);
  }
  //更改事项的勾选状态（正在进行到已完成，已完成到正在进行）
  const up = (index) => {
    console.log('up');
    let arr = [...list];
    arr[index].checked=!arr[index].checked;
    //为了特效，勾选后一定时间再变化。
    setTimeout(()=>{
      let arr = [...list];
      arr[index].finished=!arr[index].finished;
      setList(arr);
    },500);
    setList(arr);
  }
  // 撤销
  const undo = () => {
    setList(baklist);
    setToast(false);
  }
  // 删除
  const del = index => {
    setBaklist(list);
    let arr = [...list];
    arr.splice(index,1);
    setList(arr);
    setToast(true);//打开消息框
  }

  let addbtn={
    position: "absolute",
    right: "10px"
  }
  //载入时
  useEffect(()=>{
    let arr = localStorage.getItem('list');
    if(arr){
      setList(JSON.parse(arr));
    }
  },[]);
  //数字变更
  useEffect(()=>{
    let d=0;
    let f=0;
    list.map((item)=>{
      if(item.finished){
        f+=1;
      }else{
        d+=1;
      }
    })
    setFinished(f);
    setDoing(d);
    localStorage.setItem('list', JSON.stringify(list));
  },[list]);
  return (
    <div className="App">
      <AppBar position="fixed">
        <Toolbar>
        <Tabs value={tab} onChange={tabChange}>
          <Tab label={`进行中(${doing})`} />
          <Tab label={`已完成(${finished})`} />
        </Tabs>
        <IconButton style={addbtn} aria-label="add" onClick={()=>{
          setOpen(true);
        }}>
          <AddCircleOutlinedIcon style={{ color: red[50] }}/>
        </IconButton>
        </Toolbar>
      </AppBar>
      <br></br>
      <br></br>
      <br></br>
      <List component="nav">
      {
          list.map((item,index)=>{
            if(!item.finished && tab==0){
              return(
                <ListItem key={index} button>
                  <ListItemIcon>
                    <Checkbox onChange={()=>{
                      up(index);
                    }} color="primary" checked={item.checked}/>
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                  <ListItemIcon>
                    <IconButton aria-label="delete" style={{ color: red[500] }} onClick={()=>{
                      del(index);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              )
            }
          })
        }
        {
          list.map((item,index)=>{
            if(item.finished && tab==1){
              return(
                <ListItem key={index} button>
                  <ListItemIcon>
                    <Checkbox onChange={()=>{
                      up(index);
                    }} color="primary" checked={item.checked}/>
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                  <ListItemIcon>
                    <IconButton aria-label="delete" style={{ color: red[500] }} onClick={()=>{
                      del(index);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              )
            }
          })
        }
      </List>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">新增事项</DialogTitle>
        <DialogContent>
          <TextField autoFocus value={value} onChange={change} label="输入事项" variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            取消
          </Button>
          <Button onClick={add} variant="contained" color="primary">
          添加
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={toast}
        autoHideDuration={6000}
        onClose={toastClose}
        message="已删除"
        action={
          <React.Fragment>
            <Button variant="contained" color="primary" size="small" onClick={undo}>
              撤销
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={toastClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

export default App;
