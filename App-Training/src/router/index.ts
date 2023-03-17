import { Vue } from 'vue-property-decorator';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'HomeView',
        component: () => import('@/views/HomeView.vue')
    },
    {
        path: '/driver',
        name: 'DriverView',
        redirect: { name: 'DriverHomeView' },
        component: () => import('@/views/DriverView.vue'),
        children: [
            {
                path: '',
                name: 'DriverHomeView',
                component: () => import('@/components/driver/DriverHomeView.vue'),
                redirect: { name: 'DriverTable' },
                children: [
                    {
                        path: '',
                        name: 'DriverTable',
                        component: () => import('@/components/driver/DriverTable.vue')
                    }
                ]
            },
            {
                path: 'new',
                component: () => import('@/components/driver/DriverFormDetail.vue'),
                props: { isEdit: true },
                redirect: { name: 'driver-new' },
                children: [
                    {
                        path: '',
                        name: 'DriverNew',
                        component: () => import('@/components/driver/DriverForm.vue')
                    }
                ]
            },
            {
                path: ':driverId/assignment/vehicule',
                component: () => import('@/components/vehicule-assignment/VehiculeAssignmentFormDetail.vue'),
                redirect: { name: 'VehiculeAssignmentDriverForm' },
                props: route => ({ driverId: route.params.driverId }),
                children: [
                    {
                        path: '',
                        name: 'VehiculeAssignmentDriverForm',
                        component: () => import('@/components/vehicule-assignment/VehiculeAssignmentForm.vue')
                    }
                ]
            },
            {
                path: ':driverId',
                name: 'DriverFormDetail',
                component: () => import('@/components/driver/DriverFormDetail.vue'),
                redirect: { name: 'driver-detail' },
                props: route => ({ driverId: route.params.driverId, isEdit: route.meta?.isEdit }),
                children: [
                    {
                        path: '',
                        name: 'DriverDetail',
                        component: () => import('@/components/driver/DriverDetail.vue')
                    },
                    {
                        path: 'edit',
                        name: 'DriverEdit',
                        component: () => import('@/components/driver/DriverForm.vue'),
                        meta: { isEdit: true }
                    }
                ]
            }
        ]
    },
    {
        path: '/vehicule',
        name: 'VehiculeView',
        redirect: { name: 'VehiculeHomeView' },
        component: () => import('@/views/VehiculeView.vue'),
        children: [
            {
                path: '',
                name: 'VehiculeHomeView',
                component: () => import('@/components/vehicule/VehiculeHomeView.vue'),
                redirect: { name: 'VehiculeTable' },
                children: [
                    {
                        path: '',
                        name: 'VehiculeTable',
                        component: () => import('@/components/vehicule/VehiculeTable.vue')
                    }
                ]
            },
            {
                path: 'new',
                component: () => import('@/components/vehicule/VehiculeFormDetail.vue'),
                props: { isEdit: true },
                redirect: { name: 'vehicule-new' },
                children: [
                    {
                        path: '',
                        name: 'VehiculeNew',
                        component: () => import('@/components/vehicule/VehiculeForm.vue')
                    }
                ]
            },
            {
                path: ':vehiculeId/assignment/driver',
                component: () => import('@/components/vehicule-assignment/VehiculeAssignmentFormDetail.vue'),
                redirect: { name: 'VehiculeAssignmentVehiculeForm' },
                props: route => ({ vehiculeId: route.params.vehiculeId }),
                children: [
                    {
                        path: '',
                        name: 'VehiculeAssignmentVehiculeForm',
                        component: () => import('@/components/vehicule-assignment/VehiculeAssignmentForm.vue')
                    }
                ]
            },
            {
                path: ':vehiculeId',
                name: 'VehiculeFormDetail',
                component: () => import('@/components/vehicule/VehiculeFormDetail.vue'),
                redirect: { name: 'vehicule-detail' },
                props: route => ({ vehiculeId: route.params.vehiculeId, isEdit: route.meta?.isEdit }),
                children: [
                    {
                        path: '',
                        name: 'VehiculeDetail',
                        component: () => import('@/components/vehicule/VehiculeDetail.vue')
                    },
                    {
                        path: 'edit',
                        name: 'VehiculeEdit',
                        component: () => import('@/components/vehicule/VehiculeForm.vue'),
                        meta: { isEdit: true }
                    }
                ]
            }
        ]
    },
    {
        path: '/assignment',
        name: 'VehiculeAssignmentView',
        redirect: { name: 'VehiculeAssignmentTable' },
        component: () => import('@/views/VehiculeAssignmentView.vue'),
        children: [
            {
                path: '',
                name: 'VehiculeAssignmentTable',
                component: () => import('@/components/vehicule-assignment/VehiculeAssignmentTable.vue')
            },
            {
                path: ':vehiculeAssignmentId',
                redirect: { name: 'VehiculeAssignmentDetail' },
                component: () => import('@/components/vehicule-assignment/VehiculeAssignmentFormDetail.vue'),
                props: route => ({ vehiculeAssignmentId: route.params.vehiculeAssignmentId, isEdit: route.meta?.isEdit }),
                children: [
                    {
                        path: '',
                        name: 'VehiculeAssignmentDetail',
                        component: () => import('@/components/vehicule-assignment/VehiculeAssignmentDetail.vue')
                    },
                    {
                        path: 'edit',
                        name: 'VehiculeAssignmentEdit',
                        component: () => import('@/components/vehicule-assignment/VehiculeAssignmentForm.vue'),
                        meta: { isEdit: true }
                    }
                ]
            }
        ]
    },

    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;