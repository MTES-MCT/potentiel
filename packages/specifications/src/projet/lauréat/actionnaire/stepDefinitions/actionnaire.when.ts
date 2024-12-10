import { When as Quand } from '@cucumber/cucumber';
import { mediator } from 'mediateur';

import { Actionnaire } from '@potentiel-domain/laureat';
import { DateTime } from '@potentiel-domain/common';

import { PotentielWorld } from '../../../../potentiel.world';
import { waitForEvents } from '../../../../helpers/waitForEvents';

import { importerActionnaire } from './actionnaire.given';

Quand("l'actionnaire est importé pour le projet", async function (this: PotentielWorld) {
  try {
    await importerActionnaire.call(this);
  } catch (error) {
    this.error = error as Error;
  }
});

Quand(
  "le DGEC validateur modifie l'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaire.call(this, this.utilisateurWorld.adminFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "la DREAL modifie l'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaire.call(this, this.utilisateurWorld.drealFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur modifie l'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaire.call(this, this.utilisateurWorld.porteurFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur transmet l'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await transmettreActionnaire.call(this, this.utilisateurWorld.porteurFixture.email);
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le DGEC validateur modifie l'actionnaire avec la même valeur pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await modifierActionnaireSansChangement.call(
        this,
        this.utilisateurWorld.porteurFixture.email,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur demande le changement de l'actionnaire pour le projet {lauréat-éliminé}",
  async function (this: PotentielWorld, statutProjet: 'lauréat' | 'éliminé') {
    try {
      await demanderChangementActionnaire.call(
        this,
        statutProjet,
        this.utilisateurWorld.porteurFixture.email,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur demande le changement de l'actionnaire avec la même valeur pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await demanderChangementActionnaire.call(
        this,
        'lauréat',
        this.utilisateurWorld.porteurFixture.email,
        this.lauréatWorld.actionnaireWorld.importerActionnaireFixture.actionnaire,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "le porteur annule la demande de changement de l'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await annulerDemandeChangementActionnaire.call(
        this,
        this.utilisateurWorld.porteurFixture.email,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "la DREAL associée au projet accorde le changement d'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await accorderDemandeChangementActionnaire.call(
        this,
        this.utilisateurWorld.drealFixture.email,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

Quand(
  "la DREAL associée au projet rejette le changement d'actionnaire pour le projet lauréat",
  async function (this: PotentielWorld) {
    try {
      await rejeterDemandeChangementActionnaire.call(
        this,
        this.utilisateurWorld.drealFixture.email,
      );
    } catch (error) {
      this.error = error as Error;
    }
  },
);

export async function demanderChangementActionnaire(
  this: PotentielWorld,
  statutProjet: 'lauréat' | 'éliminé',
  utilisateur?: string,
  actionnaireValue?: string,
) {
  // initialisation d'actionnaire se fait via une saga
  await waitForEvents();

  const identifiantProjet =
    statutProjet === 'lauréat'
      ? this.lauréatWorld.identifiantProjet.formatter()
      : this.eliminéWorld.identifiantProjet.formatter();

  const {
    pièceJustificative: { format, content },
    demandéLe,
    demandéPar,
    raison,
    actionnaire,
  } = this.lauréatWorld.actionnaireWorld.demanderChangementActionnaireFixture.créer({
    demandéPar: utilisateur,
  });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.DemanderChangement',
    data: {
      raisonValue: raison,
      actionnaireValue: actionnaireValue ?? actionnaire,
      dateDemandeValue: demandéLe,
      identifiantUtilisateurValue: demandéPar,
      identifiantProjetValue: identifiantProjet,
      pièceJustificativeValue: {
        content,
        format,
      },
    },
  });
}

export async function annulerDemandeChangementActionnaire(
  this: PotentielWorld,
  utilisateur?: string,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { annuléeLe, annuléePar } =
    this.lauréatWorld.actionnaireWorld.annulerDemandeChangementActionnaireFixture.créer({
      annuléePar: utilisateur,
    });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.AnnulerDemandeChangement',
    data: {
      dateAnnulationValue: annuléeLe,
      identifiantUtilisateurValue: annuléePar,
      identifiantProjetValue: identifiantProjet,
    },
  });
}

export async function accorderDemandeChangementActionnaire(
  this: PotentielWorld,
  utilisateur?: string,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();
  const {
    réponseSignée: { format, content },
    accordéeLe,
    accordéePar,
  } = this.lauréatWorld.actionnaireWorld.accorderDemandeChangementActionnaireFixture.créer({
    accordéePar: utilisateur,
  });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.AccorderDemandeChangement',
    data: {
      accordéeLeValue: accordéeLe,
      accordéeParValue: accordéePar,
      identifiantProjetValue: identifiantProjet,
      réponseSignéeValue: {
        content,
        format,
      },
    },
  });
}

export async function rejeterDemandeChangementActionnaire(
  this: PotentielWorld,
  utilisateur?: string,
) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { rejetéeLe, rejetéePar, réponseSignée } =
    this.lauréatWorld.actionnaireWorld.rejeterDemandeChangementActionnaireFixture.créer({
      rejetéePar: utilisateur,
    });

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.RejeterDemandeChangement',
    data: {
      rejetéeLeValue: rejetéeLe,
      rejetéeParValue: rejetéePar,
      réponseSignéeValue: réponseSignée,
      identifiantProjetValue: identifiantProjet,
    },
  });
}

async function modifierActionnaire(this: PotentielWorld, modifiéPar: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { actionnaire, dateModification } =
    this.lauréatWorld.actionnaireWorld.modifierActionnaireFixture.créer();

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: actionnaire,
      dateModificationValue: dateModification,
    },
  });
}

async function transmettreActionnaire(this: PotentielWorld, modifiéPar: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  const { actionnaire, dateTransmission } =
    this.lauréatWorld.actionnaireWorld.transmettreActionnaireFixture.créer();

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.TransmettreActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: actionnaire,
      dateTransmissionValue: dateTransmission,
    },
  });
}

async function modifierActionnaireSansChangement(this: PotentielWorld, modifiéPar: string) {
  const identifiantProjet = this.lauréatWorld.identifiantProjet.formatter();

  await mediator.send<Actionnaire.ActionnaireUseCase>({
    type: 'Lauréat.Actionnaire.UseCase.ModifierActionnaire',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: modifiéPar,
      actionnaireValue: this.lauréatWorld.actionnaireWorld.importerActionnaireFixture.actionnaire,
      dateModificationValue: DateTime.now().formatter(),
    },
  });
}
