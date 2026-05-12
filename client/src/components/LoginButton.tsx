// components/LoginButton.tsx
'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginButton() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div className="flex flex-col items-center gap-4">
                <p className="text-lg font-medium">歡迎，{session.user?.name}</p>
                <button
                    onClick={() => signOut()}
                    className="rounded-full bg-black px-6 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    登出
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <button
                onClick={() => signIn('google')}
                className="rounded-full bg-black px-6 py-3 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
                使用 Google 登入
            </button>
        </div>
    )
}