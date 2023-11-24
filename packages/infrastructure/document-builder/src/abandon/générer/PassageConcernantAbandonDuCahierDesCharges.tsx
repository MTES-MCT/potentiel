import { Text, View } from '@react-pdf/renderer';
import React, { FC } from 'react';

type PassageConcernantAbandonDuCahierDesChargesProps = {
  appelOffre: {
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: string;
      dispositions: string;
    };
  };
};

export const PassageConcernantAbandonDuCahierDesCharges: FC<
  PassageConcernantAbandonDuCahierDesChargesProps
> = ({
  appelOffre: {
    texteEngagementRéalisationEtModalitésAbandon: { référenceParagraphe, dispositions },
  },
}) => {
  return (
    <>
      <Text style={{ fontSize: 10 }}>
        Le paragraphe {référenceParagraphe} du cahier des charges de l’appel d’offres cité en objet
        indique :
      </Text>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>« {dispositions} »</Text>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        Votre demande s’inscrit dans le processus mis en place à titre exceptionnel jusqu’au
        31/12/2024.Je prends donc bonne note de votre abandon et vous confirme le retrait de la
        décision désignant lauréat le projet ci-dessus. Je vous informe que cet engagement
        n’entrainera pas un prélèvement de vos garanties financières ni une sanction pécuniaire au
        titre de l’article L. 311-15 du code de l’énergie, dès lors que vous respecterez votre
        engagement à candidater à une prochaine période d’un appel d’offres avant le 31/12/2024 et
        que cette recandidature respectera les conditions suivantes :
      </Text>

      <View style={{ flexDirection: 'column', width: 450, marginTop: 10 }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={{ marginHorizontal: 16 }}>-</Text>
          <Text>
            Le dossier doit être complet et respecter les conditions d’éligibilité du cahier des
            charges de la période concernée par la recandidature ;
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={{ marginHorizontal: 16 }}>-</Text>
          <Text>Le projet doit avoir le même lieu d’implantation que le projet abandonné ;</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={{ marginHorizontal: 16 }}>-</Text>
          <Text>
            Le projet doit avoir la même autorisation préfectorale (numéro ICPE identique) que le
            projet abandonné, nonobstant des porter à connaissance ultérieurs ;
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={{ marginHorizontal: 16 }}>-</Text>
          <Text>
            Le tarif proposé ne doit pas être supérieur au prix plafond de la période dont le projet
            était initialement lauréat, indexé jusqu’à septembre 2023 selon la formule d’indexation
            du prix de référence indiquée dans le cahier des charges concerné par la recandidature.
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        Une fois cette recandidature respectant les conditions précédentes indiquée sur Potentiel,
        vos garanties financières pourront alors être levées.
      </Text>
    </>
  );
};
