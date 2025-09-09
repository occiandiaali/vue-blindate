<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Meet {{ username }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body m-body">
          <img
            :src="avatar"
            :alt="username"
            class="img-thumbnail rounded mx-auto d-block"
            width="150px"
            height="150px"
          />
          <p
            style="margin-top: 8px; cursor: pointer"
            class="text-center"
            @click="userVoice"
          >
            {{ username }}'s voice
            <img
              src="../assets/megaphone.png"
              alt="speaker"
              width="26px"
              height="26px"
            />
          </p>
          <div>
            <p>userid: {{ userid }}</p>
            <form
              @submit.prevent="scheduleMeet()"
              style="display: flex; flex-direction: column"
            >
              <input class="hidden" id="crush" name="crush" />
              <input class="hidden" id="crushphoto" name="crushphoto" />
              <label>Location:</label>
              <select
                name="environment"
                id="environment"
                v-model="environment"
                class="w-full mb-2 block p-2 border rounded"
              >
                <option value="">--Environment--</option>
                <option value="my_room">Black Ground</option>
                <!-- <option value="https://playcanv.as/p/AFQwcgYw/">
                  Whitebox & NPCs
                </option> -->
                <option value="green_room">Green Ground</option>
                <!-- <option value="https://playcanv.as/p/c1o59wX5/">
                  Bungalow
                </option>
                <option value="https://playcanv.as/p/yQ1cNsmW/" disabled>
                  Walled space
                </option>

                <option value="https://playcanv.as/p/sertSRJP/" disabled>
                  Geometrics
                </option>

                <option value="https://playcanv.as/p/XkL7IH8y/" disabled>
                  Lobby scene
                </option> -->
                <!-- Add more options if needed -->
              </select>
              <label>Choose a duration (minutes):</label>
              <select
                name="meetDuration"
                v-model="duration"
                class="w-full mb-2 block p-2 border rounded"
              >
                <option value="">--Duration--</option>
                <option value="300000" selected>5</option>
                <option value="600000">10</option>
                <option value="900000" disabled>15</option>
                <!-- <option value="20" disabled>20</option>
                <option value="30" disabled>30</option> -->
              </select>
              <label>Date & Time:</label>
              <input
                type="datetime-local"
                name="meetingDay"
                id="datetime"
                v-model="day"
                class="w-full mb-4 block p-2 border rounded"
                required
              />
              <input
                type="submit"
                value="Schedule"
                class="btn btn-success"
                id="submitBtn"
                :disabled="!environment || !day"
              />
            </form>
          </div>
        </div>
        <!-- <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { customRandomString } from "../utils/customRandomString.js";

import { supabase } from "../utils/supabase.js";

const thisUser = ref("");
const thisUsername = ref("");

let environment = ref("");
let day = ref<Date | null>(null);
let duration = ref("");

const modalProps = defineProps(["userid", "username", "avatar"]);

const userVoice = () =>
  window.alert(
    `Voice sample of ${modalProps.username} - ID: ${modalProps.userid}`
  );

//let meet = {} as Meeting;

// const createMeeting = async (obj: any) => {
//   const { data: meeting, error } = await supabase
//     .from("meetings")
//     .insert([obj])
//     .select()
//     .single();

//   if (error) {
//     console.error("Error creating meeting:", error.message);
//   } else {
//     console.log("Meeting created:", meeting[0].id);
//     return meeting[0]?.id;
//   }
// };
const createMeeting = async (obj: any) => {
  const { data, error } = await supabase.from("meetings").insert([obj]);
  //  .single();

  // console.log("meeting data", data);
  // console.log("meeting obj", obj);

  if (error) {
    console.error("Error creating meeting:", error.message);
    alert(
      "Sorry, can't schedule this experience at the moment. Try again later"
    );
  } else {
    console.log("Meeting created:", data);
    return data;
  }
};

const scheduleMeet = async () => {
  // meet.environment = environment.value;
  // meet.meeting_date = day.value === null ? new Date() : day.value;
  // meet.duration = duration.value === "" ? "5" : duration.value;
  // meet.participants = [modalProps.username, thisUser.value];
  // meet.room_id = customRandomString();
  // meet.created_by = thisUser.value;

  // console.log("Schedule: ", meet);
  //   const res = await createMeet(meet);
  //   console.log(res);
  const meet = {
    environment: environment.value,
    meeting_date: day.value === null ? new Date() : day.value,
    room_id: customRandomString(),
    duration: duration.value === "" ? 300000 : duration.value,
    // participants: [modalProps.username, thisUser.value],
    participant_id: [thisUser.value, modalProps.userid],
    participant_username: [thisUsername.value, modalProps.username],
    status: "pending",
    organizer: thisUser.value,
  };

  try {
    //  createMeeting(meet).then((m) => (meetingId.value = m));
    // const { data: meeting, error: meetingError } = await supabase
    //   .from("meetings")
    //   .insert([meet])
    //   .select()
    //   .single(); // get inserted row
    // const { error } = await supabase.from("meetings").insert(meet);
    // if (error) {
    //   alert(`Could not schedule this Meet: ${error.message}`);
    // } else {
    //   alert(
    //     `You've scheduled a meet for ${day.value} with ${[
    //       modalProps.username,
    //       thisUser.value,
    //     ]}!`
    //   );
    //   environment.value = "";
    //   day.value = null;
    //   duration.value = "5";
    // }
    // if (meetingError || !meeting) {
    //   console.error("Failed to schedule Meet", meetingError?.message);
    //   return;
    // }
    // meetingId.value = meeting.id;
    createMeeting(meet)
      .then(async (m) => {
        // meetingId.value = m || "9b365832-35ad-42d2-83f9-e8272f6da5b5";
        console.log("M", m);
        alert("Meeting scheduled!");

        console.log("thisUser", thisUser.value);
        console.log("thisUsername", thisUsername.value);
        console.log("modalprops", modalProps.userid);
        // console.log("meetingid ", meetingId.value);

        // meetingId.value = "9b365832-35ad-42d2-83f9-e8272f6da5b5";

        // 9b365832-35ad-42d2-83f9-e8272f6da5b5
        // const { error: participantsError } = await supabase
        //   .from("meeting_participants")
        //   .insert([
        //     { meeting_id: meetingId.value, user_id: thisUser.value },
        //     { meeting_id: meetingId, user_id: modalProps.userid },
        //   ]);
      })
      .catch((e) => console.error(e));
  } catch (error) {
    console.error(error);
  } finally {
    environment.value = "";
    day.value = null;
  }
};

onMounted(async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let metadata = user?.user_metadata;
  let theID = user?.id || "";
  console.log("The user ", metadata?.username);

  thisUser.value = theID; //metadata?.username;
  thisUsername.value = metadata?.username;
  console.log("thisUsername: ", thisUsername.value);
});
</script>

<style scoped>
.hidden {
  display: none;
}
.m-body {
  width: 100%;
  min-height: 540px;
  /* overflow-y: scroll; */
}
.m-body > img {
  margin: auto;
}
</style>
