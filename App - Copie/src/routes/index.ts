import {Vue} from 'vue-property-decorator';
import VueRouter, {type RouteConfig} from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'HomeView',
    redirect: {name: 'test'},
    component: () => import('@/views/HomeView.vue'),
    children: [
      {
        path: '',
        name: 'ProductrHomeView',
        component: () => import('@/components/product/ProductCard.vue'),
        // redirect: {name: 'ProductrTable'},
        // children: [
        //   {
        //     path: '',
        //     name: 'ProductrTable',
        //     component: () => import('@/components/product/ProductTable.vue')
        //   },
        // ],
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
