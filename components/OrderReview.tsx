
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  BellRing, 
  MoreHorizontal, 
  FileText, 
  AlertTriangle, 
  Wallet, 
  X, 
  MessageSquareQuote, 
  User, 
  ShieldAlert, 
  CreditCard, 
  Ban, 
  Info, 
  Database, 
  Wrench, 
  Satellite, 
  Calendar, 
  Map, 
  FileDigit, 
  Maximize, 
  Cpu, 
  Layers, 
  Users, 
  Timer, 
  Link as LinkIcon, 
  Code2, 
  TableProperties, 
  ArrowUpRight 
} from 'lucide-react';

interface ToolParameter {
  name: string;
  type: string;
  required: string;
  desc: string;
}

interface OrderReviewItem {
  id: string;
  reviewType: '退款申请' | '大额审批' | '风险复核' | '订单审核'; // 审核原因/类型
  productType: string; // 产品/申请类型：卫星影像、专题数据、工具订单
  customer: string;
  amount: string;
  submitTime: string;
  status: '待审核' | '已通过' | '已驳回';
  reason: string;
  priority: '高' | '中' | '低';
  details: {
    productName: string;
    orderTime: string;
    paymentMethod: string;
    description: string;
  };
  // 数据订单专属详情
  dataDetails?: {
    satellite: string;
    resolution: string;
    acquisitionTime: string;
    area: string;
    format: string;
    thumbnail: string;
  };
  // 工具订单专属详情
  toolDetails?: {
    toolName: string;
    type: string;
    url: string;
    parameters: ToolParameter[];
  };
  processResult?: string;
  auditor?: string;
  category: '数据' | '工具';
}

const MOCK_REVIEWS: OrderReviewItem[] = [
  {
    id: 'ORD-20230620-01',
    reviewType: '退款申请',
    productType: '卫星影像',
    customer: '南京市规划局',
    amount: '¥8,500.00',
    submitTime: '2023-06-20 10:30',
    status: '待审核',
    reason: '购买的数据分辨率不符合项目要求（实际需要0.5米，误购1米）。',
    priority: '中',
    category: '数据',
    details: {
      productName: '南京市全域遥感影像',
      orderTime: '2023-06-19 15:45',
      paymentMethod: '对公转账',
      description: '客户反馈在验收过程中发现数据精度无法满足最新的城市精细化管理标准，申请全额退款并重新采购高精度数据。'
    },
    dataDetails: {
      satellite: 'GF-2 (高分二号)',
      resolution: '1.0m (全色) / 4.0m (多光谱)',
      acquisitionTime: '2023-05-12 10:30:25',
      area: '6,582 km²',
      format: 'GeoTIFF',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop'
    }
  },
  {
    id: 'ORD-20230619-05',
    reviewType: '大额审批',
    productType: '专题数据',
    customer: '武汉大学测绘学院',
    amount: '¥125,000.00',
    submitTime: '2023-06-19 14:20',
    status: '待审核',
    reason: '单笔订单金额超过系统自动审批阈值（10万）。',
    priority: '高',
    category: '数据',
    details: {
      productName: '全国重点城市群三维模型库',
      orderTime: '2023-06-19 14:15',
      paymentMethod: '科研经费转账',
      description: '该订单涉及多个城市群的三维数据授权，属于年度重点科研项目采购，需财务与风控双重审批。'
    },
    dataDetails: {
      satellite: '无人机倾斜摄影',
      resolution: '0.05m',
      acquisitionTime: '2023-01 ~ 2023-05',
      area: '1,200 km²',
      format: 'OSGB / 3D Tiles',
      thumbnail: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=400&auto=format&fit=crop'
    }
  },
  {
    id: 'ORD-20230618-02',
    reviewType: '风险复核',
    productType: '工具订单',
    customer: '个人开发者_张三',
    amount: '¥12,800.00',
    submitTime: '2023-06-18 23:15',
    status: '待审核',
    reason: '短时间内频繁下单且IP地址跨省变动。',
    priority: '高',
    category: '工具',
    details: {
      productName: '高频卫星API调用包',
      orderTime: '2023-06-18 23:10',
      paymentMethod: '在线支付',
      description: '系统风控模型触发“异常登录”警报，疑似账号被盗或恶意爬虫行为。'
    },
    toolDetails: {
      toolName: '高频卫星API标准版',
      type: '在线API服务',
      url: 'https://api.satellite-service.com/v1/stream',
      parameters: [
        { name: 'token', type: 'String', required: '是', desc: '用户访问令牌' },
        { name: 'bbox', type: 'Array', required: '是', desc: '请求区域坐标范围 [minX, minY, maxX, maxY]' },
        { name: 'layers', type: 'String', required: '否', desc: '图层类型，默认 "all"' }
      ]
    },
    processResult: '经核实，该账号存在异常访问行为，且无法提供有效的身份验证信息，予以驳回并冻结账号。',
    auditor: '风控系统自动'
  },
  {
    id: 'ORD-20230615-08',
    reviewType: '退款申请',
    productType: '工具订单',
    customer: '某环保科技公司',
    amount: '¥3,200.00',
    submitTime: '2023-06-15 09:40',
    status: '已通过',
    reason: '服务调用接口不稳定，影响业务运行。',
    priority: '低',
    category: '工具',
    details: {
      productName: '实时空气质量分析服务',
      orderTime: '2023-06-14 10:00',
      paymentMethod: '企业支付宝',
      description: '客户提供日志显示API在高峰期响应超时率超过20%，符合SLA赔付标准。'
    },
    toolDetails: {
      toolName: '空气质量分析算子',
      type: '算法模型',
      url: 'https://api.eco-cloud.com/analysis/air-quality',
      parameters: [
        { name: 'stationId', type: 'Integer', required: '是', desc: '监测站点ID' },
        { name: 'timestamp', type: 'Long', required: '是', desc: '查询时间戳' },
        { name: 'metrics', type: 'Array', required: '否', desc: '指定分析指标 (PM2.5, PM10等)' }
      ]
    },
    processResult: '技术部确认故障属实，同意退款申请。',
    auditor: '李经理'
  },
  {
    id: 'ORD-20230621-03',
    reviewType: '订单审核',
    productType: '卫星影像',
    customer: '广州市国土局',
    amount: '¥45,000.00',
    submitTime: '2023-06-21 09:15',
    status: '待审核',
    reason: '特殊区域影像数据申请，需人工核验资质。',
    priority: '高',
    category: '数据',
    details: {
      productName: '广州市核心区高分影像',
      orderTime: '2023-06-21 09:00',
      paymentMethod: '财政支付',
      description: '申请下载核心敏感区域影像数据，需核对申请函及安全保密协议。'
    },
    dataDetails: {
      satellite: 'GF-7 (高分七号)',
      resolution: '0.65m (立体)',
      acquisitionTime: '2023-06-10 11:20:15',
      area: '450 km²',
      format: 'IMG / RPC',
      thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=400&auto=format&fit=crop'
    }
  }
];

export const OrderReview: React.FC = () => {
  const [view, setView] = useState<'list' | 'approve'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalOpinion, setApprovalOpinion] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部状态');
  const [activeTab, setActiveTab] = useState<'数据' | '工具'>('数据');

  const stats = useMemo(() => {
    return {
      total: MOCK_REVIEWS.length,
      pending: MOCK_REVIEWS.filter(r => r.status === '待审核').length,
      processedToday: 2, // Mock number
      rejected: MOCK_REVIEWS.filter(r => r.status === '已驳回').length,
    };
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case '待审核': return 'bg-amber-50 text-amber-600 border-amber-100';
      case '已通过': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case '已驳回': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case '高': return 'text-rose-500 bg-rose-50';
      case '中': return 'text-amber-500 bg-amber-50';
      case '低': return 'text-blue-500 bg-blue-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const filteredReviews = useMemo(() => {
    return MOCK_REVIEWS.filter(item => {
      const matchesTab = item.category === activeTab;
      const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.customer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === '全部状态' || item.status === statusFilter;
      return matchesTab && matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, activeTab]);

  const handleActionClick = (id: string) => {
    setSelectedId(id);
    // 默认意见为同意
    setApprovalOpinion('同意');
    setView('approve');
  };

  const currentItem = useMemo(() => 
    MOCK_REVIEWS.find(item => item.id === selectedId)
  , [selectedId]);

  if (view === 'approve' && currentItem) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col min-h-[600px] animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        {/* 详情头部 */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              {currentItem.status === '待审核' ? '订单审批' : '审核详情'}
            </h2>
          </div>
          <button 
            onClick={() => setView('list')}
            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 详情内容区域 */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-5xl mx-auto flex flex-col gap-10">
            
            {/* 1. 订单信息 */}
            <section className="space-y-6">
              <h3 className="text-lg font-black text-gray-900 flex items-center">
                <div className="p-1.5 bg-blue-50 rounded-lg mr-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                订单信息
              </h3>
              <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-8">
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">订单编号</p>
                    <p className="text-sm font-bold text-gray-800">{currentItem.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">申请类型</p>
                    <p className="text-sm font-bold text-gray-800">{currentItem.productType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">客户名称</p>
                    <p className="text-sm font-bold text-gray-800">{currentItem.customer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">申请时间</p>
                    <p className="text-sm font-bold text-gray-800">{currentItem.submitTime}</p>
                  </div>
                  <div className="col-span-4">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">申请原因</p>
                    <p className="text-sm font-bold text-gray-800">{currentItem.reason}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. 数据信息 (数据订单显示) */}
            {currentItem.category === '数据' && currentItem.dataDetails && (
              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <div className="p-1.5 bg-indigo-50 rounded-lg mr-2">
                    <Database className="w-4 h-4 text-indigo-600" />
                  </div>
                  数据信息
                </h3>
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8">
                  {/* 缩略图 */}
                  <div className="w-full md:w-64 shrink-0">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-100 relative group">
                      <img 
                        src={currentItem.dataDetails.thumbnail} 
                        alt="数据预览" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs font-bold text-white bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">预览数据</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 详细参数 */}
                  <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-8">
                    <div className="col-span-2">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">数据产品名称</p>
                      <p className="text-base font-black text-gray-900">{currentItem.details.productName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center">
                        <Satellite className="w-3 h-3 mr-1" /> 卫星/传感器
                      </p>
                      <p className="text-sm font-bold text-gray-700">{currentItem.dataDetails.satellite}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center">
                        <Maximize className="w-3 h-3 mr-1" /> 分辨率
                      </p>
                      <p className="text-sm font-bold text-gray-700">{currentItem.dataDetails.resolution}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> 采集时间
                      </p>
                      <p className="text-sm font-bold text-gray-700">{currentItem.dataDetails.acquisitionTime}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center">
                        <Map className="w-3 h-3 mr-1" /> 覆盖面积
                      </p>
                      <p className="text-sm font-bold text-gray-700">{currentItem.dataDetails.area}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center">
                        <FileDigit className="w-3 h-3 mr-1" /> 数据格式
                      </p>
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                        {currentItem.dataDetails.format}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 2. 工具信息 (工具订单显示) */}
            {currentItem.category === '工具' && currentItem.toolDetails && (
              <section className="space-y-6">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <div className="p-1.5 bg-orange-50 rounded-lg mr-2">
                    <Wrench className="w-4 h-4 text-orange-600" />
                  </div>
                  工具信息
                </h3>
                <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-8">
                  {/* 核心信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div className="col-span-1 md:col-span-2">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center">
                        <Code2 className="w-3 h-3 mr-1" /> 工具名称
                      </p>
                      <p className="text-base font-black text-gray-900">{currentItem.toolDetails.toolName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center">
                        <Layers className="w-3 h-3 mr-1" /> 工具类型
                      </p>
                      <span className="inline-flex px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                        {currentItem.toolDetails.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center">
                        <LinkIcon className="w-3 h-3 mr-1" /> 访问地址
                      </p>
                      <a 
                        href={currentItem.toolDetails.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                      >
                        {currentItem.toolDetails.url}
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>

                  {/* 接口参数表 */}
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-3 flex items-center">
                        <TableProperties className="w-3 h-3 mr-1" /> 接口参数
                    </p>
                    <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50/30">
                      <table className="w-full text-left">
                        <thead className="bg-gray-100/50 border-b border-gray-100">
                          <tr>
                            <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">参数名称</th>
                            <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">类型</th>
                            <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider text-center">必填</th>
                            <th className="px-5 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">描述</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {currentItem.toolDetails.parameters.map((param, idx) => (
                            <tr key={idx} className="hover:bg-white transition-colors">
                              <td className="px-5 py-3 text-xs font-bold text-gray-800">{param.name}</td>
                              <td className="px-5 py-3 text-xs font-medium text-gray-500 font-mono">{param.type}</td>
                              <td className="px-5 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  param.required === '是' ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {param.required}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-xs font-medium text-gray-500">{param.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 3. 审批处理 */}
            {currentItem.status === '待审核' ? (
              <section className="space-y-6 pt-2 border-t border-gray-100">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <div className="p-1.5 bg-amber-50 rounded-lg mr-2">
                    <MessageSquareQuote className="w-4 h-4 text-amber-600" />
                  </div>
                  审批意见
                </h3>
                <textarea 
                  value={approvalOpinion}
                  onChange={(e) => setApprovalOpinion(e.target.value)}
                  rows={4}
                  placeholder="请输入具体审核处理意见..."
                  className="w-full p-6 bg-white border border-gray-200 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold text-gray-700 placeholder:font-medium placeholder:text-gray-400 shadow-sm"
                />
              </section>
            ) : (
              <section className="space-y-6 pt-2 border-t border-gray-100">
                <h3 className="text-lg font-black text-gray-900 flex items-center">
                  <div className="p-1.5 bg-emerald-50 rounded-lg mr-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  处理结果
                </h3>
                <div className={`p-6 rounded-[1.5rem] border ${
                  currentItem.status === '已通过' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-black ${
                      currentItem.status === '已通过' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {currentItem.status}
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      审核人: {currentItem.auditor || '系统管理员'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-600 leading-relaxed">
                    {currentItem.processResult || '无详细处理说明'}
                  </p>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="px-10 py-6 border-t border-gray-100 flex justify-end space-x-4 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.02)]">
          {currentItem.status === '待审核' ? (
            <>
              <button 
                onClick={() => setView('list')}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl text-sm font-black hover:bg-gray-50 transition-all active:scale-95"
              >
                取消
              </button>
              <button 
                onClick={() => setView('list')}
                className="px-10 py-3 bg-rose-500 text-white rounded-xl text-sm font-black shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95"
              >
                驳回
              </button>
              <button 
                onClick={() => setView('list')}
                className="px-10 py-3 bg-blue-600 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
              >
                通过
              </button>
            </>
          ) : (
            <button 
              onClick={() => setView('list')}
              className="px-12 py-3 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-gray-700 transition-all active:scale-95"
            >
              返回列表
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="h-6 w-1 bg-blue-600 rounded-full" />
            <h2 className="text-[22px] font-black text-gray-900 tracking-tight">订单审核</h2>
          </div>
          <p className="text-sm text-gray-400 font-medium">
            集中处理平台的异常订单请求，包括退款申请、大额支付审批及风险交易复核。
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">待审核申请</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.pending}</h3>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-inner">
            <BellRing className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">今日已处理</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.processedToday}</h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">已驳回</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.rejected}</h3>
          </div>
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all shadow-inner">
            <Ban className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">审核总数</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.total}</h3>
          </div>
          <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner">
            <FileText className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-900 font-black text-sm">筛选条件：</span>
          <div className="flex space-x-3">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:bg-white transition-all cursor-pointer"
              >
                <option>全部状态</option>
                <option>待审核</option>
                <option>已通过</option>
                <option>已驳回</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-1 justify-end max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input 
              type="text"
              placeholder="搜索订单号或客户名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:bg-white transition-all font-bold"
            />
          </div>
          <button className="flex items-center px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-10 py-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/20">
          <div className="flex items-center space-x-2">
            {[
                { id: '数据', label: '数据订单' },
                { id: '工具', label: '工具订单' }
            ].map(tab => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                    activeTab === tab.id ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'text-gray-400 hover:text-gray-900'
                }`}
                >
                {tab.label}
                </button>
            ))}
          </div>
          <button className="flex items-center px-5 py-2 bg-white text-blue-600 rounded-xl text-[11px] font-black hover:bg-blue-50 transition-all uppercase tracking-widest shadow-sm">
             <ArrowUpDown className="w-3.5 h-3.5 mr-2" />
             时间排序
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">订单编号</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">申请类型</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">客户名称</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">申请时间</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">状态</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReviews.length > 0 ? filteredReviews.map((item) => (
                <tr key={item.id} className="group hover:bg-blue-50/10 transition-all">
                  <td className="px-10 py-6">
                    <span className="text-sm font-black text-gray-800">{item.id}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        item.category === '数据' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {item.category === '数据' ? <Database className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                      </div>
                      <span className="text-xs font-bold text-gray-600">{item.productType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">{item.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-bold text-gray-400">{item.submitTime}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center justify-end">
                      {item.status === '待审核' ? (
                        <button 
                          onClick={() => handleActionClick(item.id)}
                          className="text-[11px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-[0.2em] transition-all"
                        >
                          审核
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActionClick(item.id)}
                          className="text-[11px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-[0.2em] transition-all"
                        >
                          详情
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <ShieldAlert className="w-12 h-12 text-gray-200 mb-4" />
                      <p className="text-sm font-bold text-gray-400">暂无{activeTab}订单审核记录</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-10 py-8 border-t border-gray-50 flex items-center justify-between bg-gray-50/10">
          <span className="text-[11px] text-gray-400 font-black uppercase tracking-widest">
            显示 {filteredReviews.length > 0 ? 1 : 0} 到 {filteredReviews.length} 条，共 {MOCK_REVIEWS.filter(r => r.category === activeTab).length} 条记录
          </span>
          <div className="flex items-center space-x-3">
            <button className="p-3 border border-gray-100 rounded-xl text-gray-300 hover:text-blue-600 transition-all disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl text-xs font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20">1</button>
            <button className="w-10 h-10 rounded-xl text-xs font-black text-gray-400 border border-gray-100 hover:bg-white transition-all">2</button>
            <button className="p-3 border border-gray-100 rounded-xl text-gray-400 hover:text-blue-600 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
