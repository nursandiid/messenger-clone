import { AppProvider } from "@/contexts/app-context";
import { Head } from "@inertiajs/react";

export default function AppLayout({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  return (
    <AppProvider>
      <Head title={title} />

      <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground sm:flex-row">
        {children}
      </div>
    </AppProvider>
  );
}
