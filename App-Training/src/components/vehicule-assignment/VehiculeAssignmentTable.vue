<template>
    <v-card>
        <v-card-title> Liste des affectations </v-card-title>
        <v-card-text>
            <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Rechercher"
                single-line
                hide-details
            />
            <v-skeleton-loader v-if="loading" type="table-row@5" />
            <v-data-table
                v-else
                :headers="headers"
                :items="vehiculeAssignments"
                :search="search"
            >
                <template v-slot:[`item.beginDate`]="{ item }">
                    <span>{{ item.period.beginDate | date }}</span>
                </template>
                <template v-slot:[`item.endDate`]="{ item }">
                    <v-chip color="red" v-if="!item.period.endDate"> Véhicule non restituer </v-chip>
                    <v-chip color="green" v-else>
                        {{ item.period.endDate | date }}
                    </v-chip>
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
                                    :to="getVehiculeAssignmentDetailRoute(item)"
                                    small
                                    plain
                                    tile
                                >
                                    Details
                                </v-btn>
                            </v-list-item>
                            <v-list-item v-if="!item.period.endDate">
                                <v-btn
                                    :to="getVehiculeAssignmentEditRoute(item)"
                                    small
                                    plain
                                    tile
                                >
                                    Restituer
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { VehiculeAssignmentDto } from '@/dtos';
import { Location } from 'vue-router';

@Component
export default class VehiculeAssignmentTable extends Vue {
    private search = ''

    private loading: boolean = false;

    private NewVehiculeAssignmentRoute = { name: 'VehiculeAssignmentNew' };

    private vehiculeAssignments: VehiculeAssignmentDto[] = [];

    private headers = [
        { text: 'Véhicule', value: 'vehiculeName' },
        { text: 'Conducteur', value: 'driverName' },
        { text: 'Affecté le', value: 'beginDate' },
        { text: 'Restituté le', value: 'endDate' },
        { text: 'Détails', value: 'action', sortable: false }
    ]

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private offset: boolean = true;

    private dialogueService = new DialogService();

    private async created(): Promise<void> {
        try {
            this.loading = true;
            this.vehiculeAssignments = await this.apiService.getVehiculeAssignments() || [];
        } finally {
            this.loading = false;
        }
    }

    private getVehiculeAssignmentDetailRoute(vehiculeAssignment: VehiculeAssignmentDto): Location | null {
        return vehiculeAssignment.id
            ? { name: 'VehiculeAssignmentDetail', params: { vehiculeAssignmentId: vehiculeAssignment.id.toString() } }
            : null;
    }

    private getVehiculeAssignmentEditRoute(vehiculeAssignment: VehiculeAssignmentDto): Location | null {
        return vehiculeAssignment.id
            ? { name: 'VehiculeAssignmentEdit', params: { vehiculeAssignmentId: vehiculeAssignment.id.toString() } }
            : null;
    }
}

</script>

<style scoped>
</style>