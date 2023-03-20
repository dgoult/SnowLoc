# SnowLoc
SnowLoc plateforme opensource de gestion de location de matériel de snowboard et de ski

# Installation
***
Cloner le projet via
```
git clone https://github.com/dgoult/SnowLoc.git
```
## Setup la base de données

Démarrer votre serveur MySql (Je préconise Laragon https://laragon.org/download/index.html)

Ce référé au ``application.properties`` pour créer la base de données ``snowlocbdd`` et ce connecter à l'utilisateur correspondant
```
> Api/snowloc/src/main/resources/application.properties
```

## Lancement du projet Front App

Lancer un invite de commande depuis le dossier ``> SnowLoc/App``

S'assurer d'avoir ``npm`` d'installer
```
npm install
```

Lancer du serveur sur ``http://localhost:5173/`` avec vite

```
npm run dev
```
## Lancement du projet Back Api

Lancer avec Inteliji avec le projet Api

```
> SnowLoc/Api
```

Lancer l'Api en exécutant le fichier ``SnowlocApplication`` sur Inteliji

GOULT Dylan Master ESI 1 JavaSpringProject


Utilisations :
-starter vutify vite vue2 https://github.com/logue/vite-vue2-vuetify-ts-starter/tree/master/src
-DialogService by Hacksis Team
