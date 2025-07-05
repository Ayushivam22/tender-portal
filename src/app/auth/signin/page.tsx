import SigninForm from "@/app/components/SigninForm";
export default function SignIn() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center drop-shadow-sm">
                    Sign In
                </h1>
                <SigninForm />
            </div>
        </div>
    );
}
