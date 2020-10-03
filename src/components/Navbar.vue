<template>
<nav>
    <div class="nav-wrapper pink">
        <div class="container">
            <router-link to="/" class="brand-logo">Sercopi COMPRA</router-link>
        </div>
    </div>
</nav>
</template>

<script>
export default {
    name: "Navbar"
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    text-align: center;
}
</style>
