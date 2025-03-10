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