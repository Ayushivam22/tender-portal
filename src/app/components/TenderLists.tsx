"use client";
import axios from "axios";

async function cancelTenderApplication(tenderId: string) {
    await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenders/${tenderId}/cancel`,
        {
            withCredentials: true,
        }
    );
    window.location.reload();
}

async function applyForTender(tenderId: string) {
    await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tenders/${tenderId}/apply`,
        {},
        {
            withCredentials: true,
        }
    );
    window.location.reload();
}

function AppliedTenders({ tenders }: { tenders: any[] }) {
    return (
        <section className="bg-blue-50 rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-3 text-blue-800 flex items-center gap-2">
                <span>📄</span> Applied Tenders
            </h2>
            {tenders.length === 0 ? (
                <p className="text-gray-500">No applied tenders.</p>
            ) : (
                <ul className="space-y-3">
                    {tenders.map((tender: any) => (
                        <li
                            key={tender.id}
                            className="bg-white rounded p-3 flex flex-col md:flex-row md:items-center justify-between border border-blue-200 shadow-sm"
                        >
                            <div>
                                <div className="font-bold text-blue-900">
                                    {tender.title}
                                </div>
                                <div className="text-gray-600 text-sm mb-2">
                                    {tender.description}
                                </div>
                                <div className="text-xs text-gray-400">
                                    Deadline: {tender.deadline}
                                </div>
                            </div>
                            <button
                                className="mt-2 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                                onClick={() =>
                                    cancelTenderApplication(tender.id)
                                }
                            >
                                Cancel Application
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function AllocatedTenders({ tenders }: { tenders: any[] }) {
    return (
        <section className="bg-green-50 rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-3 text-green-800 flex items-center gap-2">
                <span>🏆</span> Allocated Tenders
            </h2>
            {tenders.length === 0 ? (
                <p className="text-gray-500">No allocated tenders.</p>
            ) : (
                <ul className="space-y-3">
                    {tenders.map((tender: any) => (
                        <li
                            key={tender.id}
                            className="bg-white rounded p-3 border border-green-200 shadow-sm"
                        >
                            <div className="font-bold text-green-900">
                                {tender.title}
                            </div>
                            <div className="text-gray-600 text-sm mb-2">
                                {tender.description}
                            </div>
                            <div className="text-xs text-gray-400">
                                Deadline: {tender.deadline}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function AvailableTenders({ tenders }: { tenders: any[] }) {
    return (
        <section className="mt-10 bg-yellow-50 rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-3 text-yellow-800 flex items-center gap-2">
                <span>📝</span> All Available Tenders
            </h2>
            {tenders.length === 0 ? (
                <p className="text-gray-500">No available tenders.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tenders.map((tender: any) => (
                        <li
                            key={tender.id}
                            className="bg-white rounded p-4 border border-yellow-200 shadow-sm flex flex-col justify-between"
                        >
                            <div>
                                <div className="font-bold text-yellow-900 text-lg">
                                    {tender.title}
                                </div>
                                <div className="text-gray-600 text-sm mb-2">
                                    {tender.description}
                                </div>
                                <div className="text-xs text-gray-400 mb-2">
                                    Deadline: {tender.deadline}
                                </div>
                            </div>
                            <button
                                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                                onClick={() => applyForTender(tender.id)}
                            >
                                Apply
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function MyTenders({ tenders }: { tenders: any[] }) {
    return (
        <section className="mb-10 bg-purple-50 rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-3 text-purple-800 flex items-center gap-2">
                <span>📢</span> My Tenders
            </h2>
            {tenders.length === 0 ? (
                <p className="text-gray-500">
                    You have not created any tenders.
                </p>
            ) : (
                <ul className="space-y-3">
                    {tenders.map((tender: any) => (
                        <li
                            key={tender.id}
                            className="bg-white rounded p-3 border border-purple-200 shadow-sm flex flex-col gap-1"
                        >
                            <div className="font-bold text-purple-900 text-lg">
                                {tender.title}
                            </div>
                            <div className="text-gray-600 text-sm">
                                {tender.description}
                            </div>
                            <div className="text-xs text-gray-400">
                                Deadline: {tender.deadline}
                            </div>
                            {tender.budget && (
                                <div className="text-xs text-gray-500">
                                    Budget: ₹{tender.budget}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function TenderLists({
    tenders,
    myTenders,
}: {
    tenders: any;
    myTenders: any[];
}) {
    return (
        <>
            <MyTenders tenders={myTenders} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AppliedTenders tenders={tenders.applied} />
                <AllocatedTenders tenders={tenders.allocated} />
            </div>
            <AvailableTenders tenders={tenders.available} />
        </>
    );
}
