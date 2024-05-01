import { AppProvider } from "@/contexts/app-context";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import clsx from "clsx";

export default function AppLayout({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const { notification_count } = usePage<PageProps>().props;

  return (
    <AppProvider>
      <Head
        title={clsx(notification_count > 0 && `(${notification_count})`, title)}
      />

      <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground sm:flex-row">
        {children}
      </div>
    </AppProvider>
  );
}
