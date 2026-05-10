import { portfolioItems } from '@/data/portfolio';
import { ArrowRight } from 'lucide-react';

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="section-spacing" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <p className="font-bold text-sm tracking-[0.2em] uppercase" style={{ color: '#F5A623' }}>
            Featured Works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: '#2C3E50' }}>
            精選作品 Showcase
          </h2>
          <div className="w-12 h-1.5 bg-orange-400 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-white font-medium flex items-center gap-2">
                    查看詳情 <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold group-hover:text-orange-500 transition-colors duration-300" style={{ color: '#2C3E50' }}>
                  {item.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-4">
                  <a
                    href={item.link}
                    className="inline-flex items-center gap-2 text-sm font-bold transition-all duration-300 group-hover:gap-4"
                    style={{ color: '#F5A623' }}
                  >
                    查看作品
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <a
            href="#contact"
            className="btn-secondary px-8 py-4 text-lg shadow-lg hover:shadow-orange-200"
          >
            開啟您的專案合作
          </a>
        </div>
      </div>
    </section>
  );
}
