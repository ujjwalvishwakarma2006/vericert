"use client";

import { FC } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  successData: any;
}

const SuccessModal: FC<SuccessModalProps> = ({ isOpen, onClose, successData }) => {
  if (!isOpen || !successData) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Certificates Issued Successfully!</h2>
                <p className="text-green-100 mt-1">NFTs have been minted and distributed to participants</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{successData.total_processed}</div>
              <div className="text-sm text-blue-700">Certificates</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{successData.success_rate}</div>
              <div className="text-sm text-green-700">Success Rate</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{successData.network}</div>
              <div className="text-sm text-purple-700">Network</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{successData.estimated_cost}</div>
              <div className="text-sm text-orange-700">Total Cost</div>
            </div>
          </div>

          {/* Individual Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Certificate Details</h3>
            {successData.results?.map((result: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{result.name}</h4>
                      <p className="text-sm text-gray-600">Token ID: #{result.transaction?.token_id}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    {result.success ? 'Success' : 'Failed'}
                  </span>
                </div>

                {result.transaction && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Transaction Hash:</span>
                      <p className="text-gray-600 font-mono text-xs break-all">
                        {result.transaction.transaction_hash}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Block Number:</span>
                      <p className="text-gray-600">{result.transaction.block_number}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Gas Used:</span>
                      <p className="text-gray-600">{result.transaction.gas_used?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Network Fee:</span>
                      <p className="text-gray-600">{result.transaction.network_fee}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {result.transaction && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <a
                      href={result.transaction.explorer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View on Explorer
                    </a>
                    <a
                      href={result.transaction.opensea_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View on OpenSea
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Raw JSON Details (Collapsible) */}
          <details className="mt-6">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 select-none">
              View Raw Transaction Data
            </summary>
            <div className="mt-3 bg-gray-100 rounded-lg p-4">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(successData, null, 2)}
              </pre>
            </div>
          </details>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
