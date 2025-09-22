import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],

    callbacks: {
        async signIn({user, account}) {
            const res = await fetch(`${process.env.API_URL}auth/${account?.provider}/register`, {
                method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: user.name,
                        email: user.email,
                        avatar: user.image,
                        provider: account?.provider,
                        provider_id: account?.providerAccountId,
                    }),
            });

            if (!res.ok) return false; // deny sign-in if backend rejects

            const data = await res.json();
            
            (user as any).accessToken = data.data.access_token;
            
            return true;
        },


        async jwt({token, user}) {
            if (user && (user as any).accessToken) {
                token.accessToken = (user as any).accessToken;
            }

            return token;
        },

        async session({ session, token }) {
            if (token.accessToken) {
                (session as any).accessToken = token.accessToken as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };