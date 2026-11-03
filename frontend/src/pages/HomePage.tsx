import { useRef } from 'react';
import { HeroSection } from '../components/HeroSection';
import { StudyMaterialForm } from '../components/StudyMaterialForm';

/**
 * Home page — the main quiz creation experience.
 * Routes to: /
 */
export default function HomePage() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Move focus to the form section for keyboard users
    formRef.current?.focus();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-10">
      <HeroSection onGetStarted={scrollToForm} />

      {/* tabIndex={-1} makes this div programmatically focusable for keyboard users
          who activate the "Get Started" CTA — focus is moved here, not trapped. */}
      <div ref={formRef} tabIndex={-1} className="outline-none">
        <StudyMaterialForm />
      </div>
    </div>
  );
}
