import React, { useState } from 'react';
import axios from 'axios';

export default function Support() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [priority, setPriority] = useState('medium');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const token = localStorage.getItem('access');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/bug-reports/',
        {
          title,
          description,
          steps,
          expected,
          actual,
          browser: navigator.userAgent,
          priority,
        },
        { headers }
      );
      setSuccess(true);
      setTitle('');
      setDescription('');
      setSteps('');
      setExpected('');
      setActual('');
    } catch (err) {
      alert('حدث خطأ أثناء إرسال التقرير، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">الدعم الفني والإبلاغ عن الأخطاء</h1>
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center mb-6">
          تم إرسال تقرير المشكلة بنجاح إلى المطورين. شكرًا لمساعدتك!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">عنوان المشكلة:</label>
          <input
            type="text"
            required
            placeholder="مثال: تعليق الصفحة عند تشغيل الـ Quiz"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">وصف المشكلة بالتفصيل:</label>
          <textarea
            required
            rows="3"
            placeholder="ما الذي حدث معك بالضبط؟"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">خطوات تكرار المشكلة:</label>
          <textarea
            required
            rows="3"
            placeholder="1. فتحت صفحة الأدوات&#10;2. أدخلت نصاً طويلاً جداً&#10;3. ضغطت زر التوليد فحدث خطأ..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">النتيجة المتوقعة:</label>
            <input
              type="text"
              required
              placeholder="أن يظهر ملف المراجعة بشكل صحيح"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">النتيجة الفعلية حالياً:</label>
            <input
              type="text"
              required
              placeholder="تعليق المتصفح بشكل كامل"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">الأهمية والأولوية:</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">منخفضة</option>
            <option value="medium">متوسطة</option>
            <option value="high">عالية (تمنع استخدام التطبيق)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold disabled:bg-gray-400"
        >
          {loading ? 'جاري الإرسال...' : 'إرسال التقرير'}
        </button>
      </form>
    </div>
  );
}