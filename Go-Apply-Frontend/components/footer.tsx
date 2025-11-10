import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary/20 via-accent/30 to-primary/10 border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="h-8 w-8" />
              <h3 className="text-2xl font-bold text-foreground">GoApply</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your trusted partner in navigating the path to international education. 
              Making study abroad dreams accessible to everyone.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.321-1.297C4.198 14.926 3.662 13.748 3.662 12.39c0-1.297.49-2.448 1.297-3.321.836-.835 1.988-1.297 3.321-1.297s2.448.49 3.321 1.297c.835.836 1.297 1.988 1.297 3.321 0 1.297-.49 2.448-1.297 3.321-.836.835-1.988 1.297-3.321 1.297zm7.83 1.297c-.49.49-1.297.835-2.176.835s-1.686-.345-2.176-.835c-.49-.49-.835-1.297-.835-2.176s.345-1.686.835-2.176c.49-.49 1.297-.835 2.176-.835s1.686.345 2.176.835c.49.49.835 1.297.835 2.176s-.345 1.686-.835 2.176z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Universities</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Programs</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Scholarships</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2025 GoApply. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Made with ❤️ for international students
          </p>
        </div>
      </div>
    </footer>
  );
}

// GoApply logo badge
const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
        fill="#10B981"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#059669"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 12H30C36.6274 12 42 17.3726 42 24C42 30.6274 36.6274 36 30 36H24V44H18V12ZM24 18V30H30C33.3137 30 36 27.3137 36 24C36 20.6863 33.3137 18 30 18H24Z"
        fill="white"
      ></path>
      <path
        d="M14 20H20V22H18V26H20V28H14V20Z"
        fill="white"
      ></path>
      <path
        d="M38 20H44V28H42V22H40V28H38V20Z"
        fill="white"
      ></path>
    </svg>
  );
};