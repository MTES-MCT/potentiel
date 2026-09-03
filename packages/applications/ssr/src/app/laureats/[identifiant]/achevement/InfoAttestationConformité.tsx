import Notice from '@codegouvfr/react-dsfr/Notice';

export const InfoBoxAttestationConformité = () => (
  <Notice
    severity="info"
    title="Pièces à fournir"
    description={
      <>
        <br />
        <span>
          Vous devez transmettre sur Potentiel la preuve, ainsi que la date de transmission au
          cocontractant, car, d'après les cahiers des charges, l'achèvement ou date d’achèvement est
          la{' '}
          <span className="italic">
            Date de fourniture au Cocontractant de l’attestation de conformité mentionnée à
            l’article R. 311-27-1 du code de l’énergie.
          </span>
        </span>
      </>
    }
  />
);
