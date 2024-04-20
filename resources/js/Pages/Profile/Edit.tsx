import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import DeleteUserForm from "./partials/DeleteUserForm";
import UpdatePasswordForm from "./partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function Edit({
  auth,
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <AuthenticatedLayout
      user={auth}
      header={
        <h2 className="text-xl font-semibold leading-tight text-foreground">
          Profile
        </h2>
      }
    >
      <Head title="Profile" />

      <div className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 sm:px-6">
          <div className="rounded-lg bg-background p-4 shadow sm:p-8">
            <UpdateProfileInformationForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              className="max-w-xl"
            />
          </div>

          <div className="rounded-lg bg-background p-4 shadow sm:p-8">
            <UpdatePasswordForm className="max-w-xl" />
          </div>

          <div className="rounded-lg bg-background p-4 shadow sm:p-8">
            <DeleteUserForm className="max-w-xl" />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
