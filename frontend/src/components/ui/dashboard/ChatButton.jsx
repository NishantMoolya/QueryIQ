import React from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ChatButton = () => {
    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate("/Chat")}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-r from-white via-gray-100 to-white hover:from-gray-100 hover:via-white hover:to-gray-100 text-black rounded-full p-4 sm:p-5 shadow-2xl transition-all duration-300 hover:scale-110 z-50 group border-2 border-white/20"
        >
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform duration-300" />
        </Button>
    )
}

export default ChatButton