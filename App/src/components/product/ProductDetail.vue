<template>
  <div v-if="product">
    <v-row dense>
      <v-col>
        <v-row dense>
          <v-col
            cols="6"
            md="3"
          >
            <span class="font-weight-bold"># </span>
          </v-col>
          <v-col>{{ product.id }}</v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="6"
            md="3"
          >
            <span class="font-weight-bold">Libelle </span>
          </v-col>
          <v-col>{{ product.libelle }}</v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="6"
            md="3"
          >
            <span class="font-weight-bold">Référence </span>
          </v-col>
          <v-col>{{ product.reference }}</v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="6"
            md="3"
          >
            <span class="font-weight-bold">Catégorie </span>
          </v-col>
          <v-col>{{ product.category }}</v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="6"
            md="3"
          >
            <span class="font-weight-bold">Stock Total </span>
          </v-col>
          <v-col>{{ product.storageAmount }}</v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-row dense>
          <v-card>
            <v-card-title>
              Transaction
            </v-card-title>
            <v-card-text>
              <v-card
                v-for="(transaction, index) in product.transactions"
                :key="index"
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Transaction numéro #{{ transaction.id }} stock de {{ transaction.amount }} {{ product.libelle }} {{ product.reference }} le {{ transaction.transactionDateTime }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-card>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {ProductDto} from '@/dtos';

@Component
export default class ProductDetail extends Vue {
  @Prop({default: () => new ProductDto()})
  public product!: ProductDto | null;

  public loading: boolean = false;
}
</script>

<style lang="scss">
</style>
