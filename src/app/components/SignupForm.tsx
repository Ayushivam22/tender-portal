
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
                {
                    full_name: fullName,
                    email: email.toLowerCase(),
                    password,
                },
                { withCredentials: true }
            );
            const data = res.data;
            if (data.success) {
                setMessage("Signup successful!");
                setTimeout(() => {
                    router.push("/auth/signin");
                }, 2000);
            } else {
                setMessage(data.error || "Signup failed.");
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverMessage =
                    err.response?.data?.error || "Unknown server error";
                setMessage(serverMessage);
            } else {
                setMessage("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold shadow"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
                {message && (
                    <p className="text-sm text-center text-red-600">
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}
