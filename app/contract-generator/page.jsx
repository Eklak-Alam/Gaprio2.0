'use client'
import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { FiCheck, FiChevronRight, FiDownload, FiEdit, FiLoader, FiMic, FiSend, FiUpload, FiX } from 'react-icons/fi'
import { FileText } from 'lucide-react'

export default function ContractGenerator() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [contractData, setContractData] = useState(null)
  const [error, setError] = useState(null)
  const recordingRef = useRef(null)

  // File upload handling
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  })

  // Voice recording simulation
  const startRecording = () => {
    setIsRecording(true)
    recordingRef.current = setTimeout(() => {
      setIsRecording(false)
      setFile({ name: 'voice_recording.mp3', type: 'audio/mp3' })
    }, 3000)
  }

  const stopRecording = () => {
    clearTimeout(recordingRef.current)
    setIsRecording(false)
  }

  // Process the contract
  const processContract = () => {
    setIsProcessing(true)
    setError(null)
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false)
      setStep(3)
      setContractData({
        title: "Mutual Non-Disclosure Agreement",
        parties: ["Your Company", "Counterparty Inc."],
        effectiveDate: new Date().toLocaleDateString(),
        clauses: [
          {
            title: "Confidential Information",
            content: "All parties agree to maintain the confidentiality of any proprietary information shared during the term of this agreement."
          },
          {
            title: "Term",
            content: "This agreement shall remain in effect for a period of 24 months from the effective date."
          },
          {
            title: "Obligations",
            content: "The receiving party shall not disclose the confidential information to any third party without prior written consent."
          }
        ]
      })
    }, 2500)
  }

  // Reset the process
  const resetProcess = () => {
    setFile(null)
    setContractData(null)
    setStep(1)
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-36">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div 
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'} transition-colors`}
                >
                  {step > stepNumber ? <FiCheck /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${step > stepNumber ? 'bg-indigo-600' : 'bg-gray-700'} transition-colors`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-400">
            <span className={step >= 1 ? 'text-indigo-400' : ''}>Upload Source</span>
            <span className={step >= 2 ? 'text-indigo-400' : ''}>Review</span>
            <span className={step >= 3 ? 'text-indigo-400' : ''}>Generated Contract</span>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Upload Your Contract Source</h2>
            <p className="text-gray-400 mb-8 text-center">
              Provide the basis for your contract by uploading a document or recording voice instructions.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Drag & Drop Upload */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700 hover:border-gray-600'} ${file ? 'border-green-500 bg-green-900/10' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                  <FiUpload className="h-12 w-12 text-gray-400" />
                  {file ? (
                    <>
                      <p className="text-green-400 font-medium">File ready: {file.name}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                        }}
                        className="text-red-400 text-sm flex items-center"
                      >
                        <FiX className="mr-1" /> Remove file
                      </button>
                    </>
                  ) : isDragActive ? (
                    <p className="text-indigo-400">Drop the file here...</p>
                  ) : (
                    <>
                      <p className="text-gray-300">Drag & drop a file here</p>
                      <p className="text-gray-500 text-sm">or click to browse</p>
                      <p className="text-gray-500 text-xs mt-4">Supports: PDF, DOCX, TXT, MP3, WAV</p>
                    </>
                  )}
                </div>
              </div>

              {/* Voice Recording */}
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center justify-center w-24 h-24 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors mb-4`}
                >
                  <FiMic className="h-8 w-8" />
                </button>
                <p className="text-gray-300 mb-2">
                  {isRecording ? "Recording... (3s)" : "Record Voice Instructions"}
                </p>
                <p className="text-gray-500 text-sm text-center">
                  {isRecording 
                    ? "Speak clearly about your contract terms"
                    : "Describe your contract requirements in your own words"}
                </p>
                {file?.type.includes('audio') && (
                  <div className="mt-4 text-green-400 text-sm flex items-center">
                    <FiCheck className="mr-1" /> Voice recording ready
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">
                {error}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => file ? setStep(2) : setError('Please upload a file or record voice instructions')}
                disabled={!file}
                className={`flex items-center px-6 py-3 rounded-md ${file ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 cursor-not-allowed'} transition-colors`}
              >
                Continue <FiChevronRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Review Your Input</h2>
            <p className="text-gray-400 mb-8 text-center">
              Confirm the details before we generate your contract.
            </p>

            <div className="bg-gray-800 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <FiUpload className="mr-2 text-indigo-400" />
                Source File: {file.name}
              </h3>
              <div className="bg-gray-900 rounded-lg p-4">
                {file.type.includes('audio') ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-2">
                      <FiMic className="text-indigo-400" />
                      <span>Voice recording ({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <FileText className="h-12 w-12 text-indigo-400" />
                    <div className="ml-4">
                      <p>{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={processContract}
                className="flex items-center px-6 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Generate Contract <FiChevronRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Generated Contract */}
        {step === 3 && contractData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Your Generated Contract</h2>
              <button
                onClick={resetProcess}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-sm"
              >
                Start New
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 mb-8">
              {/* Contract Header */}
              <div className="bg-gray-900 p-6 border-b border-gray-700">
                <h3 className="text-2xl font-bold text-center mb-2">{contractData.title}</h3>
                <p className="text-gray-400 text-center">Effective Date: {contractData.effectiveDate}</p>
              </div>

              {/* Contract Parties */}
              <div className="p-6 border-b border-gray-700">
                <h4 className="text-lg font-medium mb-4">Parties:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {contractData.parties.map((party, index) => (
                    <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                      <p className="font-medium">{party}</p>
                      <p className="text-sm text-gray-400">Party {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Clauses */}
              <div className="p-6">
                <h4 className="text-lg font-medium mb-4">Clauses:</h4>
                <div className="space-y-6">
                  {contractData.clauses.map((clause, index) => (
                    <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                      <h5 className="font-medium text-indigo-400 mb-2">{clause.title}</h5>
                      <p className="text-gray-300">{clause.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-3 gap-4">
              <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                <div className="flex flex-col items-center">
                  <FiDownload className="h-6 w-6 mb-2 text-indigo-400" />
                  <span>Download PDF</span>
                </div>
              </button>
              <button className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                <div className="flex flex-col items-center">
                  <FiEdit className="h-6 w-6 mb-2 text-amber-400" />
                  <span>Edit Terms</span>
                </div>
              </button>
              <button className="p-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                <div className="flex flex-col items-center">
                  <FiSend className="h-6 w-6 mb-2 text-white" />
                  <span>Send for Signature</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </main>      
    </div>
  )
}