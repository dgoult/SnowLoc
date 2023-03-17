<template>
    <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
        :top="position === 'top'"
        :bottom="position === 'bottom'"
        :left="position === 'left'"
        :right="position === 'right'"
        :color="level"
        :multi-line="!!title"
        :vertical="!!title"
    >
        <div v-if="title" v-html="title" />
        <div v-html="getText()" />
        <v-btn v-if="closable" tile icon color="white" @click="onClose">
            <v-icon>clear</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script lang="ts">
import { DialogLevel, Position } from '@/enums';
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Snackbar extends Vue {
    @Prop()
    public title?: string;

    @Prop()
    public text?: string;

    @Prop({ default: DialogLevel.Info })
    public level!: DialogLevel;

    @Prop({ default: 2000 })
    public timeout!: number;

    @Prop({ default: false })
    public closable!: boolean;

    @Prop({ default: Position.Bottom })
    public position!: Position;

    private snackbar: boolean = true;

    private onClose(): void {
        this.snackbar = false;
    }

    private getText(): string {
        return this.text
            ? this.text.replace(/(?:\r\n|\r|\n)/g, '<br/>')
            : '';
    }
}
</script>

<style lang="scss" scoped>
span {
    font-size: 1rem;
}
</style>