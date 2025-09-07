"use client";

import { useState } from "react";
import Papa from "papaparse";

const CertificateForm = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [primaryColor, setPrimaryColor] = useState("Blue");
  const [sealType, setSealType] = useState("Star");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a CSV file.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseTitle", courseTitle);
    formData.append("primaryColor", primaryColor);
    formData.append("sealType", sealType);

    try {
      const response = await fetch("/api/issue", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to issue certificates");
      }

      const result = await response.json();
      setSuccess(result.transactionHashes);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 mt-10 bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
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
        <button
          type="submit"
          disabled={loading}
          className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500"
        >
          {loading ? "Issuing..." : "Issue Certificates"}
        </button>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {success && (
          <div className="mt-4 p-4 bg-green-900 rounded-lg">
            <h3 className="font-bold text-green-400">Success!</h3>
            <p className="text-sm text-gray-300">Certificates issued. Transaction Hashes:</p>
            <ul className="list-disc list-inside mt-2 text-xs text-gray-400">
              {success.map((hash, index) => (
                <li key={index}>
                  <a
                    href={`https://mumbai.polygonscan.com/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    {hash}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default CertificateForm;
