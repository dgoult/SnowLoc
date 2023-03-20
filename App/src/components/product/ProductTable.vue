<template>
  <div v-if="products.length > 0">
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Rechercher"
      single-line
      hide-details
    />
    <v-data-table
      v-model="selectedProducts"
      :headers="headers"
      :items="products"
      :search="search"
      :loading="loading"
      item-key="id"
      single-select
    >
      <template #[`item.action`]="{ item }">
        <v-menu
          top
          offset-x
        >
          <template #activator="{ on, attrs }">
            <v-btn
              text
              icon
              small
              class="ma-0"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn
                :to="getProductDetailRoute(item)"
                small
                plain
                tile
              >
                Details
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                :to="getProductEditRoute(item)"
                small
                plain
                tile
              >
                Editer
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                small
                plain
                tile
                @click="removeProduct(item)"
              >
                Supprimer
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Vue, Watch} from 'vue-property-decorator';
import {ApiService, DialogService} from '@/services';
import type {ProductDto} from '@/dtos';
import type {Location} from 'vue-router';

@Component
export default class ProductTable extends Vue {
  public search = '';

  public loading: boolean = false;

  public products: ProductDto[] | [] = [];

  public headers = [
    {text: '#', value: 'id'},
    {text: 'Libelle', value: 'libelle'},
    {text: 'Référence', value: 'reference'},
    {text: 'Catégorie', value: 'category'},
    {text: 'Stock', value: 'storageAmount'},
    {text: 'Actions', value: 'action', sortable: false},
  ];

  // eslint-disable-next-line max-len
  public apiService = new ApiService();

  public offset: boolean = true;

  public dialogueService = new DialogService();

  public selectedProducts: ProductDto[] | [] = [];

  @Watch('selectedProducts')
  @Emit('productSelected')
  private onProductSelected(): ProductDto[] {
    return this.selectedProducts;
  }

  public async created(): Promise<void> {
    try {
      this.products = await this.apiService.getProducts() || [];
    } finally {
      this.loading = false;
    }
  }

  public async removeProduct(product: ProductDto): Promise<void> {
    if (!product.id ||
      !await this.dialogueService.confirm(`Supprimer ${product.category} - ${product.libelle} - Ref:${product.reference}`,
          'Êtes-vous sur de vouloir supprimer ce matériel ?',
          'Oui',
          'Annuler')) {
      return;
    }
    try {
      await this.apiService.deleteProduct(product.id);

      this.products = this.products.filter((d) => d.id !== product.id);
    } finally {
      this.loading = false;
    }
  }

  public getProductEditRoute(product: ProductDto): Location | null {
    return product.id ? {name: 'ProductEdit', params: {productId: product.id.toString()}} : null;
  }

  public getProductDetailRoute(product: ProductDto): Location | null {
    return product.id ? {name: 'ProductDetail', params: {productId: product.id.toString()}} : null;
  }
}

</script>

<style scoped>
</style>
