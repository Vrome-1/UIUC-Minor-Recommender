"use client";
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';


export default function Secondary({ refresh = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract both minorData and selectedMajor from location.state
  const { minorData = { percentages: {}, top_minors: [] }, selectedMajor = "", storedSubject = "", storedClassesData = [], storedCurrentClasses = [], storedSelectedClasses = [], storedOffset = null, storedEndOffset = null  } = location.state || {};
  const percentages = Object.values(minorData.percentages);
  const minors = Object.keys(minorData.percentages);

  const goToHomePage = () => {
    window.scrollTo(0, 0);
    navigate('/', { 
      state: { 
        storedMajor : selectedMajor, 
        storedSubject, 
        storedClassesData, 
        storedCurrentClasses, 
        storedSelectedClasses, 
        storedOffset, 
        storedEndOffset 
      } 
    });
  };

  useEffect(() => {
    if (refresh > 0) {
      goToHomePage();
    }
  }, [refresh]);

  const handleMinorClick = (minor: string) => {
    console.log(`Clicked on minor: ${minor}, selectedMajor: ${selectedMajor}`);
    if (!selectedMajor) {
      console.error("No major selected. Navigation aborted.");
      return;
    }
    window.scrollTo(0, 0);
    navigate('/careerinsights', {
      state: {
        major: selectedMajor,
        minor,
        minorDataStored: minorData,
        storedSubject,
        storedClassesData,
        storedCurrentClasses,
        storedSelectedClasses,
        storedOffset,
        storedEndOffset
      }
    });
  };


const downloadPDF = async () => {
  const element = document.getElementById("results-to-download");
  if (!element) return;

  // Wait for any transition/animation if using Tailwind etc.
  await new Promise(r => setTimeout(r, 100));
  
  const canvas = await html2canvas(element as HTMLElement, { scale: 2 } as any);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const margin = 10; // mm
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  // Compute scaled image height to fit within usable area
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(usableWidth / imgWidth, usableHeight / imgHeight);
  const renderWidth = imgWidth * ratio;
  const renderHeight = imgHeight * ratio;

  pdf.addImage(
    imgData,
    "PNG",
    margin + (usableWidth - renderWidth) / 2, // center horizontally within margin
    margin + (usableHeight - renderHeight) / 2, // center vertically within margin
    renderWidth,
    renderHeight
  );

  pdf.save("minor_recommendations.pdf");
};


  




  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13294B]/5 via-white to-[#E84A27]/5">
      <div className="w-full min-h-screen bg-white">
        <div className="bg-gradient-to-r from-[#13294B] to-[#E84A27] h-4 w-full"></div>

        <div className="p-8 md:p-12 lg:p-16 space-y-12">

          {/* Content to be converted to PDF */}
          <div id="results-to-download" className="space-y-10" style={{ color: "black" }}>
            {/* Header */}
            <div className="text-center space-y-6 py-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-bold text-[#13294B] mb-4">
                  UIUC Minor Recommendations
                </h1>
                <p className="text-2xl text-[#E84A27] font-semibold mb-4">
                  Based on your completed courses
                </p>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Click on any minor name below to explore career insights and job opportunities
                </p>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="max-w-4xl mx-auto space-y-8">
              {minors.map((minor, index) => {
                const percentage = percentages[index];
                let bgColor = '#FF6F61'; // Coral for <40%
                
                if (Number(percentage) >= 70) {
                  bgColor = '#4CAF50'; // Green
                } else if (Number(percentage) >= 40) {
                  bgColor = '#FFC107'; // Amber
                }

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between px-1">
                      <span 
                        className="font-medium text-[#13294B] cursor-pointer hover:underline"
                        onClick={() => handleMinorClick(minor)}
                      >
                        {minor}
                      </span>
                      <span className="font-semibold text-[#374151]">{Number(percentage).toFixed(2)}%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: bgColor
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="max-w-md mx-auto space-y-6">
            <button
              onClick={downloadPDF}
              className="w-full py-4 px-8 bg-[#13294B] text-white font-semibold rounded-xl hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
            >
              <span>Download as PDF</span>
            </button>

            <button
              onClick={goToHomePage}
              className="w-full py-4 px-8 bg-gradient-to-r from-[#E84A27] to-[#13294B] text-white font-semibold rounded-xl hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
            >
              <span>Back to Home</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );  
}