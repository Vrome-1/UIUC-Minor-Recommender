"use client";
import React, { useState, useEffect, useRef } from "react";

function SearchableDropdown({
  title,
  options,
  isMultiSelect = false,
  selectedValues = [],
  onSelectionChange,
  placeholder = "Search...",
  className = "",
  maxHeight = "300px"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedItems, setSelectedItems] = useState(selectedValues);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Update filtered options when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Update selected items when prop changes
  useEffect(() => {
    setSelectedItems(selectedValues);
  }, [selectedValues]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const handleSelectOption = (option) => {
    if (isMultiSelect) {
      const newSelected = selectedItems.includes(option)
        ? selectedItems.filter(item => item !== option)
        : [...selectedItems, option];
      setSelectedItems(newSelected);
      onSelectionChange(newSelected);
    } else {
      setSelectedItems([option]);
      onSelectionChange(option);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleRemoveItem = (itemToRemove, e) => {
    e.stopPropagation();
    const newSelected = selectedItems.filter(item => item !== itemToRemove);
    setSelectedItems(newSelected);
    onSelectionChange(newSelected);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const getDisplayText = () => {
    if (selectedItems.length === 0) {
      return title;
    }
    if (isMultiSelect) {
      if (selectedItems.length === 1) {
        return `${selectedItems[0]}`;
      }
      return `${selectedItems.length} selected`;
    }
    return selectedItems[0];
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Trigger */}
      <div
        onClick={handleToggleDropdown}
        className="w-full p-3 border border-[#E84A27]/20 hover:border-[#13294B] rounded-lg bg-white cursor-pointer transition-colors flex items-center justify-between min-h-[44px]"
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedItems.length > 0 ? (
            isMultiSelect ? (
              selectedItems.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-[#13294B]/10 text-[#13294B] px-2 py-1 rounded-md text-sm"
                >
                  {item}
                  <button
                    onClick={(e) => handleRemoveItem(item, e)}
                    className="hover:bg-[#13294B]/20 rounded-full p-0.5"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))
            ) : (
              <span className="text-[#13294B] font-medium">{selectedItems[0]}</span>
            )
          ) : (
            <span className="text-gray-500">{title}</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-[#13294B] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E84A27]/20 rounded-lg shadow-xl z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#13294B] focus:border-transparent text-gray-900 placeholder-gray-600 text-sm"
              />
            </div>
          </div>

          {/* Options List */}
          <div
            className="max-h-[300px] overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = selectedItems.includes(option);
                return (
                  <div
                    key={index}
                    onClick={() => handleSelectOption(option)}
                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-[#F9FAFB] transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-[#13294B]/5' : ''
                    }`}
                  >
                    <span className={`text-sm ${isSelected ? 'text-[#13294B] font-medium' : 'text-gray-700'}`}>
                      {option}
                    </span>
                    {isMultiSelect && isSelected && (
                      <svg className="w-4 h-4 text-[#13294B]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 text-sm">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>

          {/* Footer with select all/clear all for multi-select */}
          {isMultiSelect && filteredOptions.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex justify-between text-xs">
                <button
                  onClick={() => {
                    setSelectedItems(filteredOptions);
                    onSelectionChange(filteredOptions);
                  }}
                  className="text-[#13294B] hover:text-[#E84A27] font-medium"
                >
                  Select All
                </button>
                <button
                  onClick={() => {
                    setSelectedItems([]);
                    onSelectionChange([]);
                  }}
                  className="text-gray-500 hover:text-red-500 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;