<template>
    <v-app>
        <v-main>
            <Nav />
            <router-view />
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue { }
</script>

<style>
#app {
    font-family: Avenir, Arial, Helvetica, sans-serif;
    margin: 0;
    background: rgb(245, 244, 244);
}
</style>