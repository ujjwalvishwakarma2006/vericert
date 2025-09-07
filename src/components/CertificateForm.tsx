"use client";

import { useState } from "react";
import Papa from "papaparse";

const CertificateForm = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [primaryColor, setPrimaryColor] = useState("Blue");
  const [sealType, setSealType] = useState("Star");
  const [csvData, setCsvData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setCsvData(results.data);
          console.log(results.data);
        },
      });
    }
  };

  return (
    <div className="p-8 mt-10 bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
      <form>
        <div className="mb-6">
          <label htmlFor="courseTitle" className="block mb-2 text-sm font-medium text-gray-300">
            Course Title
          </label>
          <input
            type="text"
            id="courseTitle"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="e.g., Introduction to Blockchain"
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="primaryColor" className="block mb-2 text-sm font-medium text-gray-300">
              Primary Color
            </label>
            <select
              id="primaryColor"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option>Blue</option>
              <option>Gold</option>
              <option>Green</option>
              <option>Red</option>
            </select>
          </div>
          <div>
            <label htmlFor="sealType" className="block mb-2 text-sm font-medium text-gray-300">
              Seal Type
            </label>
            <select
              id="sealType"
              value={sealType}
              onChange={(e) => setSealType(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option>Star</option>
              <option>Ribbon</option>
              <option>Official Seal</option>
            </select>
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Upload Participants (.csv)
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="csv-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">CSV file with participant names</p>
                {fileName && <p className="mt-2 text-sm text-green-400">{fileName}</p>}
              </div>
              <input
                id="csv-upload"
                type="file"
                className="hidden"
                accept=".csv"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;
