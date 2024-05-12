import { useEffect, FormEventHandler } from "react";
import Checkbox from "@/components/Checkbox";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import { LoginSchema } from "@/types/user";
import ApplicationLogo from "@/components/ApplicationLogo";
import moment from "moment";
import { BsHeartFill } from "react-icons/bs";

export default function Welcome({
  canResetPassword,
  appName,
}: {
  canResetPassword: boolean;
  appName: string;
}) {
  const { data, setData, post, processing, errors, reset } =
    useForm<LoginSchema>({
      email: "",
      password: "",
      remember: false,
    });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"));
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 p-6 font-['Inter'] text-foreground sm:gap-12 sm:p-8">
      <div>
        <Link href="/">
          <ApplicationLogo className="h-10" />
        </Link>
      </div>

      <div className="my-auto grid grid-cols-1 sm:grid-cols-2">
        <div className="space-y-8 sm:w-11/12 sm:space-y-12">
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-7xl">
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">
              Hang out
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">
              anytime,
            </span>
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">
              {" anywhere"}
            </span>
          </h1>

          <p className="text-lg sm:text-xl">
            Messenger makes it easy and fun to stay close to your favorite
            people.
          </p>

          <form onSubmit={submit} className="flex flex-col gap-4 lg:w-3/4">
            <div>
              <TextInput
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="w-full border-secondary bg-secondary dark:border-secondary"
                autoComplete="username"
                isFocused={true}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="Enter your email address"
              />

              <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="w-full border-secondary bg-secondary dark:border-secondary"
                autoComplete="current-password"
                onChange={(e) => setData("password", e.target.value)}
                placeholder="Enter your password"
              />

              <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <Checkbox
                  name="remember"
                  checked={data.remember}
                  onChange={(e) => setData("remember", e.target.checked)}
                />
                <span className="ms-2 text-sm text-foreground">
                  Remember me
                </span>
              </label>

              {canResetPassword && (
                <Link href={route("password.request")} className="btn-link">
                  Forgot your password?
                </Link>
              )}
            </div>

            <div className="mt-4 flex">
              <PrimaryButton className="w-full" disabled={processing}>
                Log in
              </PrimaryButton>
            </div>

            <div className="flex justify-center">
              <Link href={route("register")} className="btn-link">
                Don't have an account?
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-4 flex items-center justify-center sm:mt-0">
          <img src="/images/vector.png" alt="vector.png" />
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <Link className="font-medium" href="/">
          &copy; {appName} {moment().format("Y")}.
        </Link>
        <span className="flex items-center gap-1 text-secondary-foreground">
          Built with <BsHeartFill className="text-sm text-danger" /> By Nursandi
        </span>
      </div>
    </div>
  );
}
