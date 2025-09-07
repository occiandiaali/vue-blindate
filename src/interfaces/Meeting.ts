// export interface Meeting {
//   room_id: string;
//   environment: string;
//   duration: string | null;
//   participants: string[];
//   meeting_date: Date;
// }
export interface Meeting {
  id?: string;
  room_id: string;
  meeting_date: Date; //string
  environment: string;
  duration: string;
  participant_id: string[];
  participant_username: string[];
  status: string;
  organizer: string;
  created_at?: string;
}
