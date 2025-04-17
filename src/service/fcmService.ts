import { client } from './sanity';

export const saveFCMToken = async (id: string, token: string, deviceType: 'mobile' | 'pc') => {
  try {
    const user = await client.fetch(`*[_type == "user" && _id == $id][0]`, { id });

    if (!user) {
      console.error(`❌ User with id ${id} not found`);
      return { success: false, message: 'User not found' };
    }

    const existingTokens = user.fcmTokens || {};
    const currentToken = existingTokens[deviceType];

    // 같은 토큰이면 굳이 저장하지 않음
    if (currentToken === token) {
      return { success: true, message: 'Token already up-to-date' };
    }

    await client
      .patch(user._id)
      .set({ fcmTokens: { ...existingTokens, [deviceType]: token } })
      .commit();

    return { success: true, message: `FCM Token for ${deviceType} updated successfully` };
  } catch (error) {
    console.error('❌ Error saving FCM Token:', error);
    return { success: false, message: 'Internal Server Error' };
  }
};