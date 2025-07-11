// src/app/modules/admin/static-page-manager/mock/static-content.ts

export interface StaticPage {
  id: string;
  title: string;
  content: string;
  lastUpdated: Date;
  status: 'published' | 'draft';
  category: string;
  metaDescription?: string;
  keywords?: string[];
}

export const STATIC_PAGES: { [key: string]: StaticPage } = {
  'about-story': {
    id: 'about-story',
    title: 'Our Story',
    content: `<p>At Altrevo, we empower businesses with cutting-edge technology solutions. Our journey began with a vision to solve complex technical challenges for startups and enterprises alike.</p>
    <p>With a dedicated team of developers, architects, and designers, we provide scalable, secure, and modern tech solutions.</p>`,
    lastUpdated: new Date('2024-01-15'),
    status: 'published',
    category: 'About Us',
    metaDescription: 'Learn about Altrevo\'s journey and commitment to delivering exceptional technology solutions.',
    keywords: ['technology consultancy', 'technology solutions', 'software development', 'digital transformation']
  },
  'about-mission': {
    id: 'about-mission',
    title: 'Our Mission',
    content: `<p>To deliver reliable and scalable digital solutions tailored to every business need.</p>
    <p>We believe in empowering organizations through innovative technology that drives growth, efficiency, and competitive advantage in the digital age.</p>`,
    lastUpdated: new Date('2024-01-15'),
    status: 'published',
    category: 'About Us',
    metaDescription: 'Our mission is to deliver reliable and scalable digital solutions for every business.',
    keywords: ['mission', 'digital solutions', 'business technology', 'scalable solutions']
  },
  'about-vision': {
    id: 'about-vision',
    title: 'Our Vision',
    content: `<p>To become a global leader in technology consultancy by continuously innovating and delivering value.</p>
    <p>We envision a future where every business, regardless of size, has access to world-class technology solutions that propel them towards success.</p>`,
    lastUpdated: new Date('2024-01-15'),
    status: 'published',
    category: 'About Us',
    metaDescription: 'Our vision is to become a global leader in technology consultancy through innovation.',
    keywords: ['vision', 'global leadership', 'innovation', 'technology consultancy']
  },
  'home-hero': {
    id: 'home-hero',
    title: 'Home Hero Section',
    content: `<h1>Transform Your Business with Expert IT Solutions</h1>
    <p>We deliver cutting-edge technology solutions that drive growth and innovation for businesses of all sizes.</p>`,
    lastUpdated: new Date('2024-01-15'),
    status: 'published',
    category: 'Home Page',
    metaDescription: 'Expert IT solutions to transform your business and drive growth.',
    keywords: ['IT solutions', 'business transformation', 'technology consulting']
  },
  'home-features': {
    id: 'home-features',
    title: 'Home Features Section',
    content: `<div class="features">
      <div class="feature">
        <h3>Expert Team</h3>
        <p>Our certified professionals bring years of experience in latest technologies.</p>
      </div>
      <div class="feature">
        <h3>24/7 Support</h3>
        <p>Round-the-clock technical support to ensure your systems run smoothly.</p>
      </div>
      <div class="feature">
        <h3>Scalable Solutions</h3>
        <p>Solutions that grow with your business needs and adapt to market changes.</p>
      </div>
    </div>`,
    lastUpdated: new Date('2024-01-15'),
    status: 'published',
    category: 'Home Page',
    metaDescription: 'Key features and benefits of our IT consultancy services.',
    keywords: ['expert team', '24/7 support', 'scalable solutions', 'IT services']
  },
  'contact-info': {
    id: 'contact-info',
    title: 'Contact Information',
    content: `<div class="contact-info">
      <h3>Get in Touch</h3>
      <p>Ready to transform your business? Contact our team of experts today.</p>
      <ul>
        <li><strong>Phone:</strong> +1 (555) 123-4567</li>
        <li><strong>Email:</strong> info@itconsult.com</li>
        <li><strong>Address:</strong> 123 Tech Street, Innovation City, IC 12345</li>
      </ul>
    </div>`,
    lastUpdated: new Date('2024-01-15'),
    status: 'published',
    category: 'Contact',
    metaDescription: 'Contact information for ITConsult - get in touch with our experts.',
    keywords: ['contact', 'phone', 'email', 'address', 'support']
  },
  'privacy-policy': {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    content: `<h2>Privacy Policy</h2>
    <p>Last updated: January 15, 2024</p>
    <h3>Information We Collect</h3>
    <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
    <h3>How We Use Your Information</h3>
    <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
    <h3>Information Sharing</h3>
    <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>`,
    lastUpdated: new Date('2024-01-15'),
    status: 'published',
    category: 'Legal',
    metaDescription: 'Privacy policy for ITConsult - how we collect and use your information.',
    keywords: ['privacy', 'policy', 'data protection', 'information security']
  },
  'terms-of-service': {
    id: 'terms-of-service',
    title: 'Terms of Service',
    content: `<h2>Terms of Service</h2>
    <p>Last updated: January 15, 2024</p>
    <h3>Acceptance of Terms</h3>
    <p>By accessing and using our services, you accept and agree to be bound by the terms and provision of this agreement.</p>
    <h3>Service Description</h3>
    <p>ITConsult provides technology consulting and software development services to businesses and organizations.</p>
    <h3>User Responsibilities</h3>
    <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.</p>`,
    lastUpdated: new Date('2024-01-15'),
    status: 'published',
    category: 'Legal',
    metaDescription: 'Terms of service for ITConsult - rules and guidelines for using our services.',
    keywords: ['terms', 'service', 'agreement', 'legal', 'conditions']
  }
};
