<template>
  <div class="accueil">
    <v-container>
      <!-- <v-row>
        <v-col>
          <v-img
            class="my-6 mx-auto"
            max-height="198"
            max-width="303"
            src="@/assets/HacksisLogo.png"
          />
        </v-col>
      </v-row> -->
      <v-row justify="center">
        <v-col
          cols="12"
          md="3"
        >
          <v-card>
            <v-card-text>
              <v-responsive
                aspect-ratio="1"
              >
                <router-link :to="GoToProduct">
                  <img
                    alt="product"
                    src="@/assets/product.png"
                    width="200"
                    height="200"
                  />
                </router-link>
                <h1 class="mt-2">
                  Matériel
                </h1>
              </v-responsive>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
// import {useRouter} from 'vue-router/composables';

@Component
export default class HomeView extends Vue {
  // public readonly router = useRouter();

  // public GoToProduct = this.router.push({name: 'ProductView'});

  public GoToProduct = {name: 'ProductHomeView'};
}
</script>

<style>
.accueil {
  text-align: center;
  margin: 0px auto;
}

.accueil p {
  margin: 80px auto;
}

.logo {
  margin: 40px auto;
}
</style>
