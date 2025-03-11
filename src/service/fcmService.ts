import { client } from './sanity';

export const saveFCMToken = async (id: string, token: string, deviceType: 'mobile' | 'pc') => {
  try {
    // 유저 조회
    const user = await client.fetch(`*[_type == "user" && _id == $id][0]`, { id });

    if (!user) {
      console.error(`❌ User with id ${id} not found`);
      return { success: false, message: 'User not found' };
    }

    // 기존 fcmTokens 객체 가져오기 (없으면 빈 객체)
    const existingTokens = user.fcmTokens || {};

    // 해당 디바이스 타입의 토큰만 업데이트
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
