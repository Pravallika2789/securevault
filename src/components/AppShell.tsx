import type { ReactNode } from "react";
import { Navigation } from "./Navigation";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">{children}</main>
      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 text-xs text-muted-foreground sm:px-6">
          <p>SecureVault — Information Assurance and Security academic project.</p>
          <p className="font-mono">
            All cryptographic operations execute on the backend service. No keys exist in this client.
          </p>
        </div>
      </footer>
    </div>
  );
}
