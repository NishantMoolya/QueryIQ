import React from 'react'

const ChatTextResponse = ({ text }) => {
    return (
        <div className={`inline-block max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] rounded-2xl px-4 sm:px-4 md:px-5 py-4 sm:py-4 md:py-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 text-white backdrop-blur-xl`}
            style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
            }}
        >
            <p className="text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
                {text}
            </p>
        </div>
    )
}

export default ChatTextResponse