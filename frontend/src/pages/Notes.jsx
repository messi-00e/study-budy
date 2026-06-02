import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const token = localStorage.getItem('access'); // تأكد أنه "access" وليس "access_token"
  const headers = { Authorization: `Bearer ${token}` };
  // 1. دالة جلب الملاحظات من السيرفر
  const fetchNotes = async () => {
    try {
      setErrorMessage('');
      const response = await axios.get('http://127.0.0.1:8000/api/notes/', { headers });
      setNotes(response.data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
      setErrorMessage('تعذر جلب الملاحظات من السيرفر. تأكد من تشغيل الـ Backend.');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 2. دالة حفظ الملاحظة (إنشاء جديد أو تعديل)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    setErrorMessage('');
    try {
      if (editingId) {
        // تعديل ملاحظة قائمة
        await axios.put(
          `http://127.0.0.1:8000/api/notes/${editingId}/`, 
          { title, content }, 
          { headers }
        );
      } else {
        // إنشاء ملاحظة جديدة
        await axios.post(
          'http://127.0.0.1:8000/api/notes/', 
          { title, content }, 
          { headers }
        );
      }
      
      // إعادة تهيئة الحقول بعد النجاح
      setTitle('');
      setContent('');
      setEditingId(null);
      fetchNotes(); // تحديث القائمة
    } catch (err) {
      console.error('Error saving note', err);
      setErrorMessage('حدث خطأ أثناء حفظ الملاحظة. تأكد من اتصال قاعدة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  // 3. وضع الملاحظة في وضع التعديل
  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  // 4. دالة حذف الملاحظة
  const handleDelete = async (id) => {
    if (window.confirm('هل تريد حذف هذه الملاحظة بالفعل؟')) {
      try {
        setErrorMessage('');
        await axios.delete(`http://127.0.0.1:8000/api/notes/${id}/`, { headers });
        fetchNotes();
      } catch (err) {
        console.error('Error deleting note', err);
        setErrorMessage('حدث خطأ أثناء محاولة حذف الملاحظة.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">ملاحظاتي الدراسية</h1>
      
      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-center mb-6">
          {errorMessage}
        </div>
      )}

      {/* نموذج الإضافة والتعديل */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? 'تعديل الملاحظة الحالية' : 'إضافة ملاحظة دراسية جديدة'}
        </h3>
        <div className="mb-4">
          <input
            type="text"
            placeholder="عنوان الملاحظة"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="اكتب تفاصيل ومحتوى الملاحظة هنا..."
            rows="4"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:bg-gray-400"
          >
            {loading ? 'جاري الحفظ...' : editingId ? 'تحديث الملاحظة' : 'حفظ الملاحظة'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setTitle(''); setContent(''); }}
              className="text-gray-600 hover:underline px-4"
            >
              إلغاء التعديل
            </button>
          )}
        </div>
      </form>

      {/* قائمة عرض الملاحظات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.length === 0 ? (
          <p className="text-center text-gray-500 col-span-2 py-8">لا توجد ملاحظات حالياً. ابدأ بإضافة ملاحظتك الأولى أعلاه!</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <h4 className="text-xl font-bold mb-2 text-gray-900">{note.title}</h4>
                <p className="text-gray-600 whitespace-pre-line mb-4">{note.content}</p>
              </div>
              <div className="flex justify-end space-x-3 border-t pt-3">
                <button onClick={() => handleEdit(note)} className="text-blue-600 hover:underline ml-4">تعديل</button>
                <button onClick={() => handleDelete(note.id)} className="text-red-600 hover:underline">حذف</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}