<template>
  <div>
    <v-card>
      <v-card-title>
        <v-btn
          :to="ProductTableRoute"
          icon
          fab
          small
          class="mr-2"
        >
          <v-icon large>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        {{ title }}
        <v-spacer />
        <v-btn
          v-if="isEdit"
          color="success"
          @click.native="save"
        >
          Enregistrer
        </v-btn>
        <v-btn
          v-else
          :to="ProductEditRoute"
          color="primary"
        >
          Modifier
        </v-btn>
      </v-card-title>
      <v-card-text v-if="!loading">
        <router-view
          ref="child"
          :product="product"
          :transactions="transactions"
          :product-id="productId"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Ref} from 'vue-property-decorator';
import {ApiService} from '@/services';
import {ProductDto, TransactionDto} from '@/dtos';

@Component
export default class ProductFormDetail extends Vue {
  @Prop({default: null})
  public productId!: number | null;

  @Prop({default: false})
  public isEdit!: boolean;

  public transactions: TransactionDto[] | [] = [];

  @Ref('child')
  private child!: { save: () => ProductDto | null };

  private apiService = new ApiService();

  public product: ProductDto | null = null;

  public ProductTableRoute = {name: 'ProductTable'};

  public ProductEditRoute = {name: 'ProductEdit'};

  public loading: boolean = false;

  public async created(): Promise<void> {
    try {
      this.loading = true;
      if (this.productId) {
        this.product = await this.apiService.getProduct(this.productId);
        this.transactions = this.product && this.product.transactions ? this.product.transactions : [];
      } else {
        this.product = new ProductDto();
      }
    } finally {
      this.loading = false;
    }
  }

  public async save(): Promise<void> {
    const form = this.child;
    if (form && !!form.save) {
      const saveProduct: ProductDto | null = await form.save();

      if (saveProduct && saveProduct.id) {
        this.product = saveProduct;
        this.$router.push({name: 'ProductDetail', params: {productId: saveProduct.id.toString()}});
      }
    }
  }

  public get title(): string {
    switch (this.$route.name) {
      case 'ProductNew':
        return 'Nouveau matériel';
      case 'ProductDetail':
        return 'Détails du matériel';
      case 'ProductEdit':
        return 'Edition du matériel';
      default: return 'Matériel';
    }
  }
}
</script>
