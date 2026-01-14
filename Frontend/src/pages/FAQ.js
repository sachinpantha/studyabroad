import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      q: "What are the eligibility requirements for studying in India?",
      a: "You need to have completed 10+2 for undergraduate programs or a bachelor's degree for postgraduate programs. Minimum GPA requirements vary by university, typically 60% or above."
    },
    {
      q: "How much scholarship can I get?",
      a: "Scholarships range from 25% to 100% based on your academic performance. Students with 80%+ marks are eligible for up to 100% scholarship at many universities."
    },
    {
      q: "Is the application process really free?",
      a: "Yes, our consultation and application assistance is completely free. You only pay the university application fees directly to the institutions."
    },
    {
      q: "How long does the admission process take?",
      a: "The process typically takes 2-4 weeks from application submission to receiving the admission letter, depending on the university and course."
    },
    {
      q: "Do I need to take any entrance exams?",
      a: "Most universities accept direct admission based on your academic records. Some may require entrance tests or interviews, which we'll help you prepare for."
    },
    {
      q: "What about visa assistance?",
      a: "We provide complete guidance for student visa applications, including document preparation and interview preparation to ensure smooth visa approval."
    },
    {
      q: "What documents do I need for application?",
      a: "You'll need academic transcripts, passport copy, citizenship certificate, English proficiency test scores (if required), statement of purpose, and CV/resume."
    },
    {
      q: "Can I work while studying in India?",
      a: "International students can work part-time on campus with proper permissions. Off-campus work requires additional approvals from immigration authorities."
    },
    {
      q: "What are the living costs in India?",
      a: "Living costs vary by city but generally range from $200-500 per month including accommodation, food, and other expenses. Tier-2 cities are more affordable than metros."
    },
    {
      q: "How do I apply for multiple universities?",
      a: "You can apply to multiple universities through our platform. We help you shortlist universities based on your profile and manage all applications efficiently."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about studying abroad in India
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                    <h3 className="font-semibold text-lg text-gray-800 pr-4">{faq.q}</h3>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-blue-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Our expert counselors are here to help you with personalized guidance for your study abroad journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:info@studyabroad.com" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Email Us
              </a>
              <a href="tel:+977-1-4567890" className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;