<template>
    <div class="accueil">
        <v-container>
            <v-row>
                <v-col>
                    <v-img
                        class="my-6 mx-auto"
                        max-height="198"
                        max-width="303"
                        src="@/assets/HacksisLogo.png"
                    ></v-img>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col align-self="start" cols="12" md="2">
                    <v-card>
                        <v-card-text>
                            <v-responsive
                                aspect-ratio="1"
                            >
                                <router-link :to="GoToDriver">
                                    <v-img
                                        src="@/assets/driver.png"
                                    ></v-img>
                                </router-link>
                            </v-responsive>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col align-self="center" cols="12" md="2">
                    <v-card>
                        <v-responsive
                            aspect-ratio="1"
                        >
                            <v-card-text>
                                <router-link :to="GoToVehicule">
                                    <v-img
                                        src="@/assets/vehicule.png"
                                    ></v-img>
                                </router-link>
                            </v-card-text>
                        </v-responsive>
                    </v-card>
                </v-col>
                <v-col align-self="center" cols="12" md="2">
                    <v-card>
                        <v-responsive
                            aspect-ratio="1"
                        >
                            <v-card-text>
                                <router-link :to="GoToVehiculeAssignment">
                                    <v-img
                                        src="@/assets/assigment.png"
                                    ></v-img>
                                </router-link>
                            </v-card-text>
                        </v-responsive>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HomeView extends Vue {
    private GoToDriver = { name: 'DriverView' };

    private GoToVehicule = { name: 'VehiculeView' };

    private GoToVehiculeAssignment = { name: 'VehiculeAssignmentView' };
}
</script>

<style>
.accueil {
    text-align: center;
    margin: 0px auto;
}

.accueil p {
    margin: 80px auto;
}

.logo {
    margin: 40px auto;
}
</style>