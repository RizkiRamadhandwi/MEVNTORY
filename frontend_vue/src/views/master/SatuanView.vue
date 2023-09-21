<template>
  <div id="unit">
    <navbar-menu />

    <div class="main">
      <main>
        <h1 class="title">Data Satuan</h1>

        <ol class="breadcrumb">
          <li class="breadcrumb-item">Home</li>
          <li class="breadcrumb-item">Data Master</li>
          <li class="breadcrumb-item active" aria-current="page">Satuan</li>
        </ol>

        <!-- DataTales Example -->
        <div class="card shadow mb-4 mt-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Daftar Satuan</h6>
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
                    <th style="min-width: 100px" class="text-center">
                      Nama Satuan
                    </th>
                    <th style="min-width: 100px" class="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(unit, index) in units" :key="unit._id">
                    <td class="text-center fw-medium">{{ index + 1 }}</td>
                    <td
                      style="text-transform: capitalize"
                      class="text-center fw-medium"
                    >
                      {{ unit.name }}
                    </td>
                    <td class="text-center fw-medium">
                      <button
                        class="btn btn-secondary btn-sm me-1 rounded-circle"
                        @click="openEditModal(unit)"
                      >
                        <i class="bx bxs-edit"></i>
                      </button>
                      <button
                        class="btn btn-danger btn-sm rounded-circle"
                        @click="deleteUnit(unit._id)"
                      >
                        <i class="bx bx-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                class="btn btn-primary float-end position-fixed bottom-0 end-0 m-3 rounded-circle"
                @click="openAddModal"
              >
                <i class="bx bx-plus bx-md"></i>
              </button>
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
import FooterMenu from "@/components/FooterMenu.vue";
import LoadIng from "@/components/LoadIng.vue";

export default {
  components: { NavbarMenu, FooterMenu, LoadIng },

  data() {
    return {
      units: [],
      isLoading: true,
      modalOpen: false,
      isEditModal: false,
      unitForm: {
        id: "",
        name: "",
      },
      dataTable: null,
    };
  },

  computed: {
    user() {
      return this.$store.state.user;
    },
  },

  created() {
    this.fetchUnits();
  },

  mounted() {
    this.initDataTable();
  },

  methods: {
    fetchUnits() {
      const token = this.$store.state.accessToken;
      axios
        .get(`${process.env.VUE_APP_API_URL}/unit/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.units = response.data;
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

    initDataTable() {
      this.dataTable = $("#dataTable").DataTable({
        responsive: true,
      });
    },

    openAddModal() {
      Swal.fire({
        title: "Tambah Satuan",
        html: `
          <input
            id="swal-input1"
            class="swal2-input"
            placeholder="Nama Satuan"
            style="text-transform: capitalize"
            required
          />
        `,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        focusConfirm: false,
        preConfirm: () => {
          const name = Swal.getPopup().querySelector("#swal-input1").value;
          if (!name) {
            Swal.showValidationMessage("Please enter a satuan name");
          }
          return { name };
        },
      }).then(({ value }) => {
        if (value) {
          this.addUnit(value.name);
        }
      });
    },

    addUnit(name) {
      const token = this.$store.state.accessToken;
      const newUnit = { name };

      axios
        .post(`${process.env.VUE_APP_API_URL}/unit/`, newUnit, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          Swal.fire({
            icon: "success",
            title: "Satuan Baru Berhasil Ditambahkan!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          this.fetchUnits();
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Terjadi Kesalahan dalam menambahkan satuan",
          });
          console.error("Error adding unit:", error);
        });
    },

    openEditModal(unit) {
      Swal.fire({
        title: "Edit Satuan",
        html: `
          <input
            id="swal-input1"
            class="swal2-input"
            value="${unit.name}"
            placeholder="Nama Satuan"
            style="text-transform: capitalize"
            required
          />
        `,
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
        focusConfirm: false,
        preConfirm: () => {
          const name = Swal.getPopup().querySelector("#swal-input1").value;
          if (!name) {
            Swal.showValidationMessage("Please enter a satuan name");
          }
          return { name };
        },
      }).then(({ value }) => {
        if (value) {
          this.editUnit(unit._id, value.name);
        }
      });
    },

    editUnit(unitId, name) {
      const token = this.$store.state.accessToken;

      axios
        .put(
          `${process.env.VUE_APP_API_URL}/unit/${unitId}`,
          { name },
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
            title: "Satuan berhasil Diupdate",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          this.fetchUnits();
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Terjadi Kesalahan dalam mengedit satuan",
          });
          console.error("Error updating unit:", error);
        });
    },

    deleteUnit(unitId) {
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
            .delete(`${process.env.VUE_APP_API_URL}/unit/${unitId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              console.log(response);
              Swal.fire({
                icon: "success",
                title: "Menghapus satuan berhasil!",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
              });
              this.fetchUnits();
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: "Terjadi Kesalahan dalam menghapus satuan.",
              });
              console.error("Error deleting unit:", error);
            });
        }
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
#unit {
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
  }
}
</style>
