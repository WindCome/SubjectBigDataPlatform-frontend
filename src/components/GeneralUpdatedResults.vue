<template>
    <el-container style="border: 1px solid #eee">
        <AsideMenu></AsideMenu>
        <el-container>
            <el-header>
                <el-row style="font-size: 20px">
                    <el-col :span="12">
                        <span>{{pageName}}更新结果</span>
                    </el-col>
                    <el-col :span="12" style="text-align: right" v-if="isSavingAllData===false">
                        <el-button type="primary" round @click="saveAllData" :disabled="this.totalNum===this.NumOfSavedData+this.NumOfSameData">
                            <span v-if="this.totalNum!==this.NumOfSavedData+this.NumOfSameData">保存更新结果</span>
                            <span class="span1" v-else>已保存所有更新结果</span>
                        </el-button>
                    </el-col>
                </el-row>
            </el-header>
            <!--new数据详细信息对话框-->
            <el-dialog title="新增数据更新信息" :visible.sync="dialogOfNewData">
                <!--保证this.detailedDatab不是一个空对象，否则在初始化绑定时会报错-->
                <el-form label-width="5rem" :model="detailedData" v-if='JSON.stringify(this.detailedData)!=="{}" '>
                    <el-form-item v-for="(value, key) in detailedSetting" :label='value.name+": " ' :key="key">
                        <el-input v-if='value.modify==="true" ' auto-complete="off" type="textarea" autosize v-model="detailedData[key].newValue"></el-input>
                        <span v-else class="span1">{{detailedData[key].newValue}}</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogOfNewData = false">取 消</el-button>
                    <el-button type="primary" @click="submitModification" v-loading="submitModificationLoading">提 交</el-button>
                </div>
            </el-dialog>

            <!--saved数据详细信息对话框-->
            <el-dialog title="数据更新信息" :visible.sync="dialogOfSavedData">
                <!--保证this.detailedDatab不是一个空对象，否则在初始化绑定时会报错-->
                <el-form label-width="5rem" :model="detailedData" v-if='JSON.stringify(this.detailedData)!=="{}" '>
                    <el-form-item v-for="(value, key) in detailedSetting" :label='value.name+": " ' :key="key">
                        <span class="span1">{{detailedData[key].newValue}}</span>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogOfSavedData = false">关 闭</el-button>
                </div>
            </el-dialog>
            <!--update数据详细信息对话框-->
            <el-dialog title="数据更新信息" :visible.sync="dialogOfUpdateData">
                <el-form label-width="5rem" :model="detailedData" v-if='JSON.stringify(this.detailedData)!=="{}" '>
                    <el-row>
                        <el-col :span="12">
                            <el-row style="font-size: 20px;text-align: center">原数据</el-row>
                            <el-row>
                                <el-form-item v-for="(value, key) in detailedSetting" :key="key" :label='value.name+": " ' style="margin-bottom: 0;">
                                    <span class="span1">{{detailedData[key].oldValue}}</span>
                                </el-form-item>
                            </el-row>
                        </el-col>
                        <el-col :span="12" style="border-left: 2px solid #eee">
                            <el-row style="font-size: 20px;text-align: center">新数据</el-row>
                            <el-form-item v-for="(value, key) in detailedSetting" :key="key">
                                <el-tag slot="label" type="success" v-if='detailedData[key].status==="update" '>
                                    {{value.name+": "}}
                                </el-tag>
                                <label slot="label" v-else>
                                    {{value.name+": "}}
                                </label>
                                <el-input v-if='value.modify==="true" ' auto-complete="off" type="textarea" autosize v-model="detailedData[key].newValue"></el-input>
                                <span v-else class="span1">{{detailedData[key].newValue}}</span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogOfUpdateData=false">取 消</el-button>
                    <el-button type="primary" @click="submitModification" v-loading="submitModificationLoading">提 交</el-button>
                </div>
            </el-dialog>
            <!--提示无更新结果-->
            <el-alert
                v-if="existUpdatedResults"
                title="错误!"
                type="error"
                description="暂无更新结果，请返回上一页面先获取最新数据"
                show-icon>
            </el-alert>
            <!--保存全部更新结果进度条-->
            <el-main v-if="isSavingAllData===true">
                <el-progress :text-inside="true" :stroke-width="36" :percentage="savingPercentage" status="success"></el-progress>
                <span>正在保存更新结果中,请勿退出更新结果页面...</span>
            </el-main>
            <el-main v-if="isSavingAllData===false">
                <el-row style="text-align: left; margin-bottom: 5px;">
                    <el-col :span="7">
                        <span>共有{{totalNum}}条数据</span>
                        <br>
                        <span v-if="NumOfSavedData!==0">已保存{{NumOfSavedData}}条</span>
                        <span v-if="NumOfNewData!==0">新增{{NumOfNewData}}条</span>
                        <span v-if="NumOfUpdateData!==0">{{NumOfUpdateData}}条数据更新状态</span>
                        <span v-if="NumOfSameData!==0">无更新{{NumOfSameData}}条</span>
                    </el-col>
                    <el-col :span="9">
                        <!--搜索框-->
                        <el-input placeholder="请输入内容" v-model="searchContent">
                            <el-select slot="prepend" placeholder="请选择" v-model="searchKey">
                                <el-option v-for="(value, key) in detailedSetting" :label='value.name' :value="key" :key="key"></el-option>
                            </el-select>
                            <el-button slot="append" @click="search" icon="el-icon-search" style="background-color: #409EFF;color: white">搜索</el-button>
                        </el-input>
                    </el-col>
                    <el-col :span="8" style="padding-left: 10px">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-checkbox-group v-model="checkedStatuses" @change="handleCheckedSingleChange">
                            <el-checkbox v-for="status in statuses" :label="status.status" :key="status.status">{{status.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-row>

                <!--信息列表-->
                <el-table border
                          highlight-current-row
                          v-loading="listLoading"
                          element-loading-text="拼命加载更新结果中..."
                          :data="storeData">
                    <!--序号-->
                    <el-table-column
                        label="序号"
                        width="70">
                        <template slot-scope="scope">
                            <span>{{scope.row.index}}</span>
                        </template>
                    </el-table-column>
                    <!--展示数据信息列-->
                    <el-table-column v-for="(value, key) in listSetting" :label="value" :key="key">
                        <template slot-scope="scope">
                            <p class="p1">{{typeof (scope.row.data[key])!=='undefined'?scope.row.data[key].newValue:key}}</p>
                        </template>
                    </el-table-column>
                    <!--数据状态列-->
                    <el-table-column label="状态"
                                     prop="status"
                                     width="100"
                                     :filters="[{text:'被移除',value:'deleted'},{text:'新增',value:'new'},
                                     {text:'数据更新',value:'update'},{text:'已保存',value:'saved'},{text:'无更新',value:'same'}]"
                                     :filter-method="statusFilter">
                        <template slot-scope="scope">
                            <el-tag v-if='scope.row.status==="deleted"' type='danger'>
                                被移除
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="new"' type="success">
                                新增
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="saved"' type="info">
                                已保存
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="update"'>
                                数据更新
                            </el-tag>
                            <el-tag v-else-if='scope.row.status==="same"' type="info">
                                无更新
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!--被删除的数据-->
                            <el-button-group v-if='scope.row.status==="deleted"'>
                                <el-button>查看</el-button>
                                <el-button>保留</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="small"
                                    @click.native=""
                                ></el-button>
                            </el-button-group>
                            <!--数据更新状态-->
                            <el-button-group v-else-if='scope.row.status==="update"'>
                                <el-button size="small" @click="showDialogOfUpdateData(scope.row.data,scope.row.index)">编辑</el-button>
                                <el-button @click="saveSingleData(scope.row.index)" size="small">保存</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="small"
                                    @click.native="del(scope.row.index)"
                                ></el-button>
                            </el-button-group>
                            <!--已保存与无更新数据状态-->
                            <el-button-group v-else-if='scope.row.status==="saved" || scope.row.status==="same"'>
                                <el-button size="small" @click="showDialogOfSavedData(scope.row.data)">查看</el-button>
                            </el-button-group>
                            <!--新增数据相关操作-->
                            <el-button-group v-else-if='scope.row.status==="new"'>
                                <el-button @click="showDialogOfNewData(scope.row.data,scope.row.index)" size="small">编辑</el-button>
                                <el-button @click="saveSingleData(scope.row.index)" size="small">保存</el-button>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    size="small"
                                    @click.native="del(scope.row.index)"
                                ></el-button>
                            </el-button-group>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="totalNum"
                    :current-page="pageNum"
                    :page-size="pageSize"
                    @current-change="handelCurrentChange">
                </el-pagination>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import AsideMenu from '@/components/AsideMenu'

    export default {
        name: "GeneralUpdatedResults",
        data: function () {
            return {
                // 保存的数据
                storeData: [],
                detailedData: {},    //详细信息
                modifyingRowIndex: null, //正在编辑的行序号
                // 对话框
                dialogOfNewData: false,      // 数据更新状态信息
                dialogOfSavedData: false,  // 已保存数据库的状态信息
                dialogOfUpdateData: false,   // 数据更新状态信息
                // 分页控制
                pageNum: 1,
                pageSize: 20,
                isSearchingResults: false,   // 当前是否处于搜索结果状态
                totalNum: 0,   // 总条数
                NumOfNewData: 0,     // 新增数据条数
                NumOfUpdateData: 0,  // 数据更新状态数据条数
                NumOfSavedData: 0, // 已保存的数据条数
                NumOfSameData: 0,    // 相同的数据条数
                // 加载状态控制
                listLoading: false,     // 列表加载状态
                submitModificationLoading: false,    // 提交修改按钮加载状态
                // 页面设置
                listSetting: {},     // 信息列表设置，包含key和对应的中文名
                detailedSetting: {},   // 详细信息设置，包含key，中文名以及是否可编辑
                editableSetting: {},     // 可编辑的信息设置
                idSetting: {},   // 列表信息id的设置，包括id的key和类型（int与str）
                pageName: null,   // 页面名称
                existUpdatedResults: false,  // 是否存在更新结果
                // 检索设置
                searchKey: null,  // 检索的key
                searchContent: '',   // 检索的内容
                checkAll: true,    // 是否全选
                checkedStatuses: ['update', 'saved', 'new', 'same'],  // 所有选择的状态
                statuses: [
                    {'status': 'update', 'label': '数据更新'},
                    {'status': 'new', 'label': '新增'},
                    {'status': 'saved', 'label': '已保存'},
                    {'status': 'same', 'label': '无更新'},
                ],
                isIndeterminate: false, // 全选的不确定状态
                searchingData: {},  // 检索数据
                // 保存所有更新结果设置
                isSavingAllData: false, // 是否正在保存所有更新结果
                savingPercentage: 0, // 更新进度
                ws: null,    // 保存所有结果的WebSocket
            }
        },
        components: {
            AsideMenu,
        },
        computed: {},
        methods: {
            handleCheckAllChange(val) {
                this.checkedStatuses = val ? ['update', 'saved', 'new', 'same'] : [];
                this.isIndeterminate = false;
            },
            handleCheckedSingleChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.statuses.length;
                // 既没有全不选也没有全选，处于不确定状态
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.statuses.length;
            },
            // 弹出展示新增数据详细信息对话框
            showDialogOfNewData: function (rowData, rowIndex) {
                this.detailedData = JSON.parse(JSON.stringify(rowData));
                this.modifyingRowIndex = rowIndex;
                this.dialogOfNewData = true;
            },
            // 弹出saved数据详细信息对话框
            showDialogOfSavedData: function (rowData) {
                this.detailedData = JSON.parse(JSON.stringify(rowData));
                this.dialogOfSavedData = true;
            },
            // 弹出update数据详细信息对话框
            showDialogOfUpdateData: function (rowData, rowIndex) {
                this.detailedData = JSON.parse(JSON.stringify(rowData));
                this.modifyingRowIndex = rowIndex;
                this.dialogOfUpdateData = true;
            },
            // 提交修改后的更新信息
            submitModification: function () {
                this.submitModificationLoading = true;
                // 保存修改的数据的序号
                let tempIndex = this.modifyingRowIndex;
                let tempData = {};
                for (let key in this.detailedData) {
                    tempData[key] = this.detailedData[key].newValue;
                }
                this.axios.post(this.apiUrl + '/upgrade/modify/' + this.$route.params.tableId + '?index=' + tempIndex, tempData)
                    .then(
                        (res) => {
                            if (res.status === 200) {
                                if (res.data === true) {
                                    this.$notify({
                                        title: '成功',
                                        message: '修改信息成功',
                                        type: 'success',
                                        duration: 4000
                                    });
                                    // 修改前端数据
                                    let index = this.storeData.findIndex(
                                        (x) => {
                                            return x['index'] === tempIndex;
                                        });
                                    this.$set(this.storeData[index], 'data', this.detailedData);
                                    this.submitModificationLoading = false;
                                    // 两种对话框都保存
                                    this.dialogOfNewData = false;
                                    this.dialogOfUpdateData = false;
                                }
                                else {      // 修改更新信息失败
                                    this.$notify({
                                        title: '失败',
                                        message: '修改信息失败',
                                        type: 'error',
                                        duration: 4000
                                    });
                                    this.submitModificationLoading = false;
                                }
                            }
                            else {
                                this.$message.error('网络异常，请重新尝试');
                                this.submitModificationLoading = false;
                            }
                        }
                    ).catch(
                    (error) => {
                        console.log(error);
                        this.$message.error('其它异常，请重新尝试');
                        this.submitModificationLoading = false;
                    });
            },
            // 保存单条更新信息
            saveSingleData: function (rowIndex) {
                this.$confirm('确认保存该条信息吗？, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let tempIndex = rowIndex;
                    let requestUrl = this.apiUrl + '/upgradeSave/' + this.$route.params.tableId +
                        '?index=' + tempIndex + '&flag=' + (this.idSetting.isDigit === 'true' ? 1 : 2);
                    this.axios.get(requestUrl)
                        .then(
                            (res) => {
                                if (res.data === true) {
                                    this.$message({
                                        type: 'success',
                                        message: '保存成功!'
                                    });
                                    // 设置数据条数
                                    // 修改前端数据
                                    let index = this.storeData.findIndex(
                                        (x) => {
                                            return x['index'] === tempIndex;
                                        });
                                    if (this.storeData[index].status === 'update')
                                        this.NumOfUpdateData -= 1;
                                    else if (this.storeData[index].status === 'new')
                                        this.NumOfNewData -= 1;
                                    // 更改为保存状态
                                    this.$set(this.storeData[index], 'status', 'saved');
                                    // 保存数据条数+1
                                    this.NumOfSavedData += 1;
                                }
                                else {
                                    this.$notify({
                                        title: '失败',
                                        message: '保存失败，请重新尝试',
                                        type: 'warning',
                                        duration: 4000
                                    });
                                }
                            }
                        ).catch(
                        (error) => {
                            console.log(error);
                            this.$notify({
                                title: '失败',
                                message: '网络异常',
                                type: 'warning',
                                duration: 4000
                            });
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 保存当前所有的更新信息
            saveAllData: function () {
                this.$confirm('确认将所有更新结果保存入库吗？该操作无法撤销, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.isSavingAllData = true;  // 开始保存所有更新结果
                    let wsUrl = this.apiUrl.replace('http', 'ws') + '/websocket/' + this.$route.params.tableId;
                    this.ws = new WebSocket(wsUrl);     // 创建websocket对象
                    this.ws.onopen = () => {    // 先发送一个消息，开始保存所有更新数据
                        this.ws.send('start');
                    };
                    let savingComplete=false;   // 统计是否完成全部保存，防止ws的断开
                    this.ws.onmessage = (event) => {
                        let temp = parseInt(event.data);
                        if (temp === 101) {
                            this.$message.success('所有更新结果保存完成！');
                            savingComplete=true;
                            this.ws.close();
                            this.isSavingAllData = false;
                            this.pageNum = 1;
                            this.pageJumping();
                        } else if (temp === -1) {
                            this.$message.error('保存所有更新结果失败，请重新尝试保存');
                            this.ws.close();
                            this.isSavingAllData = false;
                            this.pageNum = 1;
                            this.pageJumping();
                        }
                        else {
                            this.savingPercentage = temp;
                        }
                    };
                    this.ws.onerror = (event) => {
                        console.log(event);
                        this.$message.error('网络连接异常，保存失败，请重新尝试保存');
                    };
                    this.ws.onclose=(event)=>{
                        // 没有保存完就socket中断
                        if (savingComplete===false){
                            this.$message.warning('网络连接中断，保存未全部完成，请重新尝试，继续保存');
                            this.isSavingAllData=false;
                            this.pageNum = 1;
                            this.pageJumping();
                        }
                    };
                }).catch(() => {
                    this.listLoading = false;
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 删除更新信息
            del: function (rowIndex) {
                this.$confirm('此操作将删除该条更新信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tempIndex = rowIndex;
                    let requestUrl = this.apiUrl + '/upgrade/delete/' + this.$route.params.tableId + '?index=' + tempIndex;
                    this.axios.get(requestUrl)
                        .then(
                            (res) => {
                                if (res.data === true) {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!'
                                    });
                                    // 数据量减一
                                    this.totalNum -= 1;
                                    // 修改前端数据
                                    let index = this.storeData.findIndex(
                                        (x) => {
                                            return x['index'] === tempIndex;
                                        });
                                    if (this.storeData[index].status === 'update')
                                        this.NumOfUpdateData -= 1;
                                    else if (this.storeData[index].status === 'new')
                                        this.NumOfNewData -= 1;
                                    this.storeData.splice(index, 1);
                                }
                                else {
                                    this.$message.error('网络异常，请重新加载');
                                }
                            }
                        ).catch(
                        (error) => {
                            console.log(error);
                            this.$notify({
                                title: '失败',
                                message: '网络异常',
                                type: 'warning',
                                duration: 4000
                            });
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 加载搜索结果
            loadingSearchingResults: function () {
                this.listLoading = true;
                this.axios.post(this.apiUrl + '/searchUpgrade/' + this.$route.params.tableId + '?page=' + this.pageNum + '&size=' + this.pageSize, this.searchingData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .then(
                        (res) => {
                            if (res.status === 200) {
                                // 总页数配置
                                let numbers = res.data.pop();
                                this.totalNum = numbers.totalCount;
                                this.NumOfNewData = numbers.newCount;
                                this.NumOfSavedData = numbers.savedCount;
                                this.NumOfUpdateData = numbers.updateCount;
                                this.NumOfSameData = numbers.sameCount;
                                // 保存的数据
                                this.storeData = res.data;
                                // 取消页面加载转态
                                this.listLoading = false;
                                window.location.href = '#top';
                            }
                            else {
                                this.$message.error('网络异常，请重新尝试检索');
                                this.listLoading = false;
                            }
                        }
                    )
                    .catch(
                        (error) => {
                            console.log(error);
                            this.$message.error('网络异常，请重新尝试检索');
                            this.listLoading = false;
                        }
                    );
            },
            // 加载所有结果
            loadingAllData: function () {
                this.axios.get(this.apiUrl + '/upgrade/' + this.$route.params.tableId + '?page=' + this.pageNum + '&size=' + this.pageSize)
                    .then(
                        (res) => {
                            if (res.status === 200) {
                                if (res.data !== "") {        // 返回值不为空，存在更新结果
                                    // 总页数配置
                                    let numbers = res.data.pop();
                                    this.totalNum = numbers.totalCount;
                                    this.NumOfNewData = numbers.newCount;
                                    this.NumOfSavedData = numbers.savedCount;
                                    this.NumOfUpdateData = numbers.updateCount;
                                    this.NumOfSameData = numbers.sameCount;
                                    // 保存的数据
                                    this.storeData = res.data;
                                    // 取消页面加载转态
                                    this.listLoading = false;
                                    window.location.href = '#top';
                                }
                                else {
                                    this.listLoading = false;
                                    this.existUpdatedResults = true;
                                }
                            }
                            else {
                                this.$message.error('网络异常，请重新加载');
                                this.listLoading = false;
                            }
                        }
                    ).catch(
                    (error) => {
                        console.log(error);
                        this.$message.error('网络异常，请重新加载');
                        this.listLoading = false;
                    });
            },
            // 检索
            search: function () {
                this.pageNum = 1;   // 从第一页开始展示搜索结果
                if (this.checkAll === true && this.searchContent === '') {    // 如果全选并且没有搜索内容时不处于搜索状态
                    this.isSearchingResults = false;
                    this.pageJumping();
                }
                else {  // 处于搜索状态
                    this.isSearchingResults = true;
                    // 一种状态都没有选
                    if (this.checkedStatuses.length === 0) {
                        this.$message.warning('请选择一种状态');
                        return;
                    }
                    this.searchingData = {  // 构造搜索参数
                        'condition': {},
                        'status': {
                            'update': true,
                            'new': true,
                            'saved': true,
                            'same': true
                        }
                    };
                    if (this.searchKey !== null && this.searchContent !== '') {
                        this.searchingData.condition[this.searchKey] = this.searchContent;   // 传入要检索的字段信息
                    }
                    if (this.checkAll !== true) {
                        if (this.checkedStatuses.indexOf('saved') === -1) {
                            this.searchingData.status.saved = false;
                        }
                        if (this.checkedStatuses.indexOf('update') === -1) {
                            this.searchingData.status.update = false;
                        }
                        if (this.checkedStatuses.indexOf('new') === -1) {
                            this.searchingData.status.new = false;
                        }
                        if (this.checkedStatuses.indexOf('same') === -1) {
                            this.searchingData.status.same = false;
                        }
                    }
                    this.loadingSearchingResults();
                }
            },
            // 点击页数触发事件
            handelCurrentChange: function (val) {
                this.pageNum = val;
                this.pageJumping();
            },
            // 页面跳转请求
            pageJumping: function () {
                this.listLoading = true;
                if (this.isSearchingResults === true) {    // 若处于搜索结果
                    this.loadingSearchingResults();
                }
                else {
                    this.loadingAllData();
                }
            },
            // 获取页面setting
            getPageSetting: function () {
                this.listLoading = true;
                this.axios.get(this.apiUrl + '/getConfig/' + this.$route.params.tableId)
                    .then(
                        (res) => {
                            if (res.status === 200) {
                                // 获取页面配置信息
                                let pageSettingInfo = res.data;
                                // 页面名字
                                this.pageName = pageSettingInfo.pageName;
                                // 列表展示信息配置
                                this.listSetting = JSON.parse(pageSettingInfo.show);
                                // 删除修改时间字段
                                for (let key in this.listSetting) {
                                    if (key === 'MODIFY_TIME') {
                                        delete this.listSetting[key];
                                        break
                                    }
                                }
                                // 详细信息配置
                                this.detailedSetting = JSON.parse(pageSettingInfo.all);
                                // 删除修改时间字段
                                for (let key in this.detailedSetting) {
                                    if (key === 'MODIFY_TIME') {
                                        delete this.detailedSetting[key];
                                        break
                                    }
                                }
                                // 找出可编辑信息配置
                                Object.keys(this.detailedSetting).forEach(
                                    (key) => {
                                        if (this.detailedSetting[key].modify === 'true') {
                                            this.editableSetting[key] = this.detailedSetting[key];
                                        }
                                    });
                                // id设置
                                this.idSetting = JSON.parse(pageSettingInfo.index);
                                this.pageJumping();
                            }
                            else {
                                this.$message.error('网络异常，请重新加载');
                                this.listLoading = false;
                            }
                        }
                    )
                    .catch(
                        (error) => {
                            console.log(error);
                            this.$message.error('网络异常，请重新加载');
                            this.listLoading = false;
                        }
                    );
            },
            statusFilter: function (value, row) {
                return row.status === value
            },

        },
        created: function () {
            this.getPageSetting();
        },
        beforeDestroy: function () {
            if (this.isSavingAllData === true) {
                this.$confirm('现在正在保存更新结果，确认要离开当前页面吗？离开无法继续保存结果', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    if (this.ws !== null) {
                        this.ws.close();
                    }
                    this.isSavingAllData = false;
                });
            }
        },
        deactivated: function () {
            if (this.isSavingAllData === true) {
                this.$confirm('现在正在保存更新结果，确认要离开当前页面吗？离开无法继续保存结果', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    if (this.ws !== null) {
                        this.ws.close();
                    }
                    this.isSavingAllData = false;
                });
            }
        },
        beforeRouteLeave: function (to, from, next) {
            if (this.isSavingAllData === true) {
                this.$confirm('现在正在保存更新结果，确认要离开当前页面吗？离开无法继续保存结果', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    if (this.ws !== null) {
                        this.ws.close();
                    }
                    this.isSavingAllData = false;
                    next()
                }).catch(() => {
                    next(false);
                });
            }
        },
    }
</script>

<style scoped>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: left;
        line-height: 60px;
    }

    .p1 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .span1 {
        word-wrap: break-word;
        word-break: break-all;
        white-space:normal;
        overflow: hidden;
    }

    .el-aside {
        background-color: #545c64;
    }

    .el-menu {
        text-align: center;
    }

    a {
        color: #fff;
        text-decoration: none;
    }

    a:hover {
        color: #ffd04b;
    }

    .el-select {
        width: 130px;
    }
</style>
