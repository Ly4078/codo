import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/ready/login'
import Home from '@/components/system/homepage'
import Welcome from '@/components/system/welcome'
import Tack_list from '@/components/system/task/list'
import Tack_history from '@/components/system/task/history'
import Assets_init from '@/components/system/assets/init'
import Assets_host from '@/components/system/assets/host'
import Assets_backups from '@/components/system/assets/backups'
import Assets_journal from '@/components/system/assets/journal'
import Assets_users from '@/components/system/assets/users'
import Application_deploy from '@/components/system/application/deploy'
import Application_release from '@/components/system/application/release'
import Application_update from '@/components/system/application/update'
import Application_rollback from '@/components/system/application/rollback'
import Sql_examine from '@/components/system/sql/examine'
import Sql_optimization from '@/components/system/sql/optimization'
import Docker_kubernetes from '@/components/system/docker/kubernetes'
import Warehouse_git from '@/components/system/warehouse/git'
import Warehouse_harbor from '@/components/system/warehouse/harbor'
import Batch_playbook from '@/components/system/batch/playbook'
import Batch_role from '@/components/system/batch/role'
import Batch_jump from '@/components/system/batch/jump'
import Configure_app from '@/components/system/configure/app'
import Configure_file from '@/components/system/configure/file'
import Configure_playbook from '@/components/system/configure/playbook'
import Configure_role from '@/components/system/configure/role'
import Configure_yaml from '@/components/system/configure/yaml'
import Monitor_zabbix from '@/components/system/monitor/zabbix'
import Monitor_prometheus from '@/components/system/monitor/prometheus'
import Timing_list from '@/components/system/timing/list'
import Timing_journal from '@/components/system/timing/journal'
import Operation_fault from '@/components/system/operation/fault'
import Operation_wiki from '@/components/system/operation/wiki'
import Users_role from '@/components/system/users/role'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', //登录页面
      name: 'Login',
      component: Login
    }, {
      path: '/Home',  //系统页面
      name: 'Home',
      component: Home,
      children: [
        {
          path: "/",
          component: Welcome
        },
        {
          path: "/task/list",
          component: Tack_list
        },
        {
          path: "/task/history",
          component: Tack_history
        },
        {
          path: "/assets/init",
          component: Assets_init
        },
        {
          path: "/assets/host",
          component: Assets_host
        },
        {
          path: "/assets/backups",
          component: Assets_backups
        },
        {
          path: "/assets/journal",
          component: Assets_journal
        },
        {
          path: "/assets/users",
          component: Assets_users
        },
        {
          path: "/application/deploy",
          component: Application_deploy
        },
        {
          path: "/application/release",
          component: Application_release
        },
        {
          path: "/application/update",
          component: Application_update
        },
        {
          path: "/application/rollback",
          component: Application_rollback
        },
        {
          path: "/sql/examine",
          component: Sql_examine
        },
        {
          path: "/sql/optimization",
          component: Sql_optimization
        },
        {
          path: "/docker/kubernetes",
          component: Docker_kubernetes
        },
        {
          path: "/warehouse/harbor",
          component: Warehouse_harbor
        },
        {
          path: "/warehouse/git",
          component: Warehouse_git
        },
        {
          path: "/batch/playbook",
          component: Batch_playbook
        },
        {
          path: "/batch/role",
          component: Batch_role
        },
        {
          path: "/batch/jump",
          component: Batch_jump
        },
        {
          path: "/configure/app",
          component: Configure_app
        },
        {
          path: "/configure/file",
          component: Configure_file
        },
        {
          path: "/configure/yaml",
          component: Configure_yaml
        },
        {
          path: "/configure/role",
          component: Configure_role
        },
        {
          path: "/configure/playbook",
          component: Configure_playbook
        },
        {
          path: "/monitor/zabbix",
          component: Monitor_zabbix
        },
        {
          path: "/monitor/prometheus",
          component: Monitor_prometheus
        },
        {
          path: "/timing/list",
          component: Timing_list
        },
        {
          path: "/timing/journal",
          component: Timing_journal
        },
        {
          path: "/operation/fault",
          component: Operation_fault
        },
        {
          path: "/operation/wiki",
          component: Operation_wiki
        },
        {
          path: "/users/role",
          component: Users_role
        }
      ]
    }
  ]
})
