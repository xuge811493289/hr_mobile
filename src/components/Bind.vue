<template>
  <div class="bind" >
    <div class="info">
        <text class='info_text_center'>开始上课</text>
    </div>
    <div class="form_item" @click="toBottomForm('grade')">
      <text class="label">年级</text>
      <text class="item">{{form.currentGrade}}</text>
    </div>
    <div class="form_item" @click="toBottomForm('clazz')">
      <text class="label">班级</text>
      <text class="item">{{form.currentClass}}</text>
    </div>
    <div class="form_item" @click="toBottomForm('toolkit')">
      <text class="label">工具箱</text>
      <text class="item">{{form.currentToolkit}}</text>
    </div>
    <div class="form_item" @click="toBottomForm('course')">
      <text class="label">课程</text>
      <text class="item">{{form.currentCourse}}</text>
    </div>
    <div class="btn_group">
      <wxc-button class="btn" type="yellow" :disabled='oneDisabled' :btnStyle="btnStyle" text="一键绑定" @wxcButtonClicked="handleBind('oneBind')"></wxc-button>
      <wxc-button class="btn" :disabled='disabled' :btnStyle="btnStyle" type="normal" text="绑定列表" @wxcButtonClicked="handleBind('bindList')"></wxc-button>
      <wxc-button class="btn" :disabled='disabled' :btnStyle="btnStyle" type="normal" text="开始上课" @wxcButtonClicked="handleBind('beginClass')"></wxc-button>
      <wxc-button class="btn" :btnStyle="btnStyle" type="normal" text="结束上课" @wxcButtonClicked="handleBind('endClass')"></wxc-button>
    </div>
    <!-- 底层弹框 -->
    <wxc-popup popup-color="#ededed" :show="isBottomShow" @wxcPopupOverlayClicked="popupOverlayBottomClick" pos="bottom"height="400">
        <div class="grade-content" v-if='currentBtn == "grade"'>
          <scroller class="scroller">
            <text class="panel" v-for='item in allGrades' @click="selectGradeHandle(item.grade_id,item.grade_name)">{{item.grade_name}}</text>
          </scroller>
        </div>
        <!-- 班级 -->
        <div class="class-content" v-if='currentBtn == "clazz"'>
          <scroller class="scroller">
            <text class="panel"  v-for='n in allClazz' @click="selectClassHandle(n.class_id,n.class_name)">{{n.class_name}}</text>
          </scroller>
        </div>
        <!-- 工具箱 -->
        <div class="class-content" v-if='currentBtn == "toolkit"'>
          <scroller class="scroller">
            <text class="panel" v-for='n in allTools' @click="selectToolkitHandle(n.tools_id,n.tools_name)">{{n.tools_name}}</text>
          </scroller>
        </div>
        <!-- 课程 -->
        <div class="class-content" v-if='currentBtn == "course"'>
          <scroller class="scroller">
            <text class="panel" v-for='item in allCourses' @click="selectCourseHandle(item.course_type_id,item.course_type_name)">{{item.course_type_name}}</text>
          </scroller>
        </div>
    </wxc-popup>
    <!-- 结果页面 -->
    <wxc-result :type="type" :custom-set="customSet" @wxcResultButtonClicked="resultButtonClick"
      :show="show">
    </wxc-result>
  </div>
</template>
<script>
import { WxcButton ,WxcPopup,WxcResult} from 'weex-ui';
var navigators = weex.requireModule('navigator');
const modal = weex.requireModule('modal');
var stream = weex.requireModule('stream');
const storage = weex.requireModule('storage');
var websocket = weex.requireModule('webSocket');
import qs from 'querystring';
var baseURL="http://www.briup.cn:8989/bracelet/Home";
// var baseURL="http://www.corededu.com/bracelet/Home";
export default {
  data(){
    return {
      token:'',
      refreshing: false,
      oneDisabled:false,
      disabled:true,
      show:false,
      btnStyle:{
        backgroundColor:"#319bf5"
      },
      isBottomShow:false,
      currentBtn:'',
      form:{
        currentGrade:'',
        currentGradeId:'',
        currentClass:'',
        currentClassId:'',
        currentToolkit:'',
        currentToolkitId:'',
        currentCourse:'',
        currentCourseId:''
      },
      allGrades:[],
      allTools:[],
      allCourses:[],
      allClazz:[],
      type:'',
      customSet:{},
      resultButtonClick:'',
      teaId:'',
      school_prefix:'',
      uid:'',
      websocket:'',
      e:''
    }
  },
  components: { WxcButton ,WxcPopup,WxcResult},
  props:{
    socketBind:Array
  },
  created(){
    var self=this;
    //获取登录页面token值
    storage.getItem('token',res=>{
      if(res.result=='success'){
        self.token=res.data;
        //登录之后跳转当前页面获取teaId值，用于请求获取班级
        stream.fetch({
          url:baseURL+'/Index?action=index&token='+self.token,
          method:'GET',
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          type:'json'
        },function(data){
          if(data.data.code==200){//请求成功，根据唯一token值返回当前登录用户信息
              self.teaId=data.data.user_id;
          }
        });
      }
    });
    storage.getItem('formCurrentChecked',res=>{
      if(res.result=='success'){
        self.form=JSON.parse(res.data);
      }
    });
    //当用户刷新页面或者第一次打开页时后，没有选择的项，此时按钮应该默认只有一键绑定可以点击
    if(!self.form.currentGradeId&& !self.form.currentClassId&& !self.form.currentToolkitId&& !self.form.currentCourseId){
      console.log("没有选中项",self.oneDisabled);
      self.oneDisabled=false;
      self.disabled=true;
    }
    //当存在用户选择数据时
    if(this.form.currentGradeId && this.form.currentClassId && this.form.currentToolkitId && this.form.currentCourseId){
      let body={
        class_id:this.form.currentClassId,
        tools_id:this.form.currentToolkitId
      };
      body = qs.stringify(body);
      stream.fetch({
        method:'POST',
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        body:body,
        url:baseURL+'/Report/show_bind?token='+self.token,
        type:'json'
      },function(data){
        if(data.data.length>0){//绑定手环数量>0代表已经绑定过手环
            self.oneDisabled=true;
            self.disabled=false;
        }else{
            self.oneDisabled=false;
            self.disabled=true
        }
      });
    }
    storage.getItem('oneDisabled',res=>{
      if(res.result=='success'){
        self.oneDisabled=JSON.parse(res.data).oneDisabled;
        //判断一键绑定按钮是否禁用，禁用的话 另外两个按钮就可以不禁用
        if(self.oneDisabled){
            self.disabled=false;
        }
      }
    })
  },
  methods:{
    handleBind(key){
      var self=this;
      switch(key){
        case "oneBind"://点击一键绑定
          if(self.oneDisabled==false){//当前按钮为禁用状态时不做操作
              //判断当前是否选中了年级班级以及工具箱课程，选中之后即可绑定
            if(!this.form.currentGradeId){
              modal.toast({ 'message':'请先选中年级', 'duration': 1 });
            }else if(!this.form.currentClassId){
               modal.toast({ 'message':'请先选中班级', 'duration': 1 });
            }else if(!this.form.currentToolkitId){
               modal.toast({ 'message':'请先选中工具箱', 'duration': 1 });
            }else if(!this.form.currentCourseId){
               modal.toast({ 'message':'请先选中课程', 'duration': 1 });
            }else{
              //开始默认绑定
              let param={
                class_id:self.form.currentClassId,
                tools_id:self.form.currentToolkitId,
                grade_id:self.form.currentGradeId,
                course_type_id:self.form.currentCourseId
              };
              param = qs.stringify(param);
              stream.fetch({
                method:'POST',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                body:param,
                url:baseURL+'/Report/bind_hand?token='+self.token,
                type:'json'
              },function(data){
                if(data.data.code=="300"){
                  //当前手环数量不充足
                   modal.toast({ 'message': "当前手环数量不充足", 'duration': 2 });
                }else if(data.data.code=="200"){
                  //显示绑定列表
                  let body={
                    class_id:self.form.currentClassId,
                    tools_id:self.form.currentToolkitId
                  };
                  body = qs.stringify(body);
                  stream.fetch({
                    method:'POST',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    body:body,
                    url:baseURL+'/Report/show_bind?token='+self.token,
                    type:'json'
                  },function(data){
                    if(data.data.length>0){//该班级有人数
                      //self.$router.push('/bindList');
                     self.$emit('toTell','bindList');//子组件向父组件传值，进行组件切换
                      storage.setItem('bindList',JSON.stringify(data.data),function(){})//当前班级的绑定学生列表
                      storage.setItem('tools_id',self.form.currentToolkitId,function(){})
                      storage.setItem('formCurrentChecked',JSON.stringify(self.form),function(){})//用户所当前选择的form表单数据
                    }else{
                      modal.toast({ 'message': "当前班级没有学生", 'duration': 2 });
                    }
                  });
                }
              });
            }
          }
        break;
        case "bindList"://点击绑定列表
            if(this.disabled==false){
              if(this.form.currentGradeId&&this.form.currentClassId&&this.form.currentToolkitId&&this.form.currentCourseId){
                  let body={
                    class_id:this.form.currentClassId,
                    tools_id:this.form.currentToolkitId
                  };
                  body = qs.stringify(body);
                  stream.fetch({
                    method:'POST',
                    headers:{'Content-Type':'application/x-www-form-urlencoded'},
                    body:body,
                    url:baseURL+'/Report/show_bind?token='+self.token,
                    type:'json'
                  },function(data){
                    self.$emit('toTell','bindList');
                    storage.setItem('bindList',JSON.stringify(data.data),function(){})
                    storage.setItem('tools_id',self.form.currentToolkitId,function(){})
                    storage.setItem('formCurrentChecked',JSON.stringify(self.form),function(){})
                  });
              }else{
                 modal.toast({ 'message': "请选择课程信息", 'duration': 2 });
              }
            }
        break;
        case "beginClass"://点击开始上课,想实时端发送通知，将数据返回给图表显示
          if(this.disabled==false){
            if(this.form.currentGradeId&&this.form.currentClassId&&this.form.currentToolkitId&&this.form.currentCourseId){
              storage.getItem("school_prefix",res=>{
                if(res.result=='success'){
                  self.school_prefix=res.data;
                  self.uid = self.school_prefix+'_'+self.form.currentGradeId+'_'+self.form.currentClassId+'_'+self.form.currentCourseId;
                  //学校_年级_班级_课程类型;
                  storage.setItem('uid','start&'+self.uid,function(){
                    self.$emit('toTell','report');
                  });
                }
              })
            }else{
              //当用户的选项没有全部选择时，移除uid
              storage.removeItem("uid",function(data){
                if(data.result=="success"){
                  modal.toast({ 'message': "请选择所有选项", 'duration': 2 });
                }
              });
            }
          }else{//最外层else
          }
        break;
        case 'endClass':
          /*判断当前班级是否正在上课，如果正在上课，结束上课，如果没有上课，提示用户--无法判断
            1.向服务器端发送请求，结束上课
            2.解除手环绑定*/
          if(this.form.currentGradeId&&this.form.currentClassId&&this.form.currentToolkitId&&this.form.currentCourseId){
            let body={
              class_id:this.form.currentClassId,
              tools_id:this.form.currentToolkitId
            };
            body = qs.stringify(body);
            // 查看是否有手环绑定
            stream.fetch({
              method:'POST',
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              body:body,
              url:baseURL+'/Report/show_bind?token='+self.token,
              type:'json'
            },function(data){
                //data代表绑定手环的学生，有绑定代表点击过绑定按钮
              if(data.data.length>0){
                //绑定过手环，但是无法确定是否上过课，获取当前socket对象结束上课
                if(self.socketBind){
                  storage.getItem("school_prefix",res=>{
                    if(res.result=='success'){
                      self.school_prefix=res.data;
                      self.uid = self.school_prefix+'_'+self.form.currentGradeId+'_'+self.form.currentClassId+'_'+self.form.currentCourseId;
                      // 结束上课页面跳转
                      storage.setItem('uid','end&'+self.uid,function(){
                        //解除手环绑定
                        var a={
                          class_id:self.form.currentClassId
                        };
                        a = qs.stringify(a);
                        // 手环解绑
                        stream.fetch({
                          method:'POST',
                          headers:{'Content-Type':'application/x-www-form-urlencoded'},
                          body:body,
                          url:baseURL+'/Report/delete_bind?token='+self.token,
                          type:'json'
                        },function(data){
                          if(data.data.code=='200'){
                              modal.toast({ 'message': "手环已解除绑定", 'duration': 2 });
                              self.oneDisabled=false;
                              self.disabled=true;
                               //移除uid
                              storage.removeItem("uid",function(data){
                                if(data.result=="success"){
                                  // modal.toast({ 'message': "请选择所有选项", 'duration': 2 });
                                }
                              });
                          }else{
                            modal.toast({ 'message': "解绑失败", 'duration': 2 });
                          }
                        })
                        // 跳转到报表页面
                        self.$emit('toTell','report');
                        // 跳回当前页面
                        self.$emit('toTell','bind');
                      });
                    }
                  })
                }else{
                  modal.toast({ 'message': "当前班级没有开始上课", 'duration': 2 });
                }
              }else{
                //没有绑定学生
                modal.toast({ 'message': "请先绑定手环并开始上课", 'duration': 2 });
              }
            });
          }else{
            modal.toast({ 'message': "请选择结束上课的班级及工具箱信息", 'duration': 2 });
          }
        break;
      }
    }, 
    //非状态组件，需要在这里关闭
    popupOverlayBottomClick () {
      this.isBottomShow = false;
    },
    selectGradeHandle(id,name){
      this.form.currentGrade = name;
      this.form.currentGradeId = id;
      this.isBottomShow = false;
      //切换年级时清空班级信息
      this.form.currentClass='';
      this.form.currentClassId='';
    },
    selectClassHandle(id,name){
      var self=this;
      this.form.currentClass = name;
      this.form.currentClassId = id;
      this.isBottomShow = false;
      if(this.form.currentGradeId && this.form.currentClassId && this.form.currentToolkitId && this.form.currentCourseId){
        let body={
          class_id:this.form.currentClassId,
          tools_id:this.form.currentToolkitId
        };
        body = qs.stringify(body);
        stream.fetch({
          method:'POST',
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:body,
          url:baseURL+'/Report/show_bind?token='+self.token,
          type:'json'
        },function(data){
          if(data.data.length>0){//绑定手环数量>0代表已经绑定过手环
              self.oneDisabled=true;
              self.disabled=false;
          }else{
              self.oneDisabled=false;
              self.disabled=true
          }
        });
       }
    },
    selectToolkitHandle(id,name){
      this.form.currentToolkit = name;
      this.form.currentToolkitId = id;
      this.isBottomShow = false;
      var self=this;
      if(this.form.currentGradeId && this.form.currentClassId && this.form.currentToolkitId){
        let body={
              class_id:this.form.currentClassId,
              tools_id:this.form.currentToolkitId
            };
            body = qs.stringify(body);
            stream.fetch({
              method:'POST',
              headers:{'Content-Type':'application/x-www-form-urlencoded'},
              body:body,
              url:baseURL+'/Report/show_bind?token='+self.token,
              type:'json'
            },function(data){
              if(data.data.length>0){
                self.oneDisabled=true;
                self.disabled=false;
              }else{
                self.oneDisabled=false;
                self.disabled=true;
              }
            });
      }
    },
    selectCourseHandle(id,name){
      this.form.currentCourse = name;
      this.form.currentCourseId = id;
      this.isBottomShow = false;
    },
    //弹出年级弹框
    toBottomForm(type){
      var self=this;
      switch(type){
        case "grade":
          stream.fetch({
            method:'GET',
            url:baseURL+'/Report/show_headGrade?token='+self.token,
            type:'json'
          },function(data){
            if(data.data.length>0){
              self.allGrades=data.data;
               self.isBottomShow = true;
              self.currentBtn = type;
            }
          });
        break;
        case "clazz":
            if(this.form.currentGradeId){
                var body={
                  grade_id:this.form.currentGradeId,
                  teach_id:self.teaId
                };
                body = qs.stringify(body);
                stream.fetch({
                  method:'POST',
                  headers:{'Content-Type':'application/x-www-form-urlencoded'},
                  body:body,
                  url:baseURL+'/Report/show_teachClass?token='+self.token,
                  type:'json'
                },function(data){
                  //console.log(JSON.stringify(data.data[0]),'根据年级请求班级');
                  storage.setItem('currentAllClazz',JSON.stringify(data.data[0]),function(){});
                  if(data.data[0].length>0){
                    //当前年级下有班级
                     self.allClazz=data.data[0];
                     self.isBottomShow = true;
                     self.currentBtn = type;
                     storage.setItem('school_prefix',data.data[1],function(){});
                  }else{
                    self.currentBtn = type;
                    self.isBottomShow = true;
                    self.allClazz=[];
                  }
                });
            }else{
              //如果当前没有选择年级  而 先选中班级
              modal.toast({ 'message': "请先选中年级", 'duration': 2 });
            }
        break;
        case "toolkit":
          //查找所有工具箱
          stream.fetch({
              method:'GET',
              url:baseURL+'/Report/show_tools?token='+self.token,
              type:'json'
            },function(data){
              /*  self.allTools=data.data;
                self.isBottomShow = true;
                self.currentBtn = type;*/
              //绑定过得工具箱不再显示
             //当前代码为可用代码，当测试完成后放开使用       
              var newData=data.data.filter(function(item){
                  return item.toolstatus!="4" && item.toolstatus!="2"
              });
              if(newData.length<=0){
                //所有工具箱已被选中绑定
                modal.toast({ 'message': "没有可用工具箱", 'duration': 2 });
              }else{
                self.allTools=newData;
                self.isBottomShow = true;
                self.currentBtn = type;
              }
            });
        break;
        case "course":
        //查找所有课程
          if(this.form.currentGradeId && this.form.currentClassId && this.teaId){
            var body={
              grade_id:this.form.currentGradeId,
              class_id:this.form.currentClassId,
              teach_id:this.teaId
            }
            body = qs.stringify(body);
              stream.fetch({
                method:'POST',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                body:body,
                url:baseURL+'/Report/show_teachCourse?token='+self.token,
                type:'json'
              },function(data){
                self.allCourses=data.data;
                self.isBottomShow = true;
                self.currentBtn = type;
              });
          }
        break;
      }//switch结束
    }
  }
}
</script>
<style scoped>
  .refresh {
    width: 350;
    display: -ms-flex;
    display: -webkit-flex;
    display: flex;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    align-items: center;
  }
  .indicator-text {
    color: #888888;
    font-size: 42px;
    text-align: center;
  }
  .indicator {
    margin-top: 16px;
    height: 40px;
    width: 40px;
    color: blue;
  }

  .scroller1{
    
    height: 1000px;
  
  }
 
  .scroller {
      height: 400px;
  }
  .form_item{
    flex-direction: row;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-bottom-color: #ededed;
  }
  .label , .item {
    line-height: 88px;
  }
  .label {
    flex:1;
    text-align: center;
  }
  .item {
    flex: 2;
    color: #666;
    text-align: left;
  }
  .btn_group {
    flex-direction: column;
    align-items: center;
  }
  .btn {
    margin-top: 28px;
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
    position: absolute;
    left: 30px;
    top: 0px;
    bottom: 0px

    
  }
  .info_text_center {
    flex: 4;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px
  }
  .info_text_right {
    position: absolute;
    right: 30px;
    top: 0px;
    bottom: 0px;
    flex: 1;
  }
  .info_text_left,.info_text_center,.info_text_right {
    line-height: 100px;
    color: #fff;
    text-align: center;
    font-weight: bold;
  }
</style>