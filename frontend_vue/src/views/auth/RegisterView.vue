<template>
  <div id="register">
    <div class="container-xxl">
      <div class="title">
        <h1>
          <img src="@/assets/logo.png" alt="logo" class="logo" /><strong
            >MEVNTORY</strong
          >
        </h1>
      </div>

      <div class="row align-items-center">
        <div class="col-lg-6 col-sm-12">
          <form @submit.prevent="registerUser" class="register">
            <h2 class="text">Get Started</h2>
            <p class="social-text">
              Sudah Punya akun?
              <router-link to="/login" class="link">
                <U>Sign In</U></router-link
              >
            </p>
            <div class="input-field">
              <i class="bx bxs-user"></i>
              <input
                type="text"
                v-model="namaLengkap"
                required
                placeholder="Nama Lengkap"
                class="input"
                style="text-transform: capitalize"
              />
            </div>
            <div class="input-field">
              <i class="bx bxs-envelope"></i>
              <input
                type="email"
                v-model="email"
                required
                placeholder="Email"
                class="input"
              />
            </div>
            <div class="input-field">
              <i class="bx bxs-lock-alt"></i>
              <input
                v-model="password"
                required
                placeholder="Password"
                class="input"
                :type="passwordFieldType"
              />
              <span class="password-toggle" @click="togglePasswordVisibility">
                <i
                  :class="
                    passwordFieldType === 'password'
                      ? 'bx bxs-hide'
                      : 'bx bxs-show'
                  "
                ></i>
              </span>
            </div>
            <div class="input-field">
              <i class="bx bxs-lock-alt"></i>
              <input
                :type="passwordConfimFieldType"
                v-model="confirmPassword"
                required
                class="input"
                placeholder="Konfirmasi Password"
              />
              <span
                class="password-toggle"
                @click="togglePasswordConfimVisibility"
              >
                <i
                  :class="
                    passwordConfimFieldType === 'password'
                      ? 'bx bxs-hide'
                      : 'bx bxs-show'
                  "
                ></i>
              </span>
            </div>
            <button
              type="submit"
              class="btn btn-secondary"
              :disabled="isLoading"
            >
              <span v-if="isLoading"
                ><i class="bx bx-loader-alt bx-spin"></i>
              </span>
              Buat Akun
            </button>
          </form>
        </div>
        <div class="col-lg-6 col-sm-12">
          <img
            src="@/assets/ilustrasi.png"
            alt="illustration"
            class="illustration"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
export default {
  name: "SignUp",
  data() {
    return {
      passwordFieldType: "password",
      passwordConfimFieldType: "password",
      namaLengkap: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
  },
  methods: {
    registerUser() {
      this.$store.commit("SET_LOADING", true);
      // Memastikan password dan konfirmasi password sama
      if (this.password !== this.confirmPassword) {
        this.$store.commit("SET_LOADING", false);
        Swal.fire({
          icon: "error",
          title: "Oops!! Error",
          text: "Password and Confrim Password Not Match!",
        });
        return;
      }
      // Mengirimkan data registrasi ke API
      axios
        .post(`${process.env.VUE_APP_API_URL}/auth/register`, {
          namaLengkap: this.namaLengkap,
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.$store.commit("SET_LOADING", false);
          this.$router.push({ path: "/login" });
          // Menampilkan pesan sukses menggunakan SweetAlert2
          Swal.fire({
            icon: "success",
            title: "Register Successfully",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          }),
            console.log(response);
        })
        .catch((error) => {
          this.$store.commit("SET_LOADING", false);
          // Menampilkan pesan error menggunakan SweetAlert2
          Swal.fire({
            icon: "error",
            title: "Opps!! Error",
            text: "Please Try Again",
          });
          console.error(error);
        });
    },

    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },

    togglePasswordConfimVisibility() {
      this.passwordConfimFieldType =
        this.passwordConfimFieldType === "password" ? "text" : "password";
    },
  },
};
</script>

<style lang="scss" scoped>
#register {
  background-color: #faedfe;

  .container-xxl {
    font-family: Georgia, serif;
    min-height: 100vh;

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 20px;

      .logo {
        width: 1.8em;
        margin: 10px;
      }
    }

    .register {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-bottom: 20px;

      .text {
        font-size: 2em;
        color: #444;
        margin-top: 20px;
      }
      .social-text {
        font-size: 1em;
        color: #444;
        opacity: 0.6;

        .link {
          color: black;
          text-decoration: none;
          margin: 5px;
          font-weight: 600;
          opacity: 1;
        }
      }

      .input-field {
        max-width: 400px;
        width: 90%;
        background-color: #fff;
        margin: 10px auto;
        height: 55px;
        border-radius: 55px;
        display: grid;
        grid-template-columns: 15% 75% 10%;
        padding: 0 0.4rem;
        position: relative;

        .bx {
          text-align: center;
          line-height: 55px;
          color: #acacac;
          transition: 0.5s;
          font-size: 1.1rem;
        }
        .input {
          font-family: Arial, Helvetica, sans-serif;
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 600;
          font-size: 1.1rem;
          color: #333;

          &::placeholder {
            color: #aaa;
            font-weight: 500;
          }
        }
      }

      .btn {
        max-width: 300px;
        width: 90%;
        align-items: center;
        border: none;
        outline: none;
        height: 50px;
        border-radius: 50px;
        font-weight: 500;
        margin: 20px auto;
        cursor: pointer;
        transition: 0.5s;
      }
    }

    .illustration {
      width: 100%;
      margin-bottom: 50px;
    }
  }
}
</style>
