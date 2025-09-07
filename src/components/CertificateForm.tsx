"use client";

import { useState } from "react";
import Papa from "papaparse";
import SuccessModal from "./SuccessModal";

interface CertificateFormProps {
  components?: any[];
  canvasSettings?: any;
}

const CertificateForm = ({ components = [], canvasSettings }: CertificateFormProps) => {
  const [courseTitle, setCourseTitle] = useState("");
  const [primaryColor, setPrimaryColor] = useState("Blue");
  const [sealType, setSealType] = useState("Star");
  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log("Parsed CSV data:", results.data);
          setCsvData(results.data);
        },
        error: (err) => {
          console.error("CSV parsing error:", err);
          setError("Failed to parse CSV file.");
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) {
      setError("Please upload a CSV file.");
      return;
    }

    if (components.length === 0) {
      setError("Please add some components to your certificate design.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("courseTitle", courseTitle);
    formData.append("primaryColor", primaryColor);
    formData.append("sealType", sealType);
    formData.append("file", csvFile);
    
    // Add the certificate design data
    const designData = {
      components,
      canvasSettings
    };
    formData.append("designData", JSON.stringify(designData));

    try {
      const response = await fetch("/api/issue", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const result = await response.json();
      setSuccess(result);
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSuccess(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            type="text"
            id="courseTitle"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Enter course or certification title"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
              Primary Color Theme
            </label>
            <select
              id="primaryColor"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option>Blue</option>
              <option>Gold</option>
              <option>Green</option>
              <option>Red</option>
              <option>Purple</option>
            </select>
          </div>
          <div>
            <label htmlFor="sealType" className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Seal
            </label>
            <select
              id="sealType"
              value={sealType}
              onChange={(e) => setSealType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option>Star</option>
              <option>Ribbon</option>
              <option>Official Seal</option>
              <option>Badge</option>
              <option>Medal</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Participants CSV
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 px-1">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">CSV up to 10MB</p>
              {csvFile && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700 font-medium">{csvFile.name}</p>
                  <p className="text-xs text-green-600">{csvData.length} participants found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Issuing Certificates...
              </div>
            ) : (
              "Issue Certificates"
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 text-sm ml-2">{error}</p>
            </div>
          </div>
        )}
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        successData={success}
      />
    </>
  );
};

export default CertificateForm;
