<template>
  <v-dialog
    v-model="dialog"
    max-width="450"
  >
    <v-card tile>
      <v-card-title
        style="word-break: normal"
        v-html="title"
      />
      <v-card-text class="text-md-left">
        <div v-html="getText()"></div>
        <component
          :is="component"
          v-if="component"
          v-bind="componentProps"
          class="mt-4"
          @onCancel="onCancel"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="cancelText"
          text
          @click="onCancel"
        >
          {{ cancelText }}
        </v-btn>
        <v-btn
          v-if="cancelText"
          color="green darken-1"
          text
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>
        <v-btn
          v-else
          color="blue darken-1"
          text
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Vue, Component, Watch, Prop} from 'vue-property-decorator';

@Component
export default class Modal extends Vue {
    @Prop()
  public title?: string;

    @Prop()
    public text?: string;

    @Prop()
    public confirmText?: string;

    @Prop()
    public cancelText?: string;

    @Prop()
    public component?: string;

    @Prop()
    public componentProps?: Record<string, unknown>;

    public dialog: boolean = true;

    private confirm: boolean = false;

    @Watch('dialog')
    private onDialogChanged(val: boolean, oldVal: boolean): void {
      if (!val) {
        this.$root.$emit('dialog', this.confirm);
      }
    }

    public onConfirm(): void {
      this.confirm = true;
      this.dialog = false;
    }

    public onCancel(): void {
      this.dialog = false;
    }

    public getText(): string {
      return this.text ? this.text.replace(/(?:\r\n|\r|\n)/g, '<br/>') : '';
    }
}
</script>
