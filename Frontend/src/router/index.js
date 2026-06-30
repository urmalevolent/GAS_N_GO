import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ================= LAYOUTS =================
import AppLayout from '@/layouts/AppLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import UserLayout from '@/layouts/UserLayout.vue'

// ================= PAGES PUBLIC =================
import HomePage from '../pages/customer/Home.vue'
import CategoryPage from '../pages/customer/Category.vue'
import AboutPage from '../pages/customer/About.vue'
import CarsPage from '../pages/customer/Cars.vue'
import CarDetailPage from '../pages/customer/CarDetail.vue'
import BookingPage from '@/pages/customer/Booking.vue'

// ================= PAGES USER PROFILE =================
import ProfilePage from '@/pages/customer/profile/Profile.vue'
import ReviewPage from '@/pages/customer/profile/Review.vue'
import MyOrdersPage from '@/pages/customer/profile/MyOrders.vue'

// ================= PAGES ADMIN =================
import Dashboard from '@/pages/admin/Dashboard.vue'
import Cars from '@/pages/admin/cars/Cars.vue'
import CarLists from '@/pages/admin/cars/CarLists.vue'
import AddCar from '@/pages/admin/cars/AddCars.vue'
import Users from '@/pages/admin/users/Users.vue'
import UserLists from '@/pages/admin/users/UserLists.vue'
import CategoryLists from '@/pages/admin/category/CategoryLists.vue'
import RatingLists from '@/pages/admin/Ratings/RatingLists.vue'
import Rentals from '@/pages/admin/rentals/Rentals.vue'
import RentalLists from '@/pages/admin/rentals/RentalLists.vue'
import RentalDetails from '@/pages/admin/rentals/RentalDetails.vue'
import TransactionLists from '@/pages/admin/transactions/TransactionLists.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[

    // --------------------------------------------------------
    // 1. RUTE PENGUNJUNG (Dibungkus oleh AppLayout)
    // --------------------------------------------------------
    {
      path: '/',
      component: AppLayout,
      children:[
        { path: '', name: 'home', component: HomePage },
        { path: 'category', name: 'category', component: CategoryPage },
        { path: 'about', name: 'about', component: AboutPage },
        { path: 'cars', name: 'cars', component: CarsPage },
        { path: 'car/:id', name: 'car-detail', component: CarDetailPage },
        { path: 'booking', name: 'booking', component: BookingPage },
        { path: 'services', name: 'services', component: () => import('@/pages/customer/Services.vue') },

        // 1.B RUTE USER PROFILE
        {
          path: 'user',
          component: UserLayout,
          meta: { requiresAuth: true },
          children:[
            { path: 'profile', name: 'Profile', component: ProfilePage },
            { path: 'review', name: 'Review', component: ReviewPage },
            { path: 'orders', name: 'MyOrders', component: MyOrdersPage },
          ]
        }
      ]
    },

    // --------------------------------------------------------
    // 2. RUTE ADMIN (Dibungkus oleh AdminLayout)
    // --------------------------------------------------------
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children:[
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: Dashboard
        },
        {
          // PERBAIKAN: Konfigurasi rute admin cars
          path: "cars",
          component: Cars,
          children:[
            { path: "", name: "admin-cars-list", component: CarLists },
            { path: "add", name: "admin-car-add", component: AddCar },
            { path: "edit/:id", name: "admin-car-edit", component: () => import('@/pages/admin/cars/EditCars.vue') },
            { path: "detail/:id", name: "admin-car-detail", component: () => import('@/pages/admin/cars/CarDetails.vue') },
          ],
        },
        {
          // PERBAIKAN: Konfigurasi rute admin users
          path: "users",
          component: Users,
          meta: { requiresSuperAdmin: true },
          children:[
            { path: "", name: "admin-users-list", component: UserLists },
            { path: "edit/:id", name: "admin-user-edit", component: () => import('@/pages/admin/users/UserEdits.vue') },
            { path: "detail/:id", name: "admin-user-detail", component: () => import('@/pages/admin/users/UserDetails.vue') },
          ],
        },
        {
          // PERBAIKAN: Konfigurasi rute admin categories
          path: "category",
          component: CategoryLists,
          children:[
            { path: "", name: "admin-category-list", component: CategoryLists },
            { path: "add", name: "admin-category-add", component: () => import('@/pages/admin/category/AddCategoryModal.vue') },
            { path: "edit/:id", name: "admin-category-edit", component: () => import('@/pages/admin/category/EditCategoryModal.vue') },
          ],
        },
        {
          // PERBAIKAN: Konfigurasi rute admin ratings
          path: "ratings",
          component: RatingLists,
          children:[
            { path: "", name: "admin-ratings-list", component: RatingLists },
          ],
        },
        {
          // PERBAIKAN: Konfigurasi rute admin rentals
          path: "rentals",
          component: Rentals,
          children:[
            { path: "", name: "admin-rentals-list", component: RentalLists },
            { path: "detail/:id", name: "admin-rental-detail", component: RentalDetails }
          ]
        },
        {
          path: "transactions",
          component: TransactionLists,
          meta: { requiresSuperAdmin: true },
          children:[
            { path: "", name: "admin-transactions-list", component: TransactionLists },
            { path: "detail/:id", name: "admin-transaction-detail", component: () => import('@/pages/admin/transactions/TransactionDetails.vue') }
          ]
        }
      ]
    }
  ],
})

// Navigation Guard untuk Proteksi Rute
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (!authStore.initialized) {
    await authStore.initialize()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const requiresSuperAdmin = to.matched.some(record => record.meta.requiresSuperAdmin)

  console.log(`[Router Debug] Navigasi ke: ${to.path}`);
  console.log(`[Router Debug] isAuthenticated: ${authStore.isAuthenticated}, isAdmin: ${authStore.isAdmin}, userRole: ${authStore.userRole}`);
  console.log(`[Router Debug] user.value:`, authStore.user);

  if (requiresAuth && !authStore.isAuthenticated) {
    authStore.openAuthModal()
    next({ name: 'home', query: { redirect: to.fullPath } })
  } else if (requiresSuperAdmin && !authStore.isSuperAdmin) {
    console.warn(`[Router Debug] Akses SuperAdmin Ditolak! userRole: ${authStore.userRole}`);
    next({ name: 'admin-dashboard' })
  } else if (requiresAdmin && !authStore.isAdmin) {
    console.warn(`[Router Debug] Akses Ditolak! userRole: ${authStore.userRole}, requiresAdmin: ${requiresAdmin}`);
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
