<template>
  <div class="wrapper1">
    <div class="container">
      <Bind v-if="currentNav=='/bind'" @toTell="tell" :socketBind='socket'></Bind>
      <Report v-if="currentNav=='/report'" ></Report>
      <Home v-if="currentNav=='/home'"></Home>
      <BindList v-if="currentNav=='/bindList'" @toTell="tell"></BindList>
    </div>
    <div class="nav">
      <div class="bind" @click='navTo("/bind")'>
        <text class="icon nav_icon" :class="[currentNav=='/bind'?'nav_current':'']">&#xf0f3;</text>
        <text class="nav_text" :class="[currentNav=='/bind'?'nav_current':'']">上课</text>
      </div>
      <div class="report" @click='navTo("/report")'>
        <text class="icon nav_icon" :class="[currentNav=='/report'?'nav_current':'']">&#xf080;</text>
        <text class="nav_text" :class="[currentNav=='/report'?'nav_current':'']">报表</text>
      </div>
      <div class="home" @click='navTo("/home")'>
        <text class="icon nav_icon" :class="[currentNav=='/home'?'nav_current':'']">&#xf2bd;</text>
        <text class="nav_text" :class="[currentNav=='/home'?'nav_current':'']">我的</text>
      </div>
    </div>
  </div>
</template>
<script>
  import Bind from './Bind';
  import Report from './Report';
  import Home from './Home';
  import BindList from './BindList';
  const modal = weex.requireModule('modal');
  let domModule = weex.requireModule('dom');
  export default {
    name: 'App',
    components:{
      Bind,
      Report,
      Home,
      BindList
    },
    data () {
      return {
        logo: 'https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png',
        currentNav:'/bind',
        currentNavInfo:'开始上课',
        socket:[]
      }
    },
    methods:{
      backBind(){
        this.currentNavInfo = "开始上课";
        this.currentNav='/bind';
      },
      saveHandle(){
        modal.toast({ 'message': '保存成功', 'duration': 1 });
      },
      tell(msg){
        if(msg=='bindList'){
          this.currentNavInfo = "绑定列表";
          this.currentNav='/bindList';
        }else if(msg=='bind'){
          this.currentNavInfo = "开始上课";
          this.currentNav='/bind';
        }else if(msg=='report'){
          this.currentNavInfo = "报表";
          this.currentNav='/report';
        }else{
          this.socket.push(msg);
        }
      },
      navTo(url){
        this.currentNav = url;
        switch(url){
          case "/report":
            //this.currentNavInfo = "报表";
            break;
          case "/home":
           // this.currentNavInfo = "我的";
            break;
          default:
            //this.currentNavInfo = "开始上课";
        }
        this.$router.push(url);
      }
    },
    computed:{
      dyClass(){
        return "nav_current";
      }
    },
    created(){
      //添加规则 addRule是可以为dom 添加一条规则，目前支持自定义字体fontFace规则，构建自定义的font-family，可以在text使用
      domModule.addRule('fontFace', {
          'fontFamily': "iconfont",
          'src': "url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0')"
      });
    }
  }
</script>

<style scoped>
  .icon {
    font-family:iconfont;
  }
  /*根元素*/
  .wrapper1{
    flex-direction: column;
    position: absolute;  
    top: 0;  
    right: 0;  
    bottom: 0;  
    left: 0; 
  }
  /*头部信息*/

  .info {
    height: 68px;
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
    line-height: 68px;
    color: #fff;
    text-align: center;
    font-weight: bold;
  }
  /*内容容器*/
  .container {
    flex: 1;

  }
  /*导航*/
  .nav {
    height: 98px;
    display: flex;
    justify-content: center;
    flex-direction: row;
    border-top-style:solid;
    border-top-width: 1px ;
    border-top-color: #ededed;
  }
  .bind,.home,.report {
    flex: 1;
  }
  .nav_icon,.nav_text {
    text-align: center;
  }
  .nav_icon {
    line-height: 60px;
    font-size: 42px;
  }
  .nav_text {
    line-height: 30px;
    font-size: 20px;
  }
  .nav_current {
    color: #319bf5;
  }
</style>
