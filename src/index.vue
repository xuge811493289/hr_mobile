<template>
  <div class="wrapper">
    <router-view/>
  </div>
</template>

<script>
let domModule = weex.requireModule('dom');

export default {
  name: 'App',
  data () {
    return {
    }
  },
  created(){
    //添加规则 addRule是可以为dom 添加一条规则，目前支持自定义字体fontFace规则，构建自定义的font-family，可以在text使用
    domModule.addRule('fontFace', {
        'fontFamily': "iconfont",
        'src': "url('https://cdn.bootcss.com/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0')"
    });
  },
}
</script>

<style scoped>
  .icon {
    font-family:iconfont;
  }
  /*根元素*/
  .wrapper {
    flex-direction: column;
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
    flex: 1;
    position: absolute;
    right: 30px;
    top: 0px;
    bottom: 0px;
  }
  .info_text_left,.info_text_center,.info_text_right {
    line-height: 68px;
    color: #fff;
    text-align: center;
    font-weight: bold;
  }
  /*内容容器*/
  .container {
    flex: 1
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
