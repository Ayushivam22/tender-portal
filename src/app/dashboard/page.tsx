import { cookies } from "next/headers";
import axios from "axios";
import RegistrationPage from "../components/RegistrationPage";
import TenderLists from "../components/TenderLists";

async function checkAuthorization() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard`,
            {
                headers: {
                    Cookie: `token=${token}`,
                },
            }
        );
        //  ("respose from the server:", res.data);
        if (res.status === 401) {
            return { authorized: false };
        }
        return { authorized: true, data: res.data };
    } catch (error) {
        //  (error);
        return { authorized: false };
    }
}

function checkCompanyRegistered(data: any) {
    // data is the response data from the dashboard API
    //  ("Data :::: ", data);
    if (data && data.isCompanyRegistered) {
        return { isCompanyRegistered: true };
    } else {
        return { isCompanyRegistered: false };
    }
}

// Fetch tenders for the authenticated and registered user
async function fetchTenders(token: string) {
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenders`,
        {
            headers: {
                Cookie: `token=${token}`,
            },
        }
    );
    return res.data;
}

export default async function Dashboard() {
    const authResult = await checkAuthorization();

    if (!authResult.authorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold text-red-600 mb-2">
                    401 Unauthorized
                </h1>
                <p className="text-gray-700">
                    You are not authorized to view this page.
                </p>
            </div>
        );
    }

    const companyResult = checkCompanyRegistered(authResult.data);

    if (!companyResult.isCompanyRegistered) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-yellow-700 mb-6 text-center drop-shadow-sm">
                        You have no company Registered.
                        <br />
                        Please register your company first.
                    </h2>
                    <RegistrationPage />
                </div>
            </div>
        );
    }

    // Fetch tenders
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    let tenders = { applied: [], allocated: [], available: [] };
    let myTenders = [];
    try {
        tenders = await fetchTenders(token || "");
        // Fetch my tenders
        const myTendersRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenders/my`,
            {
                headers: { Cookie: `token=${token}` },
            }
        );
        myTenders = myTendersRes.data.myTenders || [];
    } catch (e) {
        // console.log(e)
    }
    const name = authResult.data?.data?.name || "User";
    const logoUrl = authResult.data?.data?.logo_url;

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow-lg">
            {/* Title bar with greeting and logo */}
            <div className="flex items-center justify-between mb-8 p-4 bg-blue-50 rounded-lg shadow">
                <div className="flex items-center gap-4">
                    {logoUrl && (
                        <img
                            src={logoUrl}
                            alt="Company Logo"
                            className="w-14 h-14 rounded-full object-cover border border-blue-200 shadow"
                        />
                    )}
                    <span className="text-2xl font-bold text-blue-700">
                        Hello, {name}
                    </span>
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
                Dashboard
            </h1>
            <TenderLists tenders={tenders} myTenders={myTenders} />
        </div>
    );
}
