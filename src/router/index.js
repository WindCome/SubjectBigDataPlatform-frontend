import Vue from 'vue'
import Router from 'vue-router'
import LibraryList from '@/components/LibraryList'
import GeneralAdmin from '@/components/GeneralAdmin'
import GeneralUpdatedResults from '@/components/GeneralUpdatedResults'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'LibraryList',
            component: LibraryList
        },
        {
            path: '/admin/:tableId',
            name: 'GeneralAdmin',
            component: GeneralAdmin
        },
        {
            path: '/updated/results/:tableId',
            name: 'GeneralUpdatedResults',
            component: GeneralUpdatedResults
        }

    ]
})
