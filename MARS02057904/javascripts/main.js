window.addEventListener("load", OnLoad)

function OnLoad(){
    let validateur = new FormValidateur();

    let elements = [];
    elements.push(
        "camera_recul",
        "genre",
        "date_naissance",
        "valeur_achat",
        "annee_fabrication",
        "kilometres_annuels",
        "reclamations",
        "nombre_reclamations",
        "montant_reclamation"
    );

    validateur.setSubmitButton("form_devis_button");
    validateur.setErreurDiv("form_devis_error");
    validateur.setCalculeDiv("form_devis_calcule");
    validateur.creerElements(elements);
    validateur.cacherElementsSuivant(elements, 1);

    validateur.elements["nombre_reclamations"].cacherEvent = validateur.cacherMontantReclames;
    validateur.elements["nombre_reclamations"].afficherEvent = validateur.afficherMontantReclames;

    let i = 0;
    validateur.verifierRadio(elements[i++], elements[i], ["Oui"]);
    validateur.verifierRadio(elements[i++], elements[i]);
    validateur.verifierDateNaissance(elements[i++], elements[i], "date_naissance_placeholder");
    validateur.verifierArgent(elements[i++], elements[i]);
    validateur.verifierAnnee(elements[i++], elements[i]);
    validateur.verifierKM(elements[i++], elements[i]);
    validateur.verifierRadio(elements[i++], elements[i], ["Oui"], true);
    validateur.verificationReclamation(elements[i++], elements[i]);
}