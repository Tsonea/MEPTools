/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|                 Fix Notifs                 |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet de corriger le bug qui envoie en multiples exemplaires la même
// notification en supprimant les doublons dans les notifications.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - accueil.php

/*-------------------------------------------*/

// Fonctions pour corriger les doublons dans les notifications
function fixNotifs() {
    const notifsContainer = document.querySelector('#notifs .card-body');
    const notifs = notifsContainer.querySelectorAll('.bd-callout');
    
    const seen = new Set();
    notifs.forEach(notif => {
        notif.style.fontSize = "13px";
        const html = notif.innerHTML;
        if (seen.has(html)) {
            notif.remove();
        } else {
            seen.add(html);
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        fixNotifs();
    });
} else {
    fixNotifs();
}
  
