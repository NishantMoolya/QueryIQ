import React from 'react'
import { Card } from '../card';

const DocumentCard = ({ doc }) => {
    // Get file icon based on type
    const getFileIcon = (type) => {
        if (type?.includes("pdf")) return "📄";
        if (type?.includes("excel") || type?.includes("sheet") || type?.includes("csv")) return "📊";
        if (type?.includes("word") || type?.includes("doc")) return "📝";
        if (type?.includes("image")) return "🖼️";
        return "📎";
    };

    return (
        <Card
            key={doc._id}
            className="group relative overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/30 transition-all duration-500 hover:scale-[1.02] cursor-pointer shadow-xl hover:shadow-2xl"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center border-b border-white/10">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {getFileIcon(doc.file_type)}
                </span>
            </div>

            <div className="relative p-4 bg-gradient-to-b from-transparent to-black/20">
                <p className="text-white text-sm sm:text-base font-medium truncate mb-1">
                    {doc.file_name}
                </p>
            </div>
        </Card>
    )
}

export default DocumentCard