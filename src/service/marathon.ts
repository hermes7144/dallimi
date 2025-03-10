import { Marathon } from '@/model/marathon';
import { client, urlFor } from './sanity';

export async function getMarathons() {
  return client
    .fetch(
      `*[_type == "marathon"]
`
    )
    .then(res => {
      console.log('res', res);
      return mapPosts(res);
    });
};

function mapPosts(marathons: Marathon[]) {

  return marathons.map((marathon: Marathon) => ({
    ...marathon,
    image: marathon.image && urlFor(marathon.image),
  }));
}
