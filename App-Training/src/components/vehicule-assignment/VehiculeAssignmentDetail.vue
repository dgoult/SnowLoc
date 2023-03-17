<template>
    <div v-if="vehiculeAssignment">
        <v-row dense
            ><v-col cols="6" md="3">
                <span class="font-weight-bold">Date d'affectation </span>
            </v-col>
            <v-col>{{ vehiculeAssignment.period.beginDate | date }}</v-col></v-row
        >
        <v-row dense v-if="vehiculeAssignment.period.endDate"
            ><v-col cols="6" md="3">
                <span class="font-weight-bold">Date de restitution </span>
            </v-col>
            <v-col><v-chip color="green"> {{ vehiculeAssignment.period.endDate | date }} </v-chip></v-col></v-row
        >
        <v-row dense>
            <v-col cols="6" md="3">
                <span class="font-weight-bold">Véhicule </span>
            </v-col>
            <v-col>
                <v-alert
                    border="left"
                    colored-border
                    color="blue accent-4"
                    elevation="0"
                >
                    <v-expansion-panels flat>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                {{ vehiculeAssignment.vehiculeName }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <VehiculeDetail
                                    :vehicule="vehicule"
                                    :hideAssignment="true"
                                />
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-alert>
            </v-col> </v-row
        ><v-row dense>
            <v-col cols="6" md="3">
                <span class="font-weight-bold">Conducteur </span>
            </v-col>
            <v-col>
                <v-alert
                    border="left"
                    colored-border
                    color="blue accent-4"
                    elevation="0"
                >
                    <v-expansion-panels flat>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                {{ vehiculeAssignment.driverName }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <DriverDetail
                                    :driver="driver"
                                    :hideAssignment="true"
                                />
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-alert>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { DriverDto, VehiculeAssignmentDto, VehiculeDto } from '@/dtos';

@Component
export default class VehiculeAssignmentDetail extends Vue {
    @Prop({ default: null })
    private vehiculeAssignment!: VehiculeAssignmentDto | null;

    @Prop({ default: null })
    private vehicule!: VehiculeDto | null;

    @Prop({ default: null })
    private driver!: DriverDto | null;

    private registrationNumber!: string | undefined;

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private loading: boolean = false;

    private showCalendar = false;

    private VehiculeAssignmentTableRoute = { name: 'VehiculeAssignmentTable' };

    private dateRules = [
        (v: Date) => !!v || 'Ce champ est requis'
    ]
}
</script>