<template>
    <div v-if="vehicule">
        <v-row dense>
            <v-col>
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold">Marque </span></v-col
                    >
                    <v-col>{{ vehicule.brand }}</v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold">Modèle </span></v-col
                    >
                    <v-col>{{ vehicule.model }}</v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold">Catégorie </span></v-col
                    >
                    <v-col>{{ vehicule.category }}</v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold"
                            >Immatriculation
                        </span></v-col
                    >
                    <v-col>{{
                        vehicule.registration.registrationNumber
                    }}</v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold"
                            >Date d'immatriculation
                        </span></v-col
                    >
                    <v-col>{{
                        vehicule.registration.registrationDate | date
                    }}</v-col>
                </v-row>
            </v-col>
            <v-col v-if="!hideAssignment">
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold"
                            >Conducteur affecté
                        </span></v-col
                    >
                    <v-col v-if="!hideAssignment && vehiculeAssignment" >{{ vehiculeAssignment.driverName }}</v-col>
                    <v-col v-else><v-btn color="warning" :to="VehiculeAssignmentVehiculeForm">AJOUTER</v-btn></v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { VehiculeDto, VehiculeAssignmentDto } from '@/dtos';

@Component
export default class VehiculeDetail extends Vue {
    @Prop({ default: () => new VehiculeDto() })
    private vehicule!: VehiculeDto | null;

    @Prop({ default: false })
    private hideAssignment!: boolean;

    @Prop({ default: () => new VehiculeAssignmentDto() })
    private vehiculeAssignment!: VehiculeAssignmentDto | null;

    private VehiculeAssignmentVehiculeForm = { name: 'VehiculeAssignmentVehiculeForm' };

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private showCalendar = false;

    private loading: boolean = false;
}
</script>

<style lang="scss">
</style>