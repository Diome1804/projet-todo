import React, { useState, useEffect } from 'react';
import { X, Upload, Mic, CheckCircle, Circle, Save, ArrowLeft } from 'lucide-react';
import AudioRecorder from '../ui/AudioRecorder';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    lex_name: task?.lex_name || '',
    lex_description: task?.lex_description || '',
    completed: task?.completed || false
  });
  const [photo, setPhoto] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Désactiver le scroll quand le composant est monté
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Réactiver le scroll quand le composant est démonté
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleAudioRecorded = (blob) => {
    setAudioBlob(blob);
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.lex_name.trim()) {
      newErrors.lex_name = 'Le titre de la tâche est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const taskData = {
        ...formData,
        photo,
        audio: audioBlob,
        id: task?.id
      };
      await onSubmit(taskData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!task;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-start justify-center p-2 pt-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden mt-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              {isEditing ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <Circle className="w-4 h-4 text-white" />
              )}
            </div>
            <h1 className="text-lg font-bold text-white">
              {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h1>
          </div>
          <button
            onClick={onCancel}
            className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Title */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                Titre de la tâche *
              </label>
              <input
                type="text"
                name="lex_name"
                value={formData.lex_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border-2 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all text-sm ${
                  errors.lex_name
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-200 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
                placeholder="Entrez le titre de votre tâche..."
              />
              {errors.lex_name && (
                <p className="text-sm text-red-600 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  {errors.lex_name}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Circle className="w-4 h-4 mr-2 text-emerald-600" />
                Description
              </label>
              <textarea
                name="lex_description"
                value={formData.lex_description}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all text-sm"
                placeholder="Ajoutez une description détaillée..."
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Upload className="w-4 h-4 mr-2 text-emerald-600" />
                Photo (optionnel)
              </label>

              {!photo ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Ajouter une photo
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF, WebP jusqu'à 10MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <div className="border-2 border-emerald-200 rounded-xl p-4 bg-emerald-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                          <Upload className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{photo.name}</p>
                          <p className="text-sm text-gray-600">
                            {(photo.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    <div className="bg-white rounded-lg p-2">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt="Aperçu"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Recorder */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Mic className="w-4 h-4 mr-2 text-emerald-600" />
                Enregistrement audio (optionnel)
              </label>
              <div className="bg-gray-50 rounded-xl p-4">
                <AudioRecorder
                  onAudioRecorded={handleAudioRecorded}
                  existingAudioUrl={task?.audioUrl}
                />
              </div>
            </div>

            {/* Completed Checkbox */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  formData.completed
                    ? 'bg-emerald-600 border-emerald-600'
                    : 'border-gray-300'
                }`}>
                  {formData.completed && (
                    <CheckCircle className="w-3 h-3 text-white" />
                  )}
                </div>
                <label htmlFor="completed" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Tâche terminée
                </label>
              </div>
              <input
                type="checkbox"
                name="completed"
                id="completed"
                checked={formData.completed}
                onChange={handleChange}
                className="hidden"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Annuler
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Mettre à jour' : 'Créer la tâche'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
