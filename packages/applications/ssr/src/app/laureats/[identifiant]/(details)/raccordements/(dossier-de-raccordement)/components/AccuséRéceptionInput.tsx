import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

import { type Iso8601DateTime, now } from '@potentiel-libraries/iso8601-datetime';

import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document';
import { InputDate } from '@/components/atoms/form/InputDate';

type Props = {
  date?: Iso8601DateTime;
  documentKey?: string;
  validationErrors: Record<string, string>;
};

export const AccuséRéceptionInput = ({ validationErrors, date, documentKey }: Props) => {
  return (
    <div className="flex flex-col gap-3">
      <InputDate
        label={
          <>
            <span>Date de l'accusé de réception</span>
            <AccuséRéceptionTooltip />
          </>
        }
        state={validationErrors['dateQualification'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['dateQualification']}
        name="dateQualification"
        max={now()}
        defaultValue={date}
        required
        small
      />
      <UploadNewOrModifyExistingDocument
        label="Accusé de réception de la demande complète de raccordement"
        name="accuseReception"
        required
        formats={['pdf']}
        state={validationErrors['accuseReception'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['accuseReception']}
        documentKeys={documentKey ? [documentKey] : undefined}
      />
    </div>
  );
};

const AccuséRéceptionTooltip = () => (
  <Tooltip
    kind="click"
    title={
      <>
        Votre gestionnaire de réseau vous retourne un{' '}
        <span className="italic">accusé de réception</span> lorsque votre demande de raccordement
        est jugée complète. <br />
        Cet accusé de réception transmis sur Potentiel facilitera vos démarches administratives avec
        les différents acteurs connectés à Potentiel, il est nécessaire pour l’instruction, selon
        les cahiers des charges modificatifs et publiés le 30/08/2022. <br />
        Si votre gestionnaire de réseau ne vous retourne pas d'accusé de réception, veuillez
        transmettre toute autre preuve de la bonne réception de votre demande complète de
        raccordement.
      </>
    }
  />
);
