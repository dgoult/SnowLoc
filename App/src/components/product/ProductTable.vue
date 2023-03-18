<template>
  <div>
    ProductTable
    <!-- <v-text-field
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
      :show-select="isVehiculeAssignmentVehiculeForm()"
      single-select
    >
      <template v-slot:[`item.birthDate`]="{ item }">
        <span>{{ item.birthDate | date }}</span>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <v-menu top offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              v-bind="attrs"
              v-on="on"
              icon
              small
              class="ma-0"
              ><v-icon>mdi-dots-vertical</v-icon></v-btn
              >
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
                <v-btn @click="removeProduct(item)" small plain tile>
                    Supprimer
                </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table> -->
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
// import {ApiService, LocalStorageService, DialogService, ConfigurationService, LogService} from '@/services';
// import {ProductDto} from '@/dtos';
// import type {Location} from 'vue-router';

@Component
export default class ProductTable extends Vue {
  // public search = '';

  // public loading: boolean = false;

  // public products: ProductDto[] = [];

  // public headers = [
  //   {text: 'Nom', value: 'lastname'},
  //   {text: 'Prénom', value: 'firstname'},
  //   {text: 'Ville', value: 'city'},
  //   {text: 'Date de naissance', value: 'birthDate', dataType: 'Date'},
  //   {text: 'Actions', value: 'action', sortable: false},
  // ];

  // // eslint-disable-next-line max-len
  // public apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

  // public offset: boolean = true;

  // public dialogueService = new DialogService();

  // public selectedProducts: ProductDto[] = [];

  // @Watch('selectedProducts')
  // @Emit('productSelected')
  // private onProductSelected(): ProductDto[] {
  //   return this.selectedProducts;
  // }

  // public isVehiculeAssignmentVehiculeForm(): boolean {
  //   return !!(this.$route.name === 'VehiculeAssignmentVehiculeForm');
  // }

  // public async created(): Promise<void> {
  //   try {
  //     this.products = await this.apiService.getProducts() || [];
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  // private async removeProduct(product: ProductDto): Promise<void> {
  //   if (!product.id ||
  //     !await this.dialogueService.confirm(`Supprimer ${product.firstname} ${product.lastname}`,
  //         'Êtes-vous sur de vouloir supprimer ce/cette conducteur(trice) ?',
  //         'Oui',
  //         'Annuler')) {
  //     return;
  //   }
  //   try {
  //     if (await this.apiService.deleteProduct(product.id) === true) {
  //       this.products = this.products.filter((d) => d !== product);
  //     }
  //   } finally {
  //     this.loading = false;
  //   }
  // }

  // private getProductEditRoute(product: ProductDto): Location | null {
  //   return product.id
  //       ? {name: 'ProductEdit', params: { productId: product.id.toString() }}
  //       : null;
  // }

  // private getProductDetailRoute(product: ProductDto): Location | null {
  //     return product.id
  //         ? { name: 'ProductDetail', params: { productId: product.id.toString() } }
  //         : null;
  // }
}

</script>

<style scoped>
</style>
