import React from 'react';

const Achievement = ({ 
  storeName = "Lowkey Store", 
  achievementTitle = "Congratulations! 🎉", 
  achievementDescription = "You have unlocked the achievement of being awesome!",
  salesCount = 1250,
  onViewSales,
}) => {
  const image = {
    src: require('../../../media/images/trophy.png'),
    alt: 'Trophy'
  };

  return (
    <div className="relative w-full max-w-[500px] h-auto max-h-[350px] bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl p-8 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
      {/* Horizontal Layout */}
      <div className="flex items-center justify-between gap-8 h-full">
        
        {/* Left Side - Text Content in Column */}
        <div className="flex-1 flex flex-col justify-between h-full">
          {/* Top Section - Store & Achievement */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              {achievementTitle}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {achievementDescription}
            </p>
          </div>

          {/* Bottom Section - Sales & Button */}
          <div className="space-y-4 mt-4">
            {/* Sales Count */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl px-3 py-2 text-center">
              <div className="text-xl font-bold text-white leading-none">
                {salesCount.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-white/90 uppercase tracking-wide mt-1">
                Total Sales
              </div>
            </div>

            {/* View Sales Button */}
            <button 
              onClick={onViewSales}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-lg px-6 py-3 font-semibold text-sm flex items-center justify-center gap-2 hover:from-gray-700 hover:to-gray-600 transition-all duration-200"
            >
              <span>View Sales</span>
              <svg 
                width="32" 
                height="32" 
                viewBox="0 0 20 20" 
                fill="none"
              >
                <path 
                  d="M7.5 15L12.5 10L7.5 5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side - Trophy Image */}
        <div className="flex-shrink-0">
          <div>
            <img 
              src={image.src}
              alt="Trophy" 
              className="w-32 h-32 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-6xl">🏆</span>';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievement;