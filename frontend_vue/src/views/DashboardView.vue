<template>
  <div id="dashboard">
    <NavbarMenu />
    <div class="main">
      <main>
        <h1 class="title">Dashboard</h1>

        <ol class="breadcrumb">
          <li class="breadcrumb-item">Home</li>
          <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
        </ol>
        <div class="info-data">
          <div class="card card-1">
            <div class="head">
              <div>
                <LoadIng v-if="isLoading" />
                <h2 v-else>{{ dataStok }}</h2>
                <p class="label">Data Produk</p>
              </div>
              <i class="bx bx-package icon"></i>
            </div>
          </div>
          <div class="card card-2">
            <div class="head">
              <div>
                <LoadIng v-if="isLoading" />
                <h2 v-else>Rp. {{ subBeli.toLocaleString("id-ID") }}</h2>
                <p class="label">Total Pembelian</p>
              </div>
              <i class="bx bx-archive-in icon"></i>
            </div>
          </div>
          <div class="card card-3">
            <div class="head">
              <div>
                <LoadIng v-if="isLoading" />
                <h2 v-else>Rp. {{ subJual.toLocaleString("id-ID") }}</h2>
                <p class="label">Total Penjualan</p>
              </div>
              <i class="bx bx-archive-out icon"></i>
            </div>
          </div>
          <div class="card card-4">
            <div class="head">
              <div>
                <LoadIng v-if="isLoading" />
                <h2 v-else>{{ dataAlert }}</h2>
                <p class="label">Persediaan Habis</p>
              </div>
              <i
                :class="
                  dataAlert === 0
                    ? 'bx bx-alarm-exclamation icon'
                    : 'bx bx-alarm-exclamation bx-tada icon'
                "
              ></i>
            </div>
          </div>
        </div>
        <div class="card shadow mb-4 mt-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Daftar Persediaan</h6>
          </div>
          <div class="card-body">
            <LoadIng v-if="isLoading" />
            <div class="table-responsive" v-else>
              <table
                id="dataTable"
                class="table table-bordered border-secondary-subtle"
                style="width: 100%"
              >
                <thead class="table-secondary">
                  <tr>
                    <th style="max-width: 40px" class="text-center">No</th>
                    <th style="min-width: 90px" class="text-center">
                      ID Produk
                    </th>
                    <th style="min-width: 120px" class="text-center">
                      Nama Produk
                    </th>
                    <th style="min-width: 90px" class="text-center">
                      Kategori
                    </th>
                    <th style="min-width: 90px" class="text-center">Stok</th>
                    <th style="min-width: 90px" class="text-center">Satuan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(stock, index) in stocks" :key="stock.id">
                    <td class="text-center fw-medium">{{ index + 1 }}</td>
                    <td class="text-center fw-medium">
                      {{ stock.productId.idProduk }}
                    </td>
                    <td
                      style="text-transform: capitalize"
                      class="px-5 fw-medium"
                    >
                      {{ stock.productId.name }}
                    </td>
                    <td
                      style="text-transform: capitalize"
                      class="text-center fw-medium"
                    >
                      {{ stock.productId.category.name }}
                    </td>
                    <td
                      class="text-center fw-medium"
                      :class="{ 'zero-stock': stock.stock === 0 }"
                    >
                      {{ stock.stock }}
                    </td>
                    <td
                      style="text-transform: capitalize"
                      class="text-center fw-medium"
                    >
                      {{ stock.productId.unit.name }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
    <FooterMenu />
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import NavbarMenu from "@/components/NavbarMenu.vue";
import FooterMenu from "@/components/FooterMenu.vue";
import LoadIng from "@/components/LoadIng.vue";
export default {
  name: "DashboardView",
  components: {
    NavbarMenu,
    FooterMenu,
    LoadIng,
  },
  data() {
    return {
      isLoading: true,
      stocks: [],
      in: [],
      out: [],
      dataTable: null,
      dataStok: 0,
      subBeli: 0,
      subJual: 0,
      dataAlert: 0,
      publicPath: process.env.BASE_URL,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.fetchDashboard();
  },

  mounted() {
    this.initDataTable();
  },

  methods: {
    fetchDashboard() {
      const token = this.$store.state.accessToken;
      axios
        .get(`${process.env.VUE_APP_API_URL}/stock/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.stocks = response.data.stock;
          this.dataStok = response.data.stock.length;
          this.dataAlert = this.stocks.filter(
            (stock) => stock.stock === 0
          ).length;
          this.subBeli = response.data.subBeli;
          this.subJual = response.data.subJual;
          this.updateDataTable();
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 401) {
            this.$router.push({ path: "/login" });
          }
        });
    },

    initDataTable() {
      this.dataTable = $("#dataTable").DataTable({
        responsive: false,
      });
    },
    updateDataTable() {
      if (this.dataTable) {
        this.dataTable.destroy();
      }

      this.$nextTick(() => {
        this.initDataTable();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#dashboard {
  height: 100%;
  min-height: 100vh;

  .main {
    width: 100%;
    padding: 24px 20px;
    min-height: 85vh;

    .title {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .info-data {
      margin-top: 36px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      grid-gap: 20px;

      .card {
        padding: 20px;
        border-radius: 10px;
        background: var(--light);
        border-left: 5px solid transparent;
        box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.05);

        &.card-1 {
          border-color: var(--primary); // Warna border kiri untuk card pertama
        }

        &.card-2 {
          border-color: var(--secondary); // Warna border kiri untuk card kedua
        }

        &.card-3 {
          border-color: var(--success); // Warna border kiri untuk card ketiga
        }

        &.card-4 {
          border-color: var(--danger); // Warna border kiri untuk card keempat
        }

        .head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          h2 {
            font-size: 24px;
            font-weight: 600;
          }

          p {
            font-size: 14px;
          }
          .bx-tada {
            color: var(--danger);
          }
          .icon {
            font-size: 40px;
          }
        }

        .label {
          margin-top: 24px;
          font-size: 14px;
          font-weight: 700;
        }
      }
    }

    .zero-stock {
      background-color: var(--danger);
      color: white;
      font-weight: bold;
    }
  }
}
</style>
