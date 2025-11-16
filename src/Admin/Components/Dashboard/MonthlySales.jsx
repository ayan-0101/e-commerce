
import { ICONS } from "../../../media/Icons/iconBank";

const MonthlySales = () => {
  const monthlySalesData = [
    {
      stats: '25.6K',
      label: 'Sales',
      icon: 'trendingUp',
      color: 'purple' // purple, blue, green, orange, red, pink
    },
    {
      stats: '12.3K',
      label: 'Customers',
      icon: 'customers',
      color: 'blue'
    },
    {
      stats: '1.2K',
      label: 'Products',
      icon: 'products',
      color: 'green'
    },
    {
      stats: '$48.5K',
      label: 'Revenue',
      icon: 'revenue',
      color: 'orange'
    }
  ];

  return (
    <div className="relative w-full max-w-[800px] max-h-[350px] bg-gradient-to-br from-blue-950 to-indigo-950 rounded-2xl p-8 shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
      {/* Content Layout */}
      <div className="flex flex-col gap-6 h-full items-start justify-start">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Monthly Overview</h2>
          <p className="text-sm font-semibold tracking-wide text-purple-400">
            Total 25.6K Sales this month
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 w-full">
          {monthlySalesData.map((item, index) => {
            const IconComponent = ICONS[item.icon];
            
            // Color mapping for backgrounds and icons
            const colorClasses = {
              purple: { bg: 'bg-purple-500/20', icon: 'text-purple-400' },
              blue: { bg: 'bg-blue-500/20', icon: 'text-blue-400' },
              green: { bg: 'bg-green-500/20', icon: 'text-green-400' },
              orange: { bg: 'bg-orange-500/20', icon: 'text-orange-400' },
              red: { bg: 'bg-red-500/20', icon: 'text-red-400' },
              pink: { bg: 'bg-pink-500/20', icon: 'text-pink-400' }
            };

            const colors = colorClasses[item.color] || colorClasses.purple;
            
            return (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex flex-col items-center gap-3 text-center">
                  {/* Icon */}
                  {IconComponent && (
                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                      <IconComponent className={colors.icon} style={{ fontSize: '24px' }} />
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="text-2xl font-bold text-white">
                    {item.stats}
                  </div>
                  
                  {/* Label */}
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthlySales;