import { AxiosResponse } from "axios";

export const saveContact = (
  userId: string,
): Promise<AxiosResponse<{ data: any }>> => {
  return window.axios.post(route("contacts.save", userId));
};

export const blockContact = (
  userId: string,
): Promise<AxiosResponse<{ data: any }>> => {
  return window.axios.post(route("contacts.block", userId));
};

export const unblockContact = (
  userId: string,
): Promise<AxiosResponse<{ data: any }>> => {
  return window.axios.post(route("contacts.unblock", userId));
};
