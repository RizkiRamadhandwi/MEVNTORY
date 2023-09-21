<template>
  <div id="stockin">
    <NavbarBeli />
    <div class="main">
      <main>
        <h1 class="title">Tambah Transaksi Pembelian</h1>

        <form @submit.prevent="addTransaction">
          <div class="card shadow mb-4 mt-4">
            <div class="card-header py-3">
              <div class="row">
                <div class="col">
                  <h6 class="m-0 font-weight-bold text-primary">
                    Transaksi Pembelian
                  </h6>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="mb-3 row">
                <label for="tanggalTransaksi" class="col-sm-2 col-form-label"
                  >Tanggal</label
                >
                <div class="col-sm-4">
                  <input
                    type="date"
                    class="form-control"
                    id="tanggalTransaksi"
                    :min="minDate"
                    v-model="newTransaction.tanggal"
                  />
                </div>
              </div>
              <div class="mb-2 row">
                <div class="col-md-3 col-sm-12">
                  <label for="pilihBarang">Nama Produk</label>
                  <select
                    v-model="newTransaction.productId"
                    class="form-select"
                    id="pilihBarang"
                    @change="pilihOpsi"
                  >
                    <option value="" disabled selected hidden>
                      Pilih Produk
                    </option>

                    <option
                      v-for="product in products"
                      :value="product._id"
                      :key="product._id"
                      style="text-transform: capitalize"
                    >
                      {{ product.name }}
                    </option>
                  </select>
                </div>
                <div class="col-md-3 col-sm-12">
                  <label for="qt">Quantity</label>
                  <div class="row justify-content-between">
                    <div class="col-md-2 col-sm-2">
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="decrementQuantity"
                      >
                        -
                      </button>
                    </div>
                    <div class="col-md-8 col-sm-8">
                      <input
                        type="number"
                        v-model="newTransaction.quantity"
                        class="form-control no-spinner"
                        id="qt"
                        @input="getHargaTotal"
                      />
                    </div>
                    <div class="col-md-2 col-sm-2">
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="incrementQuantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-2 col-sm-12">
                  <label for="hargaBeli">Harga Satuan</label>
                  <input
                    type="number"
                    id="hargaBeli"
                    v-model="newTransaction.hargaBeli"
                    class="form-control"
                    disabled
                  />
                </div>
                <div class="col-md-3 col-sm-12">
                  <label for="hargaTotal">Harga Total</label>
                  <input
                    type="number"
                    id="hargaTotal"
                    v-model="newTransaction.hargaTotal"
                    class="form-control"
                    disabled
                  />
                </div>
                <div class="col-md-1 col-sm-12 mt-4">
                  <button
                    class="btn btn-warning"
                    type="button"
                    @click="tambahKeranjang"
                  >
                    <i class="bx bx-cart-add"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow mb-4 mt-4">
            <div class="card-header py-3">
              <h6 class="m-0 font-weight-bold text-primary">Keranjang</h6>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table
                  class="table table-bordered border-secondary-subtle"
                  style="width: 100%"
                >
                  <thead class="table-secondary">
                    <tr>
                      <th style="max-width: 40px" class="text-center">No</th>
                      <th style="min-width: 130px" class="text-center">
                        Nama Produk
                      </th>
                      <th style="min-width: 60px" class="text-center">
                        Quantity
                      </th>
                      <th style="min-width: 90px" class="text-center">
                        Harga Satuan
                      </th>
                      <th style="min-width: 90px" class="text-center">
                        Harga Total
                      </th>
                      <th style="min-width: 90px" class="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in getCart"
                      :key="item.productId"
                      v-on:click.capture="showtransactionDetail(item)"
                    >
                      <td class="text-center">{{ index + 1 }}</td>
                      <td style="text-transform: capitalize">
                        {{ getProductName(item.productId) }}
                      </td>
                      <td class="text-center">{{ item.quantity }}</td>
                      <td class="text-center">
                        Rp.
                        {{
                          item.hargaBeli != undefined
                            ? item.hargaBeli.toLocaleString("id-ID")
                            : "0"
                        }}
                      </td>
                      <td class="px-5">
                        Rp.
                        {{
                          item.hargaTotal != undefined
                            ? item.hargaTotal.toLocaleString("id-ID")
                            : "0"
                        }}
                      </td>
                      <td class="text-center">
                        <button
                          type="button"
                          class="btn btn-danger btn-sm rounded-circle m-1"
                          @click="kurangiProductKeranjang(item.productId)"
                        >
                          <i class="bx bx-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" class="px-5"><b>Subtotal</b></td>
                      <td colspan="2" class="px-5 fw-medium">
                        Rp.
                        {{
                          getCart
                            .reduce((total, item) => total + item.hargaTotal, 0)
                            .toLocaleString("id-ID")
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="btn bton btn-primary float-end position-fixed bottom-0 end-0 m-3 rounded-circle zindex-fixed"
          >
            <i class="bx bxs-save bx-md"></i>
          </button>
        </form>
      </main>
    </div>
    <FooterMenu />
  </div>
</template>

<script>
import $ from "jquery";
import axios from "axios";
import Swal from "sweetalert2";
import NavbarBeli from "@/components/NavbarBeli.vue";
import { mapActions, mapGetters } from "vuex";

import FooterMenu from "@/components/FooterMenu.vue";

export default {
  name: "StockinTransView",
  components: { NavbarBeli, FooterMenu },
  data() {
    return {
      minDate: new Date().toISOString().split("T")[0], // Set nilai minimum ke tanggal hari ini
      transactions: [],
      products: [],
      keranjang: [],
      modalOpen: false,
      editModalOpen: false,
      newTransaction: {
        // Inisialisasi data produk baru
        tanggal: this.getFormattedDate(),
        productId: "",
        quantity: "",
        hargaBeli: 0,
        hargaTotal: 0,
      },
      subTotal: 0,
      dataTable: null,
      selectedtransaction: null,
    };
  },
  computed: {
    ...mapGetters(["getCart"]),
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
    ...mapActions(["addToCart", "removeItemCart"]),

    clearNewTransactions() {
      this.newTransaction.productId = "";
      this.newTransaction.quantity = 0;
      this.newTransaction.hargaBeli = "";
      this.newTransaction.hargaTotal = "";
    },

    kurangiProductKeranjang(productId) {
      console.log(productId);
      this.removeItemCart(productId);
    },

    tambahKeranjang() {
      let { productId, quantity, hargaBeli, hargaTotal } = this.newTransaction;

      if (!quantity || quantity == 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding the transaction",
        });
        return;
      }

      this.clearNewTransactions();

      const objectDitemukan = this.getCart.find(
        (item) => item.productId == productId
      );

      if (objectDitemukan) {
        quantity += objectDitemukan.quantity;
        hargaTotal = quantity * hargaBeli;
        console.log(productId, quantity, hargaBeli, hargaTotal);
        this.addToCart({
          productId,
          quantity,
          hargaBeli,
          hargaTotal,
        });
      } else {
        this.addToCart({
          productId,
          quantity,
          hargaBeli,
          hargaTotal,
        });
      }
      // Memanggil mutation untuk menambahkan produk ke keranjang
    },

    pilihOpsi(event) {
      const nilaiOpsi = event.target.value;
      // Lakukan apa yang Anda inginkan dengan nilai opsi yang dipilih di sini
      // console.log(`Anda memilih opsi: ${nilaiOpsi}`);

      // Contoh: Panggil sebuah fungsi lain
      this.getHargaBeli(nilaiOpsi);
    },
    getHargaBeli(nilaiOpsi) {
      // Fungsi lain yang akan dijalankan dengan nilai opsi yang dipilih
      const objectDitemukan = this.products.find(
        (product) => product._id == nilaiOpsi
      );
      this.newTransaction.hargaBeli = objectDitemukan.hargaBeli;
      this.newTransaction.hargaTotal =
        this.newTransaction.hargaBeli * this.newTransaction.quantity;
      // console.log(`Fungsi lain dijalankan dengan opsi: ${nilaiOpsi}`);
    },

    incrementQuantity() {
      this.newTransaction.quantity++;
      this.getHargaTotal();
    },
    decrementQuantity() {
      if (this.newTransaction.quantity > 0) {
        this.newTransaction.quantity--;
        this.getHargaTotal();
      }
    },

    getHargaTotal() {
      // Pastikan nilai input selalu positif
      if (this.newTransaction.quantity < 0) {
        this.newTransaction.quantity = 0;
      }
      this.newTransaction.hargaTotal =
        this.newTransaction.hargaBeli * this.newTransaction.quantity;
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
    fetchtransactions() {
      const token = this.$store.state.accessToken;
      axios
        .get(`${process.env.VUE_APP_API_URL}/intransaction/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.transactions = response.data.reverse();
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
      const options = { day: "numeric", month: "long", year: "numeric" };
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", options);
    },

    openModal() {
      this.modalOpen = true;
    },

    closeModal() {
      this.modalOpen = false;
      this.newTransaction.tanggal = this.getFormattedDate();
      this.newTransaction.productId = "";
      this.newTransaction.quantity = 0;
    },

    addTransaction() {
      const token = this.$store.state.accessToken;
      const products = this.getCart;
      const subTotal = this.getCart.reduce(
        (total, item) => total + item.hargaTotal,
        0
      );
      const tanggal = this.newTransaction.tanggal;

      const data = { tanggal, subTotal, products };
      // console.log(data);
      // const { tanggal, productId, quantity, hargaTotal } = this.newTransaction;

      // const newTransactionData = {
      //   tanggal,
      //   productId,
      //   quantity,
      //   hargaTotal,
      // };

      if (products.length <= 0) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while adding the transaction",
        });
      }

      axios
        .post(`${process.env.VUE_APP_API_URL}/intransaction/`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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
          sessionStorage.setItem("cart", JSON.stringify([]));
          this.$store.commit("clearCart");
          this.$router.push("/transaction/stockin");
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
    deletetransaction(transactionId) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          const token = this.$store.state.accessToken;

          axios
            .delete(
              `${process.env.VUE_APP_API_URL}/intransaction/${transactionId}`,
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
                title: "transaction deleted successfully!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
              });
              this.fetchtransactions();
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while deleting the transaction.",
              });
              console.error("Error deleting productId:", error);
            });
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
#stockin {
  height: 100%;
  min-height: 100vh;
  //Main Style
  .main {
    width: 100%;
    padding: 24px 20px;
    min-height: 85vh;

    .no-spinner {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: textfield; /* Untuk Firefox */
    }
    .title {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .modal {
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.4);

      .modal-content {
        // Tampilan konten modal
        background-color: #fefefe;
        padding: 20px;
        border: 1px solid #888;
        max-width: 500px;

        .text {
          font-size: 2em;
          text-align: center;
        }

        .input-field {
          max-width: 400px;
          width: 90%;
          margin: 10px auto;
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

        .btn-field {
          max-width: 300px;
          width: 90%;
          align-items: center;
          border: none;
          outline: none;
          height: 60px;
          border-radius: 50px;
          display: grid;
          padding: 10px;
          grid-template-columns: 50% 50%;
          margin: 10px auto;

          .btn {
            cursor: pointer;
            font-weight: 600;
            height: 40px;
            margin: 10px;
          }
        }
      }
    }
  }
}
</style>
