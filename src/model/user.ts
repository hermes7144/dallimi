export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
}


export type HomeUser = AuthUser & {
  notification: {
    isEnabled:boolean;
    regions:string[];
    events:string[];
  }
  
}

export type SearchUser = AuthUser & {
  following: number;
  followers: number;

}

export type ProfileUser = SearchUser & {
  posts: number;
}
