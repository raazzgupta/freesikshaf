import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDiscussions, postQuestion, answerQuestion } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
import toast from 'react-hot-toast';
import { FiMessageSquare, FiSend, FiChevronDown, FiChevronUp } from 'react-icons/fi';

function AnswerThread({ discussion, isTeacher }) {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const qc = useQueryClient();

  const { mutate: sendAnswer, isPending } = useMutation({
    mutationFn: ({ id, data }) => answerQuestion(id, data),
    onSuccess: () => {
      toast.success('Answer posted!');
      qc.invalidateQueries(['discussions']);
      setAnswer('');
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to post answer'),
  });

  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {discussion.student?.name?.[0] || 'S'}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">{discussion.student?.name || 'Student'}</p>
          <p className="text-sm text-gray-300 mt-0.5">{discussion.question}</p>
          <p className="text-xs text-gray-600 mt-1">{new Date(discussion.createdAt).toLocaleDateString()}</p>
        </div>
        <button onClick={() => setOpen(!open)} className="text-gray-500 hover:text-brand-400 transition-colors text-xs flex items-center gap-1">
          {open ? <FiChevronUp /> : <FiChevronDown />}
          {discussion.answers?.length || 0} answers
        </button>
      </div>

      {open && (
        <div className="ml-12 space-y-3">
          {discussion.answers?.map((a, i) => (
            <div key={i} className="bg-dark-700 rounded-lg p-3 flex gap-2">
              <div className="w-7 h-7 rounded-full bg-green-600/30 border border-green-500/30 flex items-center justify-center text-green-400 text-xs shrink-0 font-bold">T</div>
              <div>
                <p className="text-xs font-semibold text-green-400">{a.teacher?.name || 'Instructor'}</p>
                <p className="text-sm text-gray-300 mt-0.5">{a.answer || a}</p>
              </div>
            </div>
          ))}
          {isTeacher && (
            <div className="flex gap-2">
              <input
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer..."
                className="input-field text-sm py-2"
              />
              <button
                onClick={() => sendAnswer({ id: discussion._id, data: { answer } })}
                disabled={!answer.trim() || isPending}
                className="btn-primary px-3 py-2"
              >
                <FiSend className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DiscussionSection({ courseId }) {
  const { isAuthenticated, isTeacher, isAdmin } = useAuth();
  const [question, setQuestion] = useState('');
  const qc = useQueryClient();

  const { data: discussions = [], isLoading } = useQuery({
    queryKey: ['discussions', courseId],
    queryFn: () => getDiscussions(courseId),
  });

  const { mutate: askQuestion, isPending } = useMutation({
    mutationFn: postQuestion,
    onSuccess: () => {
      toast.success('Question posted!');
      qc.invalidateQueries(['discussions', courseId]);
      setQuestion('');
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to post question'),
  });

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    askQuestion({ courseId, question });
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-5">
      <h3 className="section-title flex items-center gap-2">
        <FiMessageSquare className="text-brand-400" /> Q&amp;A Discussion
      </h3>

      {isAuthenticated && !isTeacher && !isAdmin && (
        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this course..."
            className="input-field text-sm flex-1"
          />
          <button type="submit" disabled={isPending || !question.trim()} className="btn-primary px-4 flex items-center gap-1.5 text-sm">
            <FiSend className="w-4 h-4" /> Ask
          </button>
        </form>
      )}

      {discussions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FiMessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {discussions.map((d, i) => (
            <AnswerThread key={d._id || i} discussion={d} isTeacher={isTeacher || isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
