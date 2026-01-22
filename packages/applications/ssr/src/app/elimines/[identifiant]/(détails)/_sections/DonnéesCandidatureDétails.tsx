import { FC } from 'react';

import { Éliminé } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { CopyButton } from '@/components/molecules/CopyButton';
import { FormattedDate } from '@/components/atoms/FormattedDate';
import { getActionnariatTypeLabel } from '@/app/_helpers';

export type DonnéesCandidatureDétailProps = {
  éliminé: PlainType<
    Omit<Éliminé.ConsulterÉliminéReadModel, 'prixReference'> & {
      prixReference: Éliminé.ConsulterÉliminéReadModel['prixReference'] | undefined;
    }
  >;
};

export const DonnéesCandidatureDétail: FC<DonnéesCandidatureDétailProps> = ({
  éliminé: {
    localité,
    sociétéMère,
    emailContact,
    nomCandidat,
    nomReprésentantLégal,
    autorisationDUrbanisme,
    actionnariat,
    puissance,
    puissanceDeSite,
    unitéPuissance,
  },
}) => (
  <ul className="flex-col gap-4 mt-2">
    <li>
      <span className="font-bold">Site de production :</span> {localité.adresse1}
      {localité.adresse2 ? ` ${localité.adresse2}` : ''} {localité.codePostal} {localité.commune},{' '}
      {localité.département}, {localité.région}
    </li>
    <li>
      <span className="font-bold">Nom du représentant légal : </span> {nomReprésentantLégal}
    </li>
    <li className="flex flex-col gap-1">
      <span className="font-bold">Performances :</span>
      <ul className="list-disc list-inside">
        <li>
          Puissance installée : {puissance} {unitéPuissance.unité}
        </li>
        {puissanceDeSite && (
          <li>
            Puissance de site : {puissanceDeSite} {unitéPuissance.unité}
          </li>
        )}
      </ul>
    </li>
    {autorisationDUrbanisme && (
      <li className="flex flex-col gap-1">
        <span className="font-bold">Autorisation d'urbanisme :</span>
        <ul className="list-disc list-inside">
          <li>Numéro : {autorisationDUrbanisme.numéro}</li>
          <li>
            Date d'obtention :{' '}
            <FormattedDate
              date={DateTime.convertirEnValueType(autorisationDUrbanisme.date.date).formatter()}
            />
          </li>
        </ul>
      </li>
    )}
    <li className="flex gap-2 items-center">
      <span className="font-bold">Adresse email de candidature :</span>
      <CopyButton textToCopy={Email.bind(emailContact).formatter()} />
    </li>
    <li>
      <span className="font-bold">Producteur :</span> {nomCandidat}
    </li>
    <li>
      <span className="font-bold">Actionnaire :</span> {sociétéMère || 'Champs non renseigné'}
    </li>
    {actionnariat && (
      <li>
        <span className="font-bold">Type d'actionnariat :</span>{' '}
        {getActionnariatTypeLabel(actionnariat.type)}
      </li>
    )}
  </ul>
);
