import { useEffect, useState } from 'react'
import { FaBolt, FaFire } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import apiClient from '../Api/axiosConfig'

interface FlashDeal {
  _id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  image: string
  stockLeft: number
  totalStock: number
}

export default function FlashSales() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [deals, setDeals] = useState<FlashDeal[]>([])
  const [loading, setLoading] = useState(true)

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const endOfDay = new Date(now)
      endOfDay.setHours(23, 59, 59, 999)
      
      const diff = endOfDay.getTime() - now.getTime()
      
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch Flash Deals
  useEffect(() => {
    fetchFlashDeals()
  }, [])

  const fetchFlashDeals = async () => {
    try {
      const { data } = await apiClient.get(`/products/flash-deals`)
      setDeals(data)
    } catch (error) {
      console.error('Error fetching flash deals:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg my-8"></div>
    )
  }

  if (deals.length === 0) return null

  return (
    <section className="relative overflow-hidden rounded-xl my-8 shadow-2xl">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/lightning-pattern.svg')] animate-pulse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-white py-8 px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaBolt className="text-4xl animate-bounce" />
              <FaFire className="text-2xl absolute -bottom-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                FLASH SALES
                <span className="text-yellow-300 animate-pulse">⚡</span>
              </h2>
              <p className="text-white/90 text-sm">Limited time offers - Grab them fast!</p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex gap-2">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center min-w-[70px] border border-white/30">
              <div className="text-3xl font-bold tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wider">Hours</div>
            </div>
            <div className="flex items-center text-2xl font-bold">:</div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center min-w-[70px] border border-white/30">
              <div className="text-3xl font-bold tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wider">Mins</div>
            </div>
            <div className="flex items-center text-2xl font-bold">:</div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center min-w-[70px] border border-white/30">
              <div className="text-3xl font-bold tabular-nums animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wider">Secs</div>
            </div>
          </div>
        </div>

        {/* Flash Deal Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {deals?.map((deal) => {
            const stockPercentage = (deal.stockLeft / deal.totalStock) * 100
            
            return (
              <Link
                key={deal._id}
                to={`/product/${deal._id}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-2xl">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      -{deal.discount}%
                    </div>

                    {/* Stock Badge */}
                    {stockPercentage < 20 && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                        {deal.stockLeft} left!
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 bg-white text-gray-800">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 h-10">
                      {deal.name}
                    </h3>
                    
                    {/* Pricing */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-green-600">
                        ₦{deal.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 line-through">
                        ₦{deal.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            stockPercentage < 20
                              ? 'bg-red-500'
                              : stockPercentage < 50
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 text-center">
                        {deal.stockLeft} of {deal.totalStock} remaining
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6">
          <Link
            to="/flash-deals"
            className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-full hover:bg-yellow-300 hover:text-red-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View All Flash Deals →
          </Link>
        </div>
      </div>
    </section>
  )
}
