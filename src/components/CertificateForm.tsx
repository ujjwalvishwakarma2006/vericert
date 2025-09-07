"use client";

import { useState } from "react";
import Papa from "papaparse";

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-300">
          Course Title
        </label>
        <input
          type="text"
          id="courseTitle"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-300">
            Primary Color
          </label>
          <select
            id="primaryColor"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          >
            <option>Blue</option>
            <option>Gold</option>
            <option>Green</option>
            <option>Red</option>
          </select>
        </div>
        <div>
          <label htmlFor="sealType" className="block text-sm font-medium text-gray-300">
            Seal Type
          </label>
          <select
            id="sealType"
            value={sealType}
            onChange={(e) => setSealType(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          >
            <option>Star</option>
            <option>Ribbon</option>
            <option>Official Seal</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">
          Participant CSV File
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="flex text-sm text-gray-400">
              <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500 px-1">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              CSV up to 10MB
            </p>
            {csvFile && <p className="text-sm text-green-400 mt-2">{csvFile.name}</p>}
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-gray-500"
        >
          {loading ? "Issuing Certificates..." : "Issue Certificates"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && (
        <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-md">
          <h3 className="text-lg font-medium text-green-300">Success!</h3>
          <p className="text-sm text-gray-300 mt-1">NFTs minted successfully. Transaction details:</p>
          <pre className="mt-2 text-xs text-gray-400 bg-gray-800 p-2 rounded overflow-x-auto">
            {JSON.stringify(success, null, 2)}
          </pre>
        </div>
      )}
    </form>
  );
};

export default CertificateForm;
