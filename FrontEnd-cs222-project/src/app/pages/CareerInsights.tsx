"use client";
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Title from "../components/Title.js";
import Subtitle from '../components/subtitle2.js';

// Define career insights interface
interface CareerInsights {
  jobTypes: string[];
  salaryRange: {
    entry: string;
    mid: string;
    senior: string;
  };
  topLocations: string[];
  topCompanies: string[];
  growthOutlook: string;
  keySkills: string[];
}

export default function CareerInsights() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    major = "",
    minor = "",
    minorDataStored = { percentages: {}, top_minors: [] },
    storedSubject = "",
    storedClassesData = [],
    storedCurrentClasses = [],
    storedSelectedClasses = [],
    storedOffset = null,
    storedEndOffset = null
  } = location.state || {};

  const [careerInsights, setCareerInsights] = useState<CareerInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareerInsights = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching career insights for:", { major, minor });
        const response = await fetch('http://localhost:8000/api/career_insights/', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            major,
            minor
          }),
        });

        console.log("Response status:", response.status, response.statusText);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch career insights: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log("Fetched career insights:", data);

        if (data.insights) {
          setCareerInsights(data.insights);
        } else if (data.error) {
          // Backend returned an error
          throw new Error(data.error);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error('Error fetching career insights:', error);
        setError(error instanceof Error ? error.message : 'Failed to load career insights');
      } finally {
        setIsLoading(false);
      }
    };

    if (major && minor) {
      fetchCareerInsights();
    }
  }, [major, minor]);

  const goToJobs = () => {
    window.scrollTo(0, 0);
    navigate('/jobs', {
      state: {
        major,
        minor,
        minorDataStored,
        storedSubject,
        storedClassesData,
        storedCurrentClasses,
        storedSelectedClasses,
        storedOffset,
        storedEndOffset
      }
    });
  };

  const goToMinors = () => {
    window.scrollTo(0, 0);
    navigate('/recommendedminors', {
      state: {
        minorData: minorDataStored,
        selectedMajor: major,
        storedSubject,
        storedClassesData,
        storedCurrentClasses,
        storedSelectedClasses,
        storedOffset,
        storedEndOffset
      }
    });
  };

  const goToHome = () => {
    window.scrollTo(0, 0);
    navigate('/', {
      state: {
        storedMajor: major,
        storedSubject,
        storedClassesData,
        storedCurrentClasses,
        storedSelectedClasses,
        storedOffset,
        storedEndOffset
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#13294B]/5 via-white to-[#E84A27]/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13294B] mx-auto mb-4"></div>
          <p className="text-[#13294B] text-lg">Loading career insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#13294B]/5 via-white to-[#E84A27]/5 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#13294B] mb-4">Error Loading Career Insights</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/recommendedminors', {
              state: {
                minorData: minorDataStored,
                selectedMajor: major,
                storedSubject,
                storedClassesData,
                storedCurrentClasses,
                storedSelectedClasses,
                storedOffset,
                storedEndOffset
              }
            })}
            className="bg-[#13294B] text-white px-6 py-3 rounded-lg hover:bg-[#13294B]/80 transition-colors"
          >
            Back to Recommendations
          </button>
        </div>
      </div>
    );
  }

  if (!careerInsights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#13294B]/5 via-white to-[#E84A27]/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#13294B] text-lg">No career insights available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13294B]/5 via-white to-[#E84A27]/5">
      <div className="w-full min-h-screen bg-white">
        <div className="bg-gradient-to-r from-[#13294B] to-[#E84A27] h-4 w-full"></div>

        <div className="p-8 md:p-12 lg:p-16 space-y-12">

          {/* Header */}
          <div className="text-center space-y-6 py-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-[#13294B] mb-4">
                Career Insights
              </h1>
              <p className="text-2xl text-[#E84A27] font-semibold mb-4">
                {major} + {minor} Minor
              </p>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore career opportunities and insights for this academic combination
              </p>
            </div>
          </div>

          {/* Career Insights Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Job Types */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500 text-white p-3 rounded-full">
                  <span className="text-xl font-bold">💼</span>
                </div>
                <h2 className="text-2xl font-bold text-blue-800">Career Paths</h2>
              </div>
              <div className="space-y-3">
                {careerInsights.jobTypes.map((jobType, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                    <span className="text-blue-700 font-semibold">{jobType}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Information */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-500 text-white p-3 rounded-full">
                  <span className="text-xl font-bold">$</span>
                </div>
                <h2 className="text-2xl font-bold text-green-800">Salary Ranges</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-sm text-green-600 font-medium">Entry Level (0-3 years)</div>
                  <div className="text-2xl font-bold text-green-700">{careerInsights.salaryRange.entry}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-sm text-green-600 font-medium">Mid Level (3-7 years)</div>
                  <div className="text-2xl font-bold text-green-700">{careerInsights.salaryRange.mid}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                  <div className="text-sm text-green-600 font-medium">Senior Level (7+ years)</div>
                  <div className="text-2xl font-bold text-green-700">{careerInsights.salaryRange.senior}</div>
                </div>
              </div>
            </div>

            {/* Top Locations */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-500 text-white p-3 rounded-full">
                  <span className="text-xl font-bold">📍</span>
                </div>
                <h2 className="text-2xl font-bold text-purple-800">Top Locations</h2>
              </div>
              <div className="space-y-3">
                {careerInsights.topLocations.map((location, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                    <span className="text-purple-700 font-semibold">{location}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Companies */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-500 text-white p-3 rounded-full">
                  <span className="text-xl font-bold">🏢</span>
                </div>
                <h2 className="text-2xl font-bold text-orange-800">Top Companies</h2>
              </div>
              <div className="space-y-3">
                {careerInsights.topCompanies.map((company, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
                    <span className="text-orange-700 font-semibold">{company}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Growth Outlook and Skills */}
          <div className="max-w-4xl mx-auto space-y-8">

            {/* Growth Outlook */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-8 rounded-xl border-2 border-indigo-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-500 text-white p-3 rounded-full">
                  <span className="text-xl font-bold">📈</span>
                </div>
                <h2 className="text-2xl font-bold text-indigo-800">Growth Outlook</h2>
              </div>
              <p className="text-indigo-700 text-lg font-medium">{careerInsights.growthOutlook}</p>
            </div>

            {/* Key Skills */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-8 rounded-xl border-2 border-teal-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-teal-500 text-white p-3 rounded-full">
                  <span className="text-xl font-bold">🛠️</span>
                </div>
                <h2 className="text-2xl font-bold text-teal-800">Key Skills to Develop</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {careerInsights.keySkills.map((skill, index) => (
                  <span key={index} className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="max-w-md mx-auto space-y-6">
            <button
              onClick={goToJobs}
              className="w-full py-4 px-8 bg-gradient-to-r from-[#E84A27] to-[#13294B] text-white font-semibold rounded-xl hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
            >
              <span>🔍 View Job Listings</span>
            </button>

            <button
              onClick={goToHome}
              className="w-full py-4 px-8 bg-[#E84A27] text-white font-semibold rounded-xl hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
            >
              <span>🏠 Back to Home</span>
            </button>

            <button
              onClick={goToMinors}
              className="w-full py-4 px-8 bg-[#13294B] text-white font-semibold rounded-xl hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-3 text-lg"
            >
              <span>⬅️ Back to Minor Recommendations</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}