import React, { useEffect, useState } from "react";
import Toast from "../../components/Toast";
import { useContactUsMutation } from "../../services/contactApi";
import AutoResizeTextarea from '../user/components/AutoResizeTextarea'
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    body: "",
  });
  const [error, setError] = useState({ hasError: false, message: null });
  const [submitContact, { isLoading }] = useContactUsMutation();
  const [submitted, setSubmitted] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return null;
    try {
      await submitContact({ data: formData }).unwrap();
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        body: "",
      });
    } catch (err) {
      setError({
        hasError: true,
        message: err.data.message,
      });
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      const isValuesValid = new Set();
      for (const value of Object.values(formData)) {
        isValuesValid.add(Boolean(value.trim()));
      }
      setIsValid(!isValuesValid.has(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [formData]);
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            We’d love to hear from you. Whether it’s a question, feedback, or
            just a hello — drop us a line and we’ll respond promptly.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8 md:p-10"
        >
          <div className="space-y-7">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-neutral-800 mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-neutral-800 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-semibold text-neutral-800 mb-2"
              >
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
              >
                <option value="">Choose one...</option>
                <option value="general">General Inquiry</option>
                <option value="support">Support Request</option>
                <option value="feedback">Feedback</option>
                <option value="collaboration">Collaboration</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="body"
                className="block text-sm font-semibold text-neutral-800 mb-2"
              >
                Your Message
              </label>
              <AutoResizeTextarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                className="w-full min-h-[33vh] px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none transition"
                placeholder="Tell us more about how we can help..."
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full bg-primary-blue text-white font-semibold py-4 px-6 rounded-lg hover:bg-primary-blue/90 focus:outline-none focus:ring-4 focus:ring-primary-blue/30 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending Message..." : "Send Message"}
            </button>
          </div>

          {submitted && (
            <Toast
              message={
                <span>
                  Thank you! Your message has been sent successfully. We’ll get
                  back to you soon.
                </span>
              }
              type="success"
              onClose={() => setSubmitted(false)}
            />
          )}
          {error.hasError && (
            <Toast
              message={error.message}
              type="error"
              onClose={() => setError({ hasError: false, message: null })}
            />
          )}
        </form>
      </div>
    </main>
  );
};

export default Contact;
