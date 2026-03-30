'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Share2, Mail, Phone, MapPin, Globe, MessageCircle, Send, AtSign } from 'lucide-react';

const SOCIAL_ICONS: any = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  whatsapp: WhatsappIcon,
  telegram: TelegramIcon,
  youtube: YoutubeIcon,
  tiktok: TiktokIcon,
  messenger: MessengerIcon,
  snapchat: SnapchatIcon,
  line: LineIcon,
  skype: SkypeIcon,
  globe: Globe,
};

// Simple SVG Icons for Social Media to avoid Lucide version issues
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.012 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.012 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0C5.346 0 0 5.346 0 11.944s5.346 11.944 11.944 11.944 11.944-5.346 11.944-11.944S18.542 0 11.944 0zm5.206 8.334c-.161 1.697-1.103 7.22-1.587 9.81-.205 1.096-.61 1.463-1.002 1.499-.853.078-1.5-.562-2.324-1.103-1.291-.845-2.021-1.37-3.274-2.196-1.448-.953-.51-1.477.316-2.333.216-.224 3.974-3.642 4.047-3.953.009-.04.018-.187-.058-.254-.077-.066-.191-.044-.272-.025-.115.026-1.946 1.235-5.484 3.626-.518.356-.988.532-1.408.522-.463-.01-.1.355-1.353-.76-.324-.288-.58-.577-.768-.867-.282-.434-.51-.933-.51-1.43 0-.542.279-1.037.822-1.312.556-.282 1.406-.412 2.373-.412 1.157 0 2.457.19 3.61.542.42.128.852.31 1.186.537.334.226.516.484.516.764 0 .28-.182.538-.516.764z"/></svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14 1.01.23 2.08.94 2.79.68.68 1.64 1.02 2.59.92a3.24 3.24 0 002.57-2.38c.03-.12.04-.24.04-.36.06-3.31.04-6.61.04-9.92z"/></svg>
  );
}

function MessengerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.194l-3.147-3.344-6.147 3.344 6.756-7.169 3.147 3.344 6.147-3.344-6.756 7.169z"/></svg>
  );
}

function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 0c-2.484 0-4.66.726-6.128 1.83-.243.18-.323.414-.15.54.496.357.944.757 1.343 1.19.166.182.427.243.64.148.883-.396 1.88-.616 2.924-.616 1.044 0 2.04.22 2.924.616.213.095.474.034.64-.148.4-.433.847-.833 1.343-1.19.173-.126.093-.36-.15-.54C16.65.726 14.474 0 11.99 0zm.01 4.545c-2.316 0-4.225.862-5.114 2.112-.132.186-.104.425.07.564.444.354.837.766 1.17 1.226.096.133.266.195.424.152.883-.243 1.825-.373 2.805-.373s1.922.13 2.805.373c.158.043.328-.02.424-.152.333-.46.726-.872 1.17-1.226.174-.139.202-.378.07-.564-.89-1.25-2.798-2.112-5.114-2.112zm-.01 19.455c-1.026 0-2.02-.132-2.937-.373-.16-.043-.33.02-.426.153-.33.46-.723.872-1.166 1.226-.174.139-.202.378-.07.564.887 1.25 2.795 2.112 5.11 2.112s4.223-.862 5.11-2.112c.132-.186.104-.425-.07-.564-.443-.354-.836-.766-1.166-1.226-.096-.133-.266-.195-.426-.153-.917.241-1.91.373-2.937.373z"/></svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.59.121.303.079.778.039 1.085l-.171 1.027c-.052.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.041-1.161 1.572-2.316 1.572-3.415zM7.5 13.5H4.5v-6h1.5v4.5h1.5v1.5zm3.75 0h-3v-6h1.5v4.5h1.5v1.5zm3.75 0h-3v-6h1.5v4.5h1.5v1.5zm3.75 0h-3v-6h1.5v4.5h1.5v1.5z"/></svg>
  );
}

function SkypeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22.28 15.17c.28-.96.42-1.95.42-2.97 0-5.69-4.61-10.31-10.31-10.31-1.02 0-2.01.14-2.97.42C8.31.86 6.74 0 5.06 0 2.27 0 0 2.27 0 5.06c0 1.68.86 3.25 2.31 4.36-.28.96-.42 1.95-.42 2.97 0 5.69 4.61 10.31 10.31 10.31 1.02 0 2.01-.14 2.97-.42C15.69 23.14 17.26 24 18.94 24 21.73 24 24 21.73 24 18.94c0-1.68-.86-3.25-2.31-4.36l.59-.41z"/></svg>
  );
}

const Footer = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [footerContent, setFooterContent] = useState<any>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content?page=footer');
        const data = await res.json();
        if (res.ok) {
          setFooterContent(data.sections || {
            footer_description: 'Premium quality stationery for your creative journey. Elevate your workspace with our curated collection.',
            contact_address: '123 Creative Avenue, Design District, NY 10001',
            contact_phone: '+1 (234) 567-890',
            contact_email: 'hello@stationeryhub.com',
            social_links: [
              { platform: 'facebook', url: '#' },
              { platform: 'instagram', url: '#' },
              { platform: 'twitter', url: '#' },
              { platform: 'linkedin', url: '#' },
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching footer content');
      }
    };
    fetchContent();
  }, []);

  // Don't show the main footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t dark:border-slate-800 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center sm:text-left">
          {/* Brand Info */}
          <div className="space-y-6 flex flex-col items-center sm:items-start">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              StationeryHub
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
              {footerContent?.footer_description || 'Premium quality stationery for your creative journey. Elevate your workspace with our curated collection.'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {footerContent?.social_links?.filter((social: any) => social.visible !== false && social.url).map((social: any, index: number) => {
                const Icon = SOCIAL_ICONS[social.platform] || Globe;
                return (
                  <Link
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-slate-900 p-2.5 rounded-full shadow-sm hover:shadow-md hover:text-indigo-600 transition-all flex items-center justify-center"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'Products', 'Categories', 'Offers', 'About Us'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Support</h4>
            <ul className="space-y-4">
              {['Contact Us', 'Shipping Policy', 'Return & Refund', 'FAQ', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-slate-600 dark:text-slate-400 justify-center sm:justify-start">
                <MapPin className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" />
                <span>{footerContent?.contact_address || '123 Creative Avenue, Design District, NY 10001'}</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 justify-center sm:justify-start">
                <Phone className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <span>{footerContent?.contact_phone || '+1 (234) 567-890'}</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-400 justify-center sm:justify-start">
                <Mail className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <span>{footerContent?.contact_email || 'hello@stationeryhub.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
            © {currentYear} StationeryHub. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy-policy" className="text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
