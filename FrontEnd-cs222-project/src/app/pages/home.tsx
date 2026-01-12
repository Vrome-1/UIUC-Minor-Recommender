"use client";
import Title from "../components/Title.js";
import Subtitle from '../components/subtitle2.js';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchableDropdown from '../components/SearchableDropdown.js';

export default function Home() {
  const location = useLocation();
  const majors = [
    'Accountancy',
    'Actuarial Science',
    'Advertising',
    'Aerospace Engineering',
    'Agricultural and Biological Engineering',
    'Agricultural and Consumer Economics',
    'Animal Sciences',
    'Anthropology',
    'Architecture',
    'Art and Design',
    'Astronomy',
    'Atmospheric Sciences',
    'Biochemistry',
    'Biology',
    'Bioengineering',
    'Business Administration',
    'Chemical Engineering',
    'Chemistry',
    'Civil Engineering',
    'Classics',
    'Communication',
    'Community Health',
    'Computer Engineering',
    'Computer Science',
    'Crop Sciences',
    'Dance',
    'Early Childhood Education',
    'Earth, Society, and Environment',
    'Economics',
    'Electrical Engineering',
    'Elementary Education',
    'Engineering Mechanics',
    'Engineering Physics',
    'Engineering Undeclared',
    'English',
    'Finance',
    'Food Science and Human Nutrition',
    'French',
    'General Studies',
    'Geography and Geographic Information Science',
    'Geology',
    'German',
    'History',
    'Human Development and Family Studies',
    'Industrial Design',
    'Industrial Engineering',
    'Individual Plans of Study',
    'Information Sciences',
    'Information Systems',
    'Italian',
    'Japanese',
    'Journalism',
    'Kinesiology',
    'Landscape Architecture',
    'Latin American and Latino Studies',
    'Learning and Education Studies',
    'Liberal Arts and Sciences Undeclared',
    'Library and Information Science',
    'Linguistics',
    'Marketing',
    'Materials Science and Engineering',
    'Mathematics',
    'Mechanical Engineering',
    'Media and Cinema Studies',
    'Microbiology',
    'Molecular and Cellular Biology',
    'Music',
    'Natural Resources and Environmental Sciences',
    'Neuroscience',
    'Nuclear, Plasma, and Radiological Engineering',
    'Operations Management',
    'Philosophy',
    'Physics',
    'Political Science',
    'Portuguese',
    'Psychology',
    'Public Relations',
    'Recreation, Sport and Tourism',
    'Rehabilitation Sciences',
    'Religious Studies',
    'Russian, East European, and Eurasian Studies',
    'Scandinavian Studies',
    'Slavic Languages and Literatures',
    'Social Work',
    'Sociology',
    'Spanish',
    'Special Education',
    'Statistics',
    'Strategic Business Development and Entrepreneurship',
    'Supply Chain Management',
    'Systems Engineering and Design',
    'Technical Systems Management',
    'Theatre',
    'Urban Planning',
    'Women\'s and Gender Studies'
  ];
  const {
    storedMajor = "",
    storedSubject = "",
    storedClassesData = [],
    storedCurrentClasses = [],
    storedSelectedClasses = [],
    storedOffset = null,
    storedEndOffset = null
  } = location.state || {};
  const [classes, setClasses] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [majorData, setMajorData] = useState<boolean[]>([]);
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | "">("");
  const [classesData, setClassesData] = useState<boolean[]>([]);
  const [currentClasses, setCurrentClasses] = useState<string[]>([]);
  const [selectedCurrentClasses, setSelectedCurrentClasses] = useState<boolean[]>([]);
  const [offset, setOffset] = useState<number | null>(null);
  const [endOffset, setEndOffset] = useState<number | null>(null);

  let closeClasses = function() {};
  let first = true;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching classes from http://localhost:8000/api/classNames/");
        const response = await fetch('http://localhost:8000/api/classNames/', {
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
        });
        console.log("Response status:", response.status, response.statusText);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch classes: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log("Fetched classes:", data);
        setClasses(data);
        // Only set default classesData if we don't have stored data
        if (!storedClassesData || storedClassesData.length === 0) {
          setClassesData(Array(data.length).fill(false));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setIsLoading(false);
      }
    };
    const fetchSubjects = async () => {
      try {
        console.log("Fetching subjects from http://localhost:8000/api/subjectNames/");
        const response = await fetch('http://localhost:8000/api/subjectNames/', {
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch subjects: ${response.status} ${response.statusText} - ${errorText}`);
        }
        const data = await response.json();
        console.log("Fetched subjects:", data);
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };
    fetchClasses();
    fetchSubjects();


  }, []);

  // Handle state restoration only when navigating from other pages
  useEffect(() => {
    // Only restore state if we actually have navigation state (not on page refresh)
    if (location.state && (storedMajor || storedSubject || storedClassesData.length > 0)) {
      if (storedMajor) {
        setSelectedMajor(storedMajor);
        setMajorData(majors.map((major) => major === storedMajor));
      }
      if (storedSubject) {
        setSelectedSubject(storedSubject);
      }
      if (storedClassesData && storedClassesData.length > 0) {
        setClassesData(storedClassesData);
      }
      if (storedCurrentClasses && storedCurrentClasses.length > 0) {
        setCurrentClasses(storedCurrentClasses);
      }
      if (storedSelectedClasses && storedSelectedClasses.length > 0) {
        setSelectedCurrentClasses(storedSelectedClasses);
      }
      if (storedOffset !== null) {
        setOffset(storedOffset);
      }
      if (storedEndOffset !== null) {
        setEndOffset(storedEndOffset);
      }
    }
  }, [location.state, storedMajor, storedSubject, storedClassesData, storedCurrentClasses, storedSelectedClasses, storedOffset, storedEndOffset]);

  const handleSelect = (selectedSubjects: string[] | string) => {
    const subject = Array.isArray(selectedSubjects)
      ? (selectedSubjects.length > 0 ? selectedSubjects[0] : "")
      : selectedSubjects;
    setSelectedSubject(subject);
    console.log("Selected subject:", subject);
    console.log("Subject length:", subject.length);
    var changedClasses : string[] = [];
    var changedSelectedClasses : boolean[] = [];
    var changedOffset : number = -1;
    var changedEndOffset : number = -1;
    if (subject != null && subject !== "") {
      for (let i = 0; i < classes.length; ++i) {
        if (classes[i].substring(0, subject.length) == subject && classes[i].substring(subject.length, subject.length+1) == " ") {
          changedOffset = i;
          console.log("ChangedOffset:", changedOffset);
          while (i < classes.length && classes[i].substring(0, subject.length) == subject && classes[i].substring(subject.length, subject.length+1) == " ") {
            changedClasses.push(classes[i]);
            changedSelectedClasses.push(classesData[i]);
            ++i;
          }
          changedEndOffset = i;
          console.log("ChangedEndOffset:", changedEndOffset);
          break;
        }
      }
    }

    setCurrentClasses(changedClasses);
    setSelectedCurrentClasses(changedSelectedClasses);
    setOffset(changedOffset);
    setEndOffset(changedEndOffset);



    console.log("Offset:", offset);
    console.log("EndOffset:", endOffset);
    console.log("ChangedClasses", currentClasses);
    console.log("SelectedClasses", selectedCurrentClasses);
  };

  const handleDataFromChildClasses = (childData: boolean[]) => {
    if (offset != null && offset != -1 && endOffset != null) {
      var newClassesData = [...classesData];
      for (let i = 0; i < childData.length; ++i) {
        if (offset + i < newClassesData.length) {
          newClassesData[offset + i] = childData[i];
        }
      }
      setClassesData(newClassesData);
      setSelectedCurrentClasses(childData);
    }
  };


  const handleDataFromChildMajors = (selectedMajors: string[] | string) => {
    const selectedMajor = Array.isArray(selectedMajors)
      ? (selectedMajors.length > 0 ? selectedMajors[0] : "")
      : selectedMajors;
    setSelectedMajor(selectedMajor);
    setMajorData(
      majors.map((major) => major === selectedMajor) // creates the expected boolean array
    );
    console.log("Selected major:", selectedMajor);
  };

  const goToSecondaryPage = async () => {
    const to_include: string[] = [];
    for (let i = 0; i < classesData.length; ++i) {
      if (classesData[i]) {
        to_include.push(classes[i]);
        console.log('Added:', classes[i]);
      }
    }
    let to_include_majors = [];
    for (let i = 0; i < majorData.length; ++i) {
      if (majorData[i]) {
        to_include_majors.push(majors[i]);
        console.log('Added:', majors[i]);
      }
    }

    if (to_include_majors.length === 0) {
      alert("Please select a major before proceeding.");
      return;
    }
    if (to_include_majors.length > 1) {
      alert("Please select only one major.");
      return;
    }

    try {
      console.log("Sending POST request to http://localhost:8000/api/minor_progress/");
      const response = await fetch('http://localhost:8000/api/minor_progress/', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          classes: to_include,
          major: to_include_majors[0],
        }),
      });

      console.log("Response status:", response.status, response.statusText);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch minor progress: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Minor progress data:", data);

      // Scroll to top before navigating
      window.scrollTo(0, 0);

      navigate('/recommendedminors', {
        state: {
          minorData: data,
          selectedMajor: to_include_majors[0],
          storedSubject: selectedSubject,
          storedClassesData: classesData,
          storedCurrentClasses: currentClasses,
          storedSelectedClasses: selectedCurrentClasses,
          storedOffset: offset,
          storedEndOffset: endOffset
        }
      });
    } catch (error) {
      console.error('Error fetching minor progress:', error);
      alert("Failed to fetch minor progress data. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading classes...</div>;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#13294B]/5 via-white to-[#E84A27]/5">
      <div className="w-full h-full">

        {/* === MAIN CONTENT === */}
        <div className="bg-white min-h-screen relative">
          <div className="bg-gradient-to-r from-[#13294B] to-[#E84A27] h-4 w-full"></div>

        <div className="p-8 md:p-12 lg:p-16 space-y-12">
          {/* Header */}
          <div className="text-center space-y-3 py-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-[#13294B] mb-2">
                UIUC Minor Recommender
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Select your major, explore subjects, and choose completed courses to plan your academic journey
              </p>
            </div>
          </div>

          {/* Major Selection */}
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6 p-8 bg-gradient-to-r from-[#13294B]/5 to-[#E84A27]/5 rounded-xl border border-[#13294B]/10">
              <div className="flex items-center gap-4">
                <div className="bg-[#13294B] text-white p-3 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#13294B]">Select Your Major</h2>
                  <p className="text-gray-600">Choose your primary field of study</p>
                </div>
              </div>
              <SearchableDropdown
                title="Choose your major..."
                options={majors}
                isMultiSelect={false}
                selectedValues={selectedMajor ? [selectedMajor] : []}
                onSelectionChange={(value) => handleDataFromChildMajors(value)}
                placeholder="Search majors (e.g., Computer Science, Engineering)..."
                className="w-full"
              />
            </div>
          </div>

          {/* Subject Selection */}
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6 p-8 bg-gradient-to-r from-[#E84A27]/5 to-[#13294B]/5 rounded-xl border border-[#E84A27]/10">
              <div className="flex items-center gap-4">
                <div className="bg-[#E84A27] text-white p-3 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#13294B]">Choose a Subject Area</h2>
                  <p className="text-gray-600">Select a subject to view available courses</p>
                </div>
              </div>
              <SearchableDropdown
                title="Select a subject to filter courses..."
                options={subjects}
                isMultiSelect={false}
                selectedValues={selectedSubject ? [selectedSubject] : []}
                onSelectionChange={(value) => handleSelect(value)}
                placeholder="Search subjects (e.g., CS, MATH, PHYS)..."
                className="w-full"
              />
              {selectedSubject && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 font-medium">
                    Selected: <span className="font-semibold">{selectedSubject}</span> - {currentClasses.length} courses available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Courses */}
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6 p-8 bg-gradient-to-r from-[#F9FAFB] to-[#E84A27]/5 rounded-xl border-2 border-dashed border-[#E84A27]/20">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-[#E84A27] to-[#13294B] text-white p-3 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-[#13294B]">Select Completed Courses</h2>
                  <p className="text-gray-600">Choose courses you've already taken from the selected subject</p>
                </div>
              </div>
              {currentClasses.length > 0 ? (
                <>
                  <SearchableDropdown
                    title="Select the courses you've completed..."
                    options={currentClasses}
                    isMultiSelect={true}
                    selectedValues={currentClasses.filter((_, index) => selectedCurrentClasses[index])}
                    onSelectionChange={(selectedCourses) => {
                      // Convert selected courses back to boolean array
                      const updatedBooleans = currentClasses.map(course => selectedCourses.includes(course));
                      handleDataFromChildClasses(updatedBooleans);
                    }}
                    placeholder="Search courses (e.g., CS 124, MATH 241)..."
                    className="w-full"
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg font-medium mb-3">No courses available</p>
                  <p className="text-gray-500">
                    {selectedSubject ? `No courses found for ${selectedSubject}. Try selecting a different subject.` : "Please select a subject first to view available courses."}
                  </p>
                </div>
              )}
            </div>
          </div>


          {/* Selected Courses Summary */}
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 p-8 bg-white rounded-xl border-2 border-[#13294B] shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-[#13294B] text-white p-4 rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-xl font-bold">✓</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#13294B]">Your Selected Courses</h2>
                    <p className="text-lg text-gray-600">
                      {classes.filter((_, i) => classesData[i]).length > 0
                        ? `${classes.filter((_, i) => classesData[i]).length} courses selected`
                        : "No courses selected yet"
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-600">
                    {classes.filter((_, i) => classesData[i]).length}
                  </div>
                  <div className="text-sm text-gray-500">courses</div>
                </div>
              </div>

            <div className="bg-white border border-green-200 rounded-lg p-4 min-h-[100px]">
              {classes.filter((_, i) => classesData[i]).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {classes.map((course, i) =>
                    classesData[i] ? (
                      <div key={i} className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-md border border-green-200">
                        <span className="text-green-600 text-sm font-bold">•</span>
                        <span className="text-gray-800 font-medium text-sm">{course}</span>
                      </div>
                    ) : null
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">Select courses above to see them here</p>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="max-w-md mx-auto mt-12 text-center">
            <div className="mb-6">
              {!selectedMajor && (
                <p className="text-red-600 text-lg mb-4">⚠️ Please select a major to continue</p>
              )}
            </div>
            <button
              onClick={goToSecondaryPage}
              disabled={!selectedMajor}
              className={`w-full py-6 px-10 font-bold rounded-xl transform transition-all duration-300 flex items-center justify-center space-x-4 text-xl shadow-lg ${
                selectedMajor
                  ? 'bg-gradient-to-r from-[#E84A27] to-[#13294B] text-white hover:shadow-2xl hover:brightness-110 hover:-translate-y-1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>
                {selectedMajor
                  ? `Continue`
                  : "Select a Major to Continue"
                }
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <p className="text-sm text-gray-500 mt-4">
              Ready to explore minor recommendations based on your selections
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}