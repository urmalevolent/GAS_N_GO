import { createRouter, createWebHistory } from 'vue-router'

// ================= LAYOUTS =================
import AppLayout from '@/layouts/AppLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'

// ================= PAGES PUBLIC =================
import HomePage from '../pages/Home.vue'
import ServicePage from '../pages/Service.vue'
import AboutPage from '../pages/About.vue'
import CarsPage from '../pages/Cars.vue'
import CarDetailPage from '../pages/CarDetail.vue'
import CheckoutPage from '../pages/Checkout.vue'
import VerifIdentityPage from '@/pages/VerifIdentity.vue'
import PaymentPage from '@/pages/Payment.vue'

// ================= PAGES ADMIN =================
import Dashboard from '@/pages/admin/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes:[
    // --------------------------------------------------------
    // 1. RUTE PENGUNJUNG (Dibungkus oleh AppLayout)
    // Semua halaman di bawah ini akan memiliki Navbar & Footer
    // --------------------------------------------------------
    {
      path: '/',
      component: AppLayout,
      children:[
        {
          path: '',
          name: 'home',
          component: HomePage,
        },
        {
          path: 'services',
          name: 'services',
          component: ServicePage
        },
        {
          path: 'about',
          name: 'about',
          component: AboutPage
        },
        {
          path: 'cars',
          name: 'cars',
          component: CarsPage
        },
        {
          path: 'car/:id', // Dynamic route untuk ID mobil
          name: 'car-detail',
          component: CarDetailPage
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: CheckoutPage
        },
        {
          path: 'verification',
          name: 'verify',
          component: VerifIdentityPage
        },
        {
          path: 'payment',
          name: 'payment',
          component: PaymentPage
        }
      ]
    },

    // --------------------------------------------------------
    // 2. RUTE ADMIN (Dibungkus oleh AdminLayout)
    // Semua halaman di bawah ini akan memiliki Sidebar Admin
    // --------------------------------------------------------
    {
      path: '/admin',
      component: AdminLayout,
      children:[
        // Otomatis redirect ke dashboard jika hanya mengetik "/admin"
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: Dashboard
        },

        // --- KERANGKA UNTUK HALAMAN ADMIN LAINNYA ---
        // Anda tinggal membuat file .vue-nya di folder admin,
        // lalu buka komentar (uncomment) kode di bawah ini:

        // { path: 'accounts', name: 'admin-accounts', component: () => import('@/pages/admin/Accounts.vue') },
        // { path: 'products', name: 'admin-products', component: () => import('@/pages/admin/Products.vue') },
        // { path: 'categories', name: 'admin-categories', component: () => import('@/pages/admin/Categories.vue') },
        // { path: 'brands', name: 'admin-brands', component: () => import('@/pages/admin/Brands.vue') },
        // { path: 'transactions', name: 'admin-transactions', component: () => import('@/pages/admin/Transactions.vue') },
        // { path: 'status', name: 'admin-status', component: () => import('@/pages/admin/Status.vue') },
        // { path: 'comments', name: 'admin-comments', component: () => import('@/pages/admin/Comments.vue') },
      ]
    }
  ],
})

// ==========================================================
// KERANGKA MIDDLEWARE (Navigasi Guard)
// ==========================================================
// Saat ini dinonaktifkan (karena Anda belum ingin memakai backend).
// Jika backend / proteksi login sudah siap, Anda tinggal menghapus tanda /* ... */

/*
router.beforeEach(async (to, from, next) => {
  // Misalnya Anda mengambil data dari store (Pinia)
  // const authStore = useAuthStore();
  // await authStore.checkAuth();

  // Jika menuju rute admin tapi belum login / bukan admin
  if (to.path.startsWith('/admin')) {
    // if (!authStore.isAuthenticated || authStore.user?.role !== 'admin') {
    //   alert("Akses Ditolak!");
    //   return next('/');
    // }
  }

  next();
});
*/

export default router
