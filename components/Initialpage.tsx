import {motion} from 'framer-motion'
import Lottie from 'lottie-react';
import dashboard from '@/assets/lotties/dashboard.json';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
const Initialpage = () => {
    const {user} = useUser()
  return (
    <div>
        <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
>
  <Lottie animationData={dashboard} loop={true} className="w-72 md:w-96 " />
  
  <h2 className="text-4xl font-extrabold text-white text-center mb-2">
    Welcome {user ? user.firstName : "Guest"} !
  </h2>
  
  <p className="text-lg text-center text-gray-200 mb-2">
    It looks like you haven't created any code snippets yet.
  </p>
  
  <p className="text-md text-center text-gray-300 mb-4">
    Start your coding journey by creating your first snippet!
  </p>
  
  <Button 
    className="bg-white text-blue-600 hover:bg-gray-100 transition-colors duration-200 font-bold" 
    size="lg"
  >
    <Link href="/new">Create Your First Snippet</Link>
  </Button>
</motion.div>
    </div>
  )
}
export default Initialpage