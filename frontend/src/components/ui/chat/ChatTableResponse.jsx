import React from 'react'

const ChatTableResponse = ({ data }) => {
    return (
        <div
            // className="inline-block bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-[10px] sm:text-sm text-gray-300 overflow-x-auto"
            className="overflow-x-auto text-xs sm:text-sm text-gray-200"
            dangerouslySetInnerHTML={{ __html: data }}
        />
    )
}

export default ChatTableResponse