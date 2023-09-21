import { createStore } from "vuex";

export default createStore({
  state: {
    isLoading: false,
    accessToken: null,
    user: null,
    keranjangLuarGalaxy:
      JSON.parse(sessionStorage.getItem("keranjangLuarGalaxy")) || [],
    cart: JSON.parse(sessionStorage.getItem("cart")) || [],
  },
  getters: {
    getCart(state) {
      return state.cart;
    },
    getkeranjangLuarGalaxy(state) {
      return state.keranjangLuarGalaxy;
    },
  },
  mutations: {
    keranjangKeluar(state, product) {
      const existingProduct = state.keranjangLuarGalaxy.find(
        (item) => item.productId === product.productId
      );

      if (!existingProduct) {
        state.keranjangLuarGalaxy.push(product);
        sessionStorage.setItem(
          "keranjangLuarGalaxy",
          JSON.stringify(state.keranjangLuarGalaxy)
        ); // Simpan ke sessionStorage
      } else {
        let cartBaru = state.keranjangLuarGalaxy.filter(
          (item) => item.productId !== existingProduct.productId
        );
        cartBaru.push(product);
        // console.log(cartBaru);
        state.keranjangLuarGalaxy = cartBaru;

        sessionStorage.setItem(
          "keranjangLuarGalaxy",
          JSON.stringify(state.keranjangLuarGalaxy)
        ); // Simpan ke sessionStorage
      }
    },

    hapusItemKeluar(state, productId) {
      state.keranjangLuarGalaxy = state.keranjangLuarGalaxy.filter(
        (item) => item.productId !== productId
      );

      sessionStorage.setItem(
        "keranjangLuarGalaxy",
        JSON.stringify(state.keranjangLuarGalaxy)
      ); // Simpan ke sessionStorage
    },
    clearkeranjangLuarGalaxy(state) {
      state.keranjangLuarGalaxy = [];
    },
    addToCart(state, product) {
      console.log("Adding to cart");
      const existingProduct = state.cart.find(
        (item) => item.productId === product.productId
      );

      if (!existingProduct) {
        state.cart.push(product);
        sessionStorage.setItem("cart", JSON.stringify(state.cart)); // Simpan ke sessionStorage
      } else {
        let cartBaru = state.cart.filter(
          (item) => item.productId !== existingProduct.productId
        );
        cartBaru.push(product);
        // console.log(cartBaru);
        state.cart = cartBaru;
        // state.cart = [];

        sessionStorage.setItem("cart", JSON.stringify(state.cart)); // Simpan ke sessionStorage
      }
    },

    removeItemCart(state, productId) {
      state.cart = state.cart.filter((item) => item.productId !== productId);

      sessionStorage.setItem("cart", JSON.stringify(state.cart)); // Simpan ke sessionStorage
    },
    clearCart(state) {
      state.cart = [];
    },

    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading;
    },
    setAccessToken(state, token) {
      state.accessToken = token;
    },
    setUser(state, user) {
      state.user = user;
    },
    clearAccessToken(state) {
      state.accessToken = null;
    },
    clearAuthData(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
  actions: {
    keranjangKeluar({ commit, state }, product) {
      const existingProduct = state.keranjangLuarGalaxy.find(
        (item) => item.productId === product.productId
      );

      if (!existingProduct) {
        commit("keranjangKeluar", product);
      }
      commit("keranjangKeluar", product);
    },
    hapusItemKeluar({ commit }, productId) {
      commit("removeItemCart", productId);
    },

    addToCart({ commit, state }, product) {
      const existingProduct = state.cart.find(
        (item) => item.productId === product.productId
      );

      if (!existingProduct) {
        commit("addToCart", product);
      }
      commit("addToCart", product);
    },
    removeItemCart({ commit }, productId) {
      commit("removeItemCart", productId);
    },

    setAccessToken({ commit }, token) {
      commit("setAccessToken", token);
    },
    setUser({ commit }, user) {
      commit("setUser", user);
    },
    clearAccessToken({ commit }) {
      commit("clearAccessToken");
    },
    logout({ commit }) {
      // Hapus token akses dan data pengguna dari state
      commit("clearAuthData");
      // Hapus token akses dari localStorage
      sessionStorage.removeItem("accessToken");
    },
  },
  modules: {},
});
