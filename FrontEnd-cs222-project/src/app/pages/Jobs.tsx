"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Title from "../components/Title.js";
import Subtitle from '../components/subtitle2.js';

// Define the shape of a Job
interface Job {
  title: string;
  location: string;
  company: string;
  description: string;
  url: string;
}

// Define the shape of the API response
interface JobResponse {
  jobs: Job[];
  next_keyword_index: number | null;
  next_page: number;
  has_more: boolean;
  total_keywords: number;
}

export default function Jobs() {
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [nextKeywordIndex, setNextKeywordIndex] = useState<number>(0);
  const [nextPage, setNextPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);

  console.log("Jobs.tsx received state:", { major, minor });

  const lastJobElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchJobs();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchJobs = async () => {
    if (!hasMore || isLoading) return;
    if (!major || !minor) {
      setError("Major or minor not provided.");
      return;
    }

    setIsLoading(true);
    try {
      console.log(`Fetching jobs for major: ${major}, minor: ${minor}, keywordIndex: ${nextKeywordIndex}, page: ${nextPage}`);
      const response = await fetch('http://localhost:8000/api/job_recommendations/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          major,
          minor,
          current_keyword_index: nextKeywordIndex,
          current_page: nextPage,
        }),
      });

      console.log("Response status:", response.status, response.statusText);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch jobs: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: JobResponse = await response.json();
      console.log("Fetched jobs:", data);

      const newJobs: Job[] = Array.isArray(data.jobs) ? data.jobs : [];
      setJobs((prevJobs: Job[]) => [...prevJobs, ...newJobs]);
      setNextKeywordIndex(data.next_keyword_index ?? 0);
      setNextPage(data.next_page ?? 1);
      setHasMore(data.has_more);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError("Failed to fetch job recommendations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const goToCareerInsights = () => {
    window.scrollTo(0, 0);
    navigate('/careerinsights', {
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

  if (error) {
    return (
      <div>
        <Title />
        <Subtitle string={"Error"} />
        <p>{error}</p>
        <button
          onClick={goToCareerInsights}
          style={{
            color: 'white',
            backgroundColor: '#E84A27',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '10px',
            marginTop: '20px',
            marginLeft: '10px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = '#13294B')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = '#E84A27')}
        >
          Back to Career Insights
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13294B]/5 via-white to-[#E84A27]/5 p-8">
      <div className="flex gap-6">
        {/* === MAIN WHITE BUBBLE === */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl relative overflow-visible p-8 flex-1">
          <div className="bg-gradient-to-r from-[#13294B] to-[#E84A27] h-2 w-full"></div>
  
          <div className="p-10 space-y-10">
            {/* Header */}
            <div className="text-center space-y-3 mb-8">
              <div className="inline-block bg-[#13294B]/10 px-6 py-3 rounded-full">
                <h1 className="text-3xl font-bold text-[#13294B]">
                  Job Recommendations
                </h1>
              </div>
              <p className="text-lg text-[#E84A27] font-medium">
                For {major} Major with {minor} Minor
              </p>
            </div>
  
            {/* Jobs List */}
            <div className="space-y-6">
              {jobs.length === 0 && !isLoading ? (
                <p className="text-center text-gray-600 text-base">
                  No job recommendations found. Try a different major or minor combination.
                </p>
              ) : (
                jobs.map((job: Job, index: number) => {
                  const isLastElement = index === jobs.length - 1;
                  return (
                    <div
                      key={`${job.url}-${index}`}
                      ref={isLastElement ? lastJobElementRef : null}
                      className="bg-[#F9FAFB] border-2 border-[#E84A27]/30 rounded-xl p-6 shadow-md"
                    >
                      <h3 className="text-xl font-semibold text-[#13294B] mb-2">{job.title}</h3>
                      <p className="text-gray-700"><strong>Company:</strong> {job.company}</p>
                      <p className="text-gray-700"><strong>Location:</strong> {job.location}</p>
                      <p className="text-gray-700"><strong>Description:</strong> {job.description.substring(0, 200)}...</p>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#E84A27] font-medium mt-4 inline-block hover:underline"
                      >
                        View Job
                      </a>
                    </div>
                  );
                })
              )}
  
              {/* Loading & No More Jobs */}
              {isLoading && (
                <p className="text-center text-gray-500 italic">Loading more jobs...</p>
              )}
              {!hasMore && jobs.length > 0 && (
                <p className="text-center text-gray-500 italic">No more jobs to load.</p>
              )}
            </div>
  
            {/* Navigation Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goToHome}
                className="py-4 px-6 bg-[#E84A27] text-white font-semibold rounded-xl hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>🏠 Back to Home</span>
              </button>

              <button
                onClick={goToCareerInsights}
                className="py-4 px-6 bg-[#13294B] text-white font-semibold rounded-xl hover:shadow-xl hover:brightness-110 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>⬅️ Back to Career Insights</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 111.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}