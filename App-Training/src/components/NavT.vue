<template>
    <div id="navigation">
        <div class="accueilRoute">
            <router-link to="/">HacksisTraining</router-link>
        </div>
        <div id="autreRoute">
            <router-link to="/Conducteurs">Conducteurs</router-link> |
            <router-link to="/Vehicule">Véhicules</router-link> |
            <router-link to="/Affectaion">Affectations</router-link>
        </div>
    </div>
</template>

<style>
#navigation a.router-link-exact-active {
    color: #42b983;
}

.accueilRoute a.router-link-exact-active {
    color: #42b983;
}

.accueilRoute {
    float: left;
}

#navigation {
    padding: 30px;
    text-align: center;
}

a {
    color: #2c3e50;
}
</style>