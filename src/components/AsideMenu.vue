<template>
    <el-aside style="width: 18%">
        <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :default-active="this.$route.params.tableId">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>专家</span>
                </template>
                <el-menu-item v-for="(value, key) in menuData.ZJ" :index="key" @click='jumpTo("/admin/"+key)' :key="key">
                    <p>{{value}}</p>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>团队</span>
                </template>
                <el-menu-item v-for="(value, key) in menuData.TD" :index="key" @click='jumpTo("/admin/"+key)' :key="key">
                    <p>{{value}}</p>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>平台</span>
                </template>
                <el-menu-item v-for="(value, key) in menuData.PT" :index="key" @click='jumpTo("/admin/"+key)' :key="key">
                    <p>{{value}}</p>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>教学</span>
                </template>
                <el-menu-item v-for="(value, key) in menuData.JX" :index="key" @click='jumpTo("/admin/"+key)' :key="key">
                    <p>{{value}}</p>
                </el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>获奖</span>
                </template>
                <el-menu-item v-for="(value, key) in menuData.HJ" :index="key" @click='jumpTo("/admin/"+key)' :key="key">
                    <p>{{value}}</p>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </el-aside>

</template>

<script>
    export default {
        name: "AsideMenu",
        data: function () {
            return {
                activeIndex: '0',
                menuData: {
                    ZJ: {    // 专家
                        '18': '长江学者',
                        '42':'中国科学院院士',
                        '43':'中国工程院院士',
                        '20':'新世纪优秀人才支持计划-教育部新世纪优秀人才',
                        '21':'高校青年教师奖',
                        '22':'现代农业产业技术体系首席科学家',
                        '23':'万人计划入选者',
                        '25':'国医大师汇总表',
                        '27':'千人计划',
                        '28':'百千万人才工程汇总表',
                        '33':'国家级教学名师',
                    },
                    TD: {    // 团队
                        '19': '国家级教学团队名单',
                        '34': '教育部创新团队',
                    },
                    PT: {    // 平台
                        '2': '国家工程技术研究中心',
                        '3': '国家工程研究中心',
                        '4': '国家工程实验室',
                        '5': '国家级实验教学示范中心',
                        '6': '国家国际科技合作基地',
                        '7': '国家实验室',
                        '8': '国防科技重点实验室',
                        '32': '国家野外科学观测研究台站',
                    },
                    JX: {    // 教学
                        '1': '国家级规划教材',
                        '9': '研究生教育成果奖',
                        '10': '精品视频公共课',
                        '11': '精品资源共享课',
                        '12': '来华留学英语授课品牌课',
                        '13': '高等教育国家教学成果奖',
                        '24': '合作办学',
                        '29': '国家级规划教材人文用',
                        '40': '国家哲学社会科学成果文库',
                    },
                    HJ: {    // 获奖
                        '14': '教育部高校优秀成果奖（科学技术）',
                        '15': '梁希林业科学技术奖',
                        '16': '中华医学科技奖',
                        '17': '中华中医药学会科学技术奖',
                        '30': '华夏建设科学技术奖',
                        '31': '国家自然科学奖',
                        '35': '国家技术发明奖',
                        '36': '国家科技进步奖',
                        '37': '中国专利奖',
                        '38': '中华农业科技奖',
                        '41': '高等学校科学研究优秀成果奖（人文社科）',
                    }
                }
            }
        },
        methods: {
            jumpTo: function (linkStr) {
                window.location.href = linkStr;
            },
        },
    }
</script>

<style scoped>
    .el-aside {
        background-color: #545c64;
    }

    .el-menu {

    }

    .el-menu-item:hover {
        color: #ffd04b;
    }

    a {
        color: #fff;
        text-decoration: none;
    }

    p:hover {
        color: #ffd04b;
    }
</style>
