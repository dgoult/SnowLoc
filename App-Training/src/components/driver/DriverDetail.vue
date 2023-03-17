<template>
    <div v-if="driver">
        <v-row dense>
            <v-col>
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold">Nom </span></v-col
                    >
                    <v-col>{{ driver.lastname }}</v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold">Prénom </span></v-col
                    >
                    <v-col>{{ driver.firstname }}</v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold"
                            >Date de naissance
                        </span></v-col
                    >
                    <v-col>{{ driver.birthDate | date }}</v-col>
                </v-row>
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold">Ville </span></v-col
                    >
                    <v-col>{{ driver.city }}</v-col>
                </v-row>
            </v-col>
            <v-col v-if="!hideAssignment">
                <v-row dense>
                    <v-col cols="6" md="3"
                        ><span class="font-weight-bold"
                            >Véhicule affecté
                        </span></v-col
                    >
                    <v-col v-if="!hideAssignment && vehiculeAssignment" >{{ vehiculeAssignment.vehiculeName }}</v-col>
                    <v-col v-else><v-btn color="warning" :to="VehiculeAssignmentDriverForm">AJOUTER</v-btn></v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { DriverDto, VehiculeAssignmentDto } from '@/dtos';

@Component
export default class DriverDetail extends Vue {
    @Prop({ default: () => new DriverDto() })
    private driver!: DriverDto | null;

    @Prop({ default: false })
    private hideAssignment!: boolean;

    @Prop({ default: () => new VehiculeAssignmentDto() })
    private vehiculeAssignment!: VehiculeAssignmentDto | null;

    private VehiculeAssignmentDriverForm = { name: 'VehiculeAssignmentDriverForm' };

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private showCalendar = false;

    private loading: boolean = false;
}
</script>

<style lang="scss">
</style>