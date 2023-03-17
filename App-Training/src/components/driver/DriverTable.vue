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
            v-model="selectedDrivers"
            :headers="headers"
            :items="drivers"
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
                                :to="getDriverDetailRoute(item)"
                                small
                                plain
                                tile
                            >
                                Details
                            </v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn
                                :to="getDriverEditRoute(item)"
                                small
                                plain
                                tile
                            >
                                Editer
                            </v-btn>
                        </v-list-item>
                        <v-list-item>
                            <v-btn @click="removeDriver(item)" small plain tile>
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
import { DriverDto } from '@/dtos';
import { Location } from 'vue-router';

@Component
export default class DriverTable extends Vue {
    private search = ''

    private loading: boolean = false;

    private drivers: DriverDto[] = [];

    private headers = [
        { text: 'Nom', value: 'lastname' },
        { text: 'Prénom', value: 'firstname' },
        { text: 'Ville', value: 'city' },
        { text: 'Date de naissance', value: 'birthDate', dataType: 'Date' },
        { text: 'Actions', value: 'action', sortable: false }
    ]

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private offset: boolean = true;

    private dialogueService = new DialogService();

    private selectedDrivers: DriverDto[] = [];

    @Watch('selectedDrivers')
    @Emit('driverSelected')
    private onDriverSelected(): DriverDto[] {
        return this.selectedDrivers;
    }

    private isVehiculeAssignmentVehiculeForm(): boolean {
        return !!(this.$route.name === 'VehiculeAssignmentVehiculeForm');
    }

    private async created(): Promise<void> {
        try {
            this.drivers = await this.apiService.getDrivers() || [];
        } finally {
            this.loading = false;
        }
    }

    private async removeDriver(driver: DriverDto): Promise<void> {
        if (!driver.id ||
            !await this.dialogueService.confirm(`Supprimer ${driver.firstname} ${driver.lastname}`,
                'Êtes-vous sur de vouloir supprimer ce/cette conducteur(trice) ?',
                'Oui',
                'Annuler')) {
            return;
        }
        try {
            if (await this.apiService.deleteDriver(driver.id) === true) {
                this.drivers = this.drivers.filter(d => d !== driver);
            }
        } finally {
            this.loading = false;
        }
    }

    private getDriverEditRoute(driver: DriverDto): Location | null {
        return driver.id
            ? { name: 'DriverEdit', params: { driverId: driver.id.toString() } }
            : null;
    }

    private getDriverDetailRoute(driver: DriverDto): Location | null {
        return driver.id
            ? { name: 'DriverDetail', params: { driverId: driver.id.toString() } }
            : null;
    }
}

</script>

<style scoped>
</style>