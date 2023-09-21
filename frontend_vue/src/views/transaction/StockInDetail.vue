<template>
  <div id="stockin">
    <NavbarBeli />
    <div class="main">
      <main>
        <h1 class="title">Detail Transaksi Pembelian</h1>

        <ol class="breadcrumb">
          <li class="breadcrumb-item">Home</li>
          <li class="breadcrumb-item">Transaksi</li>
          <li class="breadcrumb-item active" aria-current="page">
            Detail Pembelian
          </li>
        </ol>

        <!-- DataTales Example -->
        <div class="card shadow mb-4 mt-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">
              Daftar Transaksi Pembelian
            </h6>
          </div>
          <div class="card-body">
            <LoadIng v-if="isLoading" />
            <div v-else>
              <div class="row">
                <div class="col-md-6 col-sm-12">
                  <table class="table table-borderless">
                    <tbody>
                      <tr>
                        <td class="fw-bold">ID Transaksi</td>
                        <td class="fw-bold">:</td>
                        <td class="fw-medium">{{ transaction.idTransaksi }}</td>
                      </tr>
                      <tr>
                        <td class="fw-bold">Tanggal Pembelian</td>
                        <td class="fw-bold">:</td>
                        <td class="fw-medium">
                          {{ formatDate(transaction.tanggal) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="fw-bold">Total Pembelian</td>
                        <td class="fw-bold">:</td>
                        <td class="fw-medium">
                          Rp.
                          {{
                            transaction.subTotal
                              ? transaction.subTotal.toLocaleString("id-ID")
                              : 0
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="table-responsive">
                <table
                  id="dataTable"
                  class="table table-bordered border-secondary-subtle"
                  style="width: 100%"
                >
                  <thead class="table-secondary">
                    <tr>
                      <th style="max-width: 40px" class="text-center">No</th>
                      <th style="min-width: 120px" class="text-center">
                        ID Produk
                      </th>
                      <th style="min-width: 130px" class="text-center">
                        Nama Produk
                      </th>
                      <th style="min-width: 90px" class="text-center">
                        Kuantitas
                      </th>
                      <th style="min-width: 90px" class="text-center">
                        Harga Beli
                      </th>
                      <th style="min-width: 90px" class="text-center">
                        Harga Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(product, index) in transaction.products"
                      :key="product.productId"
                    >
                      <td class="text-center fw-medium">
                        {{ index + 1 }}
                      </td>
                      <td class="text-center fw-medium">
                        {{ product.productId.idProduk }}
                      </td>
                      <td class="px-5 fw-medium text-capitalize">
                        {{ product.productId.name }}
                      </td>
                      <td class="text-center fw-medium">
                        {{ product.quantity }}
                      </td>
                      <td class="text-center fw-medium">
                        Rp.
                        {{
                          product.hargaBeli
                            ? product.hargaBeli.toLocaleString("id-ID")
                            : 0
                        }}
                      </td>
                      <td class="text-center fw-medium">
                        Rp.
                        {{
                          product.hargaTotal
                            ? product.hargaTotal.toLocaleString("id-ID")
                            : 0
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
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
import NavbarBeli from "@/components/NavbarBeli.vue";
import LoadIng from "@/components/LoadIng.vue";
import FooterMenu from "@/components/FooterMenu.vue";

export default {
  name: "StockinTransView",
  components: { NavbarBeli, FooterMenu, LoadIng },
  data() {
    return {
      transaction: {},

      isLoading: true,
      idTransaksi: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.idTransaksi = this.$route.query.idTransaksi;
    this.fetchTransactionDetails();
  },

  mounted() {
    this.initDataTable();
  },

  methods: {
    fetchTransactionDetails() {
      const token = this.$store.state.accessToken;
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/intransaction/detailPembelian?idTransaksi=${this.idTransaksi}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          this.transaction = response.data;
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

    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = new Date(dateString).toLocaleDateString(
        "id-ID",
        options
      );
      return formattedDate;
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
#stockin {
  height: 100%;
  min-height: 100vh;
  //Main Style
  .main {
    width: 100%;
    padding: 24px 20px;
    min-height: 85vh;

    .custom-link {
      text-decoration: none; /* Menghilangkan underline */
      color: black; /* Mengganti warna dari biru menjadi hitam */
    }

    .title {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .form {
      background-color: #fefefe;
      padding: 20px;
      border: 1px solid #888;
      width: 360px;

      .input-field {
        width: 300px;
        margin: 10px;
        height: 55px;
        border-radius: 55px;
        display: grid;
        grid-template-columns: 35% 5% 60%;
        padding: 0 0.4rem;
        position: relative;

        .label {
          text-align: start;
          line-height: 55px;
          font-size: 1rem;
        }
        .input {
          background: whitesmoke;
          border: none;
          line-height: 1;
          font-weight: 600;
          text-transform: capitalize;
          font-size: 1.1rem;
          padding: 0 10px;
          color: #333;

          &::placeholder {
            color: #aaa;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
