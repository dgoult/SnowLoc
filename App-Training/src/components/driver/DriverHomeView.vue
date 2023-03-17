<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        Liste de conducteurs <v-spacer />
                        <v-btn :to="NewDriverRoute" color="primary" dark>
                            Ajouter
                        </v-btn>
                    </v-card-title>
                    <v-card-text>
                        <router-view />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DriverHomeView extends Vue {
    private NewDriverRoute = { name: 'DriverNew' };
}
</script>