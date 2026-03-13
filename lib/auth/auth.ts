import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { initializeUserBoard } from "../init-user-board";
import connectDB from "../db";

// Otteniamo l'istanza di connessione
const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();

// Usiamo "as any" sul database per bypassare il conflitto di tipi tra mongoose e better-auth
const db = client.db() as any; 

export const auth = betterAuth({
  database: mongodbAdapter(db), // Rimosso il secondo parametro 'client' se non necessario, basta il db
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Better-auth passa l'oggetto user.id correttamente
          if (user.id) {
            await initializeUserBoard(user.id);
          }
        },
      },
    },
  },
});

export async function getSession() {
  // Nota: getSession restituisce session e user separati
  return await auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * ATTENZIONE: Questa funzione è pensata per essere chiamata lato SERVER (es. Server Actions)
 * Se la chiami da un pulsante Client, usa authClient.signOut() come visto prima.
 */
export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });
  
  // In Next.js redirect() deve essere chiamato fuori da blocchi try/catch e non ha bisogno di check successo
  redirect("/sign-in");
}