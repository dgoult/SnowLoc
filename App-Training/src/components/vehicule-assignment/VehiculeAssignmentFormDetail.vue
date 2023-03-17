<template>
    <v-card v-if="vehiculeAssignment && vehiculeAssignment.period">
        <v-card-title>
            <v-btn
                :to="previousRoute"
                icon
                fab
                small
                class="mr-2"
                ><v-icon large>mdi-chevron-left</v-icon></v-btn
            >
            {{ title }}
            <v-spacer />
            <template v-if="!initialEndDate && !isSaved && vehiculeAssignment.period.beginDate && vehiculeAssignmentId">
                <v-btn v-if="isEdit" @click.native="save" color="success">
                    Restituer
                </v-btn>
                <v-btn v-else :to="VehiculeAssignmentEdit" color="primary">
                    Restituer
                </v-btn>
            </template>
            <template v-if="!initialBeginDate && !vehiculeAssignmentId">
                <v-btn
                    v-if="isAffectableRoute"
                    @click.native="save"
                    class="ml-4"
                    color="success"
                >
                    Affecter
                </v-btn>
            </template>
        </v-card-title>
        <v-card-text v-if="!loading">
            <router-view
                ref="child"
                :vehicule="vehicule"
                :driver="driver"
                :vehiculeAssignment="vehiculeAssignment"
            />
        </v-card-text>
    </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { VehiculeDto, VehiculeAssignmentDto, DriverDto } from '@/dtos';

@Component
export default class VehiculeAssignmentFormDetail extends Vue {
    @Prop({ default: null })
    private vehiculeAssignmentId!: number | null;

    @Prop({ default: null })
    private driverId!: number | null;

    @Prop({ default: null })
    private vehiculeId!: number | null;

    @Ref('child')
    private child!: { save: () => VehiculeDto | null };

    @Prop({ default: false })
    private isEdit!: boolean;

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private vehicule: VehiculeDto | null = null;

    private driver: DriverDto | null = null;

    private loading: boolean = false;

    private vehiculeAssignment: VehiculeAssignmentDto | null = null;

    private VehiculeAssignmentEdit = { name: 'VehiculeAssignmentEdit' };

    private VehiculeAssignmentTableRoute = { name: 'VehiculeAssignmentTable' };

    private DriverDetailRoute = { path: `/driver/${this.driverId}` };

    private VehiculeDetailRoute = { path: `/vehicule/${this.vehiculeId}` };

    private initialEndDate: Date | undefined = new Date();

    private initialBeginDate: Date | undefined = new Date();

    private isSaved: boolean = false;

    private async created(): Promise<void> {
        try {
            this.loading = true;
            this.initialBeginDate = this.vehiculeAssignment?.period?.beginDate;
            if (this.vehiculeAssignmentId) {
                this.vehiculeAssignment = await this.apiService.getVehiculeAssignment(this.vehiculeAssignmentId);
                this.initialEndDate = this.vehiculeAssignment?.period?.endDate;
            } else {
                this.vehiculeAssignment = new VehiculeAssignmentDto();
                if (this.driverId) {
                    this.driver = await this.apiService.getDriver(this.driverId);
                } if (this.vehiculeId) {
                    this.vehicule = await this.apiService.getVehicule(this.vehiculeId);
                }
            }

            if (this.vehiculeAssignment && this.vehiculeAssignment.driverId) {
                this.driver = await this.apiService.getDriver(this.vehiculeAssignment.driverId);
            }

            if (this.vehiculeAssignment && this.vehiculeAssignment.vehiculeId) {
                this.vehicule = await this.apiService.getVehicule(this.vehiculeAssignment.vehiculeId);
            }
        } finally {
            this.loading = false;
        }
    }

    private async save(): Promise<void> {
        const form = this.child;
        if (form && !!form.save) {
            const saveVehiculeAssignment: VehiculeAssignmentDto | null = await form.save();
            if (saveVehiculeAssignment && saveVehiculeAssignment.id && saveVehiculeAssignment.period?.endDate && saveVehiculeAssignment.period?.beginDate) {
                this.isSaved = true;
                this.$router.push({ name: 'VehiculeAssignmentDetail', params: { saveVehiculeAssignmentId: saveVehiculeAssignment.id.toString() } });
            } else if (saveVehiculeAssignment && saveVehiculeAssignment.id && !saveVehiculeAssignment.period?.endDate && saveVehiculeAssignment.period?.beginDate && this.driverId) {
                this.isSaved = true;
                this.$router.push({ path: `/driver/${this.driverId}`, params: { saveVehiculeAssignmentId: saveVehiculeAssignment.id.toString() } });
            } else if (saveVehiculeAssignment && saveVehiculeAssignment.id && !saveVehiculeAssignment.period?.endDate && saveVehiculeAssignment.period?.beginDate && this.vehiculeId) {
                this.isSaved = true;
                this.$router.push({ path: `/driver/${this.driverId}`, params: { saveVehiculeAssignmentId: saveVehiculeAssignment.id.toString() } });
            } else {
                this.vehiculeAssignment = new VehiculeAssignmentDto();
                this.isSaved = false;
            }
        }
    }

    private get title(): string {
        switch (this.$route.name) {
            case 'VehiculeAssignmentDetail':
                return 'Détails de l\'affectation';
            case 'VehiculeAssignmentEdit':
                return 'Restitution';
            case 'VehiculeAssignmentDriverForm':
                return 'Affectation d\'un véhicule';
            case 'VehiculeAssignmentVehiculeForm':
                return 'Affectation d\'un conducteur';
            default: return 'Conducteur';
        }
    }

    private get previousRoute() {
        switch (this.$route.name) {
            case 'VehiculeAssignmentForm':
                return this.DriverDetailRoute;
            case 'VehiculeAssignmentDriverForm':
                return this.DriverDetailRoute;
            case 'VehiculeAssignmentVehiculeForm':
                return this.VehiculeDetailRoute;
            default: return this.VehiculeAssignmentTableRoute;
        }
    }

    private get isAffectableRoute() {
        return !!(this.$route.name === 'VehiculeAssignmentDriverForm' || this.$route.name === 'VehiculeAssignmentVehiculeForm');
    }
}
</script>