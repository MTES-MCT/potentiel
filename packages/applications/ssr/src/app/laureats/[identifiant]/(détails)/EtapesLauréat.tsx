import { getLauréat } from '../_helpers/getLauréat';

export async function EtapesLauréat({ identifiantProjet }: { identifiantProjet: string }) {
  const { lauréat } = await getLauréat({ identifiantProjet });

  return (
    <ul>
      <li>Notification : {lauréat.notifiéLe.formatter()}</li>
    </ul>
  );
}
