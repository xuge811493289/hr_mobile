<template>
	<div class="home">
		   <div class="info">
		        <text class='info_text_center'>我的</text>
		    </div>
		<div class="row">
			<text class="title">中赤智能手环云平台</text>
			<div class="content">
				<text class="table-title">账号</text>
				<text class="table-content">{{user_account}}</text>
			</div>
			<div class="content">
				<text class="table-title">姓名</text>
				<text class="table-content">{{user_name}}</text>
			</div>
			<div class="content">
				<text class="table-title">电话</text>
				<text class="table-content">{{user_tel}}</text>
			</div>
			<div class="btn_group" >
				<wxc-button :btnStyle="btnStyle" class="btn" text="退出当前账号" @wxcButtonClicked="handleBind"></wxc-button>
			</div>
		</div>
	</div>
</template>
<script>
	const modal = weex.requireModule('modal');
	const storage = weex.requireModule('storage');
	const stream = weex.requireModule('stream');
	import qs from 'querystring';
	import { WxcButton} from 'weex-ui';
	export default {
	data(){
		return {
			btnStyle:{
	        backgroundColor:"#319bf5"
	      },
			token:'',
			user_account:'',
			user_name:'',
			user_tel:'',
		}
	},
	created(){
		let vm = this;
		storage.getItem('token',event=>{
			vm.token = event.data
			if(vm.token){
				let obj = qs.stringify({action:'index'});
				stream.fetch({
			        method:'POST',
			        body:obj,
			        headers:{'Content-Type':'application/x-www-form-urlencoded'},
			        // url:'http://www.corededu.com/bracelet/Home/Index?token='+vm.token
			        url:'http://www.briup.cn:8989/bracelet/Home/Index?token='+vm.token
			        
			    },result=>{
			        if(result.status == 200){
			        	let data = JSON.parse(result.data);
			          	vm.user_account = data.user_account;
			          	vm.user_name = data.user_name;
			          	vm.user_tel = data.user_tel;
			        }else{
			        	modal.toast({ 'message': data.code_error, 'duration': 1 });
			        }
			    })
			}else{
				modal.toast({ 'message': '您还未登录！', 'duration': 1 });
			}
		});
		
	},
	methods:{
		handleBind(){
			let obj = qs.stringify({action:'logout'});
			stream.fetch({
		        method:'POST',
		        body:obj,
		        headers:{'Content-Type':'application/x-www-form-urlencoded'},
		        // url:'http://www.briup.cn:8989/bracelet/Home/Logout/Logout?token='+this.token,
		        url:'http://www.briup.cn:8989/bracelet/Home/Logout/Logout?token='+this.token,
		        type:'json'
		    },result=>{
		        if(result.data.code == 200){
		          	storage.removeItem('token',function(){});
		          	// 转到登录页面  
		          	this.$router.push({path:'/login'});
		        }else{
		        	// modal.toast({ 'message': result.code_error, 'duration': 1 });
		        	// 转到登录页面
		        	this.$router.push({path:'/login'});
		        }
		    })
		}
	},
	components: { WxcButton},
}
</script>
<style scoped>
	.row {
		display: flex;
		flex-direction: column; 
		justify-content:flex-start;
	}
	.title {
		height:120px;
		line-height: 120px;
		text-align: center;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #ededed;		
	}
	.content{
		display: flex;
		flex-direction: row;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #ededed;
		height:100px;
	}
	.table-title{
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #ededed;
		flex:2;
		text-align: center;
		font-weight: 700;
		line-height: 100px;
	}
	.table-content{
		flex:4;
		line-height: 100px;
		text-align: center;
	}
	.btn_group{
		margin-top: 40px;
		flex-direction: column;
		align-items: center;
	}
	.btn{
		background-color:  #319bf5;
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