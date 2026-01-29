import { useState } from 'react'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex gap-4">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`font-medium ${currentPage === 'home' ? 'text-blue-600' : 'text-gray-600'}`}
          >
            Home
          </button>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Welcome to Your App</h1>
        <p className="mt-4 text-gray-600">Start building something amazing!</p>
      </main>
    </div>
  )
}
