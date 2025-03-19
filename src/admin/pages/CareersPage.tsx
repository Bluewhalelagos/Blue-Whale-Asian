import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface Career {
  id: string;
  title: string;
  type: string;
  experience: string;
  description: string;
}

const CareersPage = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    experience: '',
    description: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'careers'));
      const careersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Career[];
      setCareers(careersList);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        await updateDoc(doc(db, 'careers', editingId), formData);
      } else {
        await addDoc(collection(db, 'careers'), formData);
      }
      await fetchCareers();
      setIsModalOpen(false);
      setFormData({ title: '', type: '', experience: '', description: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving career:', error);
      alert('Failed to save career opportunity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (career: Career) => {
    setFormData(career);
    setEditingId(career.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this career opportunity?')) {
      try {
        await deleteDoc(doc(db, 'careers', id));
        await fetchCareers();
      } catch (error) {
        console.error('Error deleting career:', error);
        alert('Failed to delete career opportunity');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Careers</h2>
        <button
          onClick={() => {
            setFormData({ title: '', type: '', experience: '', description: '' });
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Position
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career) => (
          <div key={career.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{career.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(career)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(career.id)}
                  className="p-1 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">Type: {career.type}</p>
            <p className="text-gray-600 mb-2">Experience: {career.experience}</p>
            <p className="text-gray-700">{career.description}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Position' : 'Add New Position'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  placeholder="Full-time / Part-time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  placeholder="e.g., 2+ years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Position'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;