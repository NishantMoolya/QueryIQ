import { Database, FileText, Loader2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/api/axios'
import SourceCard from './SourceCard'

const ChatSidebar = ({ isOpen, setIsOpen, handleDBSelect, handleDocSelect, selectedDB, selectedDocuments }) => {
    const [documents, setDocuments] = useState([]);
    const [databases, setDatabases] = useState([]);
    const [isDBFetching, setIsDBFetching] = useState(false);
    const [isDocFetching, setIsDocFetching] = useState(false);

    // Fetch all connected DB URLs
    const fetchDBUrls = async () => {
        try {
            setIsDBFetching(true);
            const res = await axiosInstance.get("/file?file_type=db");
            // console.log("DB urls: ", res);
            setDatabases(prev => [...res.data.data]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDBFetching(false);
        }
    };

    // Fetch all connected File URLs
    const fetchFileUrls = async () => {
        try {
            setIsDocFetching(true);
            const res = await axiosInstance.get("/file?file_type=application/pdf&file_type=csv");
            // console.log("File urls: ", res);
            setDocuments(prev => [...res.data.data]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDocFetching(false);
        }
    };

    // Fetch documents on mount
    useEffect(() => {
        fetchDBUrls();
        fetchFileUrls();
    }, []);

    return (
        <div
            className={`${isOpen ? "w-80" : "w-0"
                } transition-all duration-300 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-xl border-r border-white/10 flex-shrink-0 flex flex-col overflow-hidden`}
        >
            <div className="p-3 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        Sources
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Databases List */}
            <div className="flex items-center justify-between p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Databases
                </h3>
            </div>
            {isDBFetching ? (
                <div className="flex justify-center py-2">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
            )
                : <div className="p-4 border-b border-white/10 max-h-1/2 overflow-y-scroll">
                    <div className="space-y-3">
                        {databases.map((item) => <SourceCard key={item._id} src_type='db' data={item} handleSelect={handleDBSelect} isSelected={item._id === selectedDB} />)}
                    </div>

                    {databases.length === 0 && (
                        <div className="text-center py-8">
                            <Database className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">No documents yet</p>
                        </div>
                    )}
                </div>
            }

            {/* Documents List */}
            <div className="flex items-center justify-between p-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Documents
                </h3>
            </div>
            {isDocFetching ? (
                <div className="flex justify-center py-2">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
            )
            : <div className="p-4 max-h-1/2 overflow-y-scroll">
                    <div className="space-y-3">
                        {documents.map((item) => <SourceCard key={item._id} src_type='doc' data={item} handleSelect={handleDocSelect} isSelected={selectedDocuments.includes(item._id)} />)}
                    </div>

                    {documents.length === 0 && (
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">No documents yet</p>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default ChatSidebar