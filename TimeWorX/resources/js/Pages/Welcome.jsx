import React, { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion'

export default function Welcome({ auth }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div id='welcome' className="min-h-screen">
    <Head title='Welcome'/>
      {/* Navigation Bar */}
      <nav className="fixed w-full bg-white bg-opacity-90 backdrop-blur-sm z-50 transition-all duration-300 ease-in-out" style={{ boxShadow: `0 0 ${scrollY / 5}px rgba(0,0,0,0.1)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black"><svg className='text-logo'></svg></Link>
            </div>
            <div className="flex items-center space-x-4">
              {auth.user ? (
                <Link
                  href={route('dashboard')}
                  className="btn px-4 py-2 rounded-full "
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="btn px-4 py-2 rounded-full "
                  >
                    Log in
                  </Link>
                  <Link
                    href={route('register')}
                    className="btn btn-contact px-4 py-2 rounded-full"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10"
        >
          <div className='flex justify-center items-center'>
            <h1 className="text-6xl font-bold mb-4">Welcome to TimeWor<span className='text-blue-800'>X</span></h1>
          </div>
          <p className="text-gray-500 text-xl mb-8">A place where creativity meets technology.</p>
          <div className="flex justify-center gap-6">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
            >
              Learn More
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-contact px-8 py-3 border-black rounded-full"
            >
              Contact Us
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Main Content Section */}
      <main className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Why Choose Us?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'Fast and Reliable', description: 'Our services are designed to be fast, reliable, and efficient.' },
              { title: 'Professional Team', description: 'Our team is dedicated to delivering top-notch solutions with a professional approach.' },
              { title: 'Customer Satisfaction', description: 'We prioritize customer satisfaction and work hard to meet your expectations.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">&copy; 2024 MyWebsite. All rights reserved.</p>
          <div className="space-x-6">
            <a className="text-white hover:text-gray-300 transition-colors duration-300">Privacy Policy</a>
            <a className="text-white hover:text-gray-300 transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}