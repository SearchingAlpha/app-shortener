// components/SectionFeatures.jsx

export default function SectionFeatures() {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Paste Your Content</h3>
              <p className="text-gray-600">Simply paste your blog post, article, or any long-form content into our text area.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
              <p className="text-gray-600">Our AI analyzes your content and generates optimized snippets for different platforms.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Platform Snippets</h3>
              <p className="text-gray-600">Receive ready-to-use snippets for X, LinkedIn, Instagram, and Substack.</p>
            </div>
          </div>
          
          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">Platform-Ready Snippets</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded border border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 mr-2 bg-blue-500 rounded-full"></div>
                  <h4 className="font-bold">X Post</h4>
                </div>
                <p className="text-gray-700 text-sm">Concise, punchy content optimized for X's 280-character limit, designed to drive engagement.</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 mr-2 bg-blue-700 rounded"></div>
                  <h4 className="font-bold">LinkedIn Post</h4>
                </div>
                <p className="text-gray-700 text-sm">Professional, thought-leadership content optimized for your LinkedIn audience.</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 mr-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
                  <h4 className="font-bold">Instagram Caption</h4>
                </div>
                <p className="text-gray-700 text-sm">Casual, visually-oriented captions with hashtag suggestions for maximum reach.</p>
              </div>
              
              <div className="bg-white p-4 rounded border border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 mr-2 bg-orange-500 rounded"></div>
                  <h4 className="font-bold">Substack Note</h4>
                </div>
                <p className="text-gray-700 text-sm">Teaser-style snippets designed to hook readers and drive them to your newsletter.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }