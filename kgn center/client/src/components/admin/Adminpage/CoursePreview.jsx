// src/pages/CoursePreview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const CoursePreview = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const allowDraft = searchParams.get("allowDraft") === "true";

  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/api/courses/${id}`);
        const data = res.data;

        if (data.status !== "Published" && !allowDraft) {
          setError("⛔ You don't have permission to view this draft course.");
        } else {
          setCourse(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load course.");
      }
    };
    fetchCourse();
  }, [id, allowDraft]);

  if (error) return <h2 style={{ padding: "2rem" }}>{error}</h2>;
  if (!course) return <h2 style={{ padding: "2rem" }}>Loading course...</h2>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{course.title}</h1>
      <p>Status: {course.status}</p>
      <p>Category: {course.category}</p>
      <p>Price: ₹{course.mainPrice}</p>
      <p>Created By: {course.createdBy?.name}</p>
      <div dangerouslySetInnerHTML={{ __html: course.description }} />
    </div>
  );
};

export default CoursePreview;
