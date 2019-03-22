<template>
    <div id="app">
            <el-header style="width: 100%; margin: 0;padding: 0">
                <el-menu
                    mode="horizontal"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#fff">
                    <el-menu-item index="1">
                        <a href="/" style="color: #fff;text-decoration: none;">
                            <span style="font-size: 20px">公 共 库 维 护</span>
                        </a>
                    </el-menu-item>
                    <el-menu-item index="2" style="float: right" @click="showDialogOfTaskList">
                        任务列表
                    </el-menu-item>
                </el-menu>
            </el-header>
            <el-main style="width: 100%; margin: 0;padding: 0">
                <router-view @watchChild="handelJobInfoFromChild" @showTaskList="showDialogOfTaskList"/>
            </el-main>
        <el-dialog title="任务列表" :visible.sync="dialogOfTaskList" width="50%">
            <TaskList @deleteTask="deleteTask" v-bind:taskList="taskList"></TaskList>
        </el-dialog>
    </div>
</template>

<script>
    import TaskList from "./components/TaskList";
    export default {
        name: 'App',
        components: {TaskList},
        data:function () {
            return {
                dialogOfTaskList : false,//显示任务列表
                taskList : [],          //任务列表
                taskToShow :[],
                activeName : "all",  //激活选项卡
                ws: null
            };
        },
        methods:{
            showDialogOfTaskList: function () {
                this.taskToShow = this.taskList;
                this.dialogOfTaskList = true;
            },
            addTask:function(task){
                this.taskList.splice(0,0,task);
            },
            findTaskIndexByJobId:function(jobId){
                let index = null;
                for(let i= 0;i<this.taskList.length ;i++){
                    let x = this.taskList[i];
                    if(x.jobId !== undefined && x.jobId === jobId){
                        index = i;
                        break;
                    }
                }
                return index;
            },
            //更新任务进度
            updateTaskProgress:function(jobId,progress,result,log){
                let index = this.findTaskIndexByJobId(jobId);
                if(result !== undefined){
                    this.$set(this.taskList[index], "result", result);
                }
                if(progress !== undefined){
                    if(progress<=100){
                        this.$set(this.taskList[index], "progress", progress);
                    }else if(progress === 101){
                        this.$set(this.taskList[index], "progress", 100);
                        this.$set(this.taskList[index], "status","完成");
                    }
                    sessionStorage.setItem("taskList",JSON.stringify(this.taskList));
                }
            },
            deleteTask:function (jobId) {
                let index= this.findTaskIndexByJobId(jobId);
                if(index != null){
                    let task = this.taskList[index];
                    if(task.status === '正在进行'){
                        let params = {"op":"cancelJob","jobId":jobId};
                        this.webSocketSendMsg(JSON.stringify(params));
                    }
                    this.taskList.splice(index ,1);
                    sessionStorage.setItem("taskList",JSON.stringify(this.taskList));
                }
            },
            webSocketSendMsg:function(msg){
                let wsUrl = this.apiUrl.replace('http', 'ws') + '/websocket';
                if(this.ws ===null || this.ws.readyState === this.ws.CLOSED ||this.ws.readyState === this.ws.CLOSING ){
                    this.ws = new WebSocket(wsUrl);     // 创建websocket对象
                    this.ws.onmessage = (event) => {
                        let msg = JSON.parse(event.data);
                        let jobId = msg.jobId;
                        let progress = msg.progress;
                        let result = msg.result;
                        let log = msg.log;
                        this.updateTaskProgress(jobId,progress,result,log);
                    };
                    this.ws.onopen = (event) =>{
                        this.ws.send(msg)
                    };
                    this.ws.onerror = (event) => {
                        console.log(event);
                        this.$message.error('网络连接异常，保存失败，请重新尝试保存');
                    };
                }else if(this.ws.readyState === this.ws.OPEN){
                    this.ws.send(msg);
                }else {
                    this.$message.error('网络正在连接请稍后再试');
                }
            },
            handelJobInfoFromChild:function (message) {
                let params = {"op":"startJob","jobId":message.value};
                let task = {name:message.taskName,jobId:message.value,status:'正在进行'};
                this.addTask(task);
                this.webSocketSendMsg(JSON.stringify(params));
            },
            //选项卡切换
            handleClick:function(activeName, oldActiveName){
                this.showDialogOfTaskList();
            }
        },
        created:function () {
            let tasks = sessionStorage.getItem("taskList");
            if(tasks != null){
                let taskList = JSON.parse(tasks);
                for(let index in taskList){
                    this.taskList.push(taskList[index]);
                }
            }
        },
        destroyed:function () {
        },
    }
</script>

<style>
    #app {
        font-family: '"PingFang SC"', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
</style>
