import { useEffect, useState } from 'react'
import { FaBolt, FaFire, FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import apiClient from '../Api/axiosConfig'
import { useRef } from 'react'

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
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [deals, setDeals] = useState<FlashDeal[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(now)
      end.setHours(23, 59, 59, 999)
      const diff = end.getTime() - now.getTime()
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    apiClient.get('/products/flash-deals')
      .then(({ data }) => {
        setDeals((Array.isArray(data) ? data : data?.items || []).slice(0, 10))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-48 shimmer rounded mb-4" />
          <div className="flex gap-3 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-44 h-56 shimmer rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!deals.length) return null

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <FaBolt className="text-2xl text-red-500 animate-pulse" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Flash Sales
              </h2>
              <div className="hidden sm:flex items-center gap-1 ml-2">
                <FaFire className="text-orange-500 text-sm animate-pulse" />
                <span className="text-xs text-orange-500 font-semibold">HOT</span>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 font-medium">Ends in:</span>
              {[
                { v: timeLeft.hours, label: 'h' },
                { v: timeLeft.minutes, label: 'm' },
                { v: timeLeft.seconds, label: 's' },
              ].map(({ v, label }, i) => (
                <div key={label} className="flex items-center gap-1">
                  <span className="bg-gray-900 text-white text-xs font-black px-2 py-1 rounded tabular-nums min-w-[28px] text-center">
                    {String(v).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-gray-400">{label}</span>
                  {i < 2 && <span className="text-gray-400 font-bold text-xs">:</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-gray-200 hover:border-orange-400 hover:bg-orange-50 flex items-center justify-center transition-all">
              <FaChevronLeft className="text-gray-500 text-xs" />
            </button>
            <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-gray-200 hover:border-orange-400 hover:bg-orange-50 flex items-center justify-center transition-all">
              <FaChevronRight className="text-gray-500 text-xs" />
            </button>
            <Link to="/flash-sales" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              See all <FaChevronRight className="text-xs" />
            </Link>
          </div>
        </div>

        {/* Products horizontal scroll */}
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
          {deals.map((deal) => {
            const stockLeft = deal.stockLeft || 0
            const totalStock = deal.totalStock || Math.max(stockLeft + Math.floor(Math.random() * 20 + 10), 30)
            const pct = Math.round((stockLeft / totalStock) * 100)
            const sold = 100 - pct
            return (
              <Link key={deal._id} to={`/product/${deal._id}`} className="flex-shrink-0 w-44 sm:w-48 group">
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={deal.image || '/placeholder-product.jpg'}
                      alt={deal.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-400"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[11px] font-black px-2 py-0.5 rounded-md">
                      -{deal.discount}%
                    </div>
                    {pct < 20 && (
                      <div className="absolute top-2 right-2 bg-amber-400 text-gray-900 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {stockLeft} left
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 mb-2 min-h-[2.5rem]">{deal.name}</h3>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-sm font-black text-orange-500">₦{deal.price.toLocaleString()}</span>
                      <span className="text-[11px] text-gray-400 line-through">₦{deal.originalPrice.toLocaleString()}</span>
                    </div>

                    {/* Stock bar */}
                    <div className="space-y-1">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct < 20 ? 'bg-red-500' : pct < 50 ? 'bg-amber-400' : 'bg-green-500'}`}
                          style={{ width: `${sold}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500">{sold}% sold</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
