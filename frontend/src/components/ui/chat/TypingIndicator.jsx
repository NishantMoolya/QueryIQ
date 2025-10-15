import { Bot } from 'lucide-react'
import React from 'react'

const TypingIndicator = () => {
    return (
        <div className="flex gap-2 sm:gap-3 md:gap-4">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-white/20 to-white/10 border border-white/20 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="inline-block bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-xl rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5">
                <div className="flex gap-1">
                    <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                    ></span>
                    <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                    ></span>
                </div>
            </div>
        </div>
    )
}

export default TypingIndicator