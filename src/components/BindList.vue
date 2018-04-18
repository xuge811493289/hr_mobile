<template >
  <div class="bindlist">
    <div class="info">
      <text class='icon info_text_left' @click="backBind">&#xf104;</text>
      <text class='info_text_center'>绑定列表</text>
      <text class="icon info_text_right" @click="saveHandle">保存</text>
    </div>
    <div class="content">
      <div class="c_header">
        <text class="c_header_text">学号</text>
        <text class="c_header_text">姓名</text>
        <text class="c_header_text">手环编号</text>
      </div>
      <scroller class="bind_scroller">
        <div class="c_list">
          <div class="row" v-for='n in bindListData'>
            <text class="c_list_text">{{n.stu_number}}</text>
            <text class="c_list_text">{{n.stu_name}}</text>
            <text class="c_list_text" @click="selectHr(n,n.handler_stu_id)">{{n.handler_number}}</text> 
          </div>
        </div>
      </scroller>
    </div>
    <!-- 底层弹框 -->
    <wxc-popup popup-color="#ededed" :show="isBottomShow" @wxcPopupOverlayClicked="popupOverlayBottomClick" pos="bottom" height="400">
        <!-- 课程 -->
        <div class="hr-content">
          <scroller class="scroller">
            <text class="panel" v-for='n in alertHandlerNumber' @click="selectHrHandle(n.handler_id,n.handler_number)" :changedData="changedData">{{n.handler_number}}</text>
          </scroller>
        </div>
    </wxc-popup>
  </div>
</template>
<script>
  import {WxcPopup} from 'weex-ui'
  const modal = weex.requireModule('modal')
  const storage = weex.requireModule('storage');
  var stream = weex.requireModule('stream');
  let domModule = weex.requireModule('dom');
  import qs from 'querystring';
  var baseURL="http://www.briup.cn:8989/bracelet/Home";
  // var baseURL="http://www.corededu.com/bracelet/Home";
  export default {
    data(){
      return {
        isBottomShow:false,
        bindListData:[],
        changedData:{},
        changedHandNumber:"",
        changedHandNumberId:'',
        alertHandlerNumber:[],
        token:''
      }
    },
    created(){
      //添加一条规则，目前支持自定义字体fontFace规则，构建自定义的font-family，可以在text使用
      domModule.addRule('fontFace', {
          'fontFamily': "iconfont",
          'src': "url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0')"
      });
      var self=this;
      //获取登录页面token值
      storage.getItem('token',res=>{
        if(res.result=='success'){
         self.token=res.data;
        }
      });
      storage.getItem('bindList',res=>{
        if(res.result=='success'){
          self.bindListData=JSON.parse(res.data);
          if(self.bindListData.length>0){
              //当前班级有绑定手环数据,禁用一键绑定按钮
            storage.setItem('oneDisabled',JSON.stringify({oneDisabled:true}),function(){})
          }else{
            storage.setItem('oneDisabled',JSON.stringify({oneDisabled:false}),function(){})
          }
        }
      })
      storage.getItem('tools_id',res=>{
        if(res.result=='success'){
            self.tools_id=res.data;
        }
      })
    },
    components: {WxcPopup},
    methods:{
      backBind(){
        this.$router.push('/bind');
        this.$emit('toTell','bind');
      },
      //非状态组件，需要在这里关闭
      popupOverlayBottomClick () {
        this.isBottomShow = false;
      },
      // 选择手环
      selectHr(obj,handler_stu_id){
        var self=this;
        self.currentHandStuId=handler_stu_id;
        this.changedData=obj;
        //请求所有未绑定的手环
        var body={tools_id:this.tools_id};
        body = qs.stringify(body);
        stream.fetch({
          method:'POST',
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:body,
          url:baseURL+'/Report/show_noBind?token='+self.token,
          type:'json'
        },function(data){
          self.alertHandlerNumber=data.data;
        });
        this.isBottomShow = true;
      },
      selectHrHandle(id,name){
        //需要获取 {handler_stu_id: "20", handler_id: "5"} 已绑定的手环所在表的id 选择后的手环id
        //console.log(id,name);手环id  手环编号
       /* console.log(id);
        console.log(this.changedData.handler_stu_id);*/
        //点击修改手环信息时
        var self=this;
        this.changedData.handler_id=id;
        this.changedData.handler_number=name;
        //更新可用手环数据
        var body={
                handler_stu_id:this.changedData.handler_stu_id,
                handler_id:id
              };
            body = qs.stringify(body);
            stream.fetch({
              method:'POST',
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              body:body,
              url:baseURL+'/Report/update_bind?token='+self.token,
              type:'json'
            },function(data){
              self.alertHandlerNumber=data.data;
            });
            //关闭下层模态框
       
        this.isBottomShow = false;
      },
      saveHandle(){
        modal.toast({ 'message': '保存成功', 'duration': 1 });
      }
    }
  }
</script>
<style>
  .icon {
    font-family:iconfont;
  }
  .scroller {
      height: 400px;
  }
  .panel {
      height: 80px;
      line-height: 80px;
      text-align: center;
      border-bottom-width: 1px;
      border-bottom-color: #fafafa;
      flex-direction: row;
      justify-content: center;
      align-content: center;
  }
  .bindlist {
   position: absolute;
   top: 0;bottom: 0;
   left: 0;right: 0;
    background-color: #fff;

  }
  /*头部信息*/

  /* .info {
     position: absolute;
     top: 0;
    height: 68px;
    left: 0;right: 0;
    flex-direction: row;
    justify-content: space-between;
    background-color: #319bf5;
  
  }
  .info_text_left {
    flex: 1;
    font-size: 48px;
    height:150px;
    width: 100px;
    z-index: 10000
  
  
    
  }
  .info_text_center {
    flex: 4;
  }
  .info_text_right {
    flex: 1;
  }
  .info_text_left,.info_text_center,.info_text_right {
    line-height: 68px;
    color: #fff;
    text-align: center;
    font-weight: bold;
  } */
  /*内容区*/
 /*  .content {
   position: absolute;
   left: 0px;right: 0px;
   top: 0px;bottom: 0px;
 } */
  .c_header {
    flex-direction: row;
    justify-content: space-around;
    background-color: #ededed;
  }
  .c_header_text {
    line-height: 88px;
    flex: 1;
    text-align:center;
  }

  .row {
    flex-direction: row;
    justify-content: space-around;
    border-bottom-style:solid;
    border-bottom-width: 1px;
    border-bottom-color: #ededed;
  }
  .c_list_text {
    line-height:88px;
    flex: 1;
    text-align:center;
  }

    /*头部信息*/

  .info {
    height: 100px;
    flex-direction: row;
    justify-content: space-between;
    background-color: #319bf5;
  }
  .info_text_left {
    flex: 1;
    font-size: 48px;
    width: 100px;
    height: 100px;
   /*  position: absolute;
   left: 30px;
   top: 0px;
   bottom: 0px */

    
  }
  .info_text_center {
    flex: 4;
   /*  position: absolute;
   top: 0px;
   bottom: 0px;
   left: 0px;
   right: 0px */
  }
  .info_text_right {
    /* position: absolute;
    right: 30px;
    top: 0px;
    bottom: 0px; */
    flex: 1;
  }
  .info_text_left,.info_text_center,.info_text_right {
    line-height: 100px;
    color: #fff;
    text-align: center;
    font-weight: bold;
  }



</style>