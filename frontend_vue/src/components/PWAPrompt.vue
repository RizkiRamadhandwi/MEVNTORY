<template>
  <transition name="fade-up-in" appear>
    <div v-if="shown" class="pwa-prompt" :class="[{ shown }]">
      Add app to home screen?

      <button class="install-button btn btn-secondary" @click="installPWA">
        Install
      </button>

      <button class="close-button" @click="dismissPrompt">
        <span aria-hidden="true">×</span>
        <!-- Accessible text, so screen readers don't just read a symbol -->
        <span class="sr">Dismiss without installing</span>
      </button>
    </div>
  </transition>
</template>

<script>
export default {
  data: () => ({
    installEvent: undefined,
    shown: false,
  }),

  mounted() {
    // Menambahkan event listener untuk scroll pada elemen window
    window.addEventListener("scroll", this.handleScroll);
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    // Menghapus event listener saat komponen di-unmount
    window.removeEventListener("scroll", this.handleScroll);
    document.removeEventListener("click", this.handleClickOutside);
  },

  beforeMount() {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.installEvent = e;
      this.shown = true;
    });
  },

  methods: {
    handleScroll() {
      // Logika untuk menyembunyikan sidebar saat scrolling terjadi
      this.shown = false;
    },

    handleClickOutside() {
      this.shown = false;
    },
    installPWA() {
      this.installEvent.prompt();
      this.installEvent.userChoice.then((choice) => {
        this.dismissPrompt(); // Hide the banner once the user's clicked
        if (choice.outcome === "accepted") {
          // Do something additional if the user chose to install
        } else {
          // Do something additional if the user declined
        }
      });
    },

    dismissPrompt() {
      this.shown = false;
    },
  },
};
</script>

<style scoped lang="scss">
// If repurposing this component, you'll want to update the CSS variables.
.pwa-prompt {
  position: fixed;
  font-size: 1.2rem;
  z-index: 20;
  line-height: 1;
  font-family: Arial, Helvetica, sans-serif;
  top: 0;
  left: 0;
  width: 100vw;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4rem;
  background: var(--light-green);
  color: var(--dark);
  transform: translateY(0);
  margin: 0;

  .install-button {
    font-size: inherit;
    margin: 0 0 0 0.5rem;
    padding: 0.25em 0.5em;
    color: var(--light);
    border: 0;
    border-radius: 4px;
    line-height: 1;
    text-transform: uppercase;
    font-weight: 500;
  }

  .close-button {
    position: absolute;
    right: 0;
    top: -0.25rem;
    font-size: 3rem;
    background: transparent;
    border: 0;
    padding: 0 0.75rem;
    height: 100%;
    line-height: 1;
  }

  // For the accessible text. Most projects have their own .sr-only class or similar in the base styles.
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    left: -100vw;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
}

.fade-up-in-enter-active,
.fade-up-in-leave-active {
  transition: opacity 1s cubic-bezier(0.165, 0.84, 0.44, 1),
    transform 1s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: translateY(0);
}

.fade-up-in-enter,
.fade-up-in-leave-to {
  opacity: 0;
  transform: translateY(-4rem);
}
</style>
