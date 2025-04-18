import { Marathon } from '@/model/marathon';
import { client, urlFor } from './sanity';

export async function getMarathons(keyword?: string) {
  console.log('keyword', keyword);

  const query = keyword ? `&& name match "*${keyword}*"` : '';

  return client
    .fetch(
      `*[_type == "marathon" ${query}] | order(date asc) {
      ...,
      "id":_id,
      "participants": participants[]->_id,
      }`
    )
    .then(mapPosts);
}

function mapPosts(marathons: Marathon[]): Marathon[] {
  return marathons.map((marathon: Marathon) => ({
    ...marathon,
    image: marathon.image ? urlFor(marathon.image) : undefined,
  }));
}
export async function getMarathon(id: string) {
  return client.fetch(`*[_type == "marathon" && _id == "${id}"][0]`).then((post) => ({ ...post, image: urlFor(post.image) }));
}

async function deleteTestMarathons() {
  try {
    const marathons = await client.fetch(`*[_type == "marathon" && name == "테스트"]{_id}`);

    if (marathons.length === 0) {
      console.log("🟢 삭제할 '테스트' 마라톤 문서가 없습니다.");
      return;
    }

    let transaction = client.transaction();
    marathons.forEach((doc: { _id: string }) => {
      transaction = transaction.delete(doc._id);
    });

    await transaction.commit();
    console.log(`✅ ${marathons.length}개의 '테스트' 마라톤 문서가 삭제되었습니다.`);
  } catch (error) {
    console.error("❌ '테스트' 마라톤 문서 삭제 실패:", error);
  }
}

// deleteTestMarathons();
