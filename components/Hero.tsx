'use client'
import animate from "@/assets/lotties/animate.json"
import Lottie from "lottie-react";
import Link from "next/link";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";

const Hero = () => {
  return (
    <BackgroundBeamsWithCollision>
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Boost Your Coding Efficiency with Our Code Snippet Manager!
        </h1>
        <p className="text-lg md:text-2xl text-slate-500 mt-2">
          "Organize, Access, and Share Your Code Snippets Effortlessly."
        </p>
        <div className="flex justify-center items-center mt-7">
          <Link href="/dashboard">
          <Lottie animationData={animate} loop={true} className="w-72 md:w-96" />
          </Link>
        </div>
      </div>
    </div>
    </BackgroundBeamsWithCollision>
  )
}

export default Hero;