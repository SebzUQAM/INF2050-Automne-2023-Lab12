function FormValidateur(){
    this.ClassCache = "cache";
    this.champs;
    this.elements = new Object();
    this.montantReclames = [];
    this.submitButton;
    this.erreurDiv;
    this.valeurs = new Object();
    this.calculeDiv;

    this.setCalculeDiv = function(idDiv){
        this.calculeDiv = document.getElementById(idDiv);
    }

    this.setSubmitButton = function(idButton){
        this.submitButton = document.getElementById(idButton);
    }
    
    this.setErreurDiv = function(id){
        this.erreurDiv = document.getElementById(id);
    }

    this.creerElements = function(elements){
        for(let i=0;i<elements.length;i++){
            let element = new Element();
            element.affiche = i===0;
            element.index = i;
            element.element = document.getElementById(elements[i]).parentElement;
            this.elements[elements[i]] = element;
        }
    }

    this.cacherElementsSuivant = function(elements = [], index = 1){
        this.champs = elements;
        this.elements[elements[index]].affiche = false;
        this.cacherElements(true);
    }

    this.verifierRadio = function(radioName, champSuivant, condition = null, fin = false){
        let radios = document.getElementsByName(radioName);
        let elementSuivant = document.getElementById(champSuivant).parentElement;

        
        for(i = 0; i < radios.length; i++){
            radios[i].addEventListener("change", () => {
                let value = null;
                for(let btn of radios){
                    if(btn.checked){
                        value = btn.value;
                        break;
                    }
                }
                this.valeurs[radioName] = value;
                if(value != null && condition == null || condition.includes(value)){
                    this.cacherErreur(this.ClassCache);
                    this.elements[champSuivant].affiche = true;
                    this.cacherElements();
                }else{
                    if(!fin){
                        this.afficherErreur("Désoler ! Vous êtes non assurable !", this.ClassCache);
                        this.elements[champSuivant].affiche = false;
                        this.cacherElements();
                    }else{
                        this.fini();
                    }
                }
            });
        }
    }

    this.verifierDateNaissance = function(inputId, champSuivant, placeholder){
        let elementSuivant = document.getElementById(champSuivant).parentElement;
        placeholder = document.getElementById(placeholder);
        let input = document.getElementById(inputId);
        input.addEventListener("input", (e) => {
            if(e.target.value == ""){
                placeholder.classList.add(this.ClassCache);
            }else{
                placeholder.classList.remove(this.ClassCache);
            }

            let split = e.target.value.split("/");
            if(split.length == 3){
                let date = new Date(split[2]+"/"+split[1]+"/"+split[0]);
                if(
                    date != "Invalid Date" 
                    && date.getDate() == split[0] 
                    && date.getMonth()+1 == split[1]
                    && date.getFullYear() == split[2]
                    && date.getFullYear() > 1900
                    && date < Date.now()
                    ){
                        this.cacherErreur(this.ClassCache);
                        this.elements[champSuivant].affiche = true;
                        this.cacherElements();
                        this.valeurs[inputId] = date;
                }else{
                    this.afficherErreur("Date de naissance incorrecte !", this.ClassCache);
                    this.elements[champSuivant].affiche = false;
                    this.cacherElements();
                }
            }else{
                this.afficherErreur("Date de naissance incorrecte !", this.ClassCache);
                this.elements[champSuivant].affiche = false;
                this.cacherElements();
            }
        });
    }

    this.verifierArgent = function(inputID, champSuivant){
        let input = document.getElementById(inputID);

        input.addEventListener("input", (e) => {
            if(verifierTexteArgent(e.target.value)){
                this.cacherErreur(this.ClassCache);
                this.elements[champSuivant].affiche = true;
                this.cacherElements();
                this.valeurs[inputID] = parseInt(e.target.value.trim());
            }else{
                this.afficherErreur("Montant d'argent incorrect !", this.ClassCache);
                this.elements[champSuivant].affiche = false;
                this.cacherElements();
            }
        });
    }

    function verifierTexteArgent(value){
        value = value.trim();
        if(value.charAt(value.length-1) === "$"){
            value = value.slice(0, -1);
        }

        value = value.replace(",", ".");
        let apresVirgule = value.split(".")[1];

        let resultat = parseFloat(value) == value;
        resultat = resultat && value.charAt(0) !== "-";
        resultat = resultat && (apresVirgule === undefined 
            || (apresVirgule.length <=2 && apresVirgule.length !== 0));
        return resultat;
    }

    this.verifierAnnee = function(inputID, champSuivant){
        let input = document.getElementById(inputID);

        input.addEventListener("input", (e) => {
            e.target.value = e.target.value.trim();
            let value = parseInt(e.target.value.trim());

            if(value == e.target.value && value > 1900 && new Date().getFullYear()+1 >= value){
                this.cacherErreur(this.ClassCache);
                this.elements[champSuivant].affiche = true;
                this.cacherElements();
                this.valeurs[inputID] = value;
            }else{
                this.afficherErreur("Année incorrecte !", this.ClassCache);
                this.elements[champSuivant].affiche = false;
                this.cacherElements();
            }
        });
    }

    this.verifierKM = function(inputID, champSuivant){
        let input = document.getElementById(inputID);

        input.addEventListener("input", (e) => {
            let value = e.target.value.trim();
        
            if(value.substring(value.length-2).toLowerCase() === "km"){
                value = value.slice(0, -2);
                value = value.trim();
            }

            if(value == parseInt(value)){
                this.cacherErreur(this.ClassCache);
                this.elements[champSuivant].affiche = true;
                this.cacherElements();
                this.valeurs[inputID] = parseInt(value);
            }else{
                this.afficherErreur("KM incorrecte !", this.ClassCache);
                this.elements[champSuivant].affiche = false;
                this.cacherElements();
            }
        });
    };

    this.verificationReclamation = function(inputID, champSuivant){
        champSuivant = document.getElementById(champSuivant).parentElement;
        let input = document.getElementById(inputID);
        let champs = [];

        input.addEventListener("input", (e) => {
            let value = e.target.value.trim();

            if(value == parseInt(value)){
                for(let i=this.montantReclames.length-1; i>=value; i--){
                    this.montantReclames[i].element.remove();
                    this.montantReclames.pop();
                }
                let lastElement = champSuivant;
                if(this.montantReclames.length > 0){
                    lastElement = this.montantReclames[this.montantReclames.length - 1].element;
                }
                let currentElement;
                let inputText;
                for(let i=this.montantReclames.length; i<value; i++){
                    currentElement = champSuivant.cloneNode(true);
                    lastElement.after(currentElement);
                    currentElement.classList.remove(this.ClassCache);
                    currentElement.innerHTML = currentElement.innerHTML.replace("{{nb}}", i+1);
                    inputText = currentElement.getElementsByTagName("input")[0];
                    inputText.id = inputText.id+(i+1);
                    inputText.setAttribute( "name", inputText.getAttribute("name")+(i+1) );
                    inputText.addEventListener("input", (e) => {this.cacherElements();});
                    champs.push(currentElement);
                    lastElement = currentElement;
                    let newElement = new Element();
                    newElement.element = currentElement;
                    newElement.input = inputText;
                    this.montantReclames.push(newElement);
                }
                this.cacherErreur(this.ClassCache);
            }else{
                this.afficherErreur("Entrez un nombre valide, svp !", this.ClassCache);
                for(let i=0; i<this.montantReclames.length;i++){
                    this.montantReclames[i].element.remove();
                }
                this.montantReclames = [];
            }
        });
    };

    this.cacherElements = function(cacherLeDernier = false){
        let afficher = true;
        let length = this.champs.length;
        if(!cacherLeDernier){
            length--;
        }
        for(let i=0; i<length; i++){
            let element = this.elements[this.champs[i]];
            if(afficher && element.affiche){
                element.element.classList.remove(this.ClassCache);
                element.afficherEvent(this.montantReclames, this.ClassCache);
            }else{
                afficher = false;
                element.cacherEvent(this.montantReclames, this.ClassCache);
                element.element.classList.add(this.ClassCache);
            }
        }
        if(this.montantReclames.length === 0){
            afficher = false;
        }
        this.valeurs["reclamation"] = [];
        for(let i=0; afficher && i<this.montantReclames.length; i++){
            let value = this.montantReclames[i].input.value;
            this.valeurs["reclamation"].push(value);
            if( !verifierTexteArgent(value)){
                afficher = false;
                this.afficherErreur("Un des montants de réclamation est incorrect !", this.ClassCache);
            }
        }
        if(afficher){
            this.fini();
        }else{
            this.submitButton.disabled = true;
            this.calculeDiv.classList.add(this.ClassCache);
        }
    }

    this.cacherMontantReclames = function(montantReclames, classCache){
        for(let i=0; i<montantReclames.length; i++){
            montantReclames[i].element.classList.add(classCache);
        }
    }

    this.afficherMontantReclames = function(montantReclames, classCache){
        for(let i=0; i<montantReclames.length; i++){
            montantReclames[i].element.classList.remove(classCache);
        }
    }

    this.afficherErreur = function(message, classCache){
        this.erreurDiv.classList.remove(classCache);
        this.erreurDiv.innerHTML = "<p>" + message + "</p>";
    }

    this.cacherErreur = function(classCache){
        this.erreurDiv.classList.add(classCache);
    }

    this.fini = function(){
        this.calculeDiv.classList.remove(this.ClassCache);
        this.cacherErreur(this.ClassCache);

        let assurable = true;

        let age = getAge(this.valeurs["date_naissance"]);
        if(this.valeurs["genre"] === "Masculin" || this.valeurs["genre"] === "Autre"){
            if(age < 18){
                assurable = false;
            }
        }else{
            if(age < 16){
                assurable = false;
            }
        }

        if(assurable && age >= 100){
            assurable = false;
        }

        if(assurable && new Date().getFullYear() - this.valeurs["annee_fabrication"] > 25){
            assurable = false;
        }

        if(assurable && this.valeurs["valeur_achat"] > 100000){
            assurable = false;
        }

        let totalReclamation = 0;
        if(assurable && this.valeurs["reclamation"].length > 4){
            assurable = false;
        }else if(assurable){
            for(let i=0; i<this.valeurs["reclamation"].length; i++){
                totalReclamation += parseFloat( this.valeurs["reclamation"][i] );
            }
            if(totalReclamation > 35000){
                assurable = false;
            }
        }

        if(assurable && this.valeurs["kilometres_annuels"] > 50000){
            assurable = false;
        }

        if(assurable){
            this.submitButton.disabled = false;

            let montant = this.valeurs["valeur_achat"] * 0.015;
            if(this.valeurs["genre"] === "Masculin" || this.valeurs["genre"] === "Autre"){
                if(age < 25){
                    montant = this.valeurs["valeur_achat"] * 0.05;
                }
            }
            if(age >= 75){
                montant = this.valeurs["valeur_achat"] * 0.04;
            }

            montant += this.valeurs["reclamation"].length * 350;
            montant += this.valeurs["kilometres_annuels"] * 0.02;
            if(totalReclamation > 25000){
                montant += 700;
            }
            this.calculeDiv.innerHTML = "<p>D'après nos calcule la soumission annuel serait de " 
            + getRound(montant) + "$ ou "+ getMontantParMois(montant) +"$ par mois !</p>";
        }else{
            this.calculeDiv.innerHTML = "<p>Désoler ! Vous êtes non assurable !</p>";
        }
    }

    function Element(){
        this.affiche = true;
        this.index;
        this.element;
        this.input;
        this.cacherEvent = function(){};
        this.afficherEvent = function(){};
    }

    function getAge(date) {
        let diff = Date.now() - date.getTime(); 
        let age_dt = new Date(diff);
        let year = age_dt.getUTCFullYear();
        return Math.abs(year - 1970); 
    }

    function getMontantParMois(montant){
        return getRound(montant/12);
    }

    function getRound(montant){
        return Math.round(montant * 100) / 100;
    }
}