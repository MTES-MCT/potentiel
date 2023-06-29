import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import {
  convertirEnDateTime,
  DomainUseCase,
  convertirEnIdentifiantProjet,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnRéférenceDossierRaccordement,
  IdentifiantProjet,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { convertStringToReadable } from '../../helpers/convertStringToReadable';

type DemandeComplèteRaccordement = {
  identifiantProjet: IdentifiantProjet;
  raisonSociale: string;
  dateQualification: string | Date;
  référenceDossierRaccordement: string;
  format: string;
  content: string;
};

const demandeComplèteRaccordementParDéfaut: Omit<
  DemandeComplèteRaccordement,
  'raisonSociale' | 'identifiantProjet'
> = {
  dateQualification: new Date(),
  référenceDossierRaccordement: 'REF_DOSSIER',
  format: 'application/pdf',
  content: `Accusé de réception ayant pour référence REF_DOSSIER et la date de qualification au ${new Date().toISOString()}`,
};

Quand(
  `un porteur transmet une demande complète de raccordement auprès du gestionnaire de réseau {string} pour le projet {string}`,
  async function (this: PotentielWorld, raisonSociale: string, nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    await transmettreDemandeComplèteRaccordement(this, {
      ...demandeComplèteRaccordementParDéfaut,
      identifiantProjet,
      raisonSociale,
    });
  },
);

Quand(
  `un porteur transmet une demande complète de raccordement auprès du gestionnaire de réseau {string} pour le projet {string} avec( la même référence) :`,
  async function (
    this: PotentielWorld,
    raisonSociale: string,
    nomProjet: string,
    table: DataTable,
  ) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const exemple = table.rowsHash();

    const dateQualification =
      exemple['La date de qualification'] ?? demandeComplèteRaccordementParDéfaut.dateQualification;
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    await transmettreDemandeComplèteRaccordement(this, {
      identifiantProjet,
      raisonSociale,
      dateQualification,
      référenceDossierRaccordement,
      format,
      content,
    });
  },
);

Quand(
  `un porteur transmet une demande complète de raccordement auprès du gestionnaire de réseau {string} pour le projet {string} avec une date dans le futur`,
  async function (this: PotentielWorld, raisonSociale: string, nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);
    const aujourdhui = new Date();
    const dateFutur = new Date(
      aujourdhui.getFullYear() + 1,
      aujourdhui.getMonth(),
      aujourdhui.getDay(),
    );

    await transmettreDemandeComplèteRaccordement(this, {
      ...demandeComplèteRaccordementParDéfaut,
      identifiantProjet,
      raisonSociale,
      dateQualification: dateFutur,
    });
  },
);

Quand(
  `un porteur transmet une demande complète de raccordement auprès d'un gestionnaire de réseau non référencé pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    await transmettreDemandeComplèteRaccordement(this, {
      ...demandeComplèteRaccordementParDéfaut,
      identifiantProjet,
      raisonSociale: 'GESTIONNAIRE_NON_RÉFÉRENCÉ',
    });
  },
);

const transmettreDemandeComplèteRaccordement = async (
  world: PotentielWorld,
  {
    identifiantProjet,
    raisonSociale,
    dateQualification,
    référenceDossierRaccordement,
    content,
    format,
  }: DemandeComplèteRaccordement,
) => {
  const dateQualificationValueType = convertirEnDateTime(dateQualification);
  const accuséRéceptionContent =
    content ??
    `Accusé de réception ayant pour référence ${référenceDossierRaccordement} et la date de qualification au ${dateQualificationValueType.formatter()}`;

  const accuséRéception = {
    format,
    content: convertStringToReadable(accuséRéceptionContent),
  };

  const codeEIC =
    raisonSociale === 'GESTIONNAIRE_NON_RÉFÉRENCÉ'
      ? raisonSociale
      : world.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale).codeEIC;

  world.raccordementWorld.dateQualification = dateQualificationValueType;
  world.raccordementWorld.référenceDossierRaccordement = référenceDossierRaccordement;
  world.raccordementWorld.accuséRéceptionDemandeComplèteRaccordement = {
    format,
    content: accuséRéceptionContent,
  };

  try {
    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        dateQualification: dateQualificationValueType,
        accuséRéception,
      },
    });
  } catch (e) {
    world.error = e as Error;
  }
};
