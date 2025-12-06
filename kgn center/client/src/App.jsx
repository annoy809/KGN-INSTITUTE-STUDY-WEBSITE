import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { CartProvider } from "./Cartcontext";
import CourseProvider from "./Tutor/CourseAdd/CourseContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// 🔥 Add this after import
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// 🌐 Common Components
import TopNavbar from "./components/TopNavbar";
import SearchPage from "./components/SearchPage";
import SecondNavbar from "./components/SecondNavbar";
import Preloader from "./components/Preloader";
import CourseNavbar from "./Tutor/CourseAdd/CourseNavbar";
import "./components/admin/Admincss/AdminPanel.css";


// 🧑‍🎓 Student Edit Profile Page
const EditProfile = lazy(() => import('./components/EditProfile'));


// ✅ Core Admin Layout and Route
import AdminRoute from "./components/admin/Adminpage/AdminRoute";

// 📊 Dashboard & Core Pages
const AdminDashboard = lazy(() =>
  import("./components/admin/Adminpage/Dashboard")
);
const CourseList = lazy(() =>
  import("./components/admin/Adminpage/CourseList")
);
const ManageCourse = lazy(() =>
  import("./components/admin/Adminpage/ManageCourse")
);
const CoursePreview = lazy(() =>
  import("./components/admin/Adminpage/CoursePreview")
);
const NewAdmission = lazy(() =>
  import("./components/admin/Adminpage/NewAdmission")
);
const StudentMeetings = lazy(() =>
  import("./Tutor/Dashboard Pages/StudentMeetings")
);

// 📨 User & Communication
const ContactMessages = lazy(() =>
  import("./components/admin/Adminpage/ContactMessages")
);
const AllRegistrations = lazy(() =>
  import("./components/admin/Adminpage/AllRegistrations")
);
const AdminAssignmentSubmissions = lazy(() =>
  import("./components/admin/Adminpage/AdminAssignmentSubmissions")
);
const AdminUsers = lazy(() =>
  import("./components/admin/Adminpage/AdminUsers")
);

// 💰 Payments & Coupons
const PaymentRecords = lazy(() =>
  import("./components/admin/Adminpage/PaymentRecords")
);
const ReceivedPayments = lazy(() =>
  import("./components/admin/Adminpage/RecievedPayments")
);
const CouponForm = lazy(() =>
  import("./components/admin/Adminpage/CouponForm")
);
const CouponManager = lazy(() =>
  import("./components/admin/Adminpage/CouponManager")
);

// 📢 Announcements
const AdminAnnouncementVerif = lazy(() =>
  import("./components/admin/Adminpage/AdminAnnouncementVerif")
);

// 🎥 Zoom Components (Lazy-loaded)
const ScheduleMeeting = lazy(() =>
  import("./components/Zoom/ScheduleMeeting")
);
const JoinMeeting = lazy(() => import("./components/Zoom/JoinMeeting"));
const MeetingHistory = lazy(() =>
  import("./components/Zoom/MeetingHistory")
);

// 🏆 Additional Admin Features
import Certificates from "./components/admin/Adminpage/Certificates";
import Messaging from "./components/admin/Adminpage/Messaging";
import Analytics from "./components/admin/Adminpage/Analytics";
import ActivityLogs from "./components/admin/Adminpage/ActivityLogs";

// 📚 Course Add / Edit
import ContentBuilder from "./Tutor/CourseAdd/ContentBuilder";
import AdditionalInfo from "./Tutor/CourseAdd/AdditionalInfo";
import CourseCreationWizard from "./Tutor/CourseAdd/showCourse/CourseCreationWizard";
import EditCoursePage from "./pages/course/EditCoursePage";

// 🧩 Auth Components
import AuthForm from "./components/Login/AuthForm";
import OAuthSuccess from "./components/Login/OAuthSuccess";

// 🧭 Other Pages
import Teach from "./online_class/Teach";
import JobProfile from "./pages/course/jobprofile";
import ExploreCourse from "./pages/course/ExploreCourse";
import TrendingCourse from "./pages/course/TrandingCourse";
import CourseDetails from "./pages/course/CourseDetails";
import BecomeInstructor from "./Tutor/Dashboard Pages/BecomeInstructor";
import EnrolledSection from "./Tutor/Dashboard Pages/EnrolledSection";
import LearningDashboard from "./Tutor/Dashboard Pages/LearningPages/LearningDashboard";

// 🕹️ Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./components/About/About"));
const Signup = lazy(() => import("./pages/Signup"));
const Registration = lazy(() => import("./Student/Registration"));
const Contact = lazy(() => import("./components/contacts/Contact"));
const CartPage = lazy(() =>
  import("./components/Shopping/ShoppingCart/CartPage")
);
const CheckoutPage = lazy(() =>
  import("./components/Shopping/Checkout/CheckoutPage")
);
import Notification from "./components/Notification";
const OnlineClasses = lazy(() => import("./online_class/Onlineclass"));
const Payment  = lazy(() => import("./online_class/payment"));
const DashboardLayout = lazy(() =>
  import("./Tutor/Dashboard Pages/DashboardLayout")
);
const Dashboard = lazy(() =>
  import("./Tutor/Dashboard Pages/Dashboard")
);
const ProfileSection = lazy(() =>
  import("./Tutor/Dashboard Pages/ProfileSection")
);
const WishListSection = lazy(() =>
  import("./Tutor/Dashboard Pages/WishListSection")
);
const QuizAttemptsSection = lazy(() =>
  import("./Tutor/Dashboard Pages/QuizSection")
);
const OrderSection = lazy(() =>
  import("./Tutor/Dashboard Pages/OrderSection")
);
const QuestionSection = lazy(() =>
  import("./Tutor/Dashboard Pages/QuestionSection")
);
const MyCourseSection = lazy(() =>
  import("./Tutor/Dashboard Pages/MyCourseSection")
);
const AnnoucementSection = lazy(() =>
  import("./Tutor/Dashboard Pages/AnnoucementSection")
);
const Setting = lazy(() =>
  import("./Tutor/Dashboard Pages/Setting/")
);
const Courseshome = lazy(() => import("./pages/Courseshome"));

// ⚠️ Error fallback
import ErrorFallback from "./components/ErrorFallback";

// 🌐 Wrapper to hide TopNavbar/SecondNavbar for login/signup routes
const PageWrapper = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup", "/oauth-success"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <Suspense fallback={<Preloader />}>
      {!shouldHideNavbar && (
        <>
          <TopNavbar />
          <SecondNavbar />
        </>
      )}
      <Suspense fallback={<Preloader />}>{children}</Suspense>
    </Suspense>
  );
};

// 🧭 Router Configuration
const router = createBrowserRouter([
  { path: "/", element: <PageWrapper><Home /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/search/:query", element: <SearchPage /> }, // 👈 Yaha add karo
  { path: "/notification", element: <PageWrapper><Notification /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/about", element: <PageWrapper><About /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/contact", element: <PageWrapper><Contact /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/login", element: <PageWrapper><AuthForm /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/oauth-success", element: <PageWrapper><OAuthSuccess /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/signup", element: <PageWrapper><Signup /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/registration", element: <PageWrapper><Registration /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/course-details/:id", element: <PageWrapper><CourseDetails /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/explore-courses", element: <PageWrapper><ExploreCourse /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/trending-courses", element: <PageWrapper><TrendingCourse /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/cart", element: <PageWrapper><CartPage /></PageWrapper>, errorElement: <ErrorFallback /> },
{ path: '/edit-profile', element: <PageWrapper><EditProfile /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/checkout", element: <PageWrapper><CheckoutPage /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/onlineclass", element: <PageWrapper><OnlineClasses /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/Teach", element: <PageWrapper><Teach /></PageWrapper>, errorElement: <ErrorFallback /> },
  { path: "/jobprofile", element: <PageWrapper><JobProfile /></PageWrapper>, errorElement: <ErrorFallback /> },
{ path: "/signup", element: <PageWrapper><Signup /></PageWrapper>, errorElement: <ErrorFallback /> },
{ path: "/Paymentplan", element: <PageWrapper><Payment /></PageWrapper>, errorElement: <ErrorFallback /> },


  // 🧱 Course Creation / Editing
  {
    path: "/addcourse",
    element: (
      <Suspense fallback={<Preloader />}>
        <CourseNavbar />
        <CourseCreationWizard />
      </Suspense>
    ),
  },
  {
    path: "/course-builder",
    element: (
      <Suspense fallback={<Preloader />}>
        <CourseNavbar />
        <ContentBuilder />
      </Suspense>
    ),
  },
  {
    path: "/additional",
    element: (
      <Suspense fallback={<Preloader />}>
        <CourseNavbar />
        <AdditionalInfo />
      </Suspense>
    ),
  },
  {
    path: "/Editcourse/:courseId",
    element: (
      <Suspense fallback={<Preloader />}>
        <CourseNavbar />
        <EditCoursePage />
      </Suspense>
    ),
  },
  {
    path: "/BecomeInstructor",
    element: (
      <Suspense fallback={<Preloader />}>
        <TopNavbar />
        <BecomeInstructor />
      </Suspense>
    ),
  },
  {
    path: "/showcourse",
    element: (
      <Suspense fallback={<Preloader />}>
        <TopNavbar />
        <SecondNavbar />
        <Courseshome />
      </Suspense>
    ),
  },

  // 📊 Student Dashboard
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<Preloader />}>
        <DashboardLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "profile", element: <ProfileSection /> },
      { path: "enrolled", element: <EnrolledSection /> },
      { path: "wishlist", element: <WishListSection /> },
      { path: "student-meetings", element: <StudentMeetings /> },
      { path: "quiz-attempts", element: <QuizAttemptsSection /> },
      { path: "orders", element: <OrderSection /> },
      { path: "questions", element: <QuestionSection /> },
      { path: "announcements", element: <AnnoucementSection /> },
      { path: "StartLearning/:courseId", element: <LearningDashboard /> },
      {path: "setting", element: <Setting /> },
    ],
  },

  // 🧑‍💼 Admin Panel
  {
    path: "/admin",
    element: <AdminRoute />,
    errorElement: <ErrorFallback />,
    children: [
      { index: true, element: <Suspense fallback={<Preloader />}><AdminDashboard /></Suspense> },
      { path: "courses", element: <Suspense fallback={<Preloader />}><CourseList /></Suspense> },
      { path: "manage-course", element: <Suspense fallback={<Preloader />}><ManageCourse /></Suspense> },
      { path: "course-preview/:id", element: <Suspense fallback={<Preloader />}><CoursePreview /></Suspense> },
      { path: "Couponadd", element: <Suspense fallback={<Preloader />}><CouponForm /></Suspense> },
      { path: "AllCoupons", element: <Suspense fallback={<Preloader />}><CouponManager /></Suspense> },
      { path: "AllRegistrations", element: <Suspense fallback={<Preloader />}><AllRegistrations /></Suspense> },
      { path: "RecievedPayments", element: <Suspense fallback={<Preloader />}><ReceivedPayments /></Suspense> },
      { path: "PaymentRecords", element: <Suspense fallback={<Preloader />}><PaymentRecords /></Suspense> },
      { path: "Allassignments", element: <Suspense fallback={<Preloader />}><AdminAssignmentSubmissions /></Suspense> },
      { path: "Allusers", element: <Suspense fallback={<Preloader />}><AdminUsers /></Suspense> },
      { path: "messages", element: <Suspense fallback={<Preloader />}><ContactMessages /></Suspense> },
      { path: "AllAnnouncements", element: <Suspense fallback={<Preloader />}><AdminAnnouncementVerif /></Suspense> },
      { path: "zoom/schedule", element: <Suspense fallback={<Preloader />}><ScheduleMeeting /></Suspense> },
      { path: "zoom/join", element: <Suspense fallback={<Preloader />}><JoinMeeting /></Suspense> },
      { path: "zoom/history", element: <Suspense fallback={<Preloader />}><MeetingHistory /></Suspense> },
      { path: "certificates", element: <Suspense fallback={<Preloader />}><Certificates /></Suspense> },
      { path: "messaging", element: <Suspense fallback={<Preloader />}><Messaging /></Suspense> },
      { path: "analytics", element: <Suspense fallback={<Preloader />}><Analytics /></Suspense> },
      { path: "activity-logs", element: <Suspense fallback={<Preloader />}><ActivityLogs /></Suspense> },
    ],
  },
]);

// 🏁 App Entry
function App() {
  return (
    <CourseProvider>
      <CartProvider>
        <Suspense fallback={<Preloader />}>
          <ToastContainer position="top-right" autoClose={2000} />
          <RouterProvider router={router} fallbackElement={<ErrorFallback />} />
        </Suspense>
      </CartProvider>
    </CourseProvider>
  );
}

export default App;
