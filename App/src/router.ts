/** Vue Router Configure */
import {
  createRouter,
  type Router,
  type RouteRecordRaw,
} from '@logue/vue2-helpers/vue-router';
import {nextTick} from 'vue';
import store from '@/store';
import type {NavigationGuardNext, Route} from 'vue-router';
import type {Position, PositionResult} from 'vue-router/types/router';

import ErrorView from '@/views/ErrorView.vue';

// Vuetify
import goTo from 'vuetify/lib/services/goto';
import type {VuetifyGoToTarget} from 'vuetify/types/services/goto';

/** Router Config */
const routes: RouteRecordRaw[] = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: HomeView,
  // },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/product',
    name: 'ProductView',
    redirect: {name: 'ProductCard'},
    component: () => import('@/views/ProductHomeView.vue'),
    children: [
      {
        path: '',
        name: 'ProductCard',
        component: () => import('@/components/product/ProductCard.vue'),
        redirect: {name: 'ProductTable'},
        children: [
          {
            path: '',
            name: 'ProductTable',
            component: () => import('@/components/product/ProductTable.vue'),
          },
        ],
      },
      {
        path: 'new',
        component: () => import('@/components/product/ProductFormDetailView.vue'),
        props: {isEdit: true},
        redirect: {name: 'product-new'},
        children: [
          {
            path: '',
            name: 'ProductNew',
            component: () => import('@/components/product/ProductForm.vue'),
          },
        ],
      },
      {
        path: ':productId',
        name: 'ProductFormDetail',
        component: () => import('@/components/product/ProductFormDetailView.vue'),
        redirect: {name: 'ProductDetail'},
        props: (route) => ({productId: route.params.productId, isEdit: route.meta?.isEdit}),
        children: [
          {
            path: '',
            name: 'ProductDetail',
            component: () => import('@/components/product/ProductDetail.vue'),
          },
          {
            path: 'edit',
            name: 'ProductEdit',
            component: () => import('@/components/product/ProductForm.vue'),
            meta: {isEdit: true},
          },
        ],
      },
    ],
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '*',
    name: 'Error',
    component: ErrorView,
  },
];

const router = createRouter({
  base: import.meta.env.BASE_URL,
  mode: 'history', // abstract, hash, history
  scrollBehavior: async (
      to: Route,
      _from: Route,
      savedPosition: void | Position,
  ): Promise<PositionResult> => {
    // https://vuetifyjs.com/features/scrolling/#router3067306e4f7f7528
    let scrollTo: VuetifyGoToTarget = 0;

    if (to.hash) {
      scrollTo = to.hash;
    } else if (savedPosition) {
      scrollTo = savedPosition.y;
    }

    return {x: 0, y: await goTo(scrollTo)};
  },
  routes,
});

router.beforeEach(
    async (_to: Route, _from: Route, next: NavigationGuardNext<Vue>) => {
    // Show Loading
      store.dispatch('setLoading', true);
      await nextTick();

      // @see https://github.com/championswimmer/vuex-persist#how-to-know-when-async-store-has-been-replaced
      // await store.restored;

      next();
    },
);

router.afterEach(() => {
  // Hide Loading
  store.dispatch('setLoading', false);
});

export default router as Router;
