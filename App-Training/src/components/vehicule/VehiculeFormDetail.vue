<template>
    <v-card>
        <v-card-title>
            <v-btn :to="VehiculeTableRoute" icon fab small class="mr-2"
                ><v-icon large>mdi-chevron-left</v-icon></v-btn
            >
            {{ title }}
            <v-spacer />
            <v-btn v-if="isEdit" @click.native="save" color="success">
                Enregistrer
            </v-btn>
            <v-btn v-else :to="VehiculeEditRoute" color="primary">
                Modifier
            </v-btn>
        </v-card-title>
        <v-card-text v-if="!loading">
            <router-view
                ref="child"
                :vehicule="vehicule"
                :vehiculeAssignment="vehiculeAssignment"
                :vehiculeId="vehiculeId"
            />
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { VehiculeDto, VehiculeAssignmentDto } from '@/dtos';

@Component
export default class VehiculeFormDetail extends Vue {
    @Prop({ default: null })
    private vehiculeId!: number | null;

    @Ref('child')
    private child!: { save: () => VehiculeDto | null };

    @Prop({ default: false })
    private isEdit!: boolean;

    private registrationNumber!: string | undefined;

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private vehicule: VehiculeDto | null = null;

    private loading: boolean = false;

    private vehiculeAssignment: VehiculeAssignmentDto | null = null;

    private VehiculeEditRoute = { name: 'VehiculeEdit' };

    private VehiculeTableRoute = { name: 'VehiculeHomeView' };

    private async created(): Promise<void> {
        try {
            this.loading = true;
            if (this.vehiculeId) {
                this.vehicule = await this.apiService.getVehicule(this.vehiculeId);
                this.vehiculeAssignment = await this.apiService.getVehiculeAssignmentByVehiculeId(this.vehiculeId);
            } else {
                this.vehicule = new VehiculeDto();
            }
        } finally {
            this.loading = false;
        }
    }

    private async save(): Promise<void> {
        const form = this.child;
        if (form && !!form.save) {
            const saveVehicule: VehiculeDto | null = await form.save();
            if (saveVehicule && saveVehicule.id) {
                this.$router.push({ name: 'VehiculeDetail', params: { vehiculeId: saveVehicule.id.toString() } });
            } else {
                this.vehicule = new VehiculeDto();
            }
        }
    }

    private get title(): string {
        switch (this.$route.name) {
            case 'VehiculeNew':
                return 'Nouveau véhicule';
            case 'VehiculeDetail':
                return 'Détails du véhicule';
            case 'VehiculeEdit':
                return 'Edition du véhicule';
            default: return 'Véhicule';
        }
    }
}
</script>