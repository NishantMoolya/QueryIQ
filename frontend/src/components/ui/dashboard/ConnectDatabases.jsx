import React, { useEffect, useState } from "react";
import { Database, Loader2, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axios";

const ConnectDatabases = () => {
    const [dbUrl, setDbUrl] = useState("");
    const [dbName, setDbName] = useState("");
    const [DBUrlList, setDBUrlList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState("");

    // Fetch all connected DB URLs
    const fetchDBUrls = async () => {
        try {
            setIsFetching(true);
            const res = await axiosInstance.get("/file?file_type=db");
            // console.log("DB urls: ", res);
            setDBUrlList(res.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch database URLs.");
        } finally {
            setIsFetching(false);
        }
    };

    // Add a new DB URL
    const handleAddDBUrl = async () => {
        if (!dbName.trim() || !dbUrl.trim()) return;
        setIsLoading(true);
        setError("");

        try {
            const payload = [{
          file_name: dbName.trim(),
          file_url: dbUrl.trim(),
          file_type: "db"
        }]
            const res = await axiosInstance.post("/file/add", payload);
            // console.log("add db: ", res);
            if(res.status === 201) {
                setDBUrlList((prev) => [...prev, res.data.data[0]]);
                setDbName("");
                setDbUrl("");
            } else throw new Error("an server error");
        } catch (err) {
            console.error(err);
            setError("Failed to add database URL.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDBUrls();
    }, []);

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                    Databases
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                    {DBUrlList.length} databases
                </p>
                </div>
            </div>

            {/* Input Card */}
            <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-2 gap-1 sm:p-8 shadow-2xl hover:border-white/20 transition-all duration-300">
                <p className="text-gray-500 text-xs sm:text-sm mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                    Supports SQL based databases like PostgreSQL, MySQL, and more
                </p>

                <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 sm:justify-between">
                    <div className="flex flex-col sm:flex-row gap-2 flex-1 ">
                        <Input
                            value={dbName}
                            onChange={(e) => setDbName(e.target.value)}
                            placeholder="Enter database Name Ex. Employees database"
                            className="flex-1 bg-black/40 border border-white/20 text-white text-sm sm:text-base placeholder-gray-500 rounded-md  px-4 py-3 sm:py-3.5"
                        />
                        <Input
                            value={dbUrl}
                            onChange={(e) => setDbUrl(e.target.value)}
                            placeholder="Enter database URL Ex. mongodb://username:password@host:port/database"
                            className="flex-1 bg-black/40 border border-white/20 text-white text-sm sm:text-base placeholder-gray-500 rounded-md  px-4 py-3 sm:py-3.5"
                        />
                    </div>
                    <Button
                        onClick={handleAddDBUrl}
                        disabled={isLoading || !dbName.trim() || !dbUrl.trim()}
                        className="bg-gradient-to-r from-white to-gray-200 self-end hover:from-gray-100 hover:to-gray-300 text-black font-semibold px-8 py-3 sm:py-3.5 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-white/20 whitespace-nowrap"
                    >
                        {isLoading ? (
                            <span className="flex justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                            </span>
                        ) : (
                            <>
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add
                            </>
                        )}
                    </Button>
                </div>

                {/* Database List Section */}
                <div className="mt-1">
                    {isFetching ? (
                        <div className="flex justify-center py-2">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : DBUrlList.length === 0 ? (
                        <p className="text-gray-400 text-sm sm:text-base">
                            No databases added yet.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {DBUrlList.map((db) => (
                                <Card
                                    key={db._id}
                                    className="bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300 group flex flex-col justify-between"
                                >
                                    <div>
                                        <p className="text-white font-semibold font-mono break-words">
                                            {db.file_name}
                                        </p>
                                        <p className="text-white text-sm font-mono break-words">
                                            {db.file_url}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-2">
                                            Added on{" "}
                                            {new Date(db.uploaded_at).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                )}
            </Card>
        </div>
    );
};

export default ConnectDatabases;
