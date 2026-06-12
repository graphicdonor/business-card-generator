"use client";

import { useState } from "react";
import Link from "next/link";
import { templates } from "@/lib/templates";
import { Template, TemplateCategory } from "@/types/card";
import TemplateRenderer from "@/components/templates/TemplateRenderer";
import { cn } from "@/lib/utils";
import { defaultCardData } from "@/lib/templates";
import {
  Search,
  Star,
  Crown,
  ArrowRight,
  Layers,
  Zap,
  Download,
  Shield,
  CheckCircle,
  ChevronRight,
  Sparkles,
  ImageIcon,
  Upload,
} from "lucide-react";

const categories: TemplateCategory[] = [
  "All",
  "Corporate",
  "Minimal",
  "Luxury",
  "Technology",
  "Finance",
  "Medical",
  "Real Estate",
  "Creative",
];

function TemplateCard({ template }: { template: Template }) {
  const [hovered, setHovered] = useState(false);
  const previewData = defaultCardData(template);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer"
    >
      {/* Premium badge */}
      {template.isPremium && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
          <Crown size={11} />
          PRO
        </div>
      )}

      {/* Double-sided badge */}
      {template.isDoubleSided && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-800/80 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
          <Layers size={11} />
          2-sided
        </div>
      )}

      {/* Card preview */}
      <div className="relative overflow-hidden bg-slate-100" style={{ height: 200 }}>
        <div
          className="transition-all duration-500 ease-in-out"
          style={{
            transform: hovered ? "translateX(-100%)" : "translateX(0)",
            display: "flex",
            width: "200%",
          }}
        >
          {/* Front */}
          <div className="w-1/2 flex-shrink-0 overflow-hidden">
            <TemplateRenderer
              templateId={template.id}
              data={previewData}
              side="front"
              scale={350 / 1050}
            />
          </div>
          {/* Back */}
          <div className="w-1/2 flex-shrink-0 overflow-hidden">
            <TemplateRenderer
              templateId={template.id}
              data={previewData}
              side="back"
              scale={350 / 1050}
            />
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link
            href={`/builder/${template.id}`}
            className="flex items-center gap-2 bg-white text-slate-800 text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            Use Template
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Side indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all",
              !hovered ? "bg-white w-4" : "bg-white/50"
            )}
          />
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all",
              hovered ? "bg-white w-4" : "bg-white/50"
            )}
          />
        </div>
      </div>

      {/* Card info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">{template.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{template.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1.5">
            {template.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full capitalize"
              >
                {tag}
              </span>
            ))}
          </div>

          <Link
            href={`/builder/${template.id}`}
            className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            Customize
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function CustomUploadCard() {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border-2 border-dashed border-blue-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer">
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-blue-500 to-violet-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
        <Upload size={10} />
        CUSTOM
      </div>

      {/* Preview area */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-violet-50"
        style={{ height: 200 }}
      >
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(#93C5FD 1px, transparent 1px), linear-gradient(90deg, #93C5FD 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Inner dashed card outline */}
        <div className="absolute inset-4 border-2 border-dashed border-blue-200 rounded-lg" />

        {/* Center icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-blue-100 flex items-center justify-center">
            <ImageIcon size={26} className="text-blue-400" />
          </div>
          <p className="text-xs font-semibold text-blue-600">Upload your design</p>
          <p className="text-[10px] text-slate-400">Front &amp; back images</p>
        </div>

        {/* Side indicators — two dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="w-4 h-1.5 rounded-full bg-blue-400/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400/30" />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link
            href="/builder/custom-upload"
            className="flex items-center gap-2 bg-white text-slate-800 text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            Start Custom
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Card info */}
      <div className="p-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm">Custom Upload</h3>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
            Upload your existing card design — front &amp; back — as any image format
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1.5">
            {["custom", "upload"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-500 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href="/builder/custom-upload"
            className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            Use
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("All");

  const filtered = templates.filter((t) => {
    const matchesSearch =
      searchQuery === "" ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">CardCraft Pro</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#templates" className="hover:text-blue-600 transition-colors">Templates</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2">
              Sign In
            </button>
            <button className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg shadow-sm shadow-blue-500/20">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 pt-20 pb-24">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-violet-100 rounded-full opacity-40 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-blue-100">
            <Sparkles size={12} />
            Professional Business Cards in Minutes
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
            Create Stunning
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Business Cards
            </span>
          </h1>

          <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            Choose from premium templates, customize with your branding, preview in real-time,
            and export print-ready files in PDF, SVG, and PNG formats.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#templates"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              Browse Templates
              <ArrowRight size={18} />
            </a>
            <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-6 py-4 transition-colors">
              Watch Demo
              <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[6px] border-l-slate-600 border-y-[4px] border-y-transparent ml-0.5" />
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-14 text-sm">
            {[
              { value: "50+", label: "Templates" },
              { value: "10K+", label: "Cards Created" },
              { value: "99%", label: "Export Success" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section id="features" className="bg-white border-y border-slate-100 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: <Zap size={20} className="text-blue-500" />,
              title: "Real-time Preview",
              desc: "See every change instantly",
            },
            {
              icon: <Download size={20} className="text-blue-500" />,
              title: "Multiple Formats",
              desc: "PDF, PNG, and SVG export",
            },
            {
              icon: <Shield size={20} className="text-blue-500" />,
              title: "Print-Ready",
              desc: "300 DPI with bleed support",
            },
            {
              icon: <Layers size={20} className="text-blue-500" />,
              title: "Double-Sided",
              desc: "Front and back designs",
            },
          ].map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">{feature.icon}</div>
              <div>
                <div className="font-semibold text-sm text-slate-800">{feature.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Template Library */}
      <section id="templates" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900">Template Library</h2>
          <p className="text-slate-500 mt-2">Choose a template and customize it to match your brand</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 text-xs font-medium rounded-full border transition-all",
                  activeCategory === cat
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Custom upload card — always visible */}
          <CustomUploadCard />

          {filtered.length > 0 ? (
            filtered
              .filter((t) => t.id !== "custom-upload")
              .map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">No templates found</h3>
              <p className="text-slate-400 text-sm mt-1">Try a different search or category</p>
              <button
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="mt-4 text-blue-600 text-sm font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">How It Works</h2>
            <p className="text-slate-500 mt-2">Create your card in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose a Template",
                desc: "Browse our library of professionally designed templates. Hover to preview front and back.",
                color: "blue",
              },
              {
                step: "02",
                title: "Customize Your Brand",
                desc: "Add your details, upload your logo, choose colors and fonts that match your brand.",
                color: "violet",
              },
              {
                step: "03",
                title: "Export & Print",
                desc: "Download your card as PDF, PNG, or SVG. Print-ready at 300 DPI with bleed support.",
                color: "green",
              },
            ].map((step) => (
              <div key={step.step} className="relative text-center">
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-black",
                    step.color === "blue" && "bg-blue-100 text-blue-600",
                    step.color === "violet" && "bg-violet-100 text-violet-600",
                    step.color === "green" && "bg-green-100 text-green-600"
                  )}
                >
                  {step.step}
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-violet-700">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Create Your Card?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of professionals who design their cards with CardCraft Pro.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="#templates"
              className="flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start for Free
              <ArrowRight size={18} />
            </a>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <CheckCircle size={16} />
              No credit card required
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-violet-500 rounded-lg flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm">CardCraft Pro</span>
          </div>
          <p className="text-xs">© 2025 CardCraft Pro. Professional Business Card Builder.</p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
