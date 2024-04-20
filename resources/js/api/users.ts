import { User } from "@/types/user";

export const updateUser = (user: User, data: { active_status: boolean }) => {
  return window.axios.patch(route("users.update", user.id), {
    email: user.email,
    name: user.name,
    ...data,
  });
};
