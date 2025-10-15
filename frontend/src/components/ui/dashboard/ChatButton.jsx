import React from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ChatButton = () => {
  const navigate = useNavigate()

  return (
    <Button
      onClick={() => navigate("/chat")}
      className="
        fixed bottom-6 right-6 sm:bottom-8 sm:right-8 
        bg-gradient-to-r from-white via-gray-100 to-white 
        hover:from-gray-100 hover:via-white hover:to-gray-100
        text-black rounded-full px-5 py-3 sm:px-7 sm:py-5 
        shadow-2xl transition-all duration-300 
        hover:scale-105 z-50 group border border-gray-200
        flex items-center gap-2 sm:gap-3
        animate-bounce
      "
    >
      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-6 transition-transform duration-300" />
      <span className="font-medium text-sm sm:text-base">Start Chat</span>
    </Button>
  )
}

export default ChatButton
