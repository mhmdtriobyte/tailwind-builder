import { useState, FormEvent } from 'react';
import { User, Mail, MessageSquare, Send } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => void;
  loading?: boolean;
  error?: string;
  success?: boolean;
  successMessage?: string;
  title?: string;
  subtitle?: string;
  showSubjectField?: boolean;
  subjectOptions?: string[];
  namePlaceholder?: string;
  emailPlaceholder?: string;
  subjectPlaceholder?: string;
  messagePlaceholder?: string;
  submitButtonText?: string;
  minMessageLength?: number;
  maxMessageLength?: number;
  className?: string;
}

export function ContactForm({
  onSubmit,
  loading = false,
  error,
  success = false,
  successMessage = 'Thank you for your message! We will get back to you soon.',
  title = 'Get in touch',
  subtitle = 'Have a question? We would love to hear from you.',
  showSubjectField = true,
  subjectOptions,
  namePlaceholder = 'Your name',
  emailPlaceholder = 'you@example.com',
  subjectPlaceholder = 'Select a subject',
  messagePlaceholder = 'Your message...',
  submitButtonText = 'Send message',
  minMessageLength = 10,
  maxMessageLength = 1000,
  className,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation
  const nameError = touched.name && !formData.name.trim() ? 'Name is required' : '';
  const emailError = touched.email && !formData.email
    ? 'Email is required'
    : touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ? 'Invalid email address'
    : '';
  const subjectError = touched.subject && showSubjectField && subjectOptions && !formData.subject
    ? 'Please select a subject'
    : '';
  const messageError = touched.message && !formData.message.trim()
    ? 'Message is required'
    : touched.message && formData.message.length < minMessageLength
    ? `Message must be at least ${minMessageLength} characters`
    : '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });

    if (
      !nameError &&
      !emailError &&
      !subjectError &&
      !messageError &&
      formData.name &&
      formData.email &&
      formData.message
    ) {
      onSubmit?.(formData);
    }
  };

  if (success) {
    return (
      <div className={cn('w-full max-w-lg mx-auto', className)}>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full max-w-lg mx-auto', className)}>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && <h2 className="text-2xl font-bold text-gray-900">{title}</h2>}
            {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
          >
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                onBlur={() => markTouched('name')}
                placeholder={namePlaceholder}
                autoComplete="name"
                disabled={loading}
                aria-invalid={!!nameError}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  nameError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
            </div>
            {nameError && <p className="text-xs text-red-500" role="alert">{nameError}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                onBlur={() => markTouched('email')}
                placeholder={emailPlaceholder}
                autoComplete="email"
                disabled={loading}
                aria-invalid={!!emailError}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  emailError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
            </div>
            {emailError && <p className="text-xs text-red-500" role="alert">{emailError}</p>}
          </div>

          {/* Subject Field */}
          {showSubjectField && (
            <div className="space-y-1">
              <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700">
                Subject {subjectOptions && <span className="text-red-500">*</span>}
              </label>
              {subjectOptions ? (
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  onBlur={() => markTouched('subject')}
                  disabled={loading}
                  aria-invalid={!!subjectError}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg text-sm appearance-none bg-white transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    subjectError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500',
                    loading && 'bg-gray-100 cursor-not-allowed'
                  )}
                >
                  <option value="">{subjectPlaceholder}</option>
                  {subjectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  onBlur={() => markTouched('subject')}
                  placeholder="What is this about?"
                  disabled={loading}
                  className={cn(
                    'w-full px-4 py-2.5 border rounded-lg text-sm transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    'border-gray-300 focus:border-blue-500',
                    loading && 'bg-gray-100 cursor-not-allowed'
                  )}
                />
              )}
              {subjectError && <p className="text-xs text-red-500" role="alert">{subjectError}</p>}
            </div>
          )}

          {/* Message Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">
                {formData.message.length}/{maxMessageLength}
              </span>
            </div>
            <div className="relative">
              <MessageSquare
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={(e) => updateField('message', e.target.value.slice(0, maxMessageLength))}
                onBlur={() => markTouched('message')}
                placeholder={messagePlaceholder}
                rows={5}
                disabled={loading}
                aria-invalid={!!messageError}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  messageError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500',
                  loading && 'bg-gray-100 cursor-not-allowed'
                )}
              />
            </div>
            {messageError && <p className="text-xs text-red-500" role="alert">{messageError}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              'inline-flex items-center justify-center gap-2',
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            )}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" aria-hidden="true" />
                {submitButtonText}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
