import { type Meeting } from "../interfaces/Meeting";
import axios from "axios";
import { type AxiosResponse } from "axios";

export const createMeet = async (meet: Meeting) =>
  await axios.post("/meets", meet);

export const getMeets = async (): Promise<AxiosResponse<Meeting[]>> =>
  await axios.get("/meets");

export const getMeet = async (id: string): Promise<AxiosResponse<Meeting>> =>
  await axios.get(`/meets/${id}`);

export const deleteMeet = async (id: string): Promise<AxiosResponse<Meeting>> =>
  await axios.delete(`/meets/${id}`);

export const createMeeting = async () => {};
