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
            <template>
                <el-tabs type="card" v-model="activeName" :before-leave='handleClick'>
                    <el-tab-pane label="全部" name="all">
                        <el-table border
                                  highlight-current-row
                                  :data="taskToShow">
                            <!--任务名称列-->
                            <el-table-column label="任务名称">
                                <template slot-scope="scope">
                                    <p class="p1">{{scope.row.name}}</p>
                                </template>
                            </el-table-column>
                            <!--进度列-->
                            <el-table-column label="进度">
                                <template slot-scope="scope">
                                    <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.progress" status="success"></el-progress>
                                </template>
                            </el-table-column>
                            <!--状态列-->
                            <el-table-column label="状态">
                                <template slot-scope="scope">
                                    <p class="p1">{{scope.row.status}}</p>
                                </template>
                            </el-table-column>
                            <!--操作列-->
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button-group v-if='scope !== undefined && scope.row.status==="ongoing"'>
                                        <el-button @click="deleteTask" size="small">取消任务</el-button>
                                    </el-button-group>
                                    <el-button-group v-if='scope !== undefined && scope.row.status==="done"'>
                                        <el-button @click="downloadResource(scope.row)" size="small">下载文件</el-button>
                                    </el-button-group>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="正在进行" name="ongoing">

                    </el-tab-pane>
                    <el-tab-pane label="已完成" name="done">

                    </el-tab-pane>
                </el-tabs>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'App',
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
            deleteTask:function () {

            },
            downloadResource:function (data) {
                console.log(data);
                let requestUrl = this.apiUrl + '/download?fileName=' + data.result;
                window.location.href = requestUrl;
            },
            //更新任务进度
            updateTaskProgress:function(jobId,progress,result,log){
                let task = null;
                let index ;
                for(let i= 0;i<this.taskList.length ;i++){
                    let x = this.taskList[i];
                    if(x.jobId !== undefined && x.jobId === jobId){
                        task = x;
                        index = i;
                        break;
                    }
                }
                //console.log(index);
                if(result !== undefined){
                    this.$set(this.taskList[index], "result", result);
                }
                if(progress !== undefined){
                    if(progress<=100){
                        this.$set(this.taskList[index], "progress", progress);
                    }else if(progress === 101){
                        this.$set(this.taskList[index], "progress", 100);
                        this.$set(this.taskList[index], "status","done");
                    }
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
                let task = {name:message.taskName,jobId:message.value,status:'ongoing'};
                this.$set(this.taskList,this.taskList.length,task);
                this.webSocketSendMsg(JSON.stringify(params));
                this.dialogOfTaskList = true;
            },
            //选项卡切换
            handleClick:function(activeName, oldActiveName){
                this.showDialogOfTaskList();
            }
        },
        created:function () {
            //this.WebSocketSendMsg();
        }
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
