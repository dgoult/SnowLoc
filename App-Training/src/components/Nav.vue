<template>
    <div>
        <v-app-bar color="white">
            <v-tabs>
                <v-tab to="/">HACKSISTRAING</v-tab>
            </v-tabs>
        </v-app-bar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Nav extends Vue {
}
</script>
<style>
.v-tab{
    text-transform: none;
}
</style>