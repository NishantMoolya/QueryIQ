import React from 'react';
import { motion } from 'framer-motion';
// import GradientText from '../components/ui/GradientText/GradientText';
import Prism from '../components/ui/Prism/Prism';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
const Home = () => {
  const navigate = useNavigate();
  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const auth = useSelector(state => state.user.auth);

  return (
    <div className='relative w-full h-screen bg-black flex items-center justify-center overflow-hidden'>
      {/* Background Animated Prism - z-0 keeps it behind */}
      <div className='absolute inset-0 z-0'>
        <Prism
          animationType='rotate'
          timeScale={0.1}
          height={6.5}
          baseWidth={6.5}
          scale={3.6}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1}
        />
      </div>

      {/* Foreground Centered Content - z-10 keeps it on top */}
      <motion.div
        className='relative z-10 text-center flex flex-col items-center justify-center px-4'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {/* Title */}
        <motion.h1
          className='text-5xl md:text-7xl font-extrabold text-white  '
          variants={itemVariants}
        >
          Data Query
        </motion.h1>

        {/* Description */}
        <motion.p
          className='text-gray-300 text-base md:text-lg mt-4 max-w-xl leading-relaxed'
          variants={itemVariants}
        >
          Connect your documents or databases securely and chat with your data using AI-powered queries.
        </motion.p>

        {/* Continue Button */}
        <motion.div variants={itemVariants}>
          <Button
            onClick={() => navigate('/dashboard')}
            variant='default'
            size='lg'
            className='mt-8 group relative overflow-hidden bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl   transition-all duration-500 ease-in-out flex items-center gap-3 hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(255,101,0,0.6)]'
          >
            Get Started
            <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform duration-300' />
          </Button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Home;
