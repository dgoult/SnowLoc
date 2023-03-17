<template>
    <div>
        <v-card>
            <v-card-title>
                <v-btn :to="DriverTableRoute" icon fab small class="mr-2"
                    ><v-icon large>mdi-chevron-left</v-icon></v-btn
                >
                {{ title }}
                <v-spacer />
                <v-btn v-if="isEdit" @click.native="save" color="success">
                    Enregistrer
                </v-btn>
                <v-btn v-else :to="DriverEditRoute" color="primary">
                    Modifier
                </v-btn>
            </v-card-title>
            <v-card-text v-if="!loading">
                <router-view
                    ref="child"
                    :driver="driver"
                    :vehiculeAssignment="vehiculeAssignment"
                    :driverId="driverId"
                />
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { DriverDto, VehiculeAssignmentDto } from '@/dtos';

@Component
export default class DriverFormDetail extends Vue {
    @Prop({ default: null })
    private driverId!: number | null;

    @Prop({ default: false })
    private isEdit!: boolean;

    private vehiculeAssignment!: VehiculeAssignmentDto | null;

    @Ref('child')
    private child!: { save: () => DriverDto | null };

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private driver: DriverDto | null = null;

    private DriverTableRoute = { name: 'DriverHomeView' };

    private DriverEditRoute = { name: 'DriverEdit' };

    private loading: boolean = false;

    private async created(): Promise<void> {
        try {
            this.loading = true;
            if (this.driverId) {
                this.driver = await this.apiService.getDriver(this.driverId);
                this.vehiculeAssignment = await this.apiService.getVehiculeAssignmentByDriverId(this.driverId);
            } else {
                this.driver = new DriverDto();
            }
        } finally {
            this.loading = false;
        }
    }

    private async save(): Promise<void> {
        const form = this.child;
        if (form && !!form.save) {
            const saveDriver: DriverDto | null = await form.save();
            if (saveDriver && saveDriver.id) {
                this.$router.push({ name: 'DriverDetail', params: { driverId: saveDriver.id.toString() } });
            }
        }
    }

    private get title(): string {
        switch (this.$route.name) {
            case 'DriverNew':
                return 'Nouveau conducteur';
            case 'DriverDetail':
                return 'Détails du conducteur';
            case 'DriverEdit':
                return 'Edition du conducteur';
            default: return 'Conducteur';
        }
    }
}
</script>