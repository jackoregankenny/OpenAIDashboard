import type { LinkTarget, RenderComponentProps } from '@/lib/registry/types';
import { resolveLinkHref } from '@/lib/registry/types';

interface AdmissionsStep {
  title: string;
  date?: string;
  description?: string;
  linkLabel?: string;
  link?: LinkTarget | string;
  status?: 'completed' | 'current' | 'upcoming';
}

interface AdmissionsStepsProps {
  heading?: string;
  subheading?: string;
  steps?: AdmissionsStep[];
  footnote?: string;
}

const statusStyles: Record<NonNullable<AdmissionsStep['status']>, string> = {
  completed: 'bg-emerald-500 text-white border border-emerald-500',
  current: 'bg-primary-600 text-white border border-primary-600',
  upcoming: 'bg-white text-primary-600 border border-primary-200',
};

export default function AdmissionsSteps({
  props,
}: RenderComponentProps<AdmissionsStepsProps>) {
  const {
    heading = 'Your Path to Enrollment',
    subheading = 'Follow these key milestones to complete your application with confidence.',
    steps = [
      {
        title: 'Step 1 · Submit Application',
        date: 'By March 1, 2025',
        description: 'Complete the online application and upload required documents.',
        linkLabel: 'Start application',
        link: '#apply',
        status: 'completed',
      },
      {
        title: 'Step 2 · Family Interview',
        date: 'March 15 – April 10',
        description: 'Meet with our admissions team to discuss goals and programs.',
        linkLabel: 'Schedule interview',
        link: '#schedule',
        status: 'current',
      },
      {
        title: 'Step 3 · Admissions Decision',
        date: 'April 25, 2025',
        description: 'Receive notifications via email and your admissions portal.',
        status: 'upcoming',
      },
      {
        title: 'Step 4 · Enrollment Deposit',
        date: 'Due May 10, 2025',
        description: 'Secure your seat and unlock access to orientation resources.',
        linkLabel: 'Pay deposit',
        link: '#deposit',
        status: 'upcoming',
      },
    ],
    footnote = 'Questions? Email admissions@northridge.edu or call (555) 867-5309.',
  } = props;

  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">
            Admissions Timeline
          </p>
          <h2 className="mt-3 text-3xl font-light text-gray-900 md:text-4xl">{heading}</h2>
          {subheading && <p className="mt-4 text-base text-gray-600 md:text-lg">{subheading}</p>}
        </div>

        <ol className="mt-12 space-y-8 border-l border-primary-100 pl-6">
          {steps.map((step, index) => {
            const status = step.status ?? 'upcoming';
            const href = resolveLinkHref(step.link);

            return (
              <li key={`${step.title}-${index}`} className="relative">
                <div className="absolute -left-11 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold shadow-sm">
                  <span className={`flex h-full w-full items-center justify-center rounded-full ${statusStyles[status]}`}>
                    {index + 1}
                  </span>
                </div>
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-primary-100/40">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    {step.date && <span className="text-sm text-primary-600">{step.date}</span>}
                  </div>
                  {step.description && <p className="mt-3 text-sm text-gray-600">{step.description}</p>}
                  {href && step.linkLabel && (
                    <a
                      href={href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                    >
                      {step.linkLabel}
                      <span aria-hidden>→</span>
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {footnote && <p className="mt-10 text-center text-sm text-gray-500">{footnote}</p>}
      </div>
    </section>
  );
}
