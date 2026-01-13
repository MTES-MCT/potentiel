import { mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { OperationRejectedError } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { ExportCSV } from '@potentiel-libraries/csv';
import { DateTime } from '@potentiel-domain/common';

import { apiAction } from '@/utils/apiAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { decodeParameter } from '@/utils/decodeParameter';

type ExporterRaccordementParameter = {
  params: {
    identifiant: string;
  };
};

type DossierRaccordementEnAttenteMiseEnServiceCSV = {
  identifiantProjet: IdentifiantProjet.RawType;
  appelOffre: IdentifiantProjet.ValueType['appelOffre'];
  periode: IdentifiantProjet.ValueType['période'];
  famille: IdentifiantProjet.ValueType['famille'];
  numeroCRE: IdentifiantProjet.ValueType['numéroCRE'];
  commune: string;
  codePostal: string;
  nomProjet: string;
  referenceDossier: Lauréat.Raccordement.RéférenceDossierRaccordement.RawType;
  statutDGEC: Lauréat.StatutLauréat.RawType;
  puissance: string;
  dateMiseEnService?: string;
  nomCandidat: string;
  societeMere: string;
  emailContact: string;
  siteProduction: string;
  dateNotification: DateTime.RawType;
};

export const GET = async (_: Request, { params: { identifiant } }: ExporterRaccordementParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantGestionnaireRéseau = decodeParameter(identifiant);
      if (
        utilisateur.estGrd() &&
        utilisateur.identifiantGestionnaireRéseau !== identifiantGestionnaireRéseau
      ) {
        throw new OperationRejectedError(`L'accès au gestionnaire réseau n'est pas permis`);
      }
      const dossiers =
        await mediator.send<Lauréat.Raccordement.ListerDossierRaccordementEnAttenteMiseEnServiceQuery>(
          {
            type: 'Lauréat.Raccordement.Query.ListerDossierRaccordementEnAttenteMiseEnServiceQuery',
            data: {
              identifiantGestionnaireRéseau,
            },
          },
        );

      const fields = [
        'nomProjet',
        'identifiantProjet',
        'appelOffre',
        'periode',
        'famille',
        'numeroCRE',
        'commune',
        'codePostal',
        'referenceDossier',
        'statutDGEC',
        'puissance',
        'dateMiseEnService',
        'nomCandidat',
        'societeMere',
        'emailContact',
        'siteProduction',
        'dateNotification',
      ];

      const data: Array<DossierRaccordementEnAttenteMiseEnServiceCSV> = dossiers.items.map(
        ({
          appelOffre,
          codePostal,
          commune,
          famille,
          identifiantProjet,
          nomProjet,
          numéroCRE,
          période,
          référenceDossier,
          statutDGEC,
          puissance,
          dateNotification,
          emailContact,
          nomCandidat,
          siteProduction,
          sociétéMère,
        }) => ({
          nomProjet,
          identifiantProjet: identifiantProjet.formatter(),
          appelOffre,
          periode: période,
          famille,
          numeroCRE: numéroCRE,
          commune,
          codePostal,
          referenceDossier: référenceDossier.formatter(),
          statutDGEC,
          puissance,
          nomCandidat,
          societeMere: sociétéMère,
          emailContact,
          siteProduction,
          dateNotification: DateTime.convertirEnValueType(dateNotification).formatter(),
        }),
      );

      const csv = await ExportCSV.parseJson({
        data,
        fields,
      });

      const gestionnaire = await mediator.send<GestionnaireRéseau.ConsulterGestionnaireRéseauQuery>(
        {
          type: 'Réseau.Gestionnaire.Query.ConsulterGestionnaireRéseau',
          data: {
            identifiantGestionnaireRéseau: identifiant,
          },
        },
      );

      const fileName = `export_raccordement_en_attente_mise_en_service-${Option.match(gestionnaire)
        .some(({ raisonSociale }) => raisonSociale)
        .none(() => '')}`;

      return new Response(csv, {
        headers: {
          'content-type': 'text/csv',
          'content-disposition': `attachment; filename=${fileName}.csv`,
        },
      });
    }),
  );
