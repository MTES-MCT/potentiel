import { Text, View } from '@react-pdf/renderer';
import React from 'react';

export const PassageConcernantAbandonDuCahierDesCharges = () => {
  return (
    <>
      <Text style={{ fontSize: 10 }}>
        [Le paragraphe 6.2 du cahier des charges de l’appel d’offres cité en objet indique :
      </Text>

      <Text style={{ fontSize: 10, textAlign: 'justify', marginTop: 10 }}>
        « Le Candidat dont l’offre a été retenue réalise l’Installation dans les conditions du
        présent cahier des charges et conformément aux éléments du dossier de candidature (les
        possibilités et modalités de modification sont indiquées au 5.2). Par exception, le Candidat
        est délié de cette obligation : - en cas de retrait de l’autorisation environnementale par
        l’autorité compétente ou d’annulation de cette autorisation à la suite d’un contentieux. Les
        retraits gracieux sur demande du candidat ne sont pas concernés. - en cas de non obtention
        ou de retrait de toute autre autorisation administrative ou dérogation nécessaire à la
        réalisation du projet. Il en informe dans ce cas le Préfet en joignant les pièces
        justificatives. La garantie financière est alors levée. Le Candidat peut également être
        délié de cette obligation selon l’appréciation du ministre chargé de l’énergie à la suite
        d’une demande dûment justifiée. Le Ministre peut accompagner son accord de conditions ou du
        prélèvement d’une part de la garantie inancière. Ni l’accord du Ministre, ni les conditions
        imposées, ni le prélèvement de la garantie financière ne limitent la possibilité de recours
        de l’Etat aux sanctions du 8.2. »]
      </Text>

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
            Le projet doit être d’une puissance équivalente que le projet abandonné, à plus ou moins
            20% ;
          </Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={{ marginHorizontal: 16 }}>-</Text>
          <Text>
            Le tarif proposé ne doit pas être supérieur au tarif du dernier lauréat retenu pour la
            période dont le projet était initialement lauréat (et le cas échéant de la famille
            concernée) indexé jusqu'à septembre 2023.
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
