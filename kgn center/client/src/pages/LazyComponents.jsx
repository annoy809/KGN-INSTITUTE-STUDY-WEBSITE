// LazyComponents.jsx
import { lazy } from 'react';

/* =============================
   Pages / Sections
============================= */
export const Banner = lazy(() => import('./Banner'));
export const Encourages = lazy(() => import('./Encourages'));
export const Courseshome = lazy(() => import('./Courseshome'));
export const TrandingCourse = lazy(() => import('./course/TrandingCourse'));
export const Determined = lazy(() => import('./Determined'));
export const RegisterCTA = lazy(() => import('./RegisterCTA'));
export const Testimonial = lazy(() => import('../components/Testimonial'));
export const Footer = lazy(() => import('../components/Footer'));

/* =============================
   Heavy Libraries / Components
============================= */
// Example: Lazy load animated card using Framer Motion
export const AnimatedCard = lazy(() =>
  import('./animated/AnimatedCard')
);

// Example: Lazy load individual Lucide React icons
export const UserIcon = lazy(() =>
  import('lucide-react').then(module => ({ default: module.User }))
);

export const HomeIcon = lazy(() =>
  import('lucide-react').then(module => ({ default: module.Home }))
);

export const BellIcon = lazy(() =>
  import('lucide-react').then(module => ({ default: module.Bell }))
);
