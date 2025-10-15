import React from 'react'
import { Input } from '../input'
import { Button } from '../button'
import { Send } from 'lucide-react'

const ChatInput = ({ input, setInput, handleSend, handleKeyPress, isDisabled = false }) => {
  return (
    <div className="border-t border-white/10 bg-gradient-to-b from-transparent to-black/50 backdrop-blur-xl p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2 sm:gap-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-2 sm:p-3 focus-within:border-white/40 transition-all duration-300">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about your data..."
                className="flex-1 bg-transparent border-none text-white text-sm sm:text-base placeholder-gray-500 focus:ring-0 focus:outline-none px-2"
              />

              <Button
                onClick={handleSend}
                disabled={isDisabled}
                className="p-2 sm:p-2.5 bg-gradient-to-r from-white to-gray-200 hover:from-gray-100 hover:to-gray-300 text-black rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:scale-105"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>
  )
}

export default ChatInput