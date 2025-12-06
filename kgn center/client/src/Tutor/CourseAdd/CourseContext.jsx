import React, { createContext, useState, useEffect } from "react";

export const CourseContext = createContext();

const now = new Date();
const defaultDate = now.toISOString();

// ✅ Default course template (Cloudinary URLs)
const newCourseTemplate = {
  title: "Untitled Course",
  slug: "",
  description: "This is a course description.",
  visibility: "Public",
  category: "General",
  pricingModel: "Free",
  mainPrice: 0,
  regularPrice: 0,
  difficultyLevel: "Beginner",
  featuredImage: "",       // Cloudinary thumbnail
  introVideo: "",          // Cloudinary video
  enrollmentType: "Open",
  enrollmentDeadline: "",
  maxStudents: 100,
  enrollStudent: true,
  qnaEnabled: true,
  isPublic: true,
  startDate: defaultDate,
  endDate: "",
  dripType: "none",
  topics: [
    {
      title: "Topic 1",
      summary: "Introduction to the course",
      availableFrom: defaultDate,
      contents: [
        {
          type: "Lesson",
          title: "Welcome Lesson",
          body: "This is your first lesson",
          videoURL: "",           // ✅ Frontend-only field
          imageURL: "",           // ✅ Frontend-only field
        },
        {
          type: "Quiz",
          title: "Starter Quiz",
          body: "Answer the following",
          options: ["Option 1", "Option 2"],
          correctOptionIndex: 0,
          maxAttempts: 1,
          timeLimit: 5,
        }
      ]
    }
  ],
  overview: "This course covers the basics.",
  whatWillLearn: ["Understand basics", "Build foundation"],
  targetAudience: ["Beginners", "Students"],
  duration: { hours: 1, minutes: 30 },
  materialsIncluded: ["PDF Notes", "Practice Code"],
  requirements: ["Internet", "Basic English"],
  studentName: "John Doe",
  courseName: "My Course",
  certDurationMonths: 6,
  certType: "Completion",
  status: "draft",
  tags: ["default", "auto"],
  createdAt: defaultDate,
  updatedAt: defaultDate
};

const newAdditionalInfoTemplate = {
  overview: '',
  whatYouLearn: '',
  targetAudience: '',
  durationHours: '',
  durationMinutes: '',
  materials: '',
  requirements: '',
  studentName: '',
  courseName: '',
  startDate: '',
  endDate: '',
  certDurationMonths: '',
  certType: '',
};

export const CourseProvider = ({ children }) => {
  const [courseData, setCourseData] = useState(() => {
    const saved = localStorage.getItem("courseData");
    return saved ? JSON.parse(saved) : newCourseTemplate;
  });

  const [additionalInfoForm, setAdditionalInfoForm] = useState(() => {
    const saved = localStorage.getItem("additionalInfoForm");
    return saved ? JSON.parse(saved) : newAdditionalInfoTemplate;
  });

  useEffect(() => {
    localStorage.setItem("courseData", JSON.stringify(courseData));
  }, [courseData]);

  useEffect(() => {
    localStorage.setItem("additionalInfoForm", JSON.stringify(additionalInfoForm));
  }, [additionalInfoForm]);

  const resetCourse = () => {
    setCourseData(newCourseTemplate);
    setAdditionalInfoForm(newAdditionalInfoTemplate);
    localStorage.removeItem("courseData");
    localStorage.removeItem("additionalInfoForm");
  };

  // ✅ Converts videoURL → video and imageURL → featuredImage for backend
  const normalizeCourseDataForBackend = () => {
    const normalized = {
      ...courseData,
      topics: courseData.topics.map(topic => ({
        ...topic,
        contents: topic.contents.map(content => {
          if (content.type === "Lesson") {
            return {
              ...content,
              video: content.videoURL || "",
              featuredImage: content.imageURL || "",
            };
          }
          return content;
        })
      }))
    };
    return normalized;
  };

  return (
    <CourseContext.Provider
      value={{
        courseData,
        setCourseData,
        resetCourse,
        additionalInfoForm,
        setAdditionalInfoForm,
        normalizeCourseDataForBackend
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export default CourseProvider;
