
import React, { useEffect, useRef } from 'react';
import { 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, ComposedChart, Line
} from 'recharts';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { Package, Database, ShoppingCart, FileText, TrendingUp, TrendingDown, Globe, Info } from 'lucide-react';

const statsData = [
  { label: '总产品数', value: 128, trend: 12.5, icon: Package, color: 'blue' },
  { label: '总资源数据', value: 356, trend: 8.3, icon: Database, color: 'emerald' },
  { label: '总订单数据', value: 248, trend: -2.1, icon: ShoppingCart, color: 'orange' },
  { label: '总定制需求', value: 47, trend: 15.7, icon: FileText, color: 'green' },
];

const trendData = [
  { month: '1月', revenue: 120000, orders: 45 },
  { month: '2月', revenue: 155000, orders: 52 },
  { month: '3月', revenue: 135000, orders: 48 },
  { month: '4月', revenue: 195000, orders: 70 },
  { month: '5月', revenue: 170000, orders: 62 },
  { month: '6月', revenue: 215000, orders: 85 },
];

const orderDist = [
  { name: '数据', value: 65, color: '#3B82F6' },
  { name: '工具', value: 35, color: '#6366F1' },
];

const productDist = [
  { name: '数据', value: 40, color: '#10B981' },
  { name: '工具', value: 30, color: '#34D399' },
  { name: '应用', value: 20, color: '#6EE7B7' },
  { name: '地图', value: 10, color: '#A7F3D0' },
];

const resourceDist = [
  { name: '数据', value: 55, color: '#F59E0B' },
  { name: '工具', value: 25, color: '#FBBF24' },
  { name: '应用', value: 15, color: '#FCD34D' },
  { name: '地图', value: 5, color: '#FEF3C7' },
];

// Word Cloud Data
const WORD_CLOUD_DATA = [
  { name: "服务发布", value: 300 }, { name: "影像镶嵌", value: 290 },
  { name: "数据采集", value: 280 }, { name: "影像裁剪", value: 270 },
  { name: "波段合成", value: 260 }, { name: "耕地范围提取", value: 250 },
  { name: "撂荒地监测", value: 240 }, { name: "温度植被干旱指数TVDI", value: 230 },
  { name: "数据采集1", value: 220 }, { name: "服务发布1", value: 210 },
  { name: "遥感监测", value: 200 }, { name: "地理信息", value: 190 },
  { name: "卫星影像", value: 180 }, { name: "无人机", value: 170 },
  { name: "自然资源", value: 160 }, { name: "智慧城市", value: 150 },
  { name: "生态保护", value: 140 }, { name: "水利监测", value: 130 },
  { name: "应急指挥", value: 120 }, { name: "农业估产", value: 110 },
  { name: "大气监测", value: 100 }, { name: "地质灾害", value: 95 },
  { name: "国土空间", value: 90 }, { name: "数字孪生", value: 85 },
  { name: "实景三维", value: 80 }, { name: "北斗定位", value: 75 },
  { name: "云计算", value: 70 }, { name: "大数据", value: 65 },
  { name: "人工智能", value: 60 }, { name: "深度学习", value: 55 },
  { name: "特征提取", value: 50 }, { name: "变化检测", value: 45 },
  { name: "目标识别", value: 40 }, { name: "路径规划", value: 35 },
  { name: "空间分析", value: 30 }, { name: "可视化", value: 25 },
  { name: "服务发布2", value: 200 }, { name: "影像镶嵌2", value: 190 },
  { name: "数据采集2", value: 180 }, { name: "影像裁剪2", value: 170 },
  { name: "波段合成2", value: 160 }, { name: "耕地范围提取2", value: 150 },
  { name: "撂荒地监测2", value: 140 }, { name: "TVDI指数", value: 130 },
  { name: "服务发布3", value: 120 }, { name: "影像镶嵌3", value: 110 },
  { name: "数据采集3", value: 100 }, { name: "影像裁剪3", value: 90 },
  { name: "波段合成3", value: 80 }, { name: "耕地提取", value: 70 },
  { name: "监测服务", value: 60 }, { name: "干旱指数", value: 50 },
  { name: "遥感云服务", value: 145 }, { name: "在线制图", value: 135 },
  { name: "时空大数据", value: 125 }, { name: "位置服务", value: 115 }
];

const MiniDonut = ({ title, data, total }: { title: string, data: any[], total: string }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{title}</span>
      <span className="text-lg font-bold text-gray-900">{total}</span>
      <div className="mt-2 space-y-1">
        {data.map((item, i) => (
          <div key={i} className="flex items-center text-[10px]">
            <div className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: item.color }} />
            <span className="text-gray-500 truncate w-16">{item.name}</span>
            <span className="ml-auto font-medium text-gray-700">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
    <div className="w-24 h-24 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={28}
            outerRadius={38}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[10px] font-bold text-gray-400">比例</div>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current && !chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.setOption({
        tooltip: { 
          show: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 8,
          textStyle: { color: '#333', fontSize: 12 },
          padding: [8, 12],
          borderWidth: 0,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        series: [{
          type: 'wordCloud',
          shape: 'circle', // Using a robust standard shape
          left: 'center',
          top: 'center',
          width: '95%',
          height: '95%',
          right: null,
          bottom: null,
          sizeRange: [10, 45],
          rotationRange: [-45, 45],
          rotationStep: 45,
          gridSize: 8,
          drawOutOfBound: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold',
            color: function () {
              // Light Blue & Cyan Palette
              const colors = [
                '#0ea5e9', // Sky 500
                '#0284c7', // Sky 600
                '#38bdf8', // Sky 400
                '#3b82f6', // Blue 500
                '#2563eb', // Blue 600
                '#60a5fa', // Blue 400
                '#6366f1', // Indigo 500
                '#06b6d4', // Cyan 500
                '#93c5fd'  // Blue 300
              ];
              return colors[Math.floor(Math.random() * colors.length)];
            }
          },
          emphasis: {
            focus: 'self',
            textStyle: {
              shadowBlur: 10,
              shadowColor: '#bae6fd'
            }
          },
          data: WORD_CLOUD_DATA
        }]
      });
    }

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div>
        <h2 className="text-[22px] font-black text-gray-900 tracking-tight">运营概览</h2>
        <p className="text-sm text-gray-400 font-medium">欢迎回来，这是您今天的平台运行报告。</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-${stat.color === 'blue' ? 'blue-500' : stat.color === 'emerald' ? 'emerald-500' : stat.color === 'orange' ? 'orange-500' : 'green-500'}`} />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                <div className="mt-2 flex items-center">
                  {stat.trend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-bold ${stat.trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {Math.abs(stat.trend)}%
                  </span>
                  <span className="text-xs text-gray-400 ml-1">较上月</span>
                </div>
              </div>
              <div className={`p-4 rounded-2xl bg-${stat.color === 'blue' ? 'blue-50' : stat.color === 'emerald' ? 'emerald-50' : stat.color === 'orange' ? 'orange-50' : 'green-50'} text-${stat.color === 'blue' ? 'blue-600' : stat.color === 'emerald' ? 'emerald-600' : stat.color === 'orange' ? 'orange-600' : 'green-600'}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Income & Order Trend */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-xl font-bold text-gray-900 tracking-tight">业务增长趋势</h4>
              <p className="text-xs text-gray-400 mt-1 font-medium">营收与订单成交量的综合关联分析</p>
            </div>
            <div className="flex bg-gray-50 rounded-xl p-1 text-xs border border-gray-100">
              <button className="px-5 py-2 bg-white rounded-lg shadow-sm text-blue-600 font-bold">近半年</button>
              <button className="px-5 py-2 text-gray-400 hover:text-gray-600 font-bold transition-colors">近一年</button>
            </div>
          </div>
          
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                  tickFormatter={(val) => `￥${val/1000}k`}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '16px'
                  }} 
                />
                <Bar 
                  yAxisId="left"
                  dataKey="revenue" 
                  name="营收金额"
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  name="订单数量"
                  stroke="#F59E0B" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#F59E0B', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-12 text-xs font-bold">
            <div className="flex items-center text-gray-400">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
              营收金额 (L)
            </div>
            <div className="flex items-center text-gray-400">
              <div className="w-6 h-1 bg-amber-500 rounded-full mr-3" />
              订单量 (R)
            </div>
          </div>
        </div>

        {/* Insight Panels */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full">
            <h4 className="text-base font-bold text-gray-900 mb-6 flex items-center tracking-tight">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              多维分布洞察
            </h4>
            <div className="space-y-4 flex-1">
              <MiniDonut title="产品申请分布" data={orderDist} total="248 笔" />
              <MiniDonut title="产品类别占比" data={productDist} total="128 件" />
              <MiniDonut title="资源库构成" data={resourceDist} total="356 项" />
            </div>
            <button className="mt-8 w-full py-4 text-sm font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
              查看详细数据报表
            </button>
          </div>
        </div>
      </div>

      {/* World Map Word Cloud Section */}
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 overflow-hidden relative min-h-[500px]">
        {/* Header */}
        <div className="relative z-20 flex justify-between items-center mb-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
              <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
                <Globe className="w-5 h-5" />
              </div>
              资源标签全景图
            </h4>
            <p className="text-sm text-gray-400 mt-1 font-medium">深度覆盖全球 40+ 业务垂直领域 (World Map View)</p>
          </div>
          <span className="text-xs text-sky-600 font-bold bg-sky-50 px-4 py-2 rounded-full border border-sky-100">实时计算更新</span>
        </div>

        {/* Background Map SVG - Fixed non-interactive background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none mt-10">
           <svg viewBox="0 0 1000 500" className="w-[95%] h-auto fill-gray-200">
             {/* North America */}
             <path d="M 50,80 L 150,50 L 350,40 L 400,100 L 300,250 L 150,200 L 50,120 Z" />
             {/* South America */}
             <path d="M 280,280 L 380,280 L 420,350 L 350,480 L 300,420 Z" />
             {/* Europe & Asia */}
             <path d="M 450,150 L 550,50 L 900,50 L 950,150 L 900,300 L 750,320 L 650,250 L 550,200 Z" />
             {/* Africa */}
             <path d="M 460,200 L 600,200 L 650,300 L 550,450 L 480,350 Z" />
             {/* Australia */}
             <path d="M 750,350 L 900,350 L 900,450 L 750,450 Z" />
           </svg>
        </div>
        
        {/* Chart Container - Overlaid on top */}
        <div className="relative z-10 w-full h-[450px]">
           <div ref={chartRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};
