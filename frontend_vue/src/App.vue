<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css");
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap");
:root {
  --primary: #0d6efd;
  --primary-alt: #22c55e;
  --grey: #64748b;
  --dark-alt: #334155;
  --grey: #f1f0f6;
  --dark-grey: #8d8d8d;
  --light: #fff;
  --dark: #000;
  --green: #81d43a;
  --light-green: #e3ffcb;
  --blue: #1775f1;
  --light-blue: #d0e4ff;
  --dark-blue: #0c5fcd;
  --red: #fc3b56;
  --secondary: #6c757d;
  --danger: #dc3545;
  --success: #198754;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  background-color: var(--grey);
  display: flex;
  flex-direction: column;
}
</style>
