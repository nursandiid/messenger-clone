import { ContactPaginate } from "@/types/contact";
import { AxiosResponse } from "axios";

export const fetchContacts = (
  query?: string,
): Promise<AxiosResponse<{ data: ContactPaginate }>> => {
  return window.axios.get(`${route("contacts.data")}?query=${query || ""}`);
};

export const fetchContactsInPaginate = (
  url: string,
): Promise<AxiosResponse<{ data: ContactPaginate }>> => {
  return window.axios.get(url);
};

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

export const deleteContact = (
  userId: string,
): Promise<AxiosResponse<{ data: null }>> => {
  return window.axios.delete(route("contacts.destroy", userId));
};
