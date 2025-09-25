export var ErrorMessages;
(function (ErrorMessages) {
    // Auth et génériques existants
    ErrorMessages["MissingPassword"] = "Le password est obligatoire";
    ErrorMessages["MissingUserName"] = "Le nom de l'utilisateur est obligatoire";
    ErrorMessages["InvalidDescription"] = "La description est invalide";
    ErrorMessages["EmailAndPassword"] = "Email et mot de passe requis";
    ErrorMessages["IdentifiantsInvalides"] = "Identifiants invalides";
    ErrorMessages["TokenManquant"] = "Token manquant";
    ErrorMessages["TokenInvalide"] = "Token invalide";
    ErrorMessages["ValidationError"] = "Validation error";
    ErrorMessages["ErreurServeur"] = "Erreur serveur";
    ErrorMessages["EmailDejaUtilise"] = "Email d\u00E9j\u00E0 utilis\u00E9";
    ErrorMessages["ConfigManquanteSECRET"] = "Configuration manquante: SECRET";
    ErrorMessages["TacheNonTrouvee"] = "T\u00E2che non trouv\u00E9e";
    ErrorMessages["BAD_REQUEST"] = "La requ\u00EAte est invalide.";
    // Ajouts fusionnés depuis utils/errorsMessage.ts
    ErrorMessages["MissingPromoName"] = "Le nom de la promo est obligatoire";
    ErrorMessages["ProfileNotFound"] = "Profil non trouv\u00E9";
    ErrorMessages["PromoNotFound"] = "Promo non trouv\u00E9e";
    ErrorMessages["MissingReferentielName"] = "Le nom du r\u00E9f\u00E9rentiel est obligatoire";
    ErrorMessages["NameTooShort"] = "Le nom de la comp\u00E9tence doit contenir au moins 3 caract\u00E8res";
    ErrorMessages["NameTooLong"] = "Le nom de la comp\u00E9tence ne doit pas d\u00E9passer 50 caract\u00E8res";
    ErrorMessages["InvalidDescriptionType"] = "La description doit \u00EAtre une cha\u00EEne de caract\u00E8res";
    ErrorMessages["DescriptionTooLong"] = "La description ne doit pas d\u00E9passer 200 caract\u00E8res";
    ErrorMessages["MissingProfilSortie"] = "le nom de ProfilSortie est obligatoire";
    ErrorMessages["MissingNiveauName"] = "Le nom du niveau est obligatoire";
    ErrorMessages["MissingProfilId"] = "Le profil de l'utilisateur est obligatoire";
    ErrorMessages["InvalidProfilSortieId"] = "Le profil de sortie est invalide";
    ErrorMessages["MissingTagName"] = "Le nom du tag est obligatoire";
    ErrorMessages["TagNameTooShort"] = "Le nom du tag doit comporter au moins 2 caract\u00E8res";
    ErrorMessages["TagNameTooLong"] = "Le nom du tag ne peut pas d\u00E9passer 50 caract\u00E8res";
    ErrorMessages["MissingCompetenceName"] = "le nom de competence est obligatoire";
    ErrorMessages["NOREFRESHTOKEN"] = "Refresh token requis";
    ErrorMessages["USERINVALID"] = "Utilisateur introuvable";
    ErrorMessages["REFRESHTOKENINVALID"] = "Refresh token invalide";
    ErrorMessages["TOKEN_REQUIRED"] = "Le jeton d'authentification est requis.";
    ErrorMessages["TOKEN_INVALID"] = "Le jeton d'authentification est invalide ou expir\u00E9.";
    ErrorMessages["ACCESS_DENIED"] = "Acc\u00E8s refus\u00E9. Vous n'avez pas les permissions n\u00E9cessaires.";
    ErrorMessages["SERVER_ERROR"] = "Une erreur interne est survenue.";
    ErrorMessages["NOT_FOUND"] = "La ressource demand\u00E9e est introuvable.";
})(ErrorMessages || (ErrorMessages = {}));
//# sourceMappingURL=ErrorMessages.js.map