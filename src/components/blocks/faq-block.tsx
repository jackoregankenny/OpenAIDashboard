import { FAQBlockProps } from '@/lib/blocks/types';
import { registerBlock } from '@/lib/blocks/registry';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQBlock({ title, subtitle, faqs, columns = 1 }: FAQBlockProps) {
  return (
    <div className="px-6 py-16 md:px-12 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-xl text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className={`grid gap-4 ${columns === 2 ? 'md:grid-cols-2' : ''}`}>
          {columns === 2 ? (
            // Split FAQs into two columns
            <>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.filter((_, i) => i % 2 === 0).map((faq, index) => (
                  <AccordionItem key={index * 2} value={`item-${index * 2}`} className="bg-card border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.filter((_, i) => i % 2 === 1).map((faq, index) => (
                  <AccordionItem key={index * 2 + 1} value={`item-${index * 2 + 1}`} className="bg-card border rounded-lg px-6">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          ) : (
            // Single column
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
}

// Auto-register this block
registerBlock({
  type: 'faq',
  name: 'FAQ Section',
  description: 'Frequently asked questions with accordion',
  component: FAQBlock,
  defaultProps: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions',
    faqs: [
      {
        question: 'What are your school hours?',
        answer: 'Our school operates from 8:00 AM to 3:30 PM, Monday through Friday.',
      },
      {
        question: 'How do I enroll my child?',
        answer: 'You can start the enrollment process by visiting our admissions office or filling out the online application form.',
      },
      {
        question: 'What extracurricular activities do you offer?',
        answer: 'We offer a wide range of activities including sports, music, drama, art, and various academic clubs.',
      },
    ],
    columns: 1,
  },
  icon: 'help-circle',
  category: 'content',
});

