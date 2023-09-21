<template>
  <div id="profile">
    <NavbarMenu />
    <div class="main">
      <main>
        <h1 class="title">User Profile</h1>

        <ol class="breadcrumb">
          <li class="breadcrumb-item">Home</li>
          <li class="breadcrumb-item">User</li>
          <li class="breadcrumb-item active" aria-current="page">
            User Profile
          </li>
        </ol>

        <div class="card p-2 mt-4 mb-4 shadow-sm border-primary">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4 mb-4 mb-md-0">
                <div class="d-flex flex-column align-items-center text-center">
                  <div class="mt-3">
                    <img
                      v-if="user && user.photo"
                      :src="user.photo"
                      alt=""
                      class="rounded-circle cropped-photo mb-2"
                      height="150"
                    />
                    <h4
                      class="text-capitalize text-align-center"
                      v-if="user && user.namaLengkap"
                    >
                      {{ user.namaLengkap }}
                    </h4>

                    <button
                      class="btn btn-primary mt-3"
                      @click="openEditModal(user)"
                    >
                      <i class="bx bxs-edit"></i> Edit Profile
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <div class="row">
                    <div class="col-4">
                      <h6 class="mb-0">Full Name</h6>
                    </div>
                    <div
                      class="col-8 text-secondary text-capitalize"
                      v-if="user && user.namaLengkap"
                    >
                      {{ user.namaLengkap }}
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-4">
                      <h6 class="mb-0">Email</h6>
                    </div>
                    <div class="col-8 text-secondary" v-if="user && user.email">
                      {{ user.email }}
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-4">
                      <h6 class="mb-0">Phone</h6>
                    </div>
                    <div class="col-8 text-secondary" v-if="user && user.phone">
                      {{ user.phone }}
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-4">
                      <h6 class="mb-0">Name Company</h6>
                    </div>
                    <div
                      class="col-8 text-secondary text-capitalize"
                      v-if="user && user.companyName"
                    >
                      {{ user.companyName }}
                    </div>
                  </div>
                  <hr />
                  <div class="row">
                    <div class="col-4">
                      <h6 class="mb-0">Address</h6>
                    </div>
                    <div
                      class="col-8 text-secondary text-capitalize"
                      v-if="user && user.address"
                    >
                      {{ user.address }}
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="editModalOpen" class="modal">
          <div class="modal-content">
            <h2 class="text mb-2">Edit User Profile</h2>
            <form @submit.prevent="updateUser">
              <div class="d-flex flex-column align-items-center text-center">
                <img
                  v-if="previewPhoto"
                  :src="previewPhoto"
                  alt=""
                  class="rounded-circle edit-photo mb-2 m-auto"
                  height="100"
                />
              </div>
              <div class="input-field">
                <label class="label">Photo</label>
                <label class="label">:</label>
                <input type="file" @change="handlePhotoUpload" class="input" />
              </div>
              <div class="input-field">
                <label class="label">Full Name</label>
                <label class="label">:</label>
                <input
                  type="text"
                  v-model="editUser.namaLengkap"
                  class="input"
                  required
                />
              </div>
              <div class="input-field">
                <label class="label">Email</label>
                <label class="label">:</label>
                <input
                  type="email"
                  v-model="editUser.email"
                  class="input text-lowercase"
                  required
                />
              </div>
              <div class="input-field">
                <label class="labelin">Phone Number</label>
                <label class="label">:</label>
                <input
                  type="text"
                  v-model="editUser.phone"
                  class="input"
                  required
                />
              </div>
              <div class="input-field">
                <label class="labelan">Company Name</label>
                <label class="label">:</label>
                <input
                  type="text"
                  v-model="editUser.companyName"
                  class="input"
                  required
                />
              </div>
              <div class="input-field">
                <label class="label">Address</label>
                <label class="label">:</label>
                <textarea
                  type="text"
                  v-model="editUser.address"
                  class="input"
                  required
                ></textarea>
              </div>

              <div class="btn-field">
                <button class="btn btn-primary" type="submit">Save</button>
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
import axios from "axios";
import Swal from "sweetalert2";
import NavbarMenu from "@/components/NavbarMenu.vue";
import FooterMenu from "@/components/FooterMenu.vue";

export default {
  name: "ProfileView",
  components: { NavbarMenu, FooterMenu },
  data() {
    return {
      users: [],
      editModalOpen: false,
      editUser: {
        photo: "",
        initialPhoto: "",
        namaLengkap: "",
        email: "",
        phone: "",
        companyName: "",
        address: "",
      },
      previewPhoto: "",
    };
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
    fetchUserData() {
      const token = this.$store.state.accessToken;

      axios
        .get(`${process.env.VUE_APP_API_URL}/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.$store.commit("setUser", response.data);
        })
        .catch((error) => {
          // Tangani error jika terjadi
          console.error(error);
          if (error.response && error.response.status === 401) {
            this.$router.push({ path: "/login" });
          }
        });
    },
    openEditModal(user) {
      this.editUser = {
        ...user,
        initialPhoto: user.photo,
      };
      this.editModalOpen = true;
    },
    closeEditModal() {
      this.previewPhoto = "";
      this.editModalOpen = false;
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0] || null;
      this.editUser.photo = file;
      if (file) {
        this.previewPhoto = URL.createObjectURL(file);
      } else {
        this.previewPhoto = "";
      }
    },
    updateUser() {
      const token = this.$store.state.accessToken;
      const formData = new FormData();
      if (this.editUser.photo !== null) {
        formData.append("photo", this.editUser.photo);
      }
      formData.append("namaLengkap", this.editUser.namaLengkap);
      formData.append("email", this.editUser.email);
      formData.append("phone", this.editUser.phone);
      formData.append("companyName", this.editUser.companyName);
      formData.append("address", this.editUser.address);

      axios
        .put(`${process.env.VUE_APP_API_URL}/user/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("User berhasil diperbarui:", response.data);
          Swal.fire({
            icon: "success",
            title: "user data updated successfully!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
          this.user = response.data;
          this.fetchUserData();
          this.closeEditModal();
        })
        .catch((error) => {
          console.error("Terjadi kesalahan saat memperbarui produk:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while updating the user data.",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#profile {
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

    .cropped-photo {
      width: 150px;
      object-fit: cover;
      object-position: center;
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
        max-width: 500em;

        .edit-photo {
          width: 100px;
          object-fit: cover;
          object-position: center;
          justify-items: center;
        }

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
            font-size: 1em;
          }

          .labelin {
            text-align: start;
            line-height: 55px;
            font-size: 1em;

            @media (max-width: 398px) {
              line-height: normal;
            }
          }

          .labelan {
            text-align: start;
            line-height: 55px;
            font-size: 1em;

            @media (max-width: 418px) {
              line-height: normal;
            }
          }

          .input {
            background: whitesmoke;
            border: none;
            line-height: 1;
            font-weight: 600;
            text-transform: capitalize;
            font-size: 1.1rem;
            padding: 16px 10px;
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
