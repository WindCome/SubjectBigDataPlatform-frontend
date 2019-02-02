<template>
    <div id="app">
            <el-header style="width: 100%; margin: 0;padding: 0">
                <el-menu
                    mode="horizontal"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item index="1">
                        <a href="/" style="color: #fff;text-decoration: none;">
                            <span style="font-size: 20px">公 共 库 维 护</span>
                        </a>
                    </el-menu-item>
                </el-menu>
            </el-header>
            <el-main style="width: 100%; margin: 0;padding: 0">
                <router-view/>
            </el-main>
    </div>
</template>

<script>
    export default {
        name: 'App'
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
