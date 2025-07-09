import Alert from '@codegouvfr/react-dsfr/Alert';

export const InfoBoxPreuveRecandidature = () => (
  <Alert
    severity="warning"
    small
    description={
      <div className="p-3 flex flex-col">
        <span>
          Il est désormais impossible de transmettre la preuve de recandidature (date limite :
          30/06/2025)
        </span>
      </div>
    }
  />
);
