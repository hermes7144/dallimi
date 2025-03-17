import { client, urlFor, assetsURL } from './sanity';

export async function notifyMarathon(marathonId: string, userId: string) {
  console.log(marathonId, userId)

  return client
    .patch(marathonId) //
    .setIfMissing({ participants: [] })
    .append('participants', [
      {
        _ref: userId,
        _type: 'reference',
      },
    ])
    .commit({ autoGenerateArrayKeys: true });
}

export async function unnotifyMarathon(marathonId: string, userId: string) {
  console.log(marathonId, userId)

  return client
    .patch(marathonId)
    .unset([`participants[_ref=="${userId}"]`])
    .commit();
}