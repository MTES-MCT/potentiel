import { When as Quand, DataTable } from '@cucumber/cucumber';
import { PotentielWorld } from '../../potentiel.world';
import {
  convertirEnDateTime,
  DomainUseCase,
  convertirEnIdentifiantProjet,
  convertirEnIdentifiantGestionnaireRéseau,
  convertirEnRéférenceDossierRaccordement,
} from '@potentiel/domain';
import { mediator } from 'mediateur';
import { convertStringToReadable } from '../../helpers/convertStringToReadable';

type DemandeComplèteRaccordement = {
  raisonSociale: string;
  dateQualification: string | Date;
  référenceDossierRaccordement: string;
  format: string;
  content: string;
};

const demandeComplèteRaccordementParDéfaut: Omit<DemandeComplèteRaccordement, 'raisonSociale'> = {
  dateQualification: new Date(),
  référenceDossierRaccordement: 'REF_DOSSIER',
  format: 'application/pdf',
  content: `Accusé de réception ayant pour référence REF_DOSSIER et la date de qualification au ${new Date().toISOString()}`,
};

Quand(
  `le porteur d'un projet transmet une demande complète de raccordement auprès du gestionnaire de réseau {string}`,
  async function (this: PotentielWorld, raisonSociale: string) {
    await transmettreDemandeComplèteRaccordement(this, {
      ...demandeComplèteRaccordementParDéfaut,
      raisonSociale,
    });
  },
);

Quand(
  `le porteur d'un projet transmet une demande complète de raccordement auprès du gestionnaire de réseau {string} avec :`,
  async function (this: PotentielWorld, raisonSociale: string, table: DataTable) {
    const exemple = table.rowsHash();
    const dateQualification = exemple['La date de qualification'];
    const référenceDossierRaccordement = exemple['La référence du dossier de raccordement'];
    const format = exemple[`Le format de l'accusé de réception`];
    const content = exemple[`Le contenu de l'accusé de réception`];

    await transmettreDemandeComplèteRaccordement(this, {
      raisonSociale,
      dateQualification,
      référenceDossierRaccordement,
      format,
      content,
    });
  },
);

const transmettreDemandeComplèteRaccordement = async (
  world: PotentielWorld,
  {
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
    raisonSociale === 'Inconnu'
      ? 'Code EIC inconnu'
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
        identifiantProjet: convertirEnIdentifiantProjet(world.projetWorld.identifiantProjet),
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
