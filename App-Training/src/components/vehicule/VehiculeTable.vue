<template>
    <div>
        <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Rechercher"
            single-line
            hide-details
        />
        <v-data-table
            v-model="selectedVehicules"
            :headers="headers"
            :items="vehicules"
            :search="search"
            :loading="loading"
            item-key="id"
            :show-select="isVehiculeAssignmentDriverForm()"
            single-select
        >
            <template v-slot:[`item.registrationDate`]="{ item }">
                <span>{{ item.registration.registrationDate | date }}</span>
            </template>
            <template v-slot:[`item.registrationNumber`]="{ item }">
                <span>{{ item.registration.registrationNumber }}</span>
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
                                :to="getVehiculeDetailRoute(item)"
                                small
                                plain
                                tile
                            >
                                Details
                            </v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn
                                :to="getVehiculeEditRoute(item)"
                                small
                                plain
                                tile
                            >
                                Editer
                            </v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn
                                @click="removeVehicule(item)"
                                small
                                plain
                                tile
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
import { Component, Vue, Emit, Watch } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { VehiculeDto } from '@/dtos';
import { Location } from 'vue-router';

@Component
export default class VehiculeTable extends Vue {
    private search = ''

    private loading: boolean = false;

    private NewVehiculeRoute = { name: 'VehiculeNew' };

    private vehicules: VehiculeDto[] = [];

    private headers = [
        { text: 'Marque', value: 'brand' },
        { text: 'Modèle', value: 'model' },
        { text: 'Catégorie', value: 'category' },
        { text: 'Date d\'enregistrement de l\'imatriculation', value: 'registrationDate', dataType: 'Date' },
        { text: 'Plaque d\'imatriculation', value: 'registrationNumber' },
        { text: 'Actions', value: 'action', sortable: false }
    ]

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private offset: boolean = true;

    private dialogueService = new DialogService();

    private selectedVehicules: VehiculeDto[] = [];

    @Watch('selectedVehicules')
    @Emit('vehiculeSelected')
    private onVehiculeSelected(): VehiculeDto[] {
        return this.selectedVehicules;
    }

    private isVehiculeAssignmentDriverForm(): boolean {
        return !!(this.$route.name === 'VehiculeAssignmentDriverForm');
    }

    private async created(): Promise<void> {
        try {
            this.vehicules = await this.apiService.getVehicules() || [];
        } finally {
            this.loading = false;
        }
    }

    private async removeVehicule(vehicule: VehiculeDto): Promise<void> {
        if (!vehicule.id ||
            !await this.dialogueService.confirm(`Supprimer ${vehicule.brand} ${vehicule.model}`,
                'Êtes-vous sur de vouloir supprimer ce véhicule ?',
                'Oui',
                'Annuler')) {
            return;
        }
        try {
            if (await this.apiService.deleteVehicule(vehicule.id) === true) {
                this.vehicules = this.vehicules.filter(v => v !== vehicule);
            }
        } finally {
            this.loading = false;
        }
    }

    private getVehiculeDetailRoute(vehicule: VehiculeDto): Location | null {
        return vehicule.id
            ? { name: 'VehiculeDetail', params: { vehiculeId: vehicule.id.toString() } }
            : null;
    }

    private getVehiculeEditRoute(vehicule: VehiculeDto): Location | null {
        return vehicule.id
            ? { name: 'VehiculeEdit', params: { vehiculeId: vehicule.id.toString() } }
            : null;
    }
}

</script>

<style scoped>
</style>