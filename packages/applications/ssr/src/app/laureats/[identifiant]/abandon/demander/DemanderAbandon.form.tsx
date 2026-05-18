"use client";

import Input from "@codegouvfr/react-dsfr/Input";
import Notice from "@codegouvfr/react-dsfr/Notice";
import Select from "@codegouvfr/react-dsfr/SelectNext";
import { FC, useState } from "react";

import { UploadNewOrModifyExistingDocument } from "@/components/atoms/form/document/UploadNewOrModifyExistingDocument";
import { Form } from "@/components/atoms/form/Form";
import { ValidationErrors } from "@/utils/formAction";

import {
  DemanderAbandonFormKeys,
  demanderAbandonAction,
} from "./demanderAbandon.action";

export type DemanderAbandonFormProps = {
  identifiantProjet: string;
  estDéjàSignaléPPA: boolean;
};

export const DemanderAbandonForm: FC<DemanderAbandonFormProps> = ({
  identifiantProjet,
  estDéjàSignaléPPA,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderAbandonFormKeys>
  >({});

  const [afficherAideÀLaSaisiePPA, setAfficherAideÀLaSaisiePPA] =
    useState(estDéjàSignaléPPA);

  return (
    <Form
      action={demanderAbandonAction}
      onValidationError={(validationErrors) =>
        setValidationErrors(validationErrors)
      }
      actionButtons={{
        submitLabel: "Demander",
      }}
    >
      <input
        type={"hidden"}
        value={identifiantProjet}
        name="identifiantProjet"
      />

      {estDéjàSignaléPPA ? (
        <Notice
          title={
            "Ce projet a été signalé comme étant signataire d'un contrat de vente de gré à gré (PPA)"
          }
        />
      ) : (
        <Select
          state={validationErrors["estPPA"] ? "error" : "default"}
          stateRelatedMessage={validationErrors["estPPA"]}
          id="estPPA"
          label="Cet abandon est-il consécutif à la signature d'un contrat de vente de gré à gré (PPA) ?"
          nativeSelectProps={{
            name: "estPPA",
            required: true,
            "aria-required": true,
            onChange: (e) => {
              setAfficherAideÀLaSaisiePPA(e.target.value === "true");
            },
          }}
          options={[
            { label: "Oui", value: "true" },
            { label: "Non", value: "false" },
          ]}
        />
      )}

      <Input
        textArea
        label="Raison"
        id="raison"
        hintText={
          afficherAideÀLaSaisiePPA
            ? "Veuillez donner des éléments explicatifs et de preuve sur la situation économique du projet"
            : "Veuillez détailler les raisons de cet abandon (contexte, facteurs extérieurs, etc.)"
        }
        nativeTextAreaProps={{
          name: "raison",
          required: true,
          "aria-required": true,
        }}
        state={validationErrors["raison"] ? "error" : "default"}
        stateRelatedMessage={validationErrors["raison"]}
      />

      <UploadNewOrModifyExistingDocument
        label="Pièce justificative"
        hintText={
          afficherAideÀLaSaisiePPA
            ? "Veuillez joindre la première et la dernière page du PPA ainsi que tout autre document justifiant de la situation économique du projet"
            : "Veuillez joindre vos justificatifs"
        }
        name="pieceJustificative"
        formats={["pdf"]}
        required
        state={validationErrors["pieceJustificative"] ? "error" : "default"}
        stateRelatedMessage={validationErrors["pieceJustificative"]}
      />
    </Form>
  );
};
