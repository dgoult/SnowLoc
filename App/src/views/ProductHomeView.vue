<template>
  <v-container>
    <v-row>
      <v-col>
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
// import {useRouter} from 'vue-router/composables';

@Component
export default class ProductHomeView extends Vue {
}
</script>

