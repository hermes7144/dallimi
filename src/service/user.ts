import { client } from './sanity';

type OAuthUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  image?: string | null;
}
export async function addUser( { id, username, email, name, image}:OAuthUser) {
  return client.createIfNotExists({
    _id: id,
    _type: 'user',
    id,
    username,
    email,
    name,
    image,
    notification: {
      isEnabled:true,
      regions:[],
      events:[]
    }
  })
}

export async function getUser(id: string) {
  return client.fetch(
    `*[_type == "user" && id == "${id}"][0]`
  )
}

export async function setNotification(userId: string, notification: { isEnabled: boolean; regions: string[]; events: string[] }) {
  return client
    .patch(userId) // 특정 사용자 문서 업데이트
    .set({ notification }) // 기존 notification을 덮어씀
    .commit();
}

export async function setUserToken(userId: string, fcmToken: string) {
  return client
    .patch(userId) // 특정 사용자 문서 업데이트
    .set({ fcmToken }) // 기존 notification을 덮어씀
    .commit();
}

export async function getActiveUserTokens(region: string, events: string[]): Promise<string[]> {
  try {
    const query = `*[_type == "user" && notification.isEnabled == true && 
      "${region}" in notification.regions && 
      count(notification.events[(@ in ${JSON.stringify(events)})]) > 0]{
      fcmTokens
    }`;

    // 데이터 가져오기
    const users = await client.fetch(query);

    // FCM 토큰을 추출하고 평탄화
    const tokens = users.flatMap((user: {fcmTokens: {mobile:string; pc: string}}) => [
      user.fcmTokens.mobile,
      user.fcmTokens.pc
    ].filter(Boolean)); // undefined/null 값 제거

    return tokens;

  } catch (error) {
    console.error("Error fetching user tokens from Sanity:", error);
    throw new Error("Unable to fetch user tokens");
  }
}