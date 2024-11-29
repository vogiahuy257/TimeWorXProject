import React, { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';


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
      <section className="hero-welcome relative h-screen flex items-center justify-center text-center bg-gradient-to-b from-blue-50 to-white">
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
        <motion.svg 
          initial={{ opacity: 0, x: 300, y:-300, rotate: 360 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: -360 }}
          transition={{ duration: 1.3, ease: "easeInOut" }}
          className='be-cheese'>
          
          </motion.svg>
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
                className="bg-gray-50  p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Developer Introduction Section */}
      <section id="about" className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-12 text-center"
          >
            Meet Our Developers
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { name: 'Võ Gia Huy', role: 'Full Stack Developer', bio: 'Alice is a passionate frontend developer with 5 years of experience in creating beautiful and responsive user interfaces.', image: 'https://scontent.fsgn10-2.fna.fbcdn.net/v/t39.30808-1/432772573_1564647400979256_2876089901854554961_n.jpg?stp=dst-jpg_s200x200&_nc_cat=103&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=nFkkfMR796QQ7kNvgG1phX7&_nc_zt=24&_nc_ht=scontent.fsgn10-2.fna&_nc_gid=AgOA2WvlccefVOpToyWGm6I&oh=00_AYB2clvoreax5FM_a8Ep3sAVKnUBHW1HrkeI0U_ZKYEaYw&oe=67405DFC' },
              { name: 'Lê Nguyễn Bảo Trân', role: 'Business Analyst', bio: 'Bob is an experienced backend developer who specializes in building scalable and efficient server-side applications.', image: 'https://scontent.fsgn10-2.fna.fbcdn.net/v/t39.30808-1/464780211_122109600182075380_9057370931870382233_n.jpg?stp=cp6_dst-jpg_s200x200&_nc_cat=108&ccb=1-7&_nc_sid=0ecb9b&_nc_ohc=Ic4R7Jr5uk4Q7kNvgEABopu&_nc_zt=24&_nc_ht=scontent.fsgn10-2.fna&_nc_gid=AFhlKis5cLKB0xQ7OpXifcD&oh=00_AYCYhD3AZAhGGUQA6iJKpGw3pfexqPO4eSKhF640c61jsA&oe=67406C9C' },
            ].map((developer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={developer.image}
                    alt={developer.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{developer.name}</h3>
                    <p className="text-gray-600">@{developer.role}</p>
                  </div>
                </div>
                {/* <p className="text-gray-700">{developer.bio}</p> */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>


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