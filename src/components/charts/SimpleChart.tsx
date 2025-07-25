import React from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface LineChartProps {
  data: ChartDataPoint[];
  height?: number;
  showValues?: boolean;
  title?: string;
}

// シンプルな折れ線グラフ
export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 200, 
  showValues = false,
  title 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = ((maxValue - point.value) / range) * 80 + 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="relative">
        <svg width="100%" height={height} className="border border-gray-200 rounded">
          {/* グリッド線 */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* 折れ線 */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={points}
            vectorEffect="non-scaling-stroke"
          />
          
          {/* データポイント */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = ((maxValue - point.value) / range) * 80 + 10;
            return (
              <g key={index}>
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="#3b82f6"
                />
                {showValues && (
                  <text
                    x={`${x}%`}
                    y={`${y - 5}%`}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {point.value.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* X軸ラベル */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((point, index) => (
            <span key={index}>{point.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  showValues?: boolean;
  title?: string;
}

// シンプルな棒グラフ
export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  height: _height = 200, 
  showValues = true,
  title 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 text-right">
              {item.label}
            </div>
            <div className="flex-1 relative">
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="h-6 rounded-full transition-all duration-300"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || '#3b82f6'
                  }}
                />
              </div>
              {showValues && (
                <span className="absolute right-2 top-0 h-6 flex items-center text-xs font-medium text-white">
                  {item.value.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PieChartProps {
  data: ChartDataPoint[];
  size?: number;
  title?: string;
}

// シンプルな円グラフ
export const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  size = 200,
  title 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>}
      <div className="flex items-center space-x-6">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            // const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const radius = size / 2 - 10;
            const centerX = size / 2;
            const centerY = size / 2;
            
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={item.color || colors[index % colors.length]}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* 凡例 */}
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600">
                {item.label}: {item.value.toLocaleString()} ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};