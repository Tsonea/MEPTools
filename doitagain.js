/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|                Do it AGAIN !               |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet d'ajouter une fonctionnalité pour refaire un elearning selon les mêmes paramètres.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - evaluations/elearning_generate
// - evaluations/elearning_resultats

/*-------------------------------------------*/

// Fonction pour sauvegarder les données du formulaire initial
function saveFormData(event) {
    event.preventDefault(); // Empêche la soumission normale du formulaire

    const form = event.target;
    const formData = new FormData(form);
    const params = new URLSearchParams(formData).toString();
    const action = form.action;
    const method = form.method;

    const requestData = { action, method, params };

    chrome.storage.local.set({ lastRequest: requestData }, () => {
        console.log("Requête sauvegardée :", requestData);
    });

    // Soumettre le formulaire
    form.submit();
}

// Fonction pour appeler le dernier formulaire enregistré
function replayLastRequest() {
    chrome.storage.local.get("lastRequest", (data) => {
        if (data.lastRequest) {
            const { action, method, params } = data.lastRequest;

            if (method.toUpperCase() === "POST") {
                const form = document.createElement("form");
                form.method = "POST";
                form.action = action;
                form.style.display = "none";

                new URLSearchParams(params).forEach((value, key) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = value;
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit(); // Rejoue la requête
            } else {
                window.open(action + "?" + params, "_blank");
            }
        } else {
            alert("Aucune requête enregistrée.");
        }
    });
}

// Attache l'écouteur sur le formulaire cible
document.addEventListener("submit", function (event) {
    if (event.target.tagName === "FORM") {
        saveFormData(event);
    }
});

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        if (window.location.href.includes("/evaluations/elearning_resultats")) {
            createButton({
                id: "replayButton",
                text: "Refaire une session",
                action: replayLastRequest
            });
        }
    });
} else {
    if (window.location.href.includes("/evaluations/elearning_resultats")){
        createButton({
            id: "replayButton",
            text: "Refaire une session",
            action: replayLastRequest
        });
    }
}