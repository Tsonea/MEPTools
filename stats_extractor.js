/*-------------------------------------------\
|                                            |
|                  MEPTools                  |
|               Author: PM. C.               |
|                                            |
|              Stats Extractor               |
|                                            |
\-------------------------------------------*/

/*--------------- DESCRIPTION --------------*/

// Ce script permet d'exporter les données des elearnings: matières, id, note, temps, etc. vers MEDTools.
// ATTENTION ! Ce script n'est plus à jour avec la dernière version de MEDTools. A mettre à jour.

/*------------------ SCOPE -----------------*/

// Ce script est executé sur les pages suivantes:
// - /evaluations/elearning_generate

/*-------------------------------------------*/

// Nouvelle fonction d'import des erreurs avec un retour sous forme de string "success" ou "error_sql" ou "error"
const importErrors = async (sqlScript) => {
    try {
        const response = await fetch("http://localhost/assets/php/import_errors.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ script: sqlScript }),
        });
  
        // Vérifie si la réponse est correcte (status 200-299)
        if (!response.ok) throw new Error("Erreur de la requête vers le serveur.");
  
        const data = await response.json();
  
        if (data.status === "error") {
            console.error("Erreur SQL:", data.message);
            return "error_sql";
        } else {
            console.log("Succès:", data.message);
            return "success";
        }
    } catch (error) {
        // Vérifie si l'erreur est due à une indisponibilité du serveur
        if (error.message.includes("Failed to fetch")) {
            console.warn("Serveur inaccessible. Erreur de connexion.");
            return "error_server_unreachable";
        }
        
        console.error("Erreur lors de l'exécution ou de la réponse JSON:", error);
        return "error";
    }
};

function extractStats() {
  
    try {
  
        document.getElementById("MEPTools_ExtractStats").innerText = "Extraction en cours..."; // Changer le texte du bouton
        document.getElementById("MEPTools_ExtractStats").disabled = true;
        document.getElementById("MEPTools_ExtractStats").style.backgroundColor = "#af638f";
    
        // Désactiver le bouton MEPTools_ExtractStats
        const button = document.getElementById("MEPTools_ExtractStats");
        button.disabled = true;
        button.style.backgroundColor = "#af638f"; // Couleur de fond
    
        // Afficher le tableau "tab-pane p-2" en ajoutant la classe active
        const tabPane = document.querySelector("div.tab-pane.p-2");
        tabPane.classList.add("active");
    
        //ajouter une option dans le select avec la classe custom-select custom-select-sm form-control form-control-sm et sélectionner cette option
        const select = document.querySelector("select.custom-select.custom-select-sm.form-control.form-control-sm");
        const option = document.createElement("option");
        option.value = "100000";
        option.text = "100000";
        select.appendChild(option);
        select.value = "100000";
    
        //simuler un changement d'option pour afficher les stats
        select.dispatchEvent(new Event("change"));
    
        const table = document.querySelector("table.table-bordered.table-striped.text-center.dataTable.no-footer");
        const rows = table.querySelectorAll("tbody tr");
    
        list_subjects = [] // Liste des matières
    
        let sqlScript = "";
    
        //delete all rows in subjects_stats
        sqlScript += "DELETE FROM sessions_stats;\n";
    
        // parcourir les tr pour extraire les données
        rows.forEach(row => {
  
            //recuperer le nom de la matière
            const subject = row.querySelector("td:nth-child(1)").innerText;
    
            if (subject != "Méthodologie générale"){
    
            //if subject not in list_subjects
            if (!list_subjects.includes(subject)) {
                
                list_subjects.push(subject);
                sqlScript += `INSERT IGNORE INTO subjects (subject, is_enabled) VALUES ('${subject}', 1);\n`;
    
            }
    
            //recuperer le nombre de qcm
            const nb_qcm = row.querySelector("td:nth-child(2)").innerText;
    
            //recuperer la date de la session
            let session_date = row.querySelector("td:nth-child(3)").innerText;
            //ajouter ":00" à la fin de la date pour avoir le format YYYY-MM-DD HH:MM:SS
            session_date += ":00";
            //convertir la date en format YYYY-MM-DD HH:MM:SS
            const [date, time] = session_date.split(" ");
            const [day, month, year] = date.split("/");
            session_date = `${year}-${month}-${day} ${time}`;
    
            //recuperer la note
            const score = row.querySelector("td:nth-child(4)").innerText;
    
            //recuperer l'id de la session présent dans la dernière partie du lien href de la 5e colonne
            const id_session_mep = row.querySelector("td:nth-child(5) a").href.split("/").pop();
    
            //ajouter une ligne dans la table sessions
            sqlScript += `INSERT IGNORE INTO sessions_stats (n_qcm, id_session_mep, score, datetime, id_subject, id_user) VALUES (${nb_qcm}, "${id_session_mep}", ${score}, '${session_date}', (SELECT id_subject FROM subjects WHERE UPPER(subject) = UPPER('${subject}')), 1);\n`;
            }
        });
  
        importErrors(sqlScript).then(result => {
            if (result == "success") {
                document.getElementById("MEPTools_ExtractStats").innerText = "Stats mises à jour !";
            }
            else if (result == "error_sql") {
                //change le texte du bouton pour indiquer que l'extraction a échoué
                document.getElementById("MEPTools_ExtractStats").innerText = "Erreur SQL...";
            }
            else {
                //change le texte du bouton pour indiquer que l'extraction a échoué
                document.getElementById("MEPTools_ExtractStats").innerText = "Erreur serveur...";
            }
            //delai de 2 secondes avant de remettre le texte initial
            setTimeout(() => {
                document.getElementById("MEPTools_ExtractStats").innerText = "Mettre à jour les stats";
                document.getElementById("MEPTools_ExtractStats").disabled = false;
                document.getElementById("MEPTools_ExtractStats").style.backgroundColor = "#8c185b";
            }, 2000);
        });
  
        }
        catch(e){
        //change le texte du bouton pour indiquer que l'extraction a échoué
        console.log(e);
        document.getElementById("MEPTools_ExtractStats").innerText = "Extraction échouée...";
        //delai de 2 secondes avant de remettre le texte initial
        setTimeout(() => {
            document.getElementById("MEPTools_ExtractStats").innerText = "Mettre à jour les stats";
            document.getElementById("MEPTools_ExtractStats").disabled = false;
            document.getElementById("MEPTools_ExtractStats").style.backgroundColor = "#8c185b";
        }, 2000);
        
    }
    
};

// Fonction pour ajouter du contenu dans la div MEPTools
function insertMEPToolsButtons(){
    
    createButton({
        id: "MEPTools_ExtractStats",
        text: "Mettre à jour les stats",
        disabled: true,
        action: extractStats,
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        insertMEPToolsButtons();
    });
} else {
    insertMEPToolsButtons();
}