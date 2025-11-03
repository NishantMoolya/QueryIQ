import React, { useEffect, useState } from 'react'
import UploadFormModal from './UploadFormModal';
import { FileText, Loader2, Plus } from 'lucide-react';
import { Button } from '../button';
import { Card } from '../card';
import axiosInstance from '@/api/axios';
import DocumentCard from './DocumentCard';

const ConnectDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);

    // Fetch all connected File URLs
    const fetchFileUrls = async () => {
        try {
            setIsFetching(true);
            const res = await axiosInstance.get("/file/?file_type=application/pdf&file_type=csv");
            console.log("File urls: ", res);
            setDocuments(res.data.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch database URLs.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchFileUrls();
    }, []);

    return (
        <>
            <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-semibold">
                                Documents
                            </h2>
                            <p className="text-gray-500 text-sm mt-0.5">
                                {documents.length} files uploaded
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpenUpload(true)}
                        className="flex items-center self-end gap-2 bg-white hover:bg-gray-100 text-black font-semibold px-5 py-2.5 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-white/20"
                    >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Document
                    </Button>
                </div>

                {/* Documents Grid */}
                <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-2 gap-1 sm:p-8 shadow-2xl hover:border-white/20 transition-all duration-300">
                    {isFetching ? (
                        <div className="flex justify-center py-2">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) :
                        documents.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                {documents.map((doc) => <DocumentCard key={doc._id} doc={doc} />)}
                            </div>
                        ) : <p className="text-gray-400 text-sm sm:text-base">
                            No documents added yet.
                        </p>}
                </Card>
            </div>
            {/* Upload Modal */}
            <UploadFormModal openUpload={openUpload} setOpenUpload={setOpenUpload} documents={documents} setDocuments={setDocuments} />
        </>
    )
}

export default ConnectDocuments