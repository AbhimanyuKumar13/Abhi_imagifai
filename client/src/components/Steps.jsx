import React from 'react'
import { stepsData } from '../assets/assets'
import { motion } from "motion/react"

export const Steps = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center px-4 py-16 sm:px-8 lg:px-16"
    >
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-2 text-center">
        How it Works
      </h1>
      <p className="text-base sm:text-lg text-gray-600 mb-8 text-center">
        Transform words into Stunning Images
      </p>

      {/* Steps Container */}
      <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {stepsData.map((item, index) => (
          <div
            key={index}
            className="flex items-start sm:items-center gap-4 p-5 bg-white shadow-md cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-lg"
          >
            <img
              src={item.icon}
              alt="item_icon"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-medium">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
