import { ClientRootLayout } from "@/components/ClientRootLayout";

/** Marketing site shell (navbar + footer). `/portfolio` lives outside this group. */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientRootLayout>{children}</ClientRootLayout>;
}
