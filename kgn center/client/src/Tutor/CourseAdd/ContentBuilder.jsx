import { useState, useRef, useContext, useEffect } from "react";
import './ContentBuilder.css';
import { Plus, X } from 'lucide-react';
import { CourseContext } from "./CourseContext";
import { useNavigate } from "react-router-dom";

const contentTypes = ['Lesson', 'Quiz', 'Interactive Quiz', 'Assignment'];

const ContentBuilder = ({ onNext, onBack }) => {
  const { courseData, setCourseData } = useContext(CourseContext);
  const navigate = useNavigate();
  const topics = courseData.topics || [];
  const [regularPrice, setRegularPrice] = useState('');
  const [mainPrice, setMainPrice] = useState('');
  const [expandedTopics, setExpandedTopics] = useState({});
  const [expandedContents, setExpandedContents] = useState({});
  const containerRef = useRef(null);

  // ✅ Cloudinary Optimization Utility
  const optimizeCloudinaryURL = (url) => {
    if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
    return url.replace("/upload/", "/upload/q_auto,f_auto/");
  };

const isValidCloudinaryImageURL = (url) => {
  return (
    typeof url === 'string' &&
    url.includes("res.cloudinary.com") &&
    url.includes("/upload/") &&
    (url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png") || url.endsWith(".webp") || url.endsWith(".gif") || url.endsWith(".avif"))
  );
};

const isValidCloudinaryVideoURL = (url) => {
  return (
    typeof url === 'string' &&
    url.includes("res.cloudinary.com") &&
    url.includes("/upload/") &&
    (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov") || url.endsWith(".avi") || url.endsWith(".mkv"))
  );
};

  function createNewTopic() {
    return {
      id: Date.now(),
      title: '',
      summary: '',
      contents: [],
    };
  }

  const createNewContent = (type) => {
    const base = {
      id: Date.now(),
      type,
      title: '',
      body: '',
    };
    if (type.includes('Quiz')) {
      base.options = ['', ''];
      base.correctOptionIndex = null;
      base.maxAttempts = 1;
      base.timeLimit = 10;
    }
    if (type === 'Lesson') {
      base.videoURL = '';
      base.imageURL = '';
    }
    return base;
  };

  useEffect(() => {
    setRegularPrice(courseData.regularPrice || '');
    setMainPrice(courseData.mainPrice || '');
  }, [courseData]);

const toggleTopic = (id) => {
  setExpandedTopics((prev) => {
    const isAlreadyExpanded = prev[id];
    return isAlreadyExpanded ? {} : { [id]: true };
  });
};


  const toggleContent = (id) => {
    setExpandedContents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

const handleClickOutside = (e) => {
  if (containerRef.current && !containerRef.current.contains(e.target)) {
    setExpandedTopics({});
    setExpandedContents({});
  }
};


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateTopics = (newTopics) => {
    setCourseData((prev) => ({ ...prev, topics: newTopics }));
  };

  const addTopic = () => {
    const newTopic = createNewTopic();
    updateTopics([...topics, newTopic]);
    setExpandedTopics({ [newTopic.id]: true });
  };

  const removeTopic = (id) => {
    updateTopics(topics.filter((topic) => topic.id !== id));
  };

  const updateTopic = (id, field, value) => {
    const updated = topics.map((topic) =>
      topic.id === id ? { ...topic, [field]: value } : topic
    );
    updateTopics(updated);
  };

  const addContent = (topicId, type) => {
    const newContent = createNewContent(type);
    const updated = topics.map((topic) =>
      topic.id === topicId
        ? { ...topic, contents: [...topic.contents, newContent] }
        : topic
    );
    updateTopics(updated);
    setExpandedContents({ [newContent.id]: true });
  };

  const removeContent = (topicId, contentId) => {
    const updated = topics.map((topic) =>
      topic.id === topicId
        ? {
          ...topic,
          contents: topic.contents.filter((c) => c.id !== contentId),
        }
        : topic
    );
    updateTopics(updated);
  };

  const updateContent = (topicId, contentId, field, value) => {
    const updated = topics.map((topic) =>
      topic.id === topicId
        ? {
          ...topic,
          contents: topic.contents.map((content) =>
            content.id === contentId
              ? {
                ...content,
                [field]: typeof value === 'function' ? value(content[field]) : value,
              }
              : content
          ),
        }
        : topic
    );
    updateTopics(updated);
  };

  const updateOption = (topicId, contentId, index, value) => {
    updateContent(topicId, contentId, 'options', (prev) =>
      prev.map((opt, i) => (i === index ? value : opt))
    );
  };

  const addOption = (topicId, contentId) => {
    updateContent(topicId, contentId, 'options', (prev) => [...prev, '']);
  };

  const removeOption = (topicId, contentId, index) => {
    const updated = topics.map((topic) =>
      topic.id === topicId
        ? {
          ...topic,
          contents: topic.contents.map((content) => {
            if (content.id !== contentId) return content;
            const newOptions = content.options.filter((_, i) => i !== index);
            const newCorrect =
              content.correctOptionIndex === index
                ? null
                : content.correctOptionIndex > index
                  ? content.correctOptionIndex - 1
                  : content.correctOptionIndex;
            return { ...content, options: newOptions, correctOptionIndex: newCorrect };
          }),
        }
        : topic
    );
    updateTopics(updated);
  };

  const handleCorrectAnswerChange = (topicId, contentId, index) => {
    updateContent(topicId, contentId, 'correctOptionIndex', index);
  };

  const handleNext = () => {
    setCourseData((prev) => ({
      ...prev,
      regularPrice: parseFloat(regularPrice) || 0,
      mainPrice: parseFloat(mainPrice) || 0,
    }));
    onNext();
  };

  return (
    <div className="content-builder-container" ref={containerRef}>
      {topics.map((topic, tIndex) => (
        <div key={topic.id} className={`topic-card ${expandedTopics[topic.id] ? 'expanded' : ''}`}>
          <div className="topic-header" onClick={() => toggleTopic(topic.id)}>
            <h3>Topic {tIndex + 1}: {topic.title || 'Untitled'}</h3>
            <button onClick={(e) => { e.stopPropagation(); removeTopic(topic.id); }}>
              <X size={18} />
            </button>
          </div>

          {expandedTopics[topic.id] && (
            <div className="topic-body">
              <input
                type="text"
                placeholder="Topic Title"
                value={topic.title}
                onChange={(e) => updateTopic(topic.id, 'title', e.target.value)}
              />
              <textarea
                placeholder="Topic Summary"
                value={topic.summary}
                onChange={(e) => updateTopic(topic.id, 'summary', e.target.value)}
              />
              {contentTypes.map((type) => (
                <button key={type} onClick={() => addContent(topic.id, type)}>
                  + Add {type}
                </button>
              ))}

              {topic.contents.map((content, cIndex) => (
                <div key={content.id} className={`content-item ${expandedContents[content.id] ? 'expanded' : ''}`}>
                  <div className="content-header" onClick={() => toggleContent(content.id)}>
                    <h4>{content.type} {cIndex + 1}: {content.title || 'Untitled'}</h4>
                    <button onClick={(e) => { e.stopPropagation(); removeContent(topic.id, content.id); }}>
                      <X size={14} />
                    </button>
                  </div>

                  {expandedContents[content.id] && (
                    <div className="content-body">
                      <input
                        type="text"
                        placeholder={`${content.type} Title`}
                        value={content.title}
                        onChange={(e) => updateContent(topic.id, content.id, 'title', e.target.value)}
                      />
                      <textarea
                        placeholder="Body/Description"
                        value={content.body}
                        onChange={(e) => updateContent(topic.id, content.id, 'body', e.target.value)}
                      />

                      {content.type === 'Lesson' && (
                        <>
                          <label>Cloudinary Video URL:</label>
                          <input
                            type="text"
                            placeholder="Paste Cloudinary video URL"
                            value={content.videoURL || ''}
                            onChange={(e) =>
                              updateContent(
                                topic.id,
                                content.id,
                                'videoURL',
                                isValidCloudinaryVideoURL(e.target.value)
                                  ? optimizeCloudinaryURL(e.target.value)
                                  : e.target.value
                              )
                            }
                            style={{
                              borderColor: content.videoURL && !isValidCloudinaryVideoURL(content.videoURL) ? "red" : undefined
                            }}
                          />
                          {content.videoURL && isValidCloudinaryVideoURL(content.videoURL) ? (
                            <video
                              src={optimizeCloudinaryURL(content.videoURL)}
                              controls
                              width={300}
                              style={{ marginTop: '10px' }}
                            />
                          ) : content.videoURL && (
                            <p style={{ color: 'red', marginTop: '8px' }}>❌ Please enter a valid Cloudinary video URL.</p>
                          )}

                          <label>Cloudinary Image URL:</label>
                          <input
                            type="text"
                            placeholder="Paste Cloudinary image URL"
                            value={content.imageURL || ''}
                            onChange={(e) =>
                              updateContent(
                                topic.id,
                                content.id,
                                'imageURL',
                                isValidCloudinaryImageURL(e.target.value)
                                  ? optimizeCloudinaryURL(e.target.value)
                                  : e.target.value
                              )
                            }
                            style={{
                              borderColor: content.imageURL && !isValidCloudinaryImageURL(content.imageURL) ? "red" : undefined
                            }}
                          />
                          {content.imageURL && isValidCloudinaryImageURL(content.imageURL) ? (
                            <img
                              src={optimizeCloudinaryURL(content.imageURL)}
                              alt="Lesson Preview"
                              height={100}
                              style={{ marginTop: '10px', borderRadius: '8px' }}
                            />
                          ) : content.imageURL && (
                            <p style={{ color: 'red', marginTop: '8px' }}>❌ Please enter a valid Cloudinary image URL.</p>
                          )}
                        </>
                      )}

                      {content.type.includes('Quiz') && (
                        <>
                          <label>Max Attempts:</label>
                          <input type="number" value={content.maxAttempts}
                            onChange={(e) => updateContent(topic.id, content.id, 'maxAttempts', parseInt(e.target.value) || 1)}
                          />
                          <label>Time Limit (minutes):</label>
                          <input type="number" value={content.timeLimit}
                            onChange={(e) => updateContent(topic.id, content.id, 'timeLimit', parseInt(e.target.value) || 1)}
                          />

                          <h5>Options</h5>
                          {content.options.map((opt, i) => (
                            <div key={i} className="option-row">
                              <input
                                type="radio"
                                name={`correct-${content.id}`}
                                checked={content.correctOptionIndex === i}
                                onChange={() => handleCorrectAnswerChange(topic.id, content.id, i)}
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(topic.id, content.id, i, e.target.value)}
                              />
                              <button onClick={() => removeOption(topic.id, content.id, i)}>❌</button>
                            </div>
                          ))}
                          <button onClick={() => addOption(topic.id, content.id)}>+ Add Option</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button onClick={addTopic} className="add-topic-btn"><Plus size={16} /> Add Topic</button>

      <div className="next-button-wrapper">
        <button onClick={() => navigate('/addcourse')}>← Back</button>
        <button onClick={() => navigate('/additional')}>Next →</button>
      </div>
    </div>
  );
};

export default ContentBuilder;
