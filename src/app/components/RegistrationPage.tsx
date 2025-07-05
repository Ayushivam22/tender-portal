"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient"; 

// Helper function to upload logo to Supabase
async function uploadLogoToSupabase(logoFile: File): Promise<string | null> {
    const fileExt = logoFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
        .from("avatars") 
        .upload(`logos/${fileName}`, logoFile);

    if (error) {
        throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(`logos/${fileName}`);
    return publicUrlData.publicUrl;
}

function CompanyFormFields({
    form,
    handleChange,
}: {
    form: { name: string; industry: string; description: string };
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
}) {
    return (
        <>
            <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Industry</label>
                <select
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                >
                    <option value="">Select Industry</option>
                    <option value="IT">IT</option>
                    <option value="Sales">Sales</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Construction">Construction</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    rows={3}
                />
            </div>
        </>
    );
}

async function registerCompany(data: {
    name: string;
    industry: string;
    description: string;
    logo_url: string;
}) {
    return axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/register`,
        data,
        { withCredentials: true }
    );
}

export default function RegistrationPage() {
    const [form, setForm] = useState({
        name: "",
        industry: "",
        description: "",
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setUploading(true);

        let logo_url = "";

        try {
            if (logoFile) {
                logo_url = (await uploadLogoToSupabase(logoFile)) || "";
            }
            const response = await registerCompany({ ...form, logo_url });
            if (response.data.success) {
                setMessage("Registration successful! Redirecting to Dashboard");
                setTimeout(() => {
                router.push("/dashboard");
                }, 1000);
            } else {
                setMessage(response.data.error || "Registration failed.");
            }
        } catch (error: any) {
            setMessage(
                error?.response?.data?.error ||
                    error.message ||
                    "Registration failed."
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-yellow-700 mb-6 text-center drop-shadow-sm">
                Company Registration
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <CompanyFormFields form={form} handleChange={handleChange} />
                <div>
                    <label className="block mb-1 font-medium">Logo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors font-semibold shadow"
                    disabled={uploading}
                >
                    {uploading ? "Uploading..." : "Register"}
                </button>
                {message && (
                    <p className="text-green-600 text-center">{message}</p>
                )}
            </form>
        </div>
    );
}
