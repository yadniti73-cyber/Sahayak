import { APP_ROUTES } from "../routes";

export const publicNavigationItems = [
  { label: "Home", href: APP_ROUTES.home },
  { label: "Mentors", href: APP_ROUTES.mentors },
  { label: "Categories", href: APP_ROUTES.categories },
  { label: "About", href: APP_ROUTES.about },
  { label: "Contact", href: APP_ROUTES.contact },
];

export const dashboardNavigation = {
  seeker: [
    { label: "Dashboard", href: APP_ROUTES.dashboardHome },
    { label: "Bookings", href: APP_ROUTES.dashboardBookings },
    { label: "Favorites", href: APP_ROUTES.dashboardFavorites },
    { label: "Profile", href: APP_ROUTES.dashboardProfile },
    { label: "Settings", href: APP_ROUTES.dashboardSettings },
  ],
  mentor: [
    { label: "Dashboard", href: APP_ROUTES.mentorDashboard },
    { label: "Bookings", href: APP_ROUTES.mentorBookings },
    { label: "Calendar", href: APP_ROUTES.mentorCalendar },
    { label: "Availability", href: APP_ROUTES.mentorAvailability },
    { label: "Profile", href: APP_ROUTES.mentorProfile },
    { label: "Analytics", href: APP_ROUTES.mentorAnalytics },
    { label: "Settings", href: APP_ROUTES.mentorSettings },
  ],
  admin: [
    { label: "Overview", href: APP_ROUTES.admin },
    { label: "Users", href: APP_ROUTES.adminUsers },
    { label: "Mentors", href: APP_ROUTES.adminMentors },
    { label: "Categories", href: APP_ROUTES.adminCategories },
    { label: "Bookings", href: APP_ROUTES.adminBookings },
    { label: "Reports", href: APP_ROUTES.adminReports },
    { label: "Settings", href: APP_ROUTES.adminSettings },
  ],
};
