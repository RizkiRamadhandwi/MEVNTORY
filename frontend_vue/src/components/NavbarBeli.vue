<template>
  <div id="navbar">
    <nav class="navbar">
      <div class="navbar-toggle">
        <router-link to="/transaction/stockin">
          <i class="bx bx-left-arrow-alt"></i
        ></router-link>
      </div>
      <span class="brand"
        ><i class="icon"
          ><img src="@/assets/logo.png" alt="logo" width="30"
        /></i>
        MEVNTORY</span
      >
      <div class="navbar-menu">
        <!-- Item menu navbar -->
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "NavbarBeli",
};
</script>

<style lang="scss" scoped>
#navbar {
  height: 64px;
  z-index: 999;
  .navbar {
    position: -webkit-sticky;
    position: fixed;
    background: var(--light);
    height: 64px;
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    grid-gap: 28px;
    top: 0;
    left: 0;
    border-bottom: 3px solid var(--grey);
    z-index: 900;

    .brand {
      flex-shrink: 0;
      font-size: 24px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 60px;
      font-weight: 700;
      color: black;
      font-family: Georgia, "Times New Roman", Times, serif;
      position: sticky;
      top: 0;
      left: 0;
      z-index: 100;
      background: var(--light);
      transition: all 0.3s ease;
      padding: 0 6px;

      .icon {
        min-width: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 6px;
      }
    }

    // Navbar toggle style
    .navbar-toggle {
      cursor: pointer;
      font-size: 20px;
      transition: all 0.3s ease;
    }

    // Navbar menu style
    .navbar-menu {
      list-style-type: none;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    // Media query for smaller viewport
  }
}
</style>
