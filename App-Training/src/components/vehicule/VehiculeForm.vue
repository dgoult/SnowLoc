<template>
    <v-form v-if="vehicule" ref="form" class="vehiculeFormulaire">
        <v-autocomplete
            :items="tabBrand"
            item-text="name"
            item-value=""
            return-object
            class="label"
            v-model="selectedBrand"
            :rules="brandRules"
            label="Marque"
        />
        <v-autocomplete
            :items="tabModel"
            item-text="model"
            class="label"
            v-model="selectedModel"
            :rules="modelRules"
            label="Modèle"
            :disabled="!selectedBrand"
        />
        <v-text-field
            class="label"
            v-model="vehicule.category"
            :rules="categoryRules"
            label="Catégorie"
        />
        <template v-if="vehicule.registration">
            <v-menu
                v-model="showCalendar"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="vehicule.registration.registrationDate"
                        :rules="dateRules"
                        label="Date d'immatriculation"
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                        :disabled="!!vehicule.id"
                    />
                </template>
                <v-date-picker
                    v-model="vehicule.registration.registrationDate"
                    no-title
                    @input="showCalendar = false"
                />
            </v-menu>
            <v-text-field
                class="label"
                v-model="vehicule.registration.registrationNumber"
                :rules="registrationNumberRules"
                label="Immatriculation"
                :disabled="!canModifyRegistrationNumber"
            />
        </template>
    </v-form>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { VehiculeDto } from '@/dtos';
import { DialogLevel } from '@/enums';

@Component
export default class VehiculeForm extends Vue {
    private readonly FNIregex: RegExp = /^[0-9]{1,4} [A-Z]{1,3} [0-9]{2}$/;
    private readonly SIVregex: RegExp = /^([A-Z]{2})-(\d{3})-([A-Z]{2})$/;
    private readonly SIVapplicationBeginDate: Date = new Date(2009, 3, 15);

    private selectedBrand: { name: string, models: string[] } | null = null;

    private selectedModel: string | null = null;

    private VehiculeTableRoute = { name: 'VehiculeTable' };

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private dialogService = new DialogService();

    private loading: boolean = false;

    private showCalendar = false;

    private initialRegistrationNumber: string = '';

    private tabBrand: { name: string, models: string[] }[] = [
        { name: 'Mercedes-Benz', models: ['Citaro', 'Citaro NGT', 'eCitaro', 'Conecto'] },
        { name: 'Volvo', models: ['Volvo 9700', 'Volvo 9700 à double étage', 'Volvo 9900'] },
        { name: 'Setra', models: ['MultiClass 400', 'MultiClass S 416 LE', 'ComfortClass 500'] },
        { name: 'Man', models: ['MAN Lion’s Coach', 'MAN Lion’s Intercity', 'MAN Lion’s City'] }
    ];

    @Ref('form')
    private form!: { validate: () => boolean };

    private IsValid(): boolean {
        return this.form
            ? this.form.validate()
            : false;
    }

    @Prop({ default: () => new VehiculeDto() })
    private vehicule!: VehiculeDto | null;

    private async created(): Promise<void> {
        try {
            this.loading = true;
            if (!this.vehicule || !this.vehicule.registration) {
                return;
            }
            this.selectedBrand = this.tabBrand.find(brand => this.vehicule && brand.name === this.vehicule.brand) || null;
            this.selectedModel = this.tabModel.find(models => this.vehicule && models === this.vehicule.model) || null;
            this.initialRegistrationNumber = this.vehicule.registration.registrationNumber || '';
        } finally {
            this.loading = false;
        }
    }

    private async save(): Promise<VehiculeDto | null> {
        if (!this.IsValid() || !this.vehicule || !this.vehicule.registration || !this.selectedBrand || !this.selectedBrand.name || !this.selectedModel) {
            return null;
        }

        try {
            this.loading = true;

            this.vehicule.brand = this.selectedBrand.name;
            this.vehicule.model = this.selectedModel;

            const saveVehicule: VehiculeDto | null = this.vehicule.id
                ? await this.apiService.updateVehicule(this.vehicule)
                : await this.apiService.createVehicule(this.vehicule);
            if (saveVehicule && saveVehicule.id) {
                const message = this.vehicule.id
                    ? 'Le véhicule à été correctement modifié'
                    : 'Le véhicule à été correctement ajouté';
                this.dialogService.toast(message, DialogLevel.Success);
                return saveVehicule;
            }

            return null;
        } finally {
            this.loading = false;
        }
    }

    private brandRules = [
        (v: { name: string, models: string[] }) => !!v || 'Ce champ est requis',
        (v: { name: string, models: string[] }) => (!v || v.name.length <= 50) || 'Ce champ est trop long'
    ]

    private modelRules = [
        (v: string) => !!v || 'Ce champ est requis',
        (v: string) => (v && v.length <= 50) || 'Ce champ est trop long'
    ]

    private categoryRules = [
        (v: string) => !!v || 'Ce champ est requis',
        (v: string) => (v && v.length <= 50) || 'Ce champ est trop long'
    ]

    private dateRules = [
        (v: Date) => !!v || 'Ce champ est requis'
    ]

    private get tabModel(): string[] {
        return this.selectedBrand
            ? this.selectedBrand.models
            : [];
    }

    private get canModifyRegistrationNumber(): boolean {
        if (!this.vehicule || !this.vehicule?.registration?.registrationDate) {
            return false;
        }

        const vehiculeRegistrationDate = new Date(this.vehicule.registration.registrationDate);

        return this.vehicule.id && vehiculeRegistrationDate >= this.SIVapplicationBeginDate
            ? this.isRegistrationSIV(this.initialRegistrationNumber)
            : true;
    }

    private isRegistrationSIV(registrationNumber: string): boolean {
        return registrationNumber
            ? this.SIVregex.test(registrationNumber)
            : false;
    }

    private isRegistrationFNI(registrationNumber: string): boolean {
        return registrationNumber
            ? this.FNIregex.test(registrationNumber)
            : false;
    }

    private get registrationNumberRules(): ((v: string) => true | string)[] {
        const rules: ((v: string) => true | string)[] = [(v: string) => !!v || 'Ce champ est requis'];
        const additionalRule = this.vehicule && this.vehicule.id
            ? this.previousRegistrationNumberRule
            : this.newRegistrationNumberRule;
        rules.push(additionalRule);
        return rules;
    }

    private previousRegistrationNumberRule(value: string): true | string {
        const isValid = this.isRegistrationDateAfterSIVBeginDate()
            ? this.isRegistrationSIV(value)
            : (this.isRegistrationFNI(value) || this.isRegistrationSIV(value));

        return isValid || 'Le format est incorrect';
    }

    private newRegistrationNumberRule(value: string): true | string {
        const isValid = this.isRegistrationDateAfterSIVBeginDate()
            ? this.isRegistrationSIV(value)
            : (this.isRegistrationFNI(value) || this.isRegistrationSIV(value));

        return isValid || 'Le format est incorrect';
    }

    private isRegistrationDateAfterSIVBeginDate(): boolean {
        if (!this.vehicule || !this.vehicule.registration || !this.vehicule.registration.registrationDate) {
            return false;
        }

        const vehiculeRegistrationDate = new Date(this.vehicule.registration.registrationDate);

        return !isNaN(vehiculeRegistrationDate.getTime())
            ? vehiculeRegistrationDate >= this.SIVapplicationBeginDate
            : false;
    }
}
</script>

<style lang="scss">
input {
    display: block;
    padding: 10px 20px;
    width: 100%;
    box-sizing: border-box;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
}
</style>