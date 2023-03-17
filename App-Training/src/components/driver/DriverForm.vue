<template>
    <v-form ref="form" v-if="driver">
        <v-container>
            <v-text-field
                class="label"
                v-model="driver.lastname"
                :rules="lastnameRules"
                label="Nom"
            />
            <v-text-field
                class="label"
                v-model="driver.firstname"
                :rules="firstnameRules"
                label="Prénom"
            />
            <v-text-field
                class="label"
                v-model="driver.city"
                :rules="cityRules"
                label="Ville"
            />
            <v-menu
                :disabled="!!driver.id"
                v-model="showCalendar"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        :rules="dateRules"
                        v-model="driver.birthDate"
                        label="Date de naissance"
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        v-on="on"
                    />
                </template>
                <v-date-picker
                    active-picker="YEAR"
                    v-model="driver.birthDate"
                    no-title
                    @input="showCalendar = false"
                />
            </v-menu>
        </v-container>
    </v-form>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator';
import { ApiService, LocalStorageService, DialogService, ConfigurationService, LogService } from '@/services';
import { DriverDto } from '@/dtos';
import { DialogLevel } from '@/enums';

@Component
export default class DriverForm extends Vue {
    @Prop({ default: () => new DriverDto() })
    private driver!: DriverDto | null;

    private apiService = new ApiService(new LogService(), new LocalStorageService(), new DialogService(), new ConfigurationService());

    private showCalendar = false;

    private loading: boolean = false;

    private dialogService = new DialogService();

    @Ref('form')
    private form!: { validate: () => boolean };

    private isValid(): boolean {
        return this.form
            ? this.form.validate()
            : false;
    }

    public async save(): Promise<DriverDto | null> {
        if (!this.isValid() || !this.driver) {
            return null;
        }
        try {
            this.loading = true;
            const saveDriver: DriverDto | null = this.driver.id
                ? await this.apiService.updateDriver(this.driver)
                : await this.apiService.createDriver(this.driver);
            if (saveDriver && saveDriver.id) {
                const message = this.driver.id
                    ? 'Le conducteur à été correctement modifié'
                    : 'Le conducteur à été correctement ajouté';
                this.dialogService.toast(message, DialogLevel.Success);
                return saveDriver;
            }
            return null;
        } finally {
            this.loading = false;
        }
    }

    private lastnameRules = [
        (v: string) => !!v || 'Ce champ est requis',
        (v: string) => (v && v.length <= 50) || 'Ce champ est trop long'
    ]

    private firstnameRules = [
        (v: string) => !!v || 'Ce champ est requis',
        (v: string) => (v && v.length <= 50) || 'Ce champ est trop long'
    ]

    private cityRules = [
        (v: string) => !!v || 'Ce champ est requis',
        (v: string) => (v && v.length <= 50) || 'Ce champ est trop long'
    ]

    private dateRules = [
        (v: Date) => !!v || 'Ce champ est requis'
    ]
}
</script>

<style lang="scss">
.driverFormulaire {
    max-width: 700px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 40px 100px;
    border-radius: 10px;
}

input {
    display: block;
    padding: 10px 20px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
}
</style>