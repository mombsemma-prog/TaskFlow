const taches = [];
const corbeille = [];
const listeTaches = document.getElementById("task-list");
const formulaire = document.getElementById("task-form");
const boutonFormulaire = formulaire.querySelector('button[type="submit"]');
const objectif = document.getElementById("task-objectif");
const erreurObjectif = document.getElementById("objectif-error");
const erreurTitre = document.getElementById("title-error");
const erreurDate = document.getElementById("date-error");
const boutonToutes = document.getElementById("all-filter");
const boutonAFaire = document.getElementById("todo-filter");
const boutonFaites = document.getElementById("done-filter");
const boutonCorbeille = document.getElementById("trash-button");
const accueil = document.querySelector("#task-acceuil");
const application = document.querySelector("#application");
const boutonCommencer = document.querySelector("#commencer-btn");
const boutonsPriorite = document.querySelectorAll(".priority-option");
const prioriteSelectionnee = document.getElementById("task-priority-value");
const boutonsCategorie = document.querySelectorAll(".category-option");
const categorieSelectionnee = document.getElementById("task-category-value");
boutonsCategorie.forEach(function(bouton) {
    bouton.addEventListener("click", function() {
        boutonsCategorie.forEach(function(bouton) {
            bouton.classList.remove("selected");
        });
        bouton.classList.add("selected");
        categorieSelectionnee.value = bouton.dataset.category;
        console.log("Catégorie sélectionnée :", categorieSelectionnee.value);
    });
});
document.querySelector('[data-category="cours"]').classList.add("selected");
boutonsPriorite.forEach(function(bouton) {
    bouton.addEventListener("click", function() {
        boutonsPriorite.forEach(function(bouton) {
            bouton.classList.remove("selected");
        });
        bouton.classList.add("selected");
        prioriteSelectionnee.value = bouton.dataset.priority;
        console.log("Priorité sélectionnée :", prioriteSelectionnee.value);
    });
});
document.querySelector('[data-priority="moyenne"]').classList.add("selected");
boutonCommencer.addEventListener("click", function() {
    accueil.style.display = "none";
    application.style.display = "flex";
});
let tacheEnModification = null;
let elementEnModification = null;
let filterActuel ="toutes";
const tachesSauvegardees = JSON.parse(localStorage.getItem("taches")) || [];
const corbeilleSauvegardee = JSON.parse(localStorage.getItem("corbeille")) || [];
function sauvegarderTaches() {
    localStorage.setItem("taches", JSON.stringify(taches));
    localStorage.setItem("corbeille", JSON.stringify(corbeille));
}
taches.push(...tachesSauvegardees);
corbeille.push(...corbeilleSauvegardee);
taches.forEach(function(tache) {
    afficherTache(tache);
});
function afficherTache(tache) {
    const elementTaches = document.createElement("div");
    elementTaches.classList.add("task-card");
  if (tache.faite) {
    elementTaches.classList.add("task-done");
  }
    elementTaches.innerHTML = `
        <h3>${tache.titre}</h3>
        <div class="task-info">
            <p>Objectif : ${tache.objectif}</p>
            <p>Catégorie : ${tache.categorie}</p>
            <p class="task-priority-${tache.priorite}">Priorité : ${tache.priorite}</p>
            <p>Date : ${tache.date}</p>
            <p class="task-status-${tache.faite ? "fait" : "a-faire"}">Statut : ${tache.faite ? "Fait" : "A faire"}</p> 
        </div>
        <div class="task-buttons">
            <button class="complete-btn">Terminer</button>
            <button class="resume-btn">Reprendre</button>
            <button class="delete-btn">Supprimer</button>
            <button class="edit-btn">Modifier</button>
        </div>
`;
const boutonTerminer = elementTaches.querySelector(".complete-btn");
const boutonReprendre = elementTaches.querySelector(".resume-btn");
if (tache.faite) {
    boutonTerminer.style.display = "none";
}
if (!tache.faite) {
    boutonReprendre.style.display = "none";
}
const boutonSupprimer = elementTaches.querySelector(".delete-btn");
const boutonModifier = elementTaches.querySelector(".edit-btn");
boutonTerminer.addEventListener("click", function() {
    console.log("Bouton cliqué !");
    tache.faite = true;
    afficherTaches(filterActuel);
    sauvegarderTaches();
    console.log(tache);
});
boutonReprendre.addEventListener("click", function() {
    console.log("Bouton reprendre cliqué !");
    tache.faite = false;
    afficherTaches(filterActuel);
    sauvegarderTaches();
    console.log(tache);
});
boutonSupprimer.addEventListener("click", function() {
    console.log("Bouton supprimer cliqué !");
    const index = taches.findIndex(function(t) {
        return t.id === tache.id;
    });
    console.log(index);
    corbeille.push(tache);
    taches.splice(index, 1);
     sauvegarderTaches();
    afficherTaches(filterActuel);
});
boutonModifier.addEventListener("click", function() {
    console.log("Bouton modifier cliqué !");
    tacheEnModification = tache;
    elementEnModification = elementTaches;
    boutonFormulaire.textContent = "Enregistrer les modifications";
    document.getElementById("task-title").value = tache.titre;
    document.getElementById("task-objectif").value = tache.objectif;
    document.getElementById("task-category-value").value = tache.categorie;
    document.getElementById("task-priority-value").value = tache.priorite;
    boutonsCategorie.forEach(function(bouton) {
    bouton.classList.remove("selected");
});
    document.querySelector('[data-category="' + tache.categorie + '"]').classList.add("selected");
    boutonsPriorite.forEach(function(bouton) {
    bouton.classList.remove("selected");
});
    document.querySelector('[data-priority="' + tache.priorite + '"]').classList.add("selected");
    document.getElementById("task-date").value = tache.date;
});
    listeTaches.appendChild(elementTaches);
}
function afficherTaches(filter) {
    listeTaches.innerHTML = "";
    taches.forEach(function(tache) {
        if (filter === "toutes") {
            afficherTache(tache);
        }
        if (filter === "a-faire" && !tache.faite) {
            afficherTache(tache);
        }
        if (filter === "faites" && tache.faite) {
            afficherTache(tache);
        }
    });
}

function afficherCorbeille() {
    listeTaches.innerHTML ="";
    corbeille.forEach(function(tache) {
        afficherTacheCorbeille(tache);
    })
}
function afficherTacheCorbeille(tache) {
    const elementTaches = document.createElement("div");
    elementTaches.classList.add("task-card");
    elementTaches.innerHTML = `
    <h3>${tache.titre}</h3>
    <p>Objectif : ${tache.objectif}</p>
    <p>Catégorie : ${tache.categorie}</p>
    <p class="task-priority-${tache.priorite}">Priorité : ${tache.priorite}</p>
    <p>Date : ${tache.date}</p>
    <button class="restore-btn">Restaurer</button>
    <button class="delete-permanent-btn">Supprimer définitivement</button>
    `;
    const boutonRestaurer = elementTaches.querySelector(".restore-btn");
    boutonRestaurer.addEventListener("click", function() {
        console.log("Bouton restaurer cliqué !");
        corbeille.splice(corbeille.indexOf(tache), 1);
        tache.faite = false;
        taches.push(tache);
        sauvegarderTaches();
        afficherCorbeille();
        console.log(tache);
    });
    listeTaches.appendChild(elementTaches);
    const boutonSupprimerDefinitivement = elementTaches.querySelector(".delete-permanent-btn");
    boutonSupprimerDefinitivement.addEventListener("click", function() {
        console.log("Bouton supprimer définitivement cliqué !");
        const index = corbeille.indexOf(tache);
        corbeille.splice(index, 1);
        sauvegarderTaches();
        afficherCorbeille();
    });
}
function activerFiltre(boutonActif) {
    console.log(boutonActif);
    boutonToutes.classList.remove("filter-active");
    boutonAFaire.classList.remove("filter-active");
    boutonFaites.classList.remove("filter-active");
    boutonCorbeille.classList.remove("filter-active");
    boutonActif.classList.add("filter-active");
}
boutonToutes.addEventListener("click", function() {
    filterActuel ="toutes";
    activerFiltre(boutonToutes);
    afficherTaches(filterActuel);
    boutonToutes.classList.add("filter-active");
    boutonAFaire.classList.remove("filter-active");
    boutonFaites.classList.remove("filter-active");
    boutonCorbeille.classList.remove("filter-active");
});
boutonAFaire.addEventListener("click", function() {
    filterActuel ="a-faire";
    activerFiltre(boutonAFaire);
    afficherTaches(filterActuel);
});
boutonFaites.addEventListener("click", function() {
    filterActuel ="faites";
    activerFiltre(boutonFaites);
    afficherTaches(filterActuel);
});
boutonCorbeille.addEventListener("click", function() {
    console.log("Bouton corbeille cliqué !");
    activerFiltre(boutonCorbeille);
    afficherCorbeille();
});
function reinitialiserFormulaire() {
    document.getElementById("task-title").value = "";
    document.getElementById("task-objectif").value = "";
    document.getElementById("task-date").value = "";
    categorieSelectionnee.value = "cours";
    prioriteSelectionnee.value = "moyenne";
    boutonsCategorie.forEach(function(bouton) {
        bouton.classList.remove("selected");
    });
    document.querySelector('[data-category="cours"]').classList.add("selected");
    boutonsPriorite.forEach(function(bouton) {
        bouton.classList.remove("selected");
    });
    document.querySelector('[data-priority="moyenne"]').classList.add("selected");
    erreurTitre.textContent = "";
    erreurObjectif.textContent = "";
    erreurDate.textContent = "";
    boutonFormulaire.textContent = "Ajouter la tâche";
}
formulaire.addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("Le formulaire a été envoyé !")
    const titre = document.getElementById("task-title").value;
    if (titre.trim() === "") {
        erreurTitre.textContent = "Le titre de la tâche est obligatoire !";
        return;
    }
    erreurTitre.textContent ='';
    const objectif = document.getElementById("task-objectif").value;
    if (objectif.trim() === "") {
        erreurObjectif.textContent = "L'objectif est obligatoire !";
        return;
    }
    erreurObjectif.textContent ='';
    const categorie = document.getElementById("task-category-value").value;
    const priorite = document.getElementById('task-priority-value').value;
    const date = document.getElementById('task-date').value;
    const aujourdHui = new Date().toISOString().split("T")[0];
    if (date === "") {
        erreurDate.textContent = "La date d'échéance est obligatoire !";
        return;
    }
    if (date < aujourdHui) {
        erreurDate.textContent = "La date d'échéance est invalide";
        return;
    }
    erreurDate.textContent = "";
    const tache = { id: Date.now(), titre: titre, objectif: objectif, categorie: categorie, priorite: priorite, date: date, faite: false};
    if (tacheEnModification !== null) {
        tacheEnModification.titre = titre;
        tacheEnModification.objectif = objectif;
        tacheEnModification.categorie = categorie;
        tacheEnModification.priorite = priorite;
        tacheEnModification.date = date;
        elementEnModification.querySelector('.task-info p:nth-of-type(1)').textContent = "Objectif : " + objectif;
        elementEnModification.querySelector('.task-info p:nth-of-type(2)').textContent = "Catégorie : " + categorie;
        elementEnModification.querySelector('.task-info p:nth-of-type(3)').textContent = "Priorité : " + priorite;
        elementEnModification.querySelector('.task-info p:nth-of-type(4)').textContent = "Date : " + date;
        tacheEnModification = null;
        elementEnModification = null;
        reinitialiserFormulaire();
    } else {
        taches.push(tache);
        afficherTache(tache);
        reinitialiserFormulaire();
    }
    console.log(taches);
    console.log(JSON.stringify(taches));
    sauvegarderTaches();
});
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js")
        .then(function() {
            console.log("Service Worker enregistré !");
        })
        .catch(function(erreur) {
            console.log("Erreur Service Worker :", erreur);
        });
}