import { cn } from '@/utils/cn';
import { Check, X } from 'lucide-react';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaLink?: string;
  popular?: boolean;
}

interface PricingSectionProps {
  title: string;
  subtitle?: string;
  plans: PricingPlan[];
  className?: string;
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all duration-300 sm:p-8',
        plan.popular
          ? 'border-blue-600 bg-white ring-2 ring-blue-600 shadow-xl shadow-blue-600/10'
          : 'border-gray-200 bg-white hover:shadow-lg hover:shadow-gray-200/50'
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
      </div>

      <div className="mt-6 flex items-baseline justify-center gap-1">
        <span className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {plan.price}
        </span>
        {plan.period && (
          <span className="text-base text-gray-600">/{plan.period}</span>
        )}
      </div>

      <ul className="mt-8 space-y-3 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="h-5 w-5 flex-shrink-0 text-blue-600" />
            ) : (
              <X className="h-5 w-5 flex-shrink-0 text-gray-300" />
            )}
            <span
              className={cn(
                'text-sm',
                feature.included ? 'text-gray-700' : 'text-gray-400'
              )}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={plan.ctaLink || '#'}
        className={cn(
          'mt-8 block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
          plan.popular
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 focus:ring-blue-500'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500'
        )}
      >
        {plan.ctaText}
      </a>
    </div>
  );
}

export function PricingSection({
  title,
  subtitle,
  plans,
  className,
}: PricingSectionProps) {
  return (
    <section
      className={cn(
        'w-full py-16 px-4 sm:py-20 md:py-24 lg:py-32',
        'bg-gray-50',
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

        <div className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
