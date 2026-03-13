import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCourse, createSection, uploadLecture } from '../services/courseService';
import toast from 'react-hot-toast';
import { FiArrowRight, FiArrowLeft, FiPlusCircle, FiUpload, FiTrash2 } from 'react-icons/fi';

const CATEGORIES = ['Development', 'Design', 'Marketing', 'Data Science', 'Business', 'Photography', 'Other'];

const STEPS = ['Course Details', 'Sections', 'Publish'];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1: Course details
  const [courseData, setCourseData] = useState({
    title: '', description: '', category: 'Development', price: 0, thumbnail: '',
  });
  const [courseId, setCourseId] = useState(null);

  // Step 2: Sections / lectures
  const [sections, setSections] = useState([{ title: '', lectures: [] }]);
  const [uploading, setUploading] = useState({});

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: name === 'price' ? Number(value) : value });
  };

  // Step 1 submit: create course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseData.title || !courseData.description) return toast.error('Title and description required');
    setLoading(true);
    try {
      const data = await createCourse(courseData);
      setCourseId(data._id || data.course?._id);
      toast.success('Course created! Now add sections.');
      setStep(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  // Section helpers
  const addSection = () => setSections([...sections, { title: '', lectures: [] }]);
  const removeSection = (si) => setSections(sections.filter((_, i) => i !== si));
  const updateSectionTitle = (si, val) => {
    const s = [...sections];
    s[si].title = val;
    setSections(s);
  };

  // Lecture file upload (per section)
  const handleLectureUpload = async (si, e) => {
    const file = e.target.files?.[0];
    if (!file || !courseId) return;
    setUploading({ ...uploading, [si]: true });
    try {
      const fd = new FormData();
      fd.append('video', file);
      fd.append('title', file.name.replace(/\.[^.]+$/, ''));
      fd.append('courseId', courseId);
      const lec = await uploadLecture(fd);
      const s = [...sections];
      s[si].lectures = [...(s[si].lectures || []), lec];
      setSections(s);
      toast.success('Lecture uploaded!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading({ ...uploading, [si]: false });
      e.target.value = '';
    }
  };

  const handleSaveSections = async () => {
    setLoading(true);
    try {
      for (const sec of sections) {
        if (sec.title.trim()) {
          await createSection({ courseId, title: sec.title });
        }
      }
      toast.success('Sections saved!');
      setStep(2);
    } catch (err) {
      toast.error('Failed to save sections');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Create New Course</h2>
        <p className="text-gray-400 text-sm">Share your knowledge with the world</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < step ? 'bg-brand-600 border-brand-600 text-white'
              : i === step ? 'border-brand-500 text-brand-400'
              : 'border-dark-500 text-gray-500'
            }`}>{i + 1}</div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-white font-medium' : 'text-gray-500'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-brand-600' : 'bg-dark-600'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Course Details */}
      {step === 0 && (
        <form onSubmit={handleCreateCourse} className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Course Title *</label>
            <input type="text" name="title" value={courseData.title} onChange={handleCourseChange}
              required placeholder="e.g. Complete React Developer Course"
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description *</label>
            <textarea name="description" value={courseData.description} onChange={handleCourseChange}
              required rows={4} placeholder="What will students learn?"
              className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
              <select name="category" value={courseData.category} onChange={handleCourseChange} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Price (₹) <span className="text-gray-500 font-normal">0 = Free</span></label>
              <input type="number" name="price" value={courseData.price} onChange={handleCourseChange}
                min={0} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Thumbnail URL</label>
            <input type="url" name="thumbnail" value={courseData.thumbnail} onChange={handleCourseChange}
              placeholder="https://..." className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><FiArrowRight className="w-4 h-4" /> Continue to Sections</>}
          </button>
        </form>
      )}

      {/* Step 1: Sections */}
      {step === 1 && (
        <div className="space-y-4">
          {sections.map((section, si) => (
            <div key={si} className="card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(si, e.target.value)}
                  placeholder={`Section ${si + 1} title`}
                  className="input-field flex-1"
                />
                {sections.length > 1 && (
                  <button onClick={() => removeSection(si)} className="text-red-400 hover:text-red-300 transition-colors">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Lectures */}
              <div className="pl-4 border-l border-dark-500 space-y-2">
                {section.lectures.map((lec, li) => (
                  <div key={li} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                    {lec.title || lec.name || `Lecture ${li + 1}`}
                  </div>
                ))}
                <label className={`flex items-center gap-2 text-sm cursor-pointer transition-colors ${uploading[si] ? 'text-gray-500' : 'text-brand-400 hover:text-brand-300'}`}>
                  <FiUpload className="w-4 h-4" />
                  {uploading[si] ? 'Uploading...' : 'Upload Lecture Video'}
                  <input type="file" accept="video/*" className="hidden"
                    onChange={(e) => handleLectureUpload(si, e)} disabled={uploading[si]} />
                </label>
              </div>
            </div>
          ))}

          <button onClick={addSection} className="btn-secondary w-full flex items-center justify-center gap-2 text-sm">
            <FiPlusCircle className="w-4 h-4" /> Add Section
          </button>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="btn-secondary flex items-center gap-2 text-sm">
              <FiArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={handleSaveSections} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><FiArrowRight className="w-4 h-4" /> Save &amp; Finish</>}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Published confirmation */}
      {step === 2 && (
        <div className="card p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto">
            <span className="text-3xl">🎉</span>
          </div>
          <h3 className="text-xl font-bold text-white">Course Created!</h3>
          <p className="text-gray-400 text-sm">Your course is ready. Students can find and enroll in it.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep(0); setCourseId(null); setCourseData({ title: '', description: '', category: 'Development', price: 0, thumbnail: '' }); setSections([{ title: '', lectures: [] }]); }}
              className="btn-secondary text-sm">Create Another</button>
            <button onClick={() => navigate('/dashboard/teacher')} className="btn-primary text-sm">Go to Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}
