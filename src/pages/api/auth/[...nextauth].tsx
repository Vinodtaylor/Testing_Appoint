/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { axiosInstance } from "@/routes/api";
import type { AuthOptions } from "next-auth";
import { Token } from "@/types/next-auth";


// const TOKEN_EXPIRATION_TIME = 3 * 60 * 60 * 1000; 

const TOKEN_EXPIRATION_TIME = 10 * 1000; 


export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email_id: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Sending login request to your backend
          const response = await axiosInstance.post("/admin/login", {
            email_id: credentials?.email_id,
            password: credentials?.password,
          });

          // Check the login response
          const { message, data } = response.data;

          if (message === "Login Success Fully" && data) {
            const { user, token } = data;

            // Ensure the necessary fields are present
            if (user && token) {
              return {
                ...user,
                token, // Use the token for access
              };
            }
            return null;
          }
          return null;
        } catch (error) {
          console.error("Login failed with error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",  // Using JWT session strategy
  },
  callbacks: {
    async jwt({ token, user }) {


      if (user) {
        token._id = user._id;
        token.email_id = user.email_id;
        token.name = user.name;
        token.role = user.role;
        token.token = user.token;
        token.admin_photo = user.admin_photo; 
        token.expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;
      }
     
      const isTokenExpired = typeof token.expiresAt === 'number' && Date.now() > token.expiresAt;


        
      if (isTokenExpired || !token.token) {
        console.log(token.token,"Token existing")

        try {
          const response = await axiosInstance.post("/admin_refreshtoken", {},{withCredentials:true});



          console.log(response.data,"Refresh Response");
          const { user, token: newToken } = response.data;

          console.log(user)
          if (newToken) {
            token.token = newToken;
            token.expiresAt = Date.now() + TOKEN_EXPIRATION_TIME;
          }
          
        } catch (error:any) {
          // if (error.response) {
          //   console.error("Response Data:", error.response.data);
          //   console.error("Response Headers:", error.response.headers);
          //   console.error("Response Status:", error.response.status);
          // } else {
          //   console.error("Request Error:", error.message);
          // }
          console.error("Failed to refresh token:", error);
        }
      }
  
      return token;
    },
    async session({ session, token }) {
      const typedToken = token as Token;
  
      session._id = typedToken._id;
      session.token = typedToken.token;
      session.user.name = typedToken.name;
      session.user.email_id = typedToken.email_id;
      session.user.role = typedToken.role;
      session.user.admin_photo = typedToken.admin_photo; 
  
      return session;
    },
  },
  
  pages: {
    signIn: "/signin",  
    error: undefined,
  },
  cookies: {
    sessionToken: {
      name: "refreshtoken",
      options: {
        httpOnly: true,
        path: "/",
        // sameSite: 'None',
              },
    },
  },
  debug: true,  
};

export default NextAuth(authOptions);
