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
  `un porteur transmet une demande complète de raccordement auprès du gestionnaire de réseau {string} pour le projet {string} avec( la même référence)( une date dans le futur) :`,
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
    const référenceDossierRaccordement =
      exemple['La référence du dossier de raccordement'] ??
      demandeComplèteRaccordementParDéfaut.référenceDossierRaccordement;
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const codeEIC =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale).codeEIC;

    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          dateQualification: convertirEnDateTime(dateQualification),
          accuséRéception: {
            format,
            content: convertStringToReadable(content),
          },
        },
      });
    } catch (e) {
      this.error = e as Error;
    }

    this.raccordementWorld.demandeComplèteRaccordementFixtures.set(référenceDossierRaccordement, {
      dateQualification: new Date(dateQualification),
      accuséRéceptionDemandeComplèteRaccordement: {
        format,
        content,
      },
    });
  },
);

Quand(
  `un porteur transmet une demande complète de raccordement auprès d'un gestionnaire de réseau non référencé pour le projet {string}`,
  async function (this: PotentielWorld, nomProjet: string) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);
    const { référenceDossierRaccordement, dateQualification, format, content } =
      demandeComplèteRaccordementParDéfaut;

    try {
      await mediator.send<DomainUseCase>({
        type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(
            'GESTIONNAIRE_NON_RÉFÉRENCÉ',
          ),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          dateQualification: convertirEnDateTime(dateQualification),
          accuséRéception: {
            format,
            content: convertStringToReadable(content),
          },
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);

Quand(
  `un porteur modifie la demande complète de raccordement {string} du projet {string} avec( une date dans le futur) :`,
  async function (
    this: PotentielWorld,
    référenceDossierRaccordement: string,
    nomProjet: string,
    table: DataTable,
  ) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const exemple = table.rowsHash();

    const dateQualification =
      exemple['La date de qualification'] ?? demandeComplèteRaccordementParDéfaut.dateQualification;
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    try {
      await mediator.send<DomainUseCase>({
        type: 'MODIFIER_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
        data: {
          identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
          référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
            référenceDossierRaccordement,
          ),
          dateQualification: convertirEnDateTime(dateQualification),
          accuséRéception: {
            format,
            content: convertStringToReadable(content),
          },
        },
      });

      this.raccordementWorld.demandeComplèteRaccordementFixtures.set(référenceDossierRaccordement, {
        dateQualification: new Date(dateQualification),
        accuséRéceptionDemandeComplèteRaccordement: {
          format,
          content,
        },
      });
    } catch (e) {
      this.error = e as Error;
    }
  },
);
