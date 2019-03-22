<template>
    <el-table border
              highlight-current-row
              :data="taskList">
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
                <el-button-group v-if='scope !== undefined && scope.row.status==="正在进行"'>
                    <el-button @click="deleteTask(scope.row.jobId)" size="small">删除任务</el-button>
                </el-button-group>
                <el-button-group v-if='scope !== undefined && scope.row.status==="完成"'>
                    <el-button v-if="scope.row.result !== undefined" @click="downloadResource(scope.row)" size="small">下载文件</el-button>
                    <el-button @click="deleteTask(scope.row.jobId)" size="small">删除任务</el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    export default {
        name: "TaskList",
        props:{
            taskList:{
                type:Array,
                require:true
            }
        },
        methods:{
            downloadResource:function (data) {
                window.location.href = this.apiUrl + '/download?fileName=' + data.result;
            },
            deleteTask:function (jobId) {
                this.$emit('deleteTask',jobId);
            },
        },
        created:function () {
        },
    }
</script>

<style scoped>

</style>
