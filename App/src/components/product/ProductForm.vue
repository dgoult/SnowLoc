<template>
  <v-form
    v-if="product"
    ref="form"
  >
    <v-container>
      <v-text-field
        v-model="product.libelle"
        class="label"
        :rules="libelleRules"
        label="Libelle"
      />
      <v-text-field
        v-model="product.reference"
        class="label"
        :rules="referenceRules"
        label="Référence"
      />
      <v-text-field
        v-model="product.category"
        class="label"
        :rules="categoryRules"
        label="Catégorie"
      />
      <v-text-field
        v-model="product.storageAmount"
        class="label"
        label="Stock Total"
        disabled
      />
      <v-card>
        <v-card-title>
          Transaction
        </v-card-title>
        <v-card-text>
          <TransactionForm
            @onTransaction="onTransaction"
          />
          <v-card>
            <v-list-item
              v-for="(transaction, index) in product.transactions"
              :key="index"
            >
              <v-list-item-avatar>
                <img
                  alt="transaction"
                  src="@/assets/transaction.png"
                  width="200"
                  height="200"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  Transaction numéro #{{ transaction.id }} | Stock de {{ transaction.amount }} : {{ product.libelle }}
                </v-list-item-title>
                <v-list-item-subtitle v-if="transaction.transactionDateTime">
                  Le {{ transaction.transactionDateTime }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-responsive>
                  <v-btn @click="deleteTransaction(index)">
                    <img
                      alt="trash"
                      src="@/assets/trash.png"
                      width="25"
                      height="25"
                    />
                  </v-btn>
                </v-responsive>
              </v-list-item-action>
            </v-list-item>
          </v-card>
        </v-card-text>
      </v-card>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from 'vue-property-decorator';
import {ApiService, DialogService} from '@/services';
import {ProductDto, TransactionDto} from '@/dtos';
import {DialogLevel} from '@/enums';

@Component
export default class ProductForm extends Vue {
  @Prop({default: () => new ProductDto()})
  public product!: ProductDto | null;

  private apiService = new ApiService();

  public loading: boolean = false;

  private dialogService = new DialogService();

  public onTransaction(transaction: TransactionDto): void {
    this.product?.transactions?.push(transaction);
  }

  public deleteTransaction(transactionIndex: number): void {
    this.product?.transactions?.splice(transactionIndex);
  }

  @Ref('form')
  private form!: { validate: () => boolean };

  private isValid(): boolean {
    return this.form ?
          this.form.validate() :
          false;
  }

  public async save(): Promise<ProductDto | null> {
    if (!this.isValid() || !this.product) {
      return null;
    }
    try {
      this.loading = true;
      const saveProduct: ProductDto | null = await this.apiService.insertProduct(this.product);
      if (saveProduct && saveProduct.id) {
        const message = this.product.id ?
                  'Le matériel à été correctement modifié' :
                  'Le matériel à été correctement ajouté';
        this.dialogService.toast(message, DialogLevel.Success);

        return saveProduct;
      }
      return null;
    } finally {
      this.loading = false;
    }
  }

  public libelleRules = [
    (v: string) => !!v || 'Ce champ est requis',
    (v: string) => (v && v.length <= 50) || 'Ce champ est trop long',
  ];

  public referenceRules = [
    (v: string) => !!v || 'Ce champ est requis',
    (v: string) => (v && v.length <= 50) || 'Ce champ est trop long',
  ];

  public categoryRules = [
    (v: string) => !!v || 'Ce champ est requis',
    (v: string) => (v && v.length <= 50) || 'Ce champ est trop long',
  ];

  public amountRules = [
    (v: number) => !!v || 'Ce champ est requis',
    (v: string) => (v && v.length <= 50) || 'Ce champ est trop long',
  ];
}
</script>

<style lang="scss">
.productFormulaire {
  max-width: 700px;
  margin: 30px auto;
  background: white;
  text-align: left;
  padding: 40px 100px;
  border-radius: 10px;
}

input {
  display: block;
  padding: 10px 20px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}
</style>
