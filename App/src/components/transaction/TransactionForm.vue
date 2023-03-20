<template>
  <v-row>
    <v-col>
      <v-form
        v-if="transaction"
        ref="form"
      >
        <v-container>
          <v-text-field
            v-model="transaction.amount"
            class="label"
            :rules="amountRules"
            label="Nombre à ajouté"
          />
        </v-container>
      </v-form>
    </v-col>
    <v-col>
      <v-btn
        @click="emitTransaction"
      >
        Ajouter
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {Component, Ref, Vue} from 'vue-property-decorator';
import {TransactionDto} from '@/dtos';

@Component
export default class TransactionForm extends Vue {
  public transaction: TransactionDto= new TransactionDto();

  public loading: boolean = false;

  @Ref('form')
  private form!: { validate: () => boolean };

  private isValid(): boolean {
    return this.form ?
          this.form.validate() :
          false;
  }

  public async emitTransaction(): Promise<null> {
    if (!this.isValid() || !this.transaction) {
      return null;
    }
    try {
      this.loading = true;

      this.$emit('onTransaction', this.transaction);

      return null;
    } finally {
      this.loading = false;
    }
  }

  public amountRules = [
    (v: number) => !Number.isNaN(+v) || 'Ce champ doit être un nombre',
  ];
}
</script>
