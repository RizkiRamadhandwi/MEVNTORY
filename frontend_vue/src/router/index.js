import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "../store";

// Fungsi untuk memeriksa apakah token kadaluwarsa dalam 1 hari
const isTokenExpired = () => {
  const token = store.state.accessToken;
  if (token) {
    const tokenExpireTime = getTokenExpireTime(token); // Mendapatkan waktu kadaluwarsa token
    const currentTime = Math.floor(Date.now() / 1000); // Mendapatkan waktu saat ini dalam detik

    // Periksa apakah token telah kadaluwarsa
    if (tokenExpireTime < currentTime) {
      // Token telah kadaluwarsa
      return true;
    }
  }
  return false;
};

// Fungsi untuk mendapatkan waktu kadaluwarsa token dari payload JWT
const getTokenExpireTime = (token) => {
  const payload = token.split(".")[1]; // Mendapatkan bagian payload JWT
  const decodedPayload = atob(payload); // Melakukan decoding base64 pada payload
  const { exp } = JSON.parse(decodedPayload); // Mendapatkan waktu kadaluwarsa dari payload
  return exp;
};

const isAuthenticated = () => {
  const token = store.state.accessToken;
  if (token) {
    if (isTokenExpired()) {
      // Token telah kadaluwarsa
      return false;
    }
    return true;
  }
  return false;
};

// Cek apakah ada token di Local Storage saat memuat aplikasi
const accessToken = window.sessionStorage.getItem("accessToken");
if (accessToken) {
  store.commit("setAccessToken", accessToken);
}

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next("/dashboard");
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/auth/LoginView.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next("/dashboard");
      } else {
        next();
      }
    },
  },
  {
    path: "/logout",
    name: "logout",
    beforeEnter: (to, from, next) => {
      // Hapus token dari Local Storage
      window.sessionStorage.removeItem("accessToken");
      // Reset state token pada store
      store.commit("setAccessToken", null);
      // Arahkan ke halaman login
      redirectToLogin(next);
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/auth/RegisterView.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/master/product",
    name: "master.product",
    component: () => import("../views/master/ProductView.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/master/jenis",
    name: "master.jenis",
    component: () => import("../views/master/JenisView.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/master/satuan",
    name: "master.satuan",
    component: () => import("../views/master/SatuanView.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/transaction/stockin",
    name: "transaction.stockin",
    component: () => import("../views/transaction/StockIn.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/transaction/stockin/detailPembelian",
    name: "transaction.stockin.detailPembelian",
    component: () => import("../views/transaction/StockInDetail.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/transaction/stockin/detailPenjualan",
    name: "transaction.stockin.detailPenjualan",
    component: () => import("../views/transaction/StockOutDetail.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/transaction/stockin/new",
    name: "transaction.stockin.new",
    component: () => import("../views/transaction/StockInNew.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/transaction/stockout",
    name: "transaction.stockout",
    component: () => import("../views/transaction/StockOut.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/transaction/stockout/new",
    name: "transaction.stockout.new",
    component: () => import("../views/transaction/StockOutNew.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next();
      } else {
        next("/login");
      }
    },
  },
];

const router = createRouter({
  mode: "history",
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Simpan token di Local Storage saat pengguna berhasil login
store.subscribe((mutation) => {
  if (mutation.type === "setAccessToken") {
    window.sessionStorage.setItem("accessToken", mutation.payload);
  }
});

const redirectToLogin = (next) => {
  next("/login");
};

export default router;
