export const APP_ROUTES = {
  home: "/",
  about: "/about",
  howItWorks: "/how-it-works",
  mentors: "/mentors",
  categories: "/categories",
  faq: "/faq",
  contact: "/contact",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  dashboardHome: "/dashboard/home",
  dashboardBookings: "/dashboard/bookings",
  dashboardFavorites: "/dashboard/favorites",
  dashboardProfile: "/dashboard/profile",
  dashboardSettings: "/dashboard/settings",
  mentorDashboard: "/mentor/dashboard",
  mentorBookings: "/mentor/bookings",
  mentorCalendar: "/mentor/calendar",
  mentorAvailability: "/mentor/availability",
  mentorProfile: "/mentor/profile",
  mentorAnalytics: "/mentor/analytics",
  mentorSettings: "/mentor/settings",
  admin: "/admin",
  adminUsers: "/admin/users",
  adminMentors: "/admin/mentors",
  adminCategories: "/admin/categories",
  adminBookings: "/admin/bookings",
  adminReports: "/admin/reports",
  adminSettings: "/admin/settings",
};

export const ROLE_HOME_ROUTES = {
  SEEKER: APP_ROUTES.dashboardHome,
  MENTOR: APP_ROUTES.mentorDashboard,
  ADMIN: APP_ROUTES.admin,
};

const PUBLIC_ROUTE_PREFIXES = [
  APP_ROUTES.home,
  APP_ROUTES.about,
  APP_ROUTES.howItWorks,
  APP_ROUTES.mentors,
  APP_ROUTES.categories,
  "/category",
  APP_ROUTES.faq,
  APP_ROUTES.contact,
  APP_ROUTES.login,
  APP_ROUTES.register,
  APP_ROUTES.forgotPassword,
  APP_ROUTES.resetPassword,
];

export function isPublicRoute(pathname = "") {
  if (!pathname) {
    return false;
  }

  if (pathname === APP_ROUTES.home) {
    return true;
  }

  return PUBLIC_ROUTE_PREFIXES.some((prefix) => {
    if (prefix === APP_ROUTES.home) {
      return false;
    }

    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}
