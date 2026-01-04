export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          CSS Test Page
        </h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-700 mb-4">
            If you can see this page with proper styling (blue background, white card, shadows),
            then Tailwind CSS is working correctly.
          </p>
          <div className="flex gap-4">
            <div className="bg-red-500 text-white px-4 py-2 rounded">Red</div>
            <div className="bg-yellow-500 text-white px-4 py-2 rounded">Yellow</div>
            <div className="bg-green-500 text-white px-4 py-2 rounded">Green</div>
          </div>
        </div>
      </div>
    </div>
  )
}

