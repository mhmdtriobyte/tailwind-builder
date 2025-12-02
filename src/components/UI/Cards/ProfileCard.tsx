import { cn } from '@/utils/cn';
import { Twitter, Linkedin, Github, Globe, Mail, MapPin } from 'lucide-react';

export interface SocialLink {
  /** Platform type */
  platform: 'twitter' | 'linkedin' | 'github' | 'website' | 'email';
  /** URL or email address */
  url: string;
}

export interface ProfileCardProps {
  /** Profile avatar image URL */
  avatar: string;
  /** Person's name */
  name: string;
  /** Job title or role */
  title?: string;
  /** Bio or description */
  bio?: string;
  /** Location */
  location?: string;
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Cover image URL */
  coverImage?: string;
  /** Click handler for profile */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'horizontal';
}

/**
 * Profile card component for displaying user/team member information.
 * Includes avatar, name, bio, and social links.
 */
export function ProfileCard({
  avatar,
  name,
  title,
  bio,
  location,
  socialLinks,
  coverImage,
  onClick,
  className,
  variant = 'default',
}: ProfileCardProps) {
  const socialIcons = {
    twitter: Twitter,
    linkedin: Linkedin,
    github: Github,
    website: Globe,
    email: Mail,
  };

  const getSocialLabel = (platform: string) => {
    const labels: Record<string, string> = {
      twitter: 'Twitter profile',
      linkedin: 'LinkedIn profile',
      github: 'GitHub profile',
      website: 'Personal website',
      email: 'Send email',
    };
    return labels[platform] || platform;
  };

  const getSocialHref = (link: SocialLink) => {
    if (link.platform === 'email') {
      return `mailto:${link.url}`;
    }
    return link.url;
  };

  if (variant === 'horizontal') {
    return (
      <div
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl',
          'bg-white border border-gray-200',
          'transition-all duration-200',
          onClick && 'cursor-pointer hover:shadow-lg hover:border-gray-300',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <img
          src={avatar}
          alt={`${name}'s avatar`}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
          {title && (
            <p className="text-sm text-gray-500 truncate">{title}</p>
          )}
        </div>
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex items-center gap-2">
            {socialLinks.slice(0, 3).map((link) => {
              const Icon = socialIcons[link.platform];
              return (
                <a
                  key={link.platform}
                  href={getSocialHref(link)}
                  aria-label={getSocialLabel(link.platform)}
                  target={link.platform !== 'email' ? '_blank' : undefined}
                  rel={link.platform !== 'email' ? 'noopener noreferrer' : undefined}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'text-center p-4 rounded-xl',
          'bg-white border border-gray-200',
          'transition-all duration-200',
          onClick && 'cursor-pointer hover:shadow-lg',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <img
          src={avatar}
          alt={`${name}'s avatar`}
          className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
        />
        <h3 className="font-semibold text-gray-900">{name}</h3>
        {title && (
          <p className="text-sm text-gray-500">{title}</p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl overflow-hidden',
        'bg-white border border-gray-200',
        'transition-all duration-200',
        'hover:shadow-xl',
        className
      )}
    >
      {/* Cover Image */}
      <div
        className={cn(
          'h-24 sm:h-32',
          coverImage ? 'bg-cover bg-center' : 'bg-gradient-to-r from-blue-500 to-purple-500'
        )}
        style={coverImage ? { backgroundImage: `url(${coverImage})` } : undefined}
      />

      {/* Content */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="-mt-12 mb-4">
          <img
            src={avatar}
            alt={`${name}'s avatar`}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>

        {/* Name and Title */}
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        {title && (
          <p className="text-gray-500 font-medium">{title}</p>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span>{location}</span>
          </div>
        )}

        {/* Bio */}
        {bio && (
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            {bio}
          </p>
        )}

        {/* Social Links */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.platform];
              return (
                <a
                  key={link.platform}
                  href={getSocialHref(link)}
                  aria-label={getSocialLabel(link.platform)}
                  target={link.platform !== 'email' ? '_blank' : undefined}
                  rel={link.platform !== 'email' ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'p-2 rounded-lg',
                    'text-gray-500 bg-gray-100',
                    'hover:text-blue-600 hover:bg-blue-50',
                    'transition-colors duration-200'
                  )}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
