import { client } from './sanity';

type OAuthUser = {
  id: string;
  email: string;
  name: string;
  username: string;
  image?: string | null;
}
export async function addUser( { id, username, email, name, image}: OAuthUser) {
  return client.createIfNotExists({
    _id: id,
    _type: 'user',
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
    .patch(userId)
    .set({ notification })
    .commit();
}

export async function setUserToken(userId: string, fcmToken: string) {
  return client
    .patch(userId)
    .set({ fcmToken })
    .commit();
}

export async function getActiveUserTokens(region: string, events: string[]): Promise<string[]> {
  try {
    const query = `*[_type == "user" && notification.isEnabled == true && 
      "${region}" in notification.regions && 
      count(notification.events[(@ in ${JSON.stringify(events)})]) > 0]{
      fcmTokens
    }`;

    const users = await client.fetch(query);

    const tokens = users.flatMap((user: {fcmTokens: {mobile:string; pc: string}}) => [
      user.fcmTokens.mobile,
      user.fcmTokens.pc
    ].filter(Boolean));

    return tokens;

  } catch (error) {
    console.error("Error fetching user tokens from Sanity:", error);
    throw new Error("Unable to fetch user tokens");
  }
}