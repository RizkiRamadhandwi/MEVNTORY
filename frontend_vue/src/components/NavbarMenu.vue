<template>
  <div id="navbar">
    <nav class="navbar">
      <div class="navbar-toggle" @click="toggleSidebar">
        <i :class="showSidebar ? 'bx bx-x' : 'bx bx-menu'"></i>
      </div>
      <span class="brand"
        ><i class="icon"
          ><img src="@/assets/logo.png" alt="logo" width="30"
        /></i>
        MEVNTORY</span
      >
      <div class="navbar-menu">
        <!-- Item menu navbar -->

        <div class="navbar-toggle" @click="toggleUser">
          <i class="bx bx-dots-vertical-rounded"></i>
        </div>
      </div>
    </nav>
    <div class="sidebar" :class="{ 'show-sidebar': showSidebar }">
      <!-- Konten sidebar -->
      <h3 class="divider">HOME</h3>
      <ul class="side-menu">
        <li>
          <router-link to="/dashboard">
            <i class="bx bxs-dashboard icon"></i>
            Dashboard
          </router-link>
        </li>

        <li>
          <a href="#" @click="toggleDropdown(1)">
            <i class="bx bxs-inbox icon"></i>Data Master
            <i
              :class="[
                'icon-right',
                'bx',
                'bx-chevron-right',
                { 'bx-rotate-90': isDropdownOpen(1) },
              ]"
            ></i>
          </a>
          <ul v-show="isDropdownOpen(1)" class="side-dropdown">
            <li><router-link to="/master/product">Produk</router-link></li>
            <li><router-link to="/master/jenis">Kategori</router-link></li>
            <li><router-link to="/master/satuan">Satuan</router-link></li>
          </ul>
        </li>
        <li>
          <a href="#" @click="toggleDropdown(2)">
            <i class="bx bx-transfer-alt icon"></i>Transaksi
            <i
              :class="[
                'icon-right',
                'bx',
                'bx-chevron-right',
                { 'bx-rotate-90': isDropdownOpen(2) },
              ]"
            ></i>
          </a>
          <ul v-show="isDropdownOpen(2)" class="side-dropdown">
            <li>
              <router-link to="/transaction/stockin">Pembelian</router-link>
            </li>
            <li>
              <router-link to="/transaction/stockout">Penjualan</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div v-if="user" class="user" :class="{ 'show-user': showUser }">
      <!-- Konten sidebar -->
      <div class="overflow">
        <h3 class="divider">Hi {{ user.namaLengkap }}</h3>
        <hr class="mb-0 mr-0" />
      </div>
      <ul class="user-menu">
        <li>
          <router-link to="/profile">
            <i class="bx bxs-user-account icon"></i>
            Profile
          </router-link>
        </li>
        <li>
          <router-link to="" @click="confirmLogout">
            <i class="bx bx-log-out icon"></i>
            LogOut
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "NavbarMenu",
  data() {
    return {
      showUser: false,
      showSidebar: false,
      openDropdown: false,
      // isScrolling: false,
    };
  },
  mounted() {
    // Menambahkan event listener untuk scroll pada elemen window
    // window.addEventListener("scroll", this.handleScroll);
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    // Menghapus event listener saat komponen di-unmount
    // window.removeEventListener("scroll", this.handleScroll);
    document.removeEventListener("click", this.handleClickOutside);
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.fetchUserData();
  },
  methods: {
    // handleScroll() {
    //   // Logika untuk menyembunyikan sidebar saat scrolling terjadi
    //   this.showSidebar = false;
    //   this.showUser = false;
    // },

    handleClickOutside(event) {
      const target = event.target;

      // Menyembunyikan sidebar jika pengguna mengklik di luar elemen sidebar
      if (!target.closest("#navbar") && this.showSidebar) {
        this.showSidebar = false;
      }

      // Menyembunyikan menu pengguna jika pengguna mengklik di luar elemen menu pengguna
      if (
        !target.closest(".user") &&
        !target.closest(".navbar-toggle") &&
        this.showUser
      ) {
        this.showUser = false;
      }
    },

    fetchUserData() {
      const token = this.$store.state.accessToken;

      axios
        .get(`${process.env.VUE_APP_API_URL}/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.$store.dispatch("setUser", response.data);
        })
        .catch((error) => {
          // Tangani error jika terjadi
          console.error(error);
          if (error.response && error.response.status === 401) {
            this.$router.push({ path: "/login" });
          }
        });
    },
    toggleUser() {
      this.showUser = !this.showUser;
      this.showSidebar = false;
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
      this.showUser = false;
    },
    toggleDropdown(index) {
      if (this.openDropdown === index) {
        this.openDropdown = null;
      } else {
        this.openDropdown = index;
      }
    },
    isDropdownOpen(index) {
      return this.openDropdown === index;
    },
    confirmLogout() {
      Swal.fire({
        title: "Logout",
        text: "Are you sure you want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          this.logout();
        }
      });
    },
    logout() {
      // Panggil aksi logout pada Vuex store
      this.$store.dispatch("logout");

      // Redirect ke halaman login
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
#navbar {
  height: 64px;
  z-index: 999;
  .navbar {
    position: -webkit-sticky;
    position: fixed;
    background: var(--light);
    height: 64px;
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    grid-gap: 28px;
    top: 0;
    left: 0;
    border-bottom: 3px solid var(--grey);
    z-index: 900;

    .brand {
      flex-shrink: 0;
      font-size: 24px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 60px;
      font-weight: 700;
      color: black;
      font-family: Georgia, "Times New Roman", Times, serif;
      position: sticky;
      top: 0;
      left: 0;
      z-index: 100;
      background: var(--light);
      transition: all 0.3s ease;
      padding: 0 6px;

      .icon {
        min-width: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 6px;
      }
    }

    // Navbar toggle style
    .navbar-toggle {
      cursor: pointer;
      font-size: 20px;
      transition: all 0.3s ease;
    }

    // Navbar menu style
    .navbar-menu {
      list-style-type: none;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    // Media query for smaller viewport
  }

  // Sidebar style
  .sidebar {
    width: 200px;
    padding: 10px;
    display: none;

    // Show sidebar when toggled
    &.show-sidebar {
      display: block;
      position: fixed;
      max-width: 200px;
      width: 100%;
      background: var(--light);
      left: 0;
      margin-top: 65px;
      overflow-y: auto;
      scrollbar-width: none;
      transition: all 0.3s ease;
      z-index: 200;
    }

    .divider {
      margin-top: 10px;
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--dark-grey);
      white-space: nowrap;
    }

    .side-menu {
      margin: 5px 0;
      padding: 0;
      transition: all 0.3s ease;
      list-style-type: none;

      a {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--dark);
        padding: 12px 16px 12px 0;
        transition: all 0.3s ease;
        border-radius: 10px;
        margin: 4px 0;
        white-space: nowrap;
        text-decoration: none;

        &:hover {
          background: var(--grey);
        }
      }

      .icon {
        min-width: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 6px;
      }
      .icon-right {
        margin-left: auto;
        transition: all 0.3s ease;
      }
      .side-dropdown {
        padding-left: 54px;
        transition: all 0.15s ease;
        list-style-type: none;
        a {
          &:hover {
            color: var(--blue);
            background: none;
          }
        }
      }
    }
  }

  // user style
  .user {
    width: 150px;
    padding: 10px;
    display: none;

    // Show user when toggled
    &.show-user {
      display: block;
      position: fixed;
      max-width: 150px;
      margin-top: 65px;
      width: 100%;
      background: var(--light);
      right: 0;
      overflow-y: auto;
      scrollbar-width: none;
      transition: all 0.3s ease;
      z-index: 200;
    }

    .overflow {
      overflow-x: auto;
      border-bottom: 1px solid black;

      .divider {
        margin: 5px 15px;
        font-size: 14px;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--dark-grey);
        white-space: nowrap;
      }
    }

    .user-menu {
      margin: 5px 0;
      padding: 0;
      transition: all 0.3s ease;
      list-style-type: none;

      a {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--dark);
        padding: 12px 16px 12px 0;
        transition: all 0.3s ease;
        border-radius: 10px;
        margin: 4px 0;
        white-space: nowrap;
        text-decoration: none;

        &:hover {
          background: var(--grey);
        }
      }

      .icon {
        min-width: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 6px;
      }
    }
  }
}
</style>
