<template>
  <div id="product">
    <NavbarMenu />
    <div class="main">
      <main>
        <h1 class="title">Data Produk</h1>

        <ol class="breadcrumb">
          <li class="breadcrumb-item">Home</li>
          <li class="breadcrumb-item">Data Master</li>
          <li class="breadcrumb-item active" aria-current="page">Produk</li>
        </ol>

        <!-- DataTales Example -->
        <div class="card shadow mb-4 mt-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Daftar Produk</h6>
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
                    <th style="min-width: 150px" class="text-center">
                      Nama Produk
                    </th>
                    <th style="min-width: 90px" class="text-center">
                      Kategori
                    </th>
                    <th style="min-width: 90px" class="text-center">Satuan</th>
                    <th style="min-width: 90px" class="text-center">
                      Harga Beli
                    </th>
                    <th style="min-width: 90px" class="text-center">
                      Harga Jual
                    </th>

                    <th style="min-width: 90px" class="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(product, index) in products"
                    :key="product._id"
                    v-on:click.capture="showProductDetail(product)"
                  >
                    <td class="text-center fw-medium">{{ index + 1 }}</td>
                    <td class="text-center fw-medium">
                      {{ product.idProduk }}
                    </td>
                    <td
                      style="text-transform: capitalize"
                      class="px-5 fw-medium"
                    >
                      {{ product.name }}
                    </td>
                    <td
                      style="text-transform: capitalize"
                      class="text-center fw-medium"
                    >
                      {{ getCategoryName(product.category) }}
                    </td>
                    <td
                      style="text-transform: capitalize"
                      class="text-center fw-medium"
                    >
                      {{ getUnitName(product.unit) }}
                    </td>
                    <td
                      style="text-transform: capitalize"
                      class="text-center fw-medium"
                    >
                      Rp.
                      {{
                        product.hargaBeli != undefined
                          ? product.hargaBeli.toLocaleString("id-ID")
                          : "0"
                      }}
                    </td>
                    <td
                      style="text-transform: capitalize"
                      class="text-center fw-medium"
                    >
                      Rp.
                      {{
                        product.hargaJual != undefined
                          ? product.hargaJual.toLocaleString("id-ID")
                          : "0"
                      }}
                    </td>

                    <td class="text-center">
                      <button
                        class="btn btn-secondary btn-sm me-1 rounded-circle m-1"
                        @click="openEditModal(product)"
                      >
                        <i class="bx bxs-edit"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm rounded-circle m-1"
                        @click="deleteProduct(product._id)"
                      >
                        <i class="bx bx-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                class="btn btn-primary float-end position-fixed bottom-0 end-0 m-3 rounded-circle zindex-fixed"
                @click="openModal"
              >
                <i class="bx bx-plus bx-md"></i>
              </button>
            </div>
          </div>
        </div>
        <div v-if="modalOpen" class="modal">
          <div class="modal-content">
            <h2 class="text">Tambah Produk</h2>
            <form @submit.prevent="addProduct">
              <div class="input-field">
                <label class="labelin">Nama dan Ukuran Produk</label>
                <label class="label">:</label>
                <input
                  type="text"
                  v-model="newProduct.name"
                  placeholder="Nama dan Ukuran Produk"
                  style="text-transform: capitalize"
                  class="input"
                  required
                />
              </div>

              <!-- Pilih Kategori -->
              <div class="input-field">
                <label class="label">Kategori</label>
                <label class="label">:</label>
                <select v-model="newProduct.category" class="input" required>
                  <option value="" disabled selected hidden>
                    Pilih Kategori
                  </option>

                  <option
                    v-for="category in categories"
                    :value="category._id"
                    :key="category._id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <!-- Pilih Unit -->
              <div class="input-field">
                <label class="label">Satuan</label>
                <label class="label">:</label>
                <select v-model="newProduct.unit" class="input" required>
                  <option value="" disabled selected hidden class="hidden">
                    Pilih Satuan
                  </option>
                  <option
                    v-for="unit in units"
                    :value="unit._id"
                    :key="unit._id"
                  >
                    {{ unit.name }}
                  </option>
                </select>
              </div>
              <div class="input-field">
                <label class="label">Harga Beli</label>
                <label class="label">:</label>
                <input
                  type="number"
                  v-model="newProduct.hargaBeli"
                  placeholder="Harga Beli"
                  class="input"
                  required
                />
              </div>
              <div class="input-field">
                <label class="label">Harga Jual</label>
                <label class="label">:</label>
                <input
                  type="number"
                  v-model="newProduct.hargaJual"
                  placeholder="Harga Jual"
                  class="input"
                  required
                />
              </div>

              <div class="btn-field">
                <LoadIng v-if="isLoadingSave" />
                <button v-else class="btn btn-primary" type="submit">
                  Save
                </button>
                <button class="btn btn-secondary" @click="closeModal">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div v-if="editModalOpen" class="modal">
          <div class="modal-content">
            <h2 class="text">Edit Produk</h2>
            <form @submit.prevent="updateProduct">
              <div class="input-field">
                <label class="labelin">Nama dan Ukuran Produk</label>
                <label class="label">:</label>
                <input
                  type="text"
                  v-model="editProduct.name"
                  placeholder="Nama dan Ukuran Produk"
                  class="input"
                  required
                />
              </div>

              <!-- Pilih Kategori -->
              <div class="input-field">
                <label class="label">Kategori</label>
                <label class="label">:</label>
                <select v-model="editProduct.category" class="input" required>
                  <option value="" disabled selected hidden>
                    Pilih Kategori
                  </option>

                  <option
                    v-for="category in categories"
                    :value="category._id"
                    :key="category._id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <!-- Pilih Unit -->
              <div class="input-field">
                <label class="label">Satuan</label>
                <label class="label">:</label>
                <select v-model="editProduct.unit" class="input" required>
                  <option value="" disabled selected hidden class="hidden">
                    Pilih Satuan
                  </option>
                  <option
                    v-for="unit in units"
                    :value="unit._id"
                    :key="unit._id"
                  >
                    {{ unit.name }}
                  </option>
                </select>
              </div>
              <!-- Input OpenStok -->
              <div class="input-field">
                <label class="label">Harga Beli</label>
                <label class="label">:</label>
                <input
                  type="number"
                  v-model="editProduct.hargaBeli"
                  placeholder="Harga Beli"
                  class="input"
                  required
                />
              </div>
              <div class="input-field">
                <label class="label">Harga Jual</label>
                <label class="label">:</label>
                <input
                  type="number"
                  v-model="editProduct.hargaJual"
                  placeholder="Harga Jual"
                  class="input"
                  required
                />
              </div>

              <div class="btn-field">
                <LoadIng v-if="isLoadingEdit" />
                <button v-else class="btn btn-primary" type="submit">
                  Save
                </button>
                <button class="btn btn-secondary" @click="closeEditModal">
                  Cancel
                </button>
              </div>
            </form>
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
import FooterMenu from "@/components/FooterMenu.vue";
import LoadIng from "@/components/LoadIng.vue";

export default {
  name: "ProductView",
  components: { NavbarMenu, FooterMenu, LoadIng },
  data() {
    return {
      products: [],
      isLoading: true,
      isLoadingSave: false,
      isLoadingEdit: false,
      categories: [],
      units: [],
      modalOpen: false,
      editModalOpen: false,
      newProduct: {
        // Inisialisasi data produk baru
        name: "",
        category: "",
        unit: "",
        hargaBeli: "",
        hargaJual: "",
      },
      editProduct: {
        name: "",
        category: null,
        unit: null,
        hargaBeli: "",
        hargaJual: "",
      },
      dataTable: null,
      selectedProduct: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.fetchProducts();
    this.fetchCategories();
    this.fetchUnits();
  },

  mounted() {
    this.initDataTable();
  },

  methods: {
    showProductDetail(product) {
      this.selectedProduct = product;
    },
    hideProductDetail() {
      this.selectedProduct = null;
    },
    fetchProducts() {
      const token = this.$store.state.accessToken;
      axios
        .get(`${process.env.VUE_APP_API_URL}/product`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.products = response.data;
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
    fetchCategories() {
      const token = this.$store.state.accessToken;
      axios
        .get(`${process.env.VUE_APP_API_URL}/category`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.categories = response.data;
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 401) {
            this.$router.push({ path: "/login" });
          }
        });
    },
    fetchUnits() {
      const token = this.$store.state.accessToken;
      axios
        .get(`${process.env.VUE_APP_API_URL}/unit`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.units = response.data;
        })
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 401) {
            this.$router.push({ path: "/login" });
          }
        });
    },
    getCategoryName(categoryId) {
      const category = this.categories.find((cat) => cat._id === categoryId);
      return category ? category.name : "";
    },
    getUnitName(unitId) {
      const unit = this.units.find((unt) => unt._id === unitId);
      return unit ? unit.name : "";
    },

    openModal() {
      this.modalOpen = true;
    },

    closeModal() {
      this.modalOpen = false;
      this.newProduct.name = "";
      this.newProduct.category = "";
      this.newProduct.unit = "";
    },

    addProduct() {
      this.isLoadingSave = true;
      const token = this.$store.state.accessToken;
      const { name, category, unit, hargaBeli, hargaJual } = this.newProduct;

      const newProductData = {
        name,
        category,
        unit,
        hargaBeli,
        hargaJual,
      };

      axios
        .post(`${process.env.VUE_APP_API_URL}/product`, newProductData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Product added successfully!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          this.newProduct.name = "";
          this.newProduct.category = "";
          this.newProduct.unit = "";
          this.newProduct.hargaBeli = "";
          this.newProduct.hargaJual = "";
          this.closeModal();
          this.fetchProducts();
          this.isLoadingSave = false;
        })
        .catch((error) => {
          this.isLoadingSave = false;
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while adding the product.",
          });
          console.error("Error adding category:", error);
        });
    },
    deleteProduct(productId) {
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
            .delete(`${process.env.VUE_APP_API_URL}/product/${productId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              console.log(response);
              Swal.fire({
                icon: "success",
                title: "Product deleted successfully!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
              });
              this.fetchProducts();
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while deleting the category.",
              });
              console.error("Error deleting category:", error);
            });
        }
      });
    },
    openEditModal(product) {
      this.editProduct = {
        ...product,
      };
      this.editModalOpen = true;
    },
    closeEditModal() {
      this.editModalOpen = false;
    },
    updateProduct() {
      this.isLoadingEdit = true;
      const token = this.$store.state.accessToken;
      const { _id, name, category, unit, hargaBeli, hargaJual } =
        this.editProduct;

      const updatedProduct = {
        name,
        category,
        unit,
        hargaBeli,
        hargaJual,
      };

      axios
        .put(`${process.env.VUE_APP_API_URL}/product/${_id}`, updatedProduct, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Produk berhasil diperbarui:", response.data);
          Swal.fire({
            icon: "success",
            title: "Product updated successfully!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          this.closeEditModal();
          this.fetchProducts();
          this.isLoadingEdit = false;
        })
        .catch((error) => {
          this.isLoadingEdit = false;
          console.error("Terjadi kesalahan saat memperbarui produk:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while updating the product.",
          });
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
#product {
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
          font-size: 2rem;
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

          .labelin {
            text-align: start;
            line-height: normal;
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
