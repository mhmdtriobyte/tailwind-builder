'use client';

import { cn } from '@/utils/cn';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

interface ContactSectionProps {
  title: string;
  subtitle?: string;
  contactInfo: ContactInfo;
  onSubmit?: (data: { name: string; email: string; message: string }) => void;
  className?: string;
}

function ContactInfoItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
        <div className="mt-1 text-base font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block transition-opacity hover:opacity-80"
      >
        {content}
      </a>
    );
  }

  return content;
}

export function ContactSection({
  title,
  subtitle,
  contactInfo,
  onSubmit,
  className,
}: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (onSubmit) {
      await onSubmit(formData);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      className={cn(
        'w-full py-16 px-4 sm:py-20 md:py-24 lg:py-32',
        'bg-white',
        className
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-lg leading-8 text-gray-600 sm:text-xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-gray-900">
                Contact Information
              </h3>
              <div className="mt-6 space-y-6">
                {contactInfo.email && (
                  <ContactInfoItem
                    icon={Mail}
                    label="Email"
                    value={contactInfo.email}
                    href={`mailto:${contactInfo.email}`}
                  />
                )}
                {contactInfo.phone && (
                  <ContactInfoItem
                    icon={Phone}
                    label="Phone"
                    value={contactInfo.phone}
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  />
                )}
                {contactInfo.address && (
                  <ContactInfoItem
                    icon={MapPin}
                    label="Address"
                    value={contactInfo.address}
                  />
                )}
                {contactInfo.hours && (
                  <ContactInfoItem
                    icon={Clock}
                    label="Business Hours"
                    value={contactInfo.hours}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-semibold text-gray-900">
              Send us a message
            </h3>

            {submitted ? (
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-green-50 p-4 text-green-800">
                <Send className="h-5 w-5" />
                <span className="font-medium">
                  Thank you! Your message has been sent.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="mt-1 block w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
