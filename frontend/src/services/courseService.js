import api from './api';

// Courses
export const getCourses = async (params) => {
  const res = await api.get('/courses', { params });
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await api.get(`/courses/${id}`);
  return res.data;
};

export const createCourse = async (data) => {
  const res = await api.post('/courses', data);
  return res.data;
};

// Sections
export const createSection = async (data) => {
  const res = await api.post('/sections', data);
  return res.data;
};

export const getSectionsByCourse = async (courseId) => {
  const res = await api.get(`/sections/course/${courseId}`);
  return res.data;
};

// Lectures
export const getCurriculum = async (courseId) => {
  const res = await api.get(`/lectures/curriculum/${courseId}`);
  return res.data;
};

export const uploadLecture = async (formData) => {
  const res = await api.post('/lectures/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteLecture = async (id) => {
  const res = await api.delete(`/lectures/${id}`);
  return res.data;
};

export const trackLectureProgress = async (data) => {
  const res = await api.post('/lectures/progress', data);
  return res.data;
};

// Enrollments
export const enrollInCourse = async (data) => {
  const res = await api.post('/enrollments', data);
  return res.data;
};

export const verifyPayment = async (data) => {
  const res = await api.post('/enrollments/verify-payment', data);
  return res.data;
};

export const getMyEnrollments = async () => {
  const res = await api.get('/enrollments/my-enrollments');
  return res.data;
};

// Certificates
export const getMyCertificates = async () => {
  const res = await api.get('/certificates/my-certificates');
  return res.data;
};

// Reviews
export const getReviews = async (courseId) => {
  const res = await api.get(`/reviews/course/${courseId}`);
  return res.data;
};

export const submitReview = async (data) => {
  const res = await api.post('/reviews', data);
  return res.data;
};

// Discussions
export const getDiscussions = async (courseId) => {
  const res = await api.get(`/discussions/course/${courseId}`);
  return res.data;
};

export const postQuestion = async (data) => {
  const res = await api.post('/discussions', data);
  return res.data;
};

export const answerQuestion = async (id, data) => {
  const res = await api.post(`/discussions/${id}/answer`, data);
  return res.data;
};

// AI Recommendations
export const getAIRecommendations = async () => {
  const res = await api.get('/ai/recommendations');
  return res.data;
};

// Admin
export const getAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const getAdminUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const updateUserRole = async (userId, data) => {
  const res = await api.put(`/admin/users/${userId}`, data);
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
};
