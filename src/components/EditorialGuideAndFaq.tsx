import {useState} from 'react';
import {ChevronDown} from 'lucide-react';
import type {TranslationDictionary} from '../i18n/types';

interface EditorialGuideAndFaqProps {
  t: TranslationDictionary;
}

export function EditorialGuideAndFaq({t}: EditorialGuideAndFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 sm:px-6">
      {/* Editorial SEO Guide Section */}
      <section id="guide" className="rounded-2xl border border-[#E7E5E4] bg-white p-5 sm:p-8">
        <div className="max-w-2xl border-b border-[#E7E5E4] pb-5">
          <h2 className="font-display text-xl font-bold text-[#1C1917] sm:text-2xl">
            {t.guide.sectionTitle}
          </h2>
          <p className="mt-1.5 text-sm text-[#57534E]">{t.guide.sectionSubtitle}</p>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {t.guide.articles.map((article, idx) => (
            <article key={idx} className="space-y-2">
              <h3 className="font-display text-base font-bold text-[#1C1917]">
                {article.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#44403C]">{article.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Interactive Accessible FAQ Accordion */}
      <section id="faq" className="rounded-2xl border border-[#E7E5E4] bg-white p-5 sm:p-8">
        <h2 className="font-display text-xl font-bold text-[#1C1917] sm:text-2xl">
          {t.faq.sectionTitle}
        </h2>

        <div className="mt-5 divide-y divide-[#E7E5E4] border-t border-b border-[#E7E5E4]">
          {t.faq.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-start font-display text-sm font-semibold text-[#1C1917] transition-colors hover:text-[#9F1239] cursor-pointer sm:text-base"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#57534E] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#9F1239]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="pb-4 text-sm leading-relaxed text-[#44403C] max-w-3xl">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
