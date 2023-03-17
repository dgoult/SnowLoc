<template>
    <v-container>
        <v-row>
            <v-col>
                <router-view />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class VehiculeAssignmentView extends Vue { }
</script>