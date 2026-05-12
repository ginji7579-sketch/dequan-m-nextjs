import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    /**
     * 擴充 session 裡 user 的屬性
     */
    interface Session {
        user: {
            id: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    /** 擴充 JWT token 的屬性 */
    interface JWT {
        id: string
    }
}