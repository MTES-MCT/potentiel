import { Given as EtantDonné, DataTable } from '@cucumber/cucumber';
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

EtantDonné(
  'une demande complète de raccordement transmise auprès du gestionnaire de réseau {string} pour le projet {string}',
  async function (
    this: PotentielWorld,
    raisonSocialeGestionnaireRéseau: string,
    nomProjet: string,
  ) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);
    const { codeEIC } = this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(
      raisonSocialeGestionnaireRéseau,
    );

    const { référenceDossierRaccordement, format, content } = demandeComplèteRaccordementParDéfaut;
    const dateQualification = convertirEnDateTime(
      demandeComplèteRaccordementParDéfaut.dateQualification,
    );

    const accuséRéception = {
      format,
      content: convertStringToReadable(content),
    };

    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        dateQualification,
        accuséRéception,
      },
    });

    this.raccordementWorld.dossierRaccordementFixtures.set(référenceDossierRaccordement, {
      référenceDossierRaccordement,
      demandeComplèteRaccordement: {
        dateQualification: dateQualification.date,
        accuséRéceptionDemandeComplèteRaccordement: {
          format,
          content,
        },
      },
    });
  },
);

EtantDonné(
  'une demande complète de raccordement transmise auprès du gestionnaire de réseau {string} pour le projet {string} avec :',
  async function (
    this: PotentielWorld,
    raisonSociale: string,
    nomProjet: string,
    table: DataTable,
  ) {
    const { identifiantProjet } = this.projetWorld.rechercherProjetFixture(nomProjet);

    const exemple = table.rowsHash();
    const dateQualification = convertirEnDateTime(
      exemple['La date de qualification'] ?? demandeComplèteRaccordementParDéfaut.dateQualification,
    );

    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    const accuséRéception = {
      format,
      content: convertStringToReadable(content),
    };

    const { codeEIC } =
      this.gestionnaireRéseauWorld.rechercherGestionnaireRéseauFixture(raisonSociale);

    await mediator.send<DomainUseCase>({
      type: 'TRANSMETTRE_DEMANDE_COMPLÈTE_RACCORDEMENT_USE_CASE',
      data: {
        identifiantProjet: convertirEnIdentifiantProjet(identifiantProjet),
        identifiantGestionnaireRéseau: convertirEnIdentifiantGestionnaireRéseau(codeEIC),
        référenceDossierRaccordement: convertirEnRéférenceDossierRaccordement(
          référenceDossierRaccordement,
        ),
        dateQualification,
        accuséRéception,
      },
    });

    this.raccordementWorld.dossierRaccordementFixtures.set(référenceDossierRaccordement, {
      référenceDossierRaccordement,
      demandeComplèteRaccordement: {
        dateQualification: dateQualification.date,
        accuséRéceptionDemandeComplèteRaccordement: {
          format,
          content,
        },
      },
    });
  },
);
