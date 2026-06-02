import React, { useState } from 'react';
import axios from 'axios';

export default function AITools() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('access');

  const headers = { Authorization: `Bearer ${token}` };

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setSummary('');
    setQuiz([]);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/ai/summarize/',
        { text },
        { headers }
      );
      setSummary(response.data.summary);
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ في خدمة الذكاء الاصطناعي');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setSummary('');
    setQuiz([]);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/ai/quiz/',
        { text, count: 5 },
        { headers }
      );
      setQuiz(response.data.questions);
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ في خدمة الذكاء الاصطناعي');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">أدوات المذاكرة بالذكاء الاصطناعي</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <textarea
          rows="6"
          placeholder="ألصق النص الدراسي هنا (بحد أقصى 5000 حرف)..."
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSummarize}
            disabled={loading || !text.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-400 ml-4"
          >
            تلخيص النص
          </button>
          <button
            onClick={handleGenerateQuiz}
            disabled={loading || !text.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-400"
          >
            توليد اختبار قصيّر (Quiz)
          </button>
        </div>
      </div>

      {loading && <div className="text-center text-gray-600 my-4">جاري المعالجة والتحليل بالذكاء الاصطناعي...</div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center mb-6">{error}</div>}

      {/* عرض التلخيص */}
      {summary && (
        <div className="bg-purple-50 border-r-4 border-purple-500 p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4 text-purple-900">الملخص:</h3>
          <p className="text-gray-800 whitespace-pre-line">{summary}</p>
        </div>
      )}

      {/* عرض الاختبار */}
      {quiz.length > 0 && (
        <div className="bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-6 text-blue-900">اختبر معلوماتك:</h3>
          <div className="space-y-6">
            {quiz.map((q, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow border">
                <p className="font-semibold text-gray-800 mb-3">{index + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center">
                      <span className="text-gray-600 ml-2">{opt}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-green-600 font-bold mt-2">الإجابة الصحيحة: {q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}