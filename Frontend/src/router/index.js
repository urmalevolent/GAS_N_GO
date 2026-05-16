import { createRouter, createWebHistory } from 'vue-router'

// ================= LAYOUTS =================
import AppLayout from '@/layouts/AppLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import UserLayout from '@/layouts/UserLayout.vue'

// ================= PAGES PUBLIC =================
import HomePage from '../pages/Home.vue'
import SearchingPage from '../pages/Searching.vue'
import AboutPage from '../pages/About.vue'
import CarsPage from '../pages/Cars.vue'
import CarDetailPage from '../pages/CarDetail.vue'
import BookingPage from '@/pages/Booking.vue'

// ================= PAGES USER PROFILE =================
import ProfilePage from '@/pages/profile/Profile.vue'
import ReviewPage from '@/pages/profile/Review.vue'
import MyOrdersPage from '@/pages/profile/MyOrders.vue'

// ================= PAGES ADMIN =================
import Dashboard from '@/pages/admin/Dashboard.vue'
import Cars from '@/pages/admin/cars/Cars.vue'
import CarLists from '@/pages/admin/cars/CarLists.vue'
import AddCar from '@/pages/admin/cars/AddCars.vue'
import Users from '@/pages/admin/users/Users.vue'
import UserLists from '@/pages/admin/users/UserLists.vue'
import AddUsers from '@/pages/admin/users/CreateAdmin.vue'
import CategoryLists from '@/pages/admin/category/CategoryLists.vue'
import RatingLists from '@/pages/admin/Ratings/RatingLists.vue'
import RentalLists from '@/pages/admin/rentals/RentalLists.vue'

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
        { path: 'searching', name: 'searching', component: SearchingPage },
        { path: 'about', name: 'about', component: AboutPage },
        { path: 'cars', name: 'cars', component: CarsPage },
        { path: 'car/:id', name: 'car-detail', component: CarDetailPage },
        { path: 'booking', name: 'booking', component: BookingPage },

        // 1.B RUTE USER PROFILE
        {
          path: 'user',
          component: UserLayout,
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
          children:[
            { path: "", name: "admin-users-list", component: UserLists },
            { path: "add", name: "admin-user-add", component: AddUsers },
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
          component: RentalLists,
          children:[
            { path: "", name: "admin-rentals-list", component: RentalLists },
            { path: "detail/:id", name: "admin-rental-detail", component: () => import('@/pages/admin/rentals/RentalDetails.vue') }
          ]
        }
      ]
    }
  ],
})

export default router
