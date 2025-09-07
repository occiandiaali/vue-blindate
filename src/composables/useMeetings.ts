import { ref, onMounted } from "vue";
import { supabase } from "../utils/supabase";
//import type { Meeting } from "../interfaces/Meeting";

export function useMeetings() {
  //const myMeetings = ref<Meeting[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  let metadata;
  const requester = ref("");
  const currentUser = ref();
  const currentUserMeetings = ref<any[]>([]);

  // const fetchUser = async () => {
  //   const {
  //     data: { user },
  //   } = await supabase.auth.getUser();
  //   metadata = user?.user_metadata;
  //   console.log("Meta", metadata);
  //   return metadata?.username;
  // };

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    metadata = user?.user_metadata;
    let userid = user?.id;
    console.log("Meta", metadata);

    return userid; //metadata?.username;
  };

  const fetchMeetings = async () => {
    loading.value = true;
    // error.value = null;
    getCurrentUser().then((u) => {
      currentUser.value = u;
      console.log("currentUser ", currentUser.value);
    });
    // fetchUser().then((user) => {
    //   requester.value = user;
    //   console.log("requester", requester.value);
    // });

    // const { data, error: fetchError } = await supabase
    //   .from("meetings")
    //   .select("*")
    //   .contains("participants", [requester.value]);
    // const { data: meetings, error: fetchError } = await supabase
    //   .from("meetings")
    //   .select();
    const { data, error: fetchError } = await supabase
      .from("meetings")
      .select("*")
      .contains("participant_id", [currentUser.value]);
    // const { data: meetings, error: fetchError } = await supabase.from(
    //   "meetings"
    // ).select(`
    //   id,
    //   room_id,
    //   meeting_date,
    //   meeting_participants (
    //     user_id
    //   ),
    //   environment,
    //  duration,
    //   status,
    //   created_by
    // `);

    if (fetchError) {
      error.value = fetchError.message;
      console.error(error.value);
      return [];
    } else {
      // meetings.value = data as Meeting[];
      currentUserMeetings.value = data || [];
      // currentUserMeetings.value.push(data || []);
      console.log("useMeeting ", currentUserMeetings);
      console.log(data);
      data.forEach((d) => {
        console.log(d);
        console.log("organizer", d.organizer);
        requester.value = d.organizer;
      });
    }

    loading.value = false;
  };

  onMounted(() => fetchMeetings());

  return { currentUserMeetings, loading, error, currentUser, requester };
}
