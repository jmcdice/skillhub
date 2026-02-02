import { useState, useEffect } from 'react';
import { Search, Package, ExternalLink, Tag } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  url?: string;
}

function App() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = async (query = '') => {
    try {
      setLoading(true);
      const url = query 
        ? `/api/v1/skills?search=${encodeURIComponent(query)}`
        : '/api/v1/skills';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch skills');
      const data = await response.json();
      setSkills(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSkills(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">SkillHub</h1>
          </div>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-lg transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading && skills.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border p-6 h-48 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill) => (
                <div key={skill.id} className="bg-white rounded-xl border hover:border-indigo-300 hover:shadow-md transition-all p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{skill.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">
                      v{skill.version}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 flex-1 mb-4 line-clamp-3">
                    {skill.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                      <Tag className="w-3 h-3" />
                      {skill.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 text-sm">
                    <span className="text-gray-500">by {skill.author}</span>
                    {skill.url && (
                      <a 
                        href={skill.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium"
                      >
                        Source <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!loading && skills.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No skills found matching your search.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
