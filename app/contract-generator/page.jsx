'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { FiCheck, FiChevronRight, FiDownload, FiEdit, FiLoader, FiMic, FiSend, FiUpload, FiX } from 'react-icons/fi'
import { FileText } from 'lucide-react'

export default function ContractGenerator() {
  const [step, setStep] = useState(1)
  const [file, setFile] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [contractData, setContractData] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const audioRef = useRef(null)

  // Supported media formats
  const supportedFormats = {
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/x-m4a', 'audio/mp3', 'audio/m4a'],
    video: ['video/mp4', 'video/webm', 'video/ogg'],
    document: ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  }

  // File upload handling with robust validation
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      // Check if file type is supported
      const isSupported = 
        supportedFormats.audio.includes(file.type) ||
        supportedFormats.video.includes(file.type) ||
        supportedFormats.document.includes(file.type)
      
      if (!isSupported) {
        setError(`Unsupported file type: ${file.type}. Please upload audio, video, PDF, DOCX, or TXT files.`)
        return
      }

      setFile(file)
      setError(null)
      
      // Warn about video processing
      if (supportedFormats.video.includes(file.type)) {
        setError('Note: Only audio will be extracted from video files')
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.aac', '.webm'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  })

  // Media preview component
  const MediaPreview = () => {
    if (!file) return null
    
    try {
      // Handle recorded audio
      if (audioBlob) {
        return (
          <audio
            ref={audioRef}
            src={URL.createObjectURL(audioBlob)}
            controls
            className="w-full mb-4"
          />
        )
      }

      // Handle uploaded files
      if (supportedFormats.audio.includes(file.type)) {
        return (
          <audio
            ref={audioRef}
            src={URL.createObjectURL(file)}
            controls
            className="w-full mb-4"
          />
        )
      }

      if (supportedFormats.video.includes(file.type)) {
        return (
          <video
            controls
            className="w-full mb-4 max-h-40"
          >
            <source src={URL.createObjectURL(file)} type={file.type} />
            Your browser does not support the video tag.
          </video>
        )
      }

      return null
    } catch (error) {
      console.error('Error creating media preview:', error)
      return (
        <div className="text-red-400 text-sm">
          Could not preview media file (type: {file.type})
        </div>
      )
    }
  }

  // Voice recording functionality
  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
        setFile(new File([audioBlob], 'recording.wav', { type: 'audio/wav' }))
      }
      
      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (err) {
      setError('Microphone access denied or not available')
      console.error('Recording error:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  // Process the contract with actual API call
  const processContract = async () => {
    if (!file) {
      setError('Please provide a file or recording')
      return
    }

    setIsProcessing(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10
          return newProgress > 90 ? 90 : newProgress
        })
      }, 500)

      const response = await fetch('http://localhost:8000/generate_contract/', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProgress(100)

      // Format the contract data for display
      if (data.contract_text) {
        const contractParts = data.contract_text.split('\n\n').filter(part => part.trim())
        const title = contractParts[0] || "Generated Contract"
        const parties = contractParts[1]?.split(' and ') || ["Party A", "Party B"]
        const effectiveDate = new Date().toLocaleDateString()
        
        const clauses = contractParts.slice(2).map((clause, index) => {
          const [title, ...content] = clause.split(':')
          return {
            title: title || `Clause ${index + 1}`,
            content: content.join(':').trim() || "Contract clause content"
          }
        })

        setContractData({
          title,
          parties,
          effectiveDate,
          clauses,
          rawText: data.contract_text,
          pdfUrl: data.pdf_url || null,
          pdfFilename: data.pdf_filename || `contract_${Date.now()}.pdf`
        })
      }

      setStep(3)
    } catch (error) {
      console.error('Error processing contract:', error)
      setError('Failed to generate contract. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Download PDF with proper error handling
  const downloadPDF = async () => {
    if (!contractData?.pdfUrl) {
      setError('PDF not available yet')
      return
    }

    setIsDownloading(true)
    setError(null)

    try {
      // First try to download directly from the URL
      const response = await fetch(contractData.pdfUrl)
      
      if (!response.ok) {
        throw new Error('Failed to fetch PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = contractData.pdfFilename || 'contract.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (error) {
      console.error('Error downloading PDF:', error)
      setError('Failed to download PDF. Please try again.')
      
      // Fallback to opening in new tab
      window.open(contractData.pdfUrl, '_blank')
    } finally {
      setIsDownloading(false)
    }
  }

  // Reset the process
  const resetProcess = () => {
    setFile(null)
    setAudioBlob(null)
    setContractData(null)
    setStep(1)
    setIsProcessing(false)
    setProgress(0)
    chunksRef.current = []
  }

  // Clean up recording and object URLs
  useEffect(() => {
    return () => {
      // Clean up media recorder
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
      
      // Clean up audio element
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      
      // Revoke object URLs
      if (audioBlob) {
        URL.revokeObjectURL(URL.createObjectURL(audioBlob))
      }
      if (file && (supportedFormats.audio.includes(file.type) || supportedFormats.video.includes(file.type))) {
        URL.revokeObjectURL(URL.createObjectURL(file))
      }
    }
  }, [isRecording, audioBlob, file])

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 md:pt-36 px-4">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Progress Steps */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div 
                  className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full ${step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'} transition-colors`}
                >
                  {step > stepNumber ? <FiCheck size={stepNumber === 3 ? 18 : 16} /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 md:w-16 h-1 ${step > stepNumber ? 'bg-indigo-600' : 'bg-gray-700'} transition-colors`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 md:mt-4 text-xs md:text-sm text-gray-400">
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
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Upload Your Contract Source</h2>
            <p className="text-gray-400 mb-6 md:mb-8 text-center text-sm md:text-base">
              Provide the basis for your contract by uploading a document or recording voice instructions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Drag & Drop Upload */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700 hover:border-gray-600'} ${file ? 'border-green-500 bg-green-900/10' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3 md:space-y-4">
                  <FiUpload className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                  {file ? (
                    <>
                      <p className="text-green-400 font-medium text-sm md:text-base">File ready: {file.name}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setFile(null)
                        }}
                        className="text-red-400 text-xs md:text-sm flex items-center"
                      >
                        <FiX className="mr-1" /> Remove file
                      </button>
                    </>
                  ) : isDragActive ? (
                    <p className="text-indigo-400">Drop the file here...</p>
                  ) : (
                    <>
                      <p className="text-gray-300 text-sm md:text-base">Drag & drop a file here</p>
                      <p className="text-gray-500 text-xs md:text-sm">or click to browse</p>
                      <p className="text-gray-500 text-xs mt-2 md:mt-4">
                        Supports: MP3, WAV, M4A, OGG, AAC, WEBM, MP4, PDF, DOCX, TXT
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Voice Recording */}
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 md:p-8 flex flex-col items-center justify-center">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors mb-3 md:mb-4`}
                >
                  <FiMic className="h-5 w-5 md:h-8 md:w-8" />
                </button>
                <p className="text-gray-300 mb-1 md:mb-2 text-sm md:text-base">
                  {isRecording ? "Recording... (Click to stop)" : "Record Voice Instructions"}
                </p>
                <p className="text-gray-500 text-xs md:text-sm text-center">
                  {isRecording 
                    ? "Speak clearly about your contract terms"
                    : "Describe your contract requirements in your own words"}
                </p>
                {(file?.type.startsWith('audio/') || file?.type.startsWith('video/')) && (
                  <div className="mt-3 md:mt-4 w-full">
                    <MediaPreview />
                    <div className="text-green-400 text-xs md:text-sm flex items-center mt-1 md:mt-2">
                      <FiCheck className="mr-1" /> {file.type.startsWith('audio/') ? 'Audio' : 'Video'} file ready
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-3 md:mt-4 p-2 md:p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200 text-xs md:text-sm">
                {error}
              </div>
            )}

            <div className="mt-6 md:mt-8 flex justify-center">
              <button
                onClick={() => file ? setStep(2) : setError('Please upload a file or record voice instructions')}
                disabled={!file}
                className={`flex items-center px-4 py-2 md:px-6 md:py-3 rounded-md ${file ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 cursor-not-allowed'} transition-colors text-sm md:text-base`}
              >
                Continue <FiChevronRight className="ml-1 md:ml-2" />
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
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Review Your Input</h2>
            <p className="text-gray-400 mb-6 md:mb-8 text-center text-sm md:text-base">
              Confirm the details before we generate your contract.
            </p>

            <div className="bg-gray-800 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4 flex items-center">
                <FiUpload className="mr-2 text-indigo-400" />
                Source File: {file.name}
              </h3>
              <div className="bg-gray-900 rounded-lg p-3 md:p-4">
                {(file.type.startsWith('audio/') || file.type.startsWith('video/')) ? (
                  <div className="flex flex-col items-center py-2 md:py-4">
                    <MediaPreview />
                    <span className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2">
                      {(file.size / 1024).toFixed(1)} KB • {file.type}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4 md:py-8">
                    <FileText className="h-8 w-8 md:h-12 md:w-12 text-indigo-400" />
                    <div className="ml-3 md:ml-4">
                      <p className="text-sm md:text-base">{file.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-6 md:mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 md:px-6 md:py-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-sm md:text-base"
              >
                Back
              </button>
              <button
                onClick={processContract}
                disabled={isProcessing}
                className="flex items-center px-4 py-2 md:px-6 md:py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:bg-indigo-800 text-sm md:text-base"
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="animate-spin mr-1 md:mr-2" />
                    Processing... ({Math.round(progress)}%)
                  </>
                ) : (
                  <>
                    Generate Contract <FiChevronRight className="ml-1 md:ml-2" />
                  </>
                )}
              </button>
            </div>

            {isProcessing && (
              <div className="mt-4 md:mt-6 w-full bg-gray-700 rounded-full h-2 md:h-2.5">
                <div 
                  className="bg-indigo-600 h-full rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">Your Generated Contract</h2>
              <button
                onClick={resetProcess}
                className="px-3 py-1.5 md:px-4 md:py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-xs md:text-sm"
              >
                Start New
              </button>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 mb-6 md:mb-8">
              {/* Contract Header */}
              <div className="bg-gray-900 p-4 md:p-6 border-b border-gray-700">
                <h3 className="text-xl md:text-2xl font-bold text-center mb-1 md:mb-2">{contractData.title}</h3>
                <p className="text-gray-400 text-center text-sm md:text-base">Effective Date: {contractData.effectiveDate}</p>
              </div>

              {/* Contract Parties */}
              <div className="p-4 md:p-6 border-b border-gray-700">
                <h4 className="text-base md:text-lg font-medium mb-3 md:mb-4">Parties:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {contractData.parties.map((party, index) => (
                    <div key={index} className="bg-gray-900/50 p-3 md:p-4 rounded-lg">
                      <p className="font-medium text-sm md:text-base">{party}</p>
                      <p className="text-xs md:text-sm text-gray-400">Party {index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Clauses */}
              <div className="p-4 md:p-6">
                <h4 className="text-base md:text-lg font-medium mb-3 md:mb-4">Clauses:</h4>
                <div className="space-y-4 md:space-y-6">
                  {contractData.clauses.map((clause, index) => (
                    <div key={index} className="bg-gray-900/50 p-3 md:p-4 rounded-lg">
                      <h5 className="font-medium text-indigo-400 mb-1 md:mb-2 text-sm md:text-base">{clause.title}</h5>
                      <p className="text-gray-300 text-xs md:text-sm">{clause.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <button 
                onClick={downloadPDF}
                disabled={!contractData.pdfUrl || isDownloading}
                className="p-3 md:p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors disabled:opacity-50"
              >
                <div className="flex flex-col items-center">
                  {isDownloading ? (
                    <FiLoader className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-indigo-400 animate-spin" />
                  ) : (
                    <FiDownload className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-indigo-400" />
                  )}
                  <span className="text-xs md:text-sm">Download PDF</span>
                  {!contractData.pdfUrl && (
                    <span className="text-xs text-gray-500 mt-1">Generating...</span>
                  )}
                </div>
              </button>
              <button className="p-3 md:p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                <div className="flex flex-col items-center">
                  <FiEdit className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-amber-400" />
                  <span className="text-xs md:text-sm">Edit Terms</span>
                </div>
              </button>
              <button className="p-3 md:p-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                <div className="flex flex-col items-center">
                  <FiSend className="h-5 w-5 md:h-6 md:w-6 mb-1 md:mb-2 text-white" />
                  <span className="text-xs md:text-sm">Send for Signature</span>
                </div>
              </button>
            </div>

            {/* Raw Text Preview */}
            <div className="mt-6 md:mt-8 bg-gray-800 rounded-lg p-4 md:p-6">
              <h4 className="text-base md:text-lg font-medium mb-3 md:mb-4">Full Contract Text:</h4>
              <pre className="bg-gray-900 p-3 md:p-4 rounded-md overflow-x-auto text-xs md:text-sm text-gray-300">
                {contractData.rawText || "No raw text available"}
              </pre>
            </div>
          </motion.div>
        )}
      </main>      
    </div>
  )
}
