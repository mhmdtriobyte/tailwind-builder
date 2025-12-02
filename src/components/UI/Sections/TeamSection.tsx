import { cn } from '@/utils/cn';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  email?: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar: string;
  social?: SocialLinks;
}

interface TeamSectionProps {
  title: string;
  subtitle?: string;
  members: TeamMember[];
  variant?: 'grid' | 'cards' | 'compact';
  className?: string;
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Twitter;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}

function TeamMemberCard({
  member,
  variant,
}: {
  member: TeamMember;
  variant: 'grid' | 'cards' | 'compact';
}) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4">
        <img
          src={member.avatar}
          alt={member.name}
          className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100"
        />
        <div>
          <h3 className="font-semibold text-gray-900">{member.name}</h3>
          <p className="text-sm text-gray-600">{member.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group flex flex-col items-center text-center',
        variant === 'cards' &&
          'rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 sm:p-8'
      )}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={member.avatar}
          alt={member.name}
          className={cn(
            'object-cover transition-transform duration-500 group-hover:scale-105',
            variant === 'cards' ? 'h-40 w-40' : 'h-56 w-56 sm:h-64 sm:w-64'
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-gray-900">{member.name}</h3>
      <p className="mt-1 text-sm font-medium text-blue-600">{member.role}</p>

      {member.bio && (
        <p className="mt-3 text-sm leading-6 text-gray-600">{member.bio}</p>
      )}

      {member.social && (
        <div className="mt-4 flex gap-2">
          {member.social.twitter && (
            <SocialLink
              href={member.social.twitter}
              icon={Twitter}
              label={`${member.name}'s Twitter`}
            />
          )}
          {member.social.linkedin && (
            <SocialLink
              href={member.social.linkedin}
              icon={Linkedin}
              label={`${member.name}'s LinkedIn`}
            />
          )}
          {member.social.github && (
            <SocialLink
              href={member.social.github}
              icon={Github}
              label={`${member.name}'s GitHub`}
            />
          )}
          {member.social.email && (
            <SocialLink
              href={`mailto:${member.social.email}`}
              icon={Mail}
              label={`Email ${member.name}`}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function TeamSection({
  title,
  subtitle,
  members,
  variant = 'grid',
  className,
}: TeamSectionProps) {
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

        <div
          className={cn(
            'mt-12 sm:mt-16',
            variant === 'compact'
              ? 'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid grid-cols-1 gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          )}
        >
          {members.map((member, index) => (
            <TeamMemberCard key={index} member={member} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  );
}
