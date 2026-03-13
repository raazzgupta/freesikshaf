import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../services/courseService';
import CourseCard from '../components/CourseCard';
import Spinner from '../components/Spinner';
import { FiSearch, FiFilter, FiTrendingUp, FiAward, FiUsers } from 'react-icons/fi';

const CATEGORIES = ['All', 'Development', 'Design', 'Marketing', 'Data Science', 'Business', 'Photography'];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all');

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses', searchParams.get('search'), selectedCat, priceFilter],
    queryFn: () => getCourses({
      search: searchParams.get('search') || '',
      category: selectedCat !== 'All' ? selectedCat : '',
      free: priceFilter === 'free' ? 'true' : '',
    }),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(localSearch ? { search: localSearch } : {});
  };

  const stats = [
    { icon: FiUsers, value: '50K+', label: 'Students' },
    { icon: FiAward, value: '200+', label: 'Courses' },
    { icon: FiTrendingUp, value: '95%', label: 'Success Rate' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 via-dark-900 to-purple-900/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-600/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-600/30 text-brand-300 text-sm px-4 py-1.5 rounded-full mb-6">
            <FiTrendingUp className="w-3.5 h-3.5" /> Learn without limits
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight">
            Unlock Your Potential with
            <span className="text-gradient block mt-1">FreeSiksha</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Explore hundreds of expert-led courses. Learn programming, design, business, and more — free & affordable.
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                type="text"
                placeholder="What do you want to learn?"
                className="input-field pl-12 h-12 rounded-xl text-base shadow-lg"
              />
            </div>
            <button type="submit" className="btn-primary h-12 px-6 rounded-xl glow">Search</button>
          </form>

          {/* Stats */}
          <div className="mt-12 flex justify-center gap-8 sm:gap-16">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-1"><Icon className="text-brand-400 w-5 h-5" /></div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                selectedCat === cat
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'bg-dark-800 border-dark-600 text-gray-400 hover:border-brand-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            {['all', 'free', 'paid'].map((f) => (
              <button
                key={f}
                onClick={() => setPriceFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                  priceFilter === f
                    ? 'bg-brand-600 border-brand-600 text-white'
                    : 'bg-dark-800 border-dark-600 text-gray-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {searchParams.get('search')
              ? `Results for "${searchParams.get('search')}"`
              : selectedCat !== 'All' ? `${selectedCat} Courses` : 'All Courses'}
            <span className="ml-2 text-sm font-normal text-gray-400">({courses.length} courses)</span>
          </h2>
        </div>

        {/* Grid */}
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <div className="text-center py-16 text-gray-500">
            <p>Failed to load courses. Make sure the backend is running.</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <FiSearch className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No courses found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
