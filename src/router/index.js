// 配置路由信息
import VueRouter from "vue-router"
import Vue from "vue"
import store from "@/store";

Vue.use(VueRouter);

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
};

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/main',
    component: () => import(/* webpackChunkName: "main" */'@/views/Main'),
    children: [
      {
        path: '/main/uploadVideo',
        component: () => import(/* webpackChunkName: "uploadVideo" */'@/views/UploadVideoView/UploadVideoView'),
        meta: {
          title: '视频上传'
        }
      },
      {
        path: '/main/editVideoInfo',
        component: () => import(/* webpackChunkName: "editVideoInfo" */'@/views/EditVideoInfoView'),
        meta: {
          title: '视频信息修改'
        }
      },
      {
        path: '/main/tagManage',
        component: () => import(/* webpackChunkName: "tagManage" */'@/views/TagManageView'),
        meta: {
          title: '视频标签管理'
        }
      },
      {
        path: '/main/uploadFromUrl',
        component: () => import('@/views/UploadFromUrlView'),
        meta: {
          title: 'URL上传'
        }
      }
    ],
    meta: {
      title: '管理后台'
    }
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "main" */"@/views/LoginTest"),
    meta: {
      title: '登录'
    }
  }
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !store.state.user) next('/login');
  else next();
});

export default router;
