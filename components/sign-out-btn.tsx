"use client";

import { authClient } from "@/lib/auth/auth-client"; // Assicurati di importare il client
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <DropdownMenuItem
      className="cursor-pointer text-red-600 focus:text-red-600"
      onClick={async () => {
        try {
          // Better Auth client ha un metodo signOut dedicato
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in");
                router.refresh(); // Svuota la cache del server per nascondere i dati protetti
              },
            },
          });
        } catch (error) {
          console.error("Logout failed:", error);
          alert("Error signing out");
        }
      }}
    >
      Log Out
    </DropdownMenuItem>
  );
}