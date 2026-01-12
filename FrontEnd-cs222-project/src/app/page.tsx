"use client";
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home.tsx';
import Secondary from './pages/secondary.tsx';
import CareerInsights from './pages/CareerInsights.tsx';
import Jobs from './pages/Jobs.tsx';

const Page = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recommendedminors" element={<Secondary refresh={0}/>} />
        <Route path="/careerinsights" element={<CareerInsights />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Page;