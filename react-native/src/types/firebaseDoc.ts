export type ProfileDoc = {
  uid: string; // Firestoreドキュメントのキーとして必須
  userName: string | null;
  gender: 'male' | 'female' | null;
  birthday: Date | null;
  iconImagePath: string | null;
  bio: string | null;
  connectAdd: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  version: number;
};

export type preferences = {
  uid: string;
  movie: string | null;
  likedFood: string | null;
  hobby: string | null;
  skill: string | null;
};