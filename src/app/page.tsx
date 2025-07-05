import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="bg-white rounded-xl shadow-lg p-10 flex flex-col items-center max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center drop-shadow-sm">
                    Welcome to Tender Portal
                </h1>
                <p className="text-gray-600 mb-8 text-center text-lg">
                    Manage, apply, and track tenders with ease. Sign in or
                    create an account to get started!
                </p>
                <div className="flex gap-4 w-full justify-center">
                    <Link
                        href="/auth/signin"
                        className="px-6 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors text-lg"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/auth/signup"
                        className="px-6 py-2 rounded bg-white border border-blue-600 text-blue-700 font-semibold shadow hover:bg-blue-50 transition-colors text-lg"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
