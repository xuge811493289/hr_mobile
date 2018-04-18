<template>  
    <div class="login_home"> 
      <div class="logo">
        <img class="logo_img" :src="logo" alt="logo"> 
        <text class="title">中赤智能手环云平台</text>
      </div>
      <div class="login">  
          <div class="input-wrapper">  
              <text class="icon nav_icon" >&#xf007;</text>
              <input @input="onchangeUserNumber"  class="input" type="text" placeholder="请输入用户名" :autofocus="true" value=""/>  
          </div>  
          <div class="input-wrapper">  
              <text class="icon nav_icon" >&#xf023;</text>
              <input @input="onchangeUserPassword" class="input" type="password" placeholder="请输入密码" value=""/>  
          </div>  
          <div class="input-wrapper">  
              <div class="input-login" @click="login">  
                  <text class="input-login-text">登录</text>  
              </div>  
          </div> 
      </div>  
    </div>  
    </router-view>
</template>  
<script> 
const stream = weex.requireModule('stream');
const modal = weex.requireModule('modal');
const storage = weex.requireModule('storage')
const Base64 = require('js-base64').Base64;
const navigator = weex.requireModule('navigator')
let domModule = weex.requireModule('dom');
import qs from 'querystring';
export default {
  name:'helloWorld',
  data () {
    return {
      logo:'http://120.78.164.247/assets/hr/images/bg_1.jpg',
      userNumber:'',  
      userPassword:'' ,
      bundleUrl:'',
    }
  },
  created(){
    //添加规则 addRule是可以为dom 添加一条规则，目前支持自定义字体fontFace规则，构建自定义的font-family，可以在text使用
    domModule.addRule('fontFace', {
        'fontFamily': "iconfont",
        'src': "url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0')"
    });
  },
  methods:{  
    onchangeUserNumber:function (event) {  
      this.userNumber = event.value;  
    }, 
    onchangeUserPassword:function (event) {
      this.userPassword = event.value;  
    },  
    /*处理登录*/  
    login: function () {
      // 校验
      if(this.userNumber.length < 1){
        modal.toast({ 'message':'请输入正确的用户名', 'duration': 1 }) 
      }else if(this.userPassword.length < 1){ 
        modal.toast({ 'message':'请输入正确的密码', 'duration': 1 })  
      } 
      // 用户名密码编码转码
      let data = qs.stringify({user_name:(Base64.encode((this.userNumber+'&'+this.userPassword)))});
      let vm = this;
      // 发送请求
      stream.fetch({
        method:'POST',
        body:data,
        headers:{'Content-Type':'application/x-www-form-urlencoded'},
        // url:'http://www.corededu.com/bracelet/Home/Login/Index',
        url:'http://www.briup.cn:8989/bracelet/Home/Login/Index',
        type:'json'
      },result=>{
        if(result.data.code == 200){
          //保存session值
          storage.removeItem('token',function(){});
          storage.setItem('token',result.data.token,function(){});
          modal.toast({'message':'登录成功!', 'duration': 1 });
          // 路由跳转
          /*let url = ''
          navigator.push({
              url: url,
              animated: "true"
          }, (event) => {
            modal.toast({ message: 'callback: ' + event })
          })*/
          this.$router.push('/nav');
        }else{
          modal.toast({'message':result.data.code_error, 'duration': 1 });
        }
      })
    }  
  }  
}  
</script>  
<style> 
  .login_home {  
    position: absolute;  
    top: 0;  
    right: 0;  
    bottom: 0;  
    left: 0; 
  }  
  .logo{
    position: absolute;
    top:0px;
    left:0;
    right:0;
    height: 400px;
  }
  .logo_img{
    position: absolute;
    top:0px;
    left:0;
    right:0;
    height: 400px;
  }
  .login{  
    margin-top: 450px;
  }  
  .icon{
      font-family: iconfont;
      line-height: 60px;
    font-size: 42px;
    color: #319bf5;
    position: absolute;  
    top:10px;  
    left: 15px;  
    width: 60px;  
    height: 60px; 
    z-index: 1;
  } 
    .title{
      position: absolute;
      top:150px;
      left: 0;
      right: 0;
      text-align:center;
      font-weight: 700;
      font-size: 50px;
      color:white;
    }
  .input-wrapper{ 
    width: 550px;  
    margin-left: 100px;  
    margin-right: 100px;  
    margin-bottom: 30px; 
  }  
  .input {  
    font-size: 30px;  
    height: 80px;  
    width: 550px;  
    padding-left: 90px;  
    padding-top: 15px;  
    padding-bottom: 15px;  
    border-width:1px;  
    border-color: #48c9bf;  
    border-radius:10px;  
    outline: none;  
  }  
  .input-img{  
    position: absolute;  
    top:10px;  
    left: 15px;  
    width: 60px;  
    height: 60px;  
  }  
  .input-login{  
    height: 80px;  
    width: 550px;  
    /*background-color: #48c9bf;  */
    background-color: #319bf5;  

    border-radius: 10px;  
    margin-top: 40px;  
  }  
  .input-register{
    height: 80px;  
    width: 550px;  
    background-color: RGB(249,38,89);  
    border-radius: 10px;  
    margin-top: 40px; 
  }
  .input-login-text{  
    height: 80px;  
    width: 550px;  
    text-align: center;  
    line-height: 80px;  
    color: white;  
    font-size: 35px;  
  } 
  .input-forget{  
    position: absolute;  
    left: 30px;  
    font-size: 30px;  
  }
</style>  