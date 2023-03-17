<template>
    <div>
        <v-row class="mt-5" justify="center">
            <v-col>
                <h2>Détails du conducteur</h2>
                <DriverDetail
                    :driver="driver"
                    :vehiculeAssignment="vehiculeAssignment"
                    :hideAssignment="true"
                />
            </v-col>
            <v-col>
                <h2>Détails du véhicule</h2>
                <VehiculeDetail
                    :vehicule="vehicule"
                    :vehiculeAssignment="vehiculeAssignment"
                    :hideAssignment="true"
                />
            </v-col>
            <v-col>
                <v-row dense justify="center">
                    <h2>Véhicule à affecter</h2>
                    {{ selectedVehiculeId }}
                    <VehiculeTable @vehiculeSelected="onVehiculeSelected" />
                </v-row>
            </v-col>
            <v-col>
                <v-row dense justify="center">
                    <h2>Conducteur à affecter</h2>
                    {{ selectedDriverId }}
                    <DriverTable @driverSelected="onDriverSelected" />
                </v-row>
            </v-col>
        </v-row>
        <!-- <v-row
            class="mt-5"
            justify="center"
            v-if="this.$route.name === 'VehiculeAssignmentVehiculeForm'"
        >
            <v-col>
                <v-row dense justify="center">
                    <h2>Conducteur à affecter</h2>
                    {{ selectedVehiculeId }}
                    <DriverTable @vehiculeSelected="onVehiculeSelected" />
                </v-row>
            </v-col>
            <v-col>
                <h2>Détails du conducteur</h2>
                <VehiculeDetail
                    :vehicule="vehicule"
                    :vehiculeAssignment="vehiculeAssignment"
                    :hideAssignment="true"
                />
            </v-col>
        </v-row>
        <v-row
            class="mt-5"
            justify="center"
            v-if="this.$route.name === 'VehiculeAssignmentEdit'"
        >
            <v-col>
                <h2>Détails du conducteur</h2>
                <DriverDetail
                    :driver="driver"
                    :vehiculeAssignment="vehiculeAssignment"
                    :hideAssignment="true"
                />
            </v-col>
            <v-col>
                <v-row dense
                    ><v-col cols="6" md="3">
                        <span class="font-weight-bold"
                            >Date d'affectation
                        </span>
                    </v-col>
                    <v-col>{{
                        vehiculeAssignment.period.beginDate | date
                    }}</v-col></v-row
                >
            </v-col>
            <v-col>
                <h2>Détails du véhicule</h2>
                <VehiculeDetail
                    :vehicule="vehicule"
                    :vehiculeAssignment="vehiculeAssignment"
                    :hideAssignment="true"
                />
            </v-col>
        </v-row> -->
        <v-row>
            <v-col>
                <v-form ref="form" class="mb-5">
                    <v-menu
                        v-if="
                            vehiculeAssignment &&
                            vehiculeAssignment.period &&
                            vehiculeAssignment.id
                        "
                        v-model="showCalendar"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="vehiculeAssignment.period.endDate"
                                :rules="dateRestitute"
                                label="Date de restitution"
                                prepend-icon="mdi-calendar"
                                v-bind="attrs"
                                v-on="on"
                            />
                        </template>
                        <v-date-picker
                            v-model="vehiculeAssignment.period.endDate"
                            no-title
                            @input="showCalendar = false"
                        />
                    </v-menu>
                    <v-menu
                        v-model="showCalendar"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                        v-else
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="vehiculeAssignment.period.beginDate"
                                :rules="dateAffect"
                                label="Date d'affectation"
                                prepend-icon="mdi-calendar"
                                v-bind="attrs"
                                v-on="on"
                            />
                        </template>
                        <v-date-picker
                            v-model="vehiculeAssignment.period.beginDate"
                            no-title
                            @input="showCalendar = false"
                        />
                    </v-menu>
                </v-form>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { VehiculeDto, VehiculeAssignmentDto, DriverDto } from '@/dtos';
import { DialogLevel } from '@/enums';

@Component
export default class VehiculeAssignmentForm extends Vue {
    @Prop({ default: null })
    private vehiculeAssignment!: VehiculeAssignmentDto | null;

    @Prop({ default: null })
    private vehicule!: VehiculeDto | null;

    @Prop({ default: null })
    private driver!: DriverDto | null;

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private showCalendar = false;

    private loading: boolean = false;

    private dialogService = new DialogService();

    private showAffectTable: boolean = false;

    @Ref('form')
    private form!: { validate: () => boolean };

    private isValid(): boolean {
        return this.form
            ? this.form.validate()
            : false;
    }

    public async save(): Promise<VehiculeAssignmentDto | null> {
        if (!this.isValid() || !this.vehiculeAssignment) {
            return null;
        }
        try {
            this.loading = true;
            const savevehiculeAssignment: VehiculeAssignmentDto | null = this.vehiculeAssignment.id
                ? await this.apiService.updateVehiculeAssignment(this.vehiculeAssignment)
                : new VehiculeAssignmentDto();
            if (savevehiculeAssignment && savevehiculeAssignment.id) {
                const message = savevehiculeAssignment.id
                    ? 'Le véhicule a été correctement restituer'
                    : 'Vous n\'avez séléctionné aucune affectation';
                if (savevehiculeAssignment.id) {
                    this.dialogService.toast(message, DialogLevel.Error);
                } this.dialogService.toast(message, DialogLevel.Success);
                return savevehiculeAssignment;
            } if (savevehiculeAssignment && !savevehiculeAssignment.id) {
                if (this.driver && this.driver.id && this.selectedVehiculeId) {
                    this.vehiculeAssignment.vehiculeId = +this.selectedVehiculeId;
                    this.vehiculeAssignment.driverId = this.driver.id;
                    const saveNewvehiculeAssignment: VehiculeAssignmentDto | null = !this.vehiculeAssignment.id
                        ? await this.apiService.createVehiculeAssignmentByDriver(this.vehiculeAssignment)
                        : new VehiculeAssignmentDto();
                    if (saveNewvehiculeAssignment && saveNewvehiculeAssignment.id) {
                        const message = 'Le véhicule a été correctement affecter';
                        this.dialogService.toast(message, DialogLevel.Success);
                    } else {
                        const message = 'Le véhicule n\'a pas été correctement affecter';
                        this.dialogService.toast(message, DialogLevel.Error);
                    }
                    return saveNewvehiculeAssignment;
                } else if (this.vehicule && this.vehicule.id && this.selectedDriverId) {
                    this.vehiculeAssignment.driverId = +this.selectedDriverId;
                    this.vehiculeAssignment.vehiculeId = this.vehicule.id;
                    const saveNewdriverAssignment: VehiculeAssignmentDto | null = !this.vehiculeAssignment.id
                        ? await this.apiService.createVehiculeAssignmentByDriver(this.vehiculeAssignment)
                        : new VehiculeAssignmentDto();
                    if (saveNewdriverAssignment && saveNewdriverAssignment.id) {
                        const message = 'Le conducteur a été correctement affecter';
                        this.dialogService.toast(message, DialogLevel.Success);
                    } else {
                        const message = 'Le conducteur n\'a pas été correctement affecter';
                        this.dialogService.toast(message, DialogLevel.Error);
                    }
                    return saveNewdriverAssignment;
                }
            }
            //  else if (savevehiculeAssignment && !savevehiculeAssignment.id && this.selectedVehiculeId && this.vehicule && this.vehicule.id) {
            //     this.vehiculeAssignment.vehiculeId = +this.selectedVehiculeId;
            //     this.vehiculeAssignment.driverId = this.vehicule.id;
            //     const saveNewvehiculeAssignment: VehiculeAssignmentDto | null = !this.vehiculeAssignment.id
            //         ? await this.apiService.createVehiculeAssignmentByDriver(this.vehiculeAssignment)
            //         : new VehiculeAssignmentDto();
            //     if (saveNewvehiculeAssignment && saveNewvehiculeAssignment.id) {
            //         const message = 'Le véhicule a été correctement affecter';
            //         this.dialogService.toast(message, DialogLevel.Success);
            //     } else {
            //         const message = 'Le véhicule n\'a pas été correctement affecter';
            //         this.dialogService.toast(message, DialogLevel.Error);
            //     }
            //     return saveNewvehiculeAssignment;
            // }
            const message = 'L\'affectation n\'a pas pu être enregistré';
            this.dialogService.toast(message, DialogLevel.Error);
            return null;
        } finally {
            this.loading = false;
        }
    }

    private selectedVehiculesToAffect: VehiculeAssignmentDto[] | null = [];

    private selectedVehiculesNamesToAffect: string[] | null = [];

    private selectedVehiculesIdToAffect!: (number | undefined)[];

    private selectedVehiculeId: string | null = null;

    private onVehiculeSelected(selectedVehicules: VehiculeDto[] | null) {
        if (!selectedVehicules) {
            return null;
        }
        this.selectedVehiculesToAffect = selectedVehicules;
        this.selectedVehiculesNamesToAffect = selectedVehicules.map(v => v.brand + ', ' + v.model + ', ' + v.registration?.registrationNumber);
        this.selectedVehiculesIdToAffect = selectedVehicules.map(v => v.id);
        this.selectedVehiculeId = this.selectedVehiculesIdToAffect.toString();
    }

    private selectedDriversToAffect: VehiculeAssignmentDto[] | null = [];

    private selectedDriversNamesToAffect: string[] | null = [];

    private selectedDriversIdToAffect!: (number | undefined)[];

    private selectedDriverId: string | null = null;

    private onDriverSelected(selectedDrivers: DriverDto[] | null) {
        if (!selectedDrivers) {
            return null;
        }
        this.selectedDriversToAffect = selectedDrivers;
        this.selectedDriversIdToAffect = selectedDrivers.map(v => v.id);
        this.selectedDriverId = this.selectedDriversIdToAffect.toString();
    }

    private dateRestitute = [
        (v: string) => !!v || 'Ce champ est requis',
        (v: string) => this.isBeginDateSuperiorEndDate() || 'La date de restitution doit être postérieure à la date d\'affectation !'
    ]

    private dateAffect = [
        (v: string) => !!v || 'Ce champ est requis'
    ]

    private isBeginDateSuperiorEndDate(): boolean {
        if (!this.vehiculeAssignment || !this.vehiculeAssignment.period || !this.vehiculeAssignment.period.beginDate || !this.vehiculeAssignment.period.endDate) {
            return false;
        }

        const beginDate = new Date(this.vehiculeAssignment.period.beginDate);
        const endDate = new Date(this.vehiculeAssignment.period.endDate);

        return beginDate || endDate
            ? beginDate < endDate
            : false;
    }
}
</script>

<style lang="scss">
</style>