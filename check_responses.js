/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|              Check Responses               |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet d'ajouter une vérification avant de valider un QCM 
// pour s'assurer que toutes les questions ont une réponse cochée et sinon d'afficher une pop-up d'avertissement.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - evaluations/evaluations/
// - elearning/create
// - /evaluations/elearning/id/

/*-------------------------------------------*/

// Fonction pour vérifier si toutes les questions d'un QCM sont cochées avant de valider
function checkResponses() {

    const questions = document.querySelectorAll('.question.card');
    let allChecked = true;
    let popupDisplayed = false; // Variable pour vérifier si la pop-up a déjà été affichée

    questions.forEach((question, index) => {
        const checkboxes = question.querySelectorAll('input[type="checkbox"]');
        const isChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

        if (!isChecked && !popupDisplayed) {
            allChecked = false;
            question.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showPopup(index + 1); // Envoie le numéro de la question au lieu de l'id
            popupDisplayed = true; // Empêche l'affichage de la pop-up une deuxième fois
            return; // Arrête l'exécution dès qu'une question non cochée est trouvée
        }
    });

    return allChecked;
}

// Fonction pour fermer la pop-up de validation
function closePopup() {
    const popup = document.getElementById('validationPopup');
    popup.style.animation = 'fadeOut 0.3s';
    setTimeout(() => popup.remove(), 300); // Supprimer après l'animation
}

// Fonction pour afficher une pop-up d'avertissement si une question n'est pas cochée
function showPopup(questionId) {

    // Ajout de la pop-up (même que celle des évaluations)
    const popup = document.createElement('div');
    popup.id = 'validationPopup';
    popup.className = 'modal fade show';
    popup.style.cssText = 'display: block; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1050;';
    popup.innerHTML = `
        <div class="swal2-container swal2-center swal2-backdrop-show" style="overflow-y: auto;">
            <div class="swal2-popup swal2-modal swal2-icon-info swal2-show" tabindex="-1" role="dialog" aria-live="assertive" aria-modal="true" style="display: grid;">
                <div class="swal2-icon swal2-info swal2-icon-show" style="display: flex;">
                    <div class="swal2-icon-content">i</div>
                </div>
                <h2 class="swal2-title" id="swal2-title" style="display: block;">QCM vide !</h2>
                <div class="swal2-html-container" id="swal2-html-container" style="display: block;">
                    <p><strong>Attention !</strong> La question n°<span id="questionId"></span> n'a pas de réponse cochée.</p>
                </div>
                <div class="swal2-actions" style="text-align: center; width: 100%;">
                    <button type="button" id="closePopupButton" class="swal2-deny btn btn-secondary m-1">Répondre à la question</button>
                    <button type="button" class="swal2-confirm btn btn-success m-1" id="forceSubmit">Soumettre quand même</button>
                </div>
            </div>
        </div>
    `;

    // Ajout des événements pour les boutons
    const closePopupButton = popup.querySelector('#closePopupButton');
    closePopupButton.addEventListener('click', closePopup);

    const forceSubmitButton = popup.querySelector('#forceSubmit');
    forceSubmitButton.addEventListener('click', () => {
        console.log('Forcer la validation');
        closePopup();
        document.getElementById('buttonSubmit').click();
    });

    document.body.appendChild(popup);
}

// Fonction pour modifier le bouton "Soumettre" en cas de validation
function modifySubmitButton() {

    /*
    Etant donné que l'on n'a pas les informations du bouton original,
    on crée un nouveau bouton qui va remplacer l'ancien et qui va appeler le click de l'ancien bouton.
    */

    // Cacher le bouton original
    const originalSubmitButton = document.getElementById('buttonSubmit');
    originalSubmitButton.style.display = 'none';

    // Cration du bouton proxy
    const proxySubmitButton = document.createElement('button');
    proxySubmitButton.id = 'MEPToolsSubmitButton';
    proxySubmitButton.type = 'button';
    proxySubmitButton.className = originalSubmitButton.className;
    proxySubmitButton.innerText = originalSubmitButton.innerText;

    proxySubmitButton.addEventListener('click', (event) => {
        if (checkResponses()) {
            originalSubmitButton.click();
        }
    });

    originalSubmitButton.parentNode.insertBefore(proxySubmitButton, originalSubmitButton);

    // Animation CSS
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    `;
    
    document.head.appendChild(style);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        if (!window.location.href.startsWith("https://dijon.monespaceprepa.fr/evaluations/elearning_resultats/")) {
            modifySubmitButton();
        }
    });
} else {
    if (!window.location.href.startsWith("https://dijon.monespaceprepa.fr/evaluations/elearning_resultats/")) {
        modifySubmitButton();
    }
}
