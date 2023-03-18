<template>
  <v-card class="container">
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <router-view />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';


@Component
export default class HomeView extends Vue {
  @Prop()
  public title: string = 'Page d\'acceuil';
}
</script>
