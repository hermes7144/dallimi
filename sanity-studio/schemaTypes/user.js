export default {
  title: 'User',
  name: 'user',
  type: 'document',
  fields: [
    {
      title: 'ID',
      name: 'id',
      type: 'string'
    },
    {
      title: 'Username',
      name: 'username',
      type: 'string'
    },
    {
      title: 'Name',
      name: 'name',
      type: 'string'
    },
    {
      title: 'Email',
      name: 'email',
      type: 'string'
    }, 
    {
      title: 'Image',
      name: 'image',
      type: 'string'
    },
    {
      name: 'fcmTokens',
      title: 'FCM Tokens',
      type: 'object', // 객체로 저장
      fields: [
        { name: 'mobile', type: 'string', title: 'Mobile Token' },
        { name: 'pc', type: 'string', title: 'PC Token' },
      ],
    },
    {
      name: "notification",
      title: "Notification Settings",
      type: "object",
      fields: [
        { name: "isEnabled", type: "boolean", title: "알림 활성화" },
        { 
          name: "regions", 
          type: "array", 
          title: "알림 받을 지역", 
          of: [{ type: "string" }] 
        },
        { 
          name: "events", 
          type: "array", 
          title: "알림 받을 이벤트", 
          of: [{ type: "string" }]
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name', 
      subtitle: 'username'
    }
  }
};
