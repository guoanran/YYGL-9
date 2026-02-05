
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProductManagement } from './components/ProductManagement';
import { ResourceManagement } from './components/ResourceManagement';
import { ServiceResourceManagement } from './components/ServiceResourceManagement';
import { AppResourceManagement } from './components/AppResourceManagement';
import { MapResourceManagement } from './components/MapResourceManagement';
import { ResourceReview } from './components/ResourceReview';
import { ServiceReview } from './components/ServiceReview';
import { AppReview } from './components/AppReview';
import { MapReview } from './components/MapReview';
import { OrderReview } from './components/OrderReview';
import { CustomizationManagement } from './components/CustomizationManagement';
import { SatellitePriceManagement } from './components/SatellitePriceManagement';
import { OperatorPriceManagement } from './components/OperatorPriceManagement';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 产品管理二级路由 */}
        <Route path="/product/data" element={<ProductManagement title="数据产品" />} />
        <Route path="/product/service" element={<ProductManagement title="工具产品" />} />
        <Route path="/product/app" element={<ProductManagement title="应用产品" />} />
        <Route path="/product/map" element={<ProductManagement title="地图产品" />} />
        
        {/* 资源管理二级路由 */}
        <Route path="/resource/data" element={<ResourceManagement title="数据资源" />} />
        <Route path="/resource/service" element={<ServiceResourceManagement title="工具资源" />} />
        <Route path="/resource/app" element={<AppResourceManagement />} />
        <Route path="/resource/map" element={<MapResourceManagement title="地图资源" />} />
        
        {/* 资源审核二级路由 */}
        <Route path="/review/data" element={<ResourceReview title="数据审核" />} />
        <Route path="/review/service" element={<ServiceReview />} />
        <Route path="/review/app" element={<AppReview />} />
        <Route path="/review/map" element={<MapReview />} />
        
        {/* 订单管理二级路由 */}
        <Route path="/order/review" element={<OrderReview />} />
        
        <Route path="/custom" element={<CustomizationManagement />} />
        
        {/* 价格管理二级路由 */}
        <Route path="/price/satellite" element={<SatellitePriceManagement />} />
        <Route path="/price/service" element={<OperatorPriceManagement />} />
      </Routes>
    </Layout>
  );
};

export default App;
