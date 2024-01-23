<template>
  <div class="outer">
    <div class="inner">
      <h2>Page Not Found</h2>
      <p>Did you mean to go to the Editor?</p>
      <router-link to="/">
        <div class="route-button">
          Take me there!
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.outer {
  display: flex;
  justify-content: center;
  /* align-items: center; */
}

.inner {
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  box-shadow: 3px 4px 24px -10px rgba(0, 0, 0, 0.35);
}

.route-button {
  text-align: center;
  padding: 10px 0;
  border: 1px solid #ddd;
  transition: background-color 0.3s;
  border-radius: 7px;
  box-shadow: 7px 8px 24px -18px rgba(0, 0, 0, 0.35);
}

@media (hover: hover) {
  .route-button:hover {
    background-color: #e6e6e6;
  }
}
</style>