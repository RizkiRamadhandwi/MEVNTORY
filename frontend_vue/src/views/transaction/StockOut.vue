<template>
  <div id="stockout">
    <NavbarMenu />
    <div class="main">
      <main>
        <h1 class="title">Data Transaksi Penjualan</h1>

        <ol class="breadcrumb">
          <li class="breadcrumb-item">Home</li>
          <li class="breadcrumb-item">Transaksi</li>
          <li class="breadcrumb-item active" aria-current="page">Penjualan</li>
        </ol>

        <div class="card shadow mb-4 mt-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
              Pencarian Berdasarkan Periode Tanggal
            </h6>
          </div>
          <div class="card-body">
            <form @submit.prevent="fetchReport">
              <div class="row g-3 align-items-center">
                <div class="col-auto">
                  <input
                    type="date"
                    id="startDate"
                    v-model="startDate"
                    class="form-control"
                    @input="handleDateChange"
                  />
                </div>
                <div class="col-auto">-</div>
                <div class="col-auto">
                  <input
                    type="date"
                    id="endDate"
                    v-model="endDate"
                    class="form-control"
                    :min="minDate"
                    @input="handleDateChange"
                  />
                </div>
                <div class="col-auto">
                  <button
                    type="submit"
                    :class="
                      tombolCariTanggal
                        ? 'btn fw-medium btn-warning'
                        : 'btn fw-medium btn-secondary'
                    "
                    :disabled="!tombolCariTanggal"
                  >
                    Cari
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- DataTales Example -->
        <div class="card shadow mb-4 mt-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
              Daftar Transaksi Penjualan
            </h6>
          </div>
          <div class="card-body">
            <LoadIng v-if="isLoading || isLoadingCari" />
            <div class="table-responsive" v-else>
              <table
                id="dataTable"
                class="table table-bordered border-secondary-subtle"
                style="width: 100%"
              >
                <thead class="table-secondary">
                  <tr>
                    <th style="max-width: 40px" class="text-center">No</th>
                    <th style="min-width: 120px" class="text-center">
                      ID Transaksi
                    </th>
                    <th style="min-width: 90px" class="text-center">Tanggal</th>
                    <th style="min-width: 130px" class="text-center">
                      Total Penjualan
                    </th>
                    <th style="min-width: 90px" class="text-center">
                      Detail Penjualan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(trans, index) in transactions"
                    :key="trans._id"
                    v-on:click.capture="showtransactionDetail(trans)"
                  >
                    <td class="text-center fw-medium">
                      {{ index + 1 }}
                    </td>
                    <td class="text-center fw-medium">
                      {{ trans.idTransaksi }}
                    </td>
                    <td class="text-center fw-medium">
                      {{ formatDate(trans.tanggal) }}
                    </td>
                    <td class="text-center fw-medium">
                      Rp. {{ trans.subTotal.toLocaleString("id-ID") }}
                    </td>
                    <td class="text-center fw-medium">
                      <router-link
                        :to="{
                          path: 'stockin/detailPenjualan',
                          query: {
                            idTransaksi: trans.idTransaksi,
                          },
                        }"
                        class="custom-link"
                        >Detail Transaksi >></router-link
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
              <router-link to="/transaction/stockOut/new">
                <button
                  class="btn btn-primary float-end position-fixed bottom-0 end-0 m-3 rounded-circle"
                >
                  <i class="bx bx-plus bx-md"></i>
                </button>
              </router-link>
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
import Swal from "sweetalert2";
import NavbarMenu from "@/components/NavbarMenu.vue";
import LoadIng from "@/components/LoadIng.vue";
import FooterMenu from "@/components/FooterMenu.vue";

export default {
  name: "StockinTransView",
  components: { NavbarMenu, FooterMenu, LoadIng },
  data() {
    return {
      transactions: [],
      isLoading: true,
      isLoadingCari: false,
      minDate: null,
      products: [],
      startDate: null,
      tables: null,
      endDate: null,
      reportData: [],
      tombolCariTanggal: false,
      dataTable: null,
      selectedtransaction: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.fetchtransactions();
    this.fetchProducts();
  },

  mounted() {
    this.initDataTable();
  },

  methods: {
    handleDateChange() {
      this.tombolCariTanggal = this.endDate != null && this.startDate != null;
      this.minDate = this.startDate;
      if (this.endDate < this.startDate) {
        this.endDate = this.startDate;
      }
    },
    getFormattedDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    showtransactionDetail(transaction) {
      this.selectedtransaction = transaction;
    },
    hidetransactionDetail() {
      this.selectedtransaction = null;
    },
    fetchReport() {
      this.isLoadingCari = true;
      const token = this.$store.state.accessToken;
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/report/in?startDate=${this.startDate}&endDate=${this.endDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.transactions = response.data;
          this.isLoadingCari = false;
          this.updateDataTable();
        })
        .catch((error) => {
          this.isLoadingCari = false;
          console.error(error);
          if (error.response && error.response.status === 401) {
            this.$router.push({ path: "/login" });
          }
        });
    },
    fetchtransactions() {
      const token = this.$store.state.accessToken;
      axios
        .get(`${process.env.VUE_APP_API_URL}/outtransaction/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.transactions = response.data.reverse();
          this.isLoading = false;
          this.updateDataTable();
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 401) {
            this.$router.push({ path: "/login" });
          }
        });
    },
    fetchProducts() {
      const token = this.$store.state.accessToken;
      axios
        .get(`${process.env.VUE_APP_API_URL}/product/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.products = response.data;
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 401) {
            this.$router.push({ path: "/login" });
          }
        });
    },

    getProductName(productId) {
      const product = this.products.find((cat) => cat._id === productId);
      return product ? product.name : "";
    },

    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = new Date(dateString).toLocaleDateString(
        "id-ID",
        options
      );
      return formattedDate;
    },

    addTransaction() {
      const token = this.$store.state.accessToken;
      const { tanggal, productId, quantity, hargaTotal } = this.newTransaction;

      const newTransactionData = {
        tanggal,
        productId,
        quantity,
        hargaTotal,
      };

      axios
        .post(
          `${process.env.VUE_APP_API_URL}/outtransaction/`,
          newTransactionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "transaction added successfully!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          this.newTransaction.tanggal = "";
          this.newTransaction.productId = "";
          this.newTransaction.quantity = 0;
          this.closeModal();
          this.fetchtransactions();
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while adding the transaction",
          });
          console.error("Error adding productId:", error);
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
#stockout {
  height: 100%;
  min-height: 100vh;
  //Main Style
  .main {
    width: 100%;
    padding: 24px 20px;
    min-height: 85vh;

    .title {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .custom-link {
      text-decoration: none; /* Menghilangkan underline */
      /* Mengganti warna dari biru menjadi hitam */
    }
  }
}
</style>
