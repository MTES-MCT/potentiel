import Alert from '@codegouvfr/react-dsfr/Alert';

export const InfoBoxAttestationConformité = () => (
  <Alert
    severity="info"
    small
    description={
      <p className="p-3">
        Vous devez transmettre sur Potentiel la preuve, ainsi que la date de transmission au
        co-contractant, car d'après les cahiers des charges, l'achèvement ou date d’achèvement est
        la :
        <br />
        <span className="italic">
          Date de fourniture au cocontractant de l’attestation de conformité mentionnée à l’article
          R. 311-27-1 du code de l’énergie.
        </span>
      </p>
    }
    className="mb-2"
  />
);
