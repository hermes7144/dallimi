import { Marathon } from '@/model/marathon';
import { client, urlFor } from './sanity';

export async function getMarathons() {


  return client
    .fetch(
      `*[_type == "marathon"]`
    )
    .then(mapPosts);
};

function mapPosts(marathons: Marathon[]) {

  return marathons.map((marathon: Marathon) => ({
    ...marathon,
    image: marathon.image && urlFor(marathon.image),
  }));
}

async function deleteAllMarathons() {
  try {
    const marathons = await client.fetch('*[_type == "marathon"]{_id}');

    if (marathons.length === 0) {
      console.log("🟢 삭제할 마라톤 문서가 없습니다.");
      return;
    }

    let transaction = client.transaction();
    marathons.forEach((doc: Marathon) => {
      transaction = transaction.delete(doc._id);
    });

    await transaction.commit();
    console.log(`✅ ${marathons.length}개의 마라톤 문서가 삭제되었습니다.`);
  } catch (error) {
    console.error("❌ 마라톤 문서 삭제 실패:", error);
  }
}

// deleteAllMarathons();