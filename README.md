# MEPTools
Une extension chromium pour rajouter quelques fonctionnalités sur MEP et corriger quelques bugs.

## Installation

1. Télecharger l'archive.
2. Extraire l'archive
3. Dans votre navigateur -> Gestionnaire d'extension -> Charger l'extension non empaquetée -> Sélectionner le dossier contenant le code télechargé.

## Fonctionnalités ajoutées:

### Visualisation des statistiques d'un tag directement sur la page du cours lié

MEPTools permet de visualiser les statistiques d'un tag directement sur la page du cours lié au tag.

<img width="1065" alt="insert_stats" src="https://github.com/user-attachments/assets/d6e73d8d-8c11-4223-bb6d-15dda2dd3c1c" />

### Fonctionnalité de zoom sur les images

MEPTools offre la possibilité de zoomer sur les images des questions lors d'un elearning et de les afficher en grand. Une fonctionnalité très pratique pour ne pas devenir myope !

![zoom](https://github.com/user-attachments/assets/b84649f5-5ad3-4bc1-950a-adbfdc4af928)

### Ajout d'un accès rapide vers l'affichage des cours

Un clic sur l'icone oeil sur les cours permet de renvoyer directement vers la lecture du pdf du cours.

<img width="196" alt="add_link_to_eye" src="https://github.com/user-attachments/assets/24452630-d640-4992-9d6f-94b0e6e0a5e7" />

### Sauvegarde des paramètres de la création d'elearnings

MEPTools permet de sauvegarder des paramètres par défaut pour la création d'elearnings qui seront automatiquement chargés à chaque création d'un elearning.

<img width="444" alt="autoset" src="https://github.com/user-attachments/assets/17b346fe-82d8-4624-baac-100982fc4540" />

### Ajout d'une confirmation de soumission des elearnings

MEPTools vérifiera que l'utilisateur a répondu à chaque question avant de soumettre l'elearning. Si une question est laissé vide, une popup préviendra l'utilisateur.

<img width="1036" alt="check_resp" src="https://github.com/user-attachments/assets/284c89c5-a851-4689-a1d0-9c8de6df6b86" />

### Ajout d'un bouton permettant de refaire directement une nouvelle session

Un nouveau bouton permet à la fin d'une session de elearning de refaire une nouvelle session basée sur les mêmes paramètres. Très pratique quand l'utilisateur enchaine les sessions.

<img width="210" alt="doitagain" src="https://github.com/user-attachments/assets/85096295-653f-458e-bf81-aec51f4bd8d2" />

### Fonctionnalité de téléchargement automatique des cours

Un bouton permet de télécharger de façon automatique tout les cours d'une matière. Pratique si l'on s'apprête à partir à la campagne !

<img width="208" alt="download" src="https://github.com/user-attachments/assets/40257edb-c02b-4292-a4a1-0c80329a6519" />

### Améliorations dans l'affichage des matières

MEPTools donne la possiblité à l'utilisateur de trier les matières en catégories: 1er semestre, 2e semestre, Spés et mineures, Divers
*Fonctionnalité en développement, actuellement uniquement compatible avec Dijon*

<img width="1261" alt="organize" src="https://github.com/user-attachments/assets/c956ee94-360e-4b3e-81cd-f43b3cc8e05b" />

### Ajout automatique des cours vers MEDTools

Ajout d'une fonctionnalité d'envoi des informations d'un cours vers l'outil d'organisation MEDTools via le bouton + sur les cours.
Lors de l'ouverture de l'interface sur MEP, MEPTools récupère et détècte les informations et puis communique avec MEDTools (un utilitaire d'organisation de révisions).

<img width="617" alt="tomed" src="https://github.com/user-attachments/assets/9deac61a-121c-4c78-b1fe-770a41471037" />
<img width="1007" alt="medtools" src="https://github.com/user-attachments/assets/24d2b6d6-22ad-4d32-b879-3d7acf9ccc09" />

⚠️⚠️ **Cette fonctionnalité génère un script SQL qui est envoyé par MEPTools puis executé par MedTools. Etant donné que MedTools est un utilitaire devant être hébergé en local, cette méthode est acceptable. En aucun cas celle-ci ne pourrait être utilisé sur une version en ligne pour des raisons évidentes de sécurité.** ⚠️⚠️

## Bugs / Fix:

### Correction des notifs multiples

Correction d'un bug (ou mauvaise utilisation ?) qui envoie jusqu'à 6 fois la même notification. MEPTools filtre les notifications de la page d'accueil en supprimant les doublons !

### Correction des tags automatiques

Correction d'un bug qui affecte la création d'elearning où, venant d'un cours, les tags du cours n'étaient plus ajoutés automatiquement.
*Le bug a été corrigé depuis*
