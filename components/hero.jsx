"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { HoverEffect } from "./ui/card-hover-effect";
import { BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { BackgroundBeams } from "./ui/background_beams";

const statsData = [
  {
    value: "5K+",
    label: "Active Users",
  },
  {
    value: "100K+",
    label: "Transactions Tracked",
  },
  {
    value: "99.5%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

const featureList = [
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Advanced Analytics",
    description:
      "Get detialed insights into your spending patterns with AI powered analytics",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Smart Receipt Scanner",
    description:
      "Extract data automatically from receipts using advanced AI technology",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Budget Planning",
    description:
      "Create and manage budgets with intelligent recommendations",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Multi-Account Support",
    description:
      "Manage multiple accounts and credit cards in one place",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Multi-Currency",
    description:
      "Support for multiple currencies with real-time conversion",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Automated Insights",
    description:
      "Get automated financial insights and recommendations",
  },
];

const HeroSection = () => {
  return (
    <div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-4xl md:text-6xl font-bold text-slate-600 lg:text-7xl dark:text-slate-300">
          {"Manage Your Finances".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
          <br />

          {"With Intelligence".split(" ").map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="mr-2 pb-1 inline-block text-4xl md:text-6xl lg:text-7xl bg-gradient-to-b from-purple-500 via-violet-500 to-pink-500 text-transparent bg-clip-text"
            >
              {word}
            </motion.span>
          ))}

          {/* <span className="text-4xl md:text-6xl lg:text-7xl bg-gradient-to-b from-purple-500 via-violet-500 to-pink-500 text-transparent bg-clip-text">With Intelligence</span> */}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          An AI-powered financial management platform that helps you track,
          analyze and optimize your spending with real-time insights.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="w-60 cursor-pointer transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Explore Now
          </button>
          <button className="w-60 cursor-pointer transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Watch Demo
          </button>
        </motion.div>
      </div>

      <div className="w-full">
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="mx-auto relative w-[84vw] z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-[80vw] container mx-auto mb-8 overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <Image
              src="/banner.jpg"
              alt="Landing page preview"
              className="aspect-[16/9] h-[500px] w-[80vw] object-fit"
              height={500}
              width={750}
            />
          </div>
        </motion.div>
      </div>

      <section className="py-20 bg-blue-50 dark:bg-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((statsData, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2 dark:text-purple-500">
                  {statsData.value}
                </div>
                <div className="text-foreground">{statsData.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to know
          </h2>
          <HoverEffect items={featureList} />
        </div>
      </section>

      {/* call to action  */}
      <section className="w-full bg-blue-500 dark:bg-blue-950 py-7">
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <h2 className="text-3xl text-white text-shadow-md md:text-4xl">
                Ready to Take Control of Your Finances?
            </h2>
            <p className="text-md md:text-lg text-gray-200 dark:">Join thousands of users who are already managing thier finances smarter with Finora.</p>

            <Button size="lg" className="cursor-pointer w-40 mx-auto animate-bounce">Start Free Trial</Button>
        </div>
      </section>
      <BackgroundBeams />
    </div>
  );
};

export default HeroSection;
