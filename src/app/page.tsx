'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-white">
                N
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                NEIRE
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">
                Pricing
              </a>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Personal AI Tutor
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Upload your study materials and let NEIRE transform them into an adaptive learning journey. Learn faster with personalized explanations, practice questions, and intelligent reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="#demo"
              className="px-8 py-4 border-2 border-purple-500 rounded-lg font-semibold text-lg hover:bg-purple-500/10 transition"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black/20 border-t border-purple-500/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Adaptive Learning Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📚',
                title: 'Smart Content Analysis',
                description: 'Upload PDFs, notes, or textbooks. NEIRE extracts and structures the content into a personalized learning path.',
              },
              {
                icon: '🎯',
                title: 'Multi-Modal Teaching',
                description: 'Learn through voice, text, visuals, examples, stories, and interactive conversations tailored to your pace.',
              },
              {
                icon: '🧠',
                title: 'Adaptive Intelligence',
                description: 'NEIRE tracks your understanding, mistakes, and confidence to decide what you need next.',
              },
              {
                icon: '✅',
                title: 'Practice & Assessment',
                description: 'Answer questions, get detailed feedback, and receive explanations for every mistake.',
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                description: 'Monitor your mastery by topic, identify weak areas, and get personalized review recommendations.',
              },
              {
                icon: '🔄',
                title: 'Spaced Repetition',
                description: 'Automated recall questions and adaptive difficulty to maximize long-term retention.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/20 hover:border-purple-500/50 transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            How NEIRE Works
          </h2>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Upload & Extract',
                description: 'Share your study material—PDFs, notes, or documents.',
              },
              {
                step: '2',
                title: 'Structure & Analyze',
                description: 'NEIRE breaks down content into topics and creates a learning path.',
              },
              {
                step: '3',
                title: 'Learn Interactively',
                description: 'Get explanations, ask for simplifications, request examples, and engage in conversations.',
              },
              {
                step: '4',
                title: 'Practice & Assess',
                description: 'Answer questions, receive feedback, and understand your mistakes.',
              },
              {
                step: '5',
                title: 'Adapt & Improve',
                description: 'NEIRE analyzes your performance and recommends your next step.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600/20 to-pink-600/20 border-t border-purple-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Learn Smarter?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your personalized learning journey today. Upload your first study material and let NEIRE guide you.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-purple-500/10 bg-black/30">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p>&copy; 2024 NEIRE. Your adaptive AI learning platform.</p>
        </div>
      </footer>
    </div>
  );
}
