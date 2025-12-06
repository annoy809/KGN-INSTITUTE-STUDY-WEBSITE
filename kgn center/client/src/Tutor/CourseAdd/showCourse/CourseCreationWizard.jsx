import React, { useEffect, useContext, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AddCourseForm from '../AddCourseForm';
import { CourseContext } from '../CourseContext';
import Preloader from '../../../components/Preloader';

const CourseCreationWizard = () => {
  const { setCourseData, setTopics } = useContext(CourseContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const courseId = searchParams.get('id');

  useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
          setCourseData(res.data);
          setTopics(res.data.topics || []);
        } catch (err) {
          console.error('❌ Error fetching course:', err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourse();
  }, [courseId, setCourseData, setTopics]);

  if (loading) return <Preloader />;

  return <AddCourseForm />;
};

export default CourseCreationWizard;
