<template>
	<!-- 一键绑定 -->
	<div class="reports">
	 	<div class="info">
        <text class='info_text_center'>报表</text>
    </div>
    <web ref='webview' :src="url" class="webview" @error="error"></web>
    <!-- <web ref='webview' src="http://m.you.163.com/topic/v1/look/list" class="webview" @error="error"></web> -->
    <!-- <web ref='webview' src="https://www.baidu.com" class="webview" @error="error"></web> -->
	</div>
</template>
<script>
  const storage = weex.requireModule('storage');
  const modal = weex.requireModule('modal');
  let domModule = weex.requireModule('dom');
  var webView = weex.requireModule('webview');
  export default {
  	data:()=>({
  		url:'',
  		webview:webView
  	}),
  	methods:{
      error(error){
        console.log(error);
      }
  	},
  	created(){
  		var self=this;
  		 storage.getItem('uid',res=>{
  	      if(res.result=='success'){
  	        if(res.data){
          		//获取当前年级下的所有班级
  					 	storage.getItem('currentAllClazz',resq=>{
  					 		if(resq.result=='success'){
                  self.url='https://zuozl.com/main.html?'+res.data+'&'+resq.data;
  					 			// self.url='http://www.corededu.com/heartRateCurve/main.html?'+res.data+'&'+resq.data;
  					 			//self.url='http://www.corededu.com/heartRateCurve/main.html';
  					 		}else{
  					 			console.log("没有获取到班级---");
  					 		}
  					 	})
          	}else{
       				modal.toast({ 'message':'没有选中的班级信息', 'duration': 2 });
          	}
          }else{
          		modal.toast({ 'message':'没有选中的班级信息', 'duration': 2 });
          }
        });
  	}
  }
</script>
<style scoped>
	.reports {
		background-color: #eee;
		position: absolute;
		left: 0;right: 0;
		top: 0;bottom: 0;
	}
	.webview {
		flex: 1;
		/* width: 200px;
		height: 200px */
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