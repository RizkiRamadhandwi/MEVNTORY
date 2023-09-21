<template>
  <div id="login">
    <div class="container-xxl">
      <PWAPrompt />
      <div class="title">
        <h1>
          <img src="@/assets/logo.png" alt="logo" class="logo" />
          <strong>MEVNTORY</strong>
        </h1>
      </div>

      <!-- Login -->
      <div class="row align-items-center" id="login">
        <div class="col-lg-6 col-sm-12">
          <img
            src="@/assets/ilustrasi.png"
            alt="illustration"
            class="illustration"
          />
        </div>
        <div class="col-lg-6 col-sm-12">
          <form @submit.prevent="loginUser" class="login">
            <h2 class="text">Welcome Back!</h2>
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
            <!-- <router-link to="/forgot" class="link"
              >Forgot Password?</router-link
            > -->

            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading"
                ><i class="bx bx-loader-alt bx-spin"></i>
              </span>
              Login
            </button>

            <span class="social-text"
              >Belum Punya akun?
              <router-link to="/register" class="link"
                ><u> Sign up </u>
              </router-link></span
            >
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";
import PWAPrompt from "@/components/PWAPrompt.vue";

export default {
  name: "LoginView",
  components: {
    PWAPrompt,
  },
  data() {
    return {
      passwordFieldType: "password",
      email: "",
      password: "",
    };
  },

  computed: {
    isLoading() {
      return this.$store.state.isLoading;
    },
  },

  methods: {
    togglePasswordVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },

    loginUser() {
      this.$store.commit("SET_LOADING", true);
      axios
        .post(`${process.env.VUE_APP_API_URL}/auth/login`, {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.$store.commit("SET_LOADING", false);
          const token = response.data.token;
          this.$store.dispatch("setAccessToken", token);
          this.$router.push({ path: "/dashboard" });
          console.log(response);
        })
        .catch((error) => {
          this.$store.commit("SET_LOADING", false);
          // Menampilkan pesan error menggunakan SweetAlert2
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: "email or password is not registered",
          });
          console.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#login {
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

    .illustration {
      width: 100%;
      margin-bottom: 50px;
    }

    .login {
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
        height: 49px;
        border-radius: 49px;
        text-transform: uppercase;
        font-weight: 600;
        margin: 20px auto;
        cursor: pointer;
        transition: 0.5s;
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
    }
  }
}
</style>
