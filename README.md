# SnowLoc
SnowLoc plateforme de gestion de location de matériel de snowboard et de ski

# Installation
***
Cloner le projet via
```
$ git clone https://example.com
```
## Setup la base de données

Démarrer votre serveur MySql (Je préconise Laragon https://laragon.org/download/index.html)

Ce référé au ``application.properties`` pour ce connecter à l'utilisateur correspondant
```
> Api/snowloc/src/main/resources/application.properties
```

## Lancement du projet Front App

Lancer un invite de commande depuis le dossier ``> SnowLoc/App``

S'assurer d'avoir ``npm`` d'installer
```
> npm install
```

Lancer du serveur sur ``http://localhost:5173/`` avec vite

```
npm run dev
```

GOULT Dylan Master ESI 1 JavaSpringProject
