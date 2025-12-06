const mongoose = require("mongoose");
const slugify = require("slugify");

// Schema for each content item inside a topic
const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Lesson", "Quiz", "Interactive Quiz", "Assignment"],
    required: true,
  },
  title: { type: String, required: true },
  body: String,
  video: String,
  featuredImage: String,
  options: [String],
  correctOptionIndex: Number,
  maxAttempts: Number,
  timeLimit: Number,
  availableFrom: Date,
});

// Schema for each topic inside a course
const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: String,
  contents: [contentSchema],
  availableFrom: Date,
});

// Main course schema
const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    description: String,
    category: String,
    pricingModel: {
      type: String,
      enum: ["Free", "Paid"],
      required: true,
    },
    mainPrice: { type: Number, default: 0 },
    regularPrice: { type: Number, default: 0 },
    
    difficultyLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    featuredImage: String,
    introVideo: String,
    enrollmentType: {
      type: String,
      enum: ["Open", "Invite Only", "Paid Access"],
      default: "Open",
    },
    enrollmentDeadline: Date,
    startDate: Date,
    endDate: Date,
    dripType: {
      type: String,
      enum: ["none", "scheduled", "sequential", "immediate"],
      default: "none",
    },
    topics: [topicSchema],
    overview: String,
    whatWillLearn: [String],
    targetAudience: [String],
    duration: {
      hours: Number,
      minutes: Number,
    },
    materialsIncluded: [String],
    requirements: [String],
    studentName: String,
    courseName: String,
    certDurationMonths: Number,
    certType: {
      type: String,
      enum: ["Completion", "Participation", "Excellence", "Merit"],
      default: "Completion",
    },
    draft: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔁 Slug generation middleware
courseSchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let newSlug = baseSlug;
    let counter = 1;

    const Course = mongoose.model("Course", courseSchema);
    let existing = await Course.findOne({ slug: newSlug });

    while (existing && existing._id.toString() !== this._id.toString()) {
      newSlug = `${baseSlug}-${counter}`;
      counter++;
      existing = await Course.findOne({ slug: newSlug });
    }

    this.slug = newSlug;
  }

  // Price fix for paid courses
  if (this.pricingModel === "Paid") {
    if (!this.regularPrice) this.regularPrice = 1999;
    if (!this.mainPrice) this.mainPrice = 499;
    if (this.mainPrice > this.regularPrice) {
      [this.mainPrice, this.regularPrice] = [this.regularPrice, this.mainPrice];
    }
  } else {
    this.mainPrice = 0;
    this.regularPrice = 0;
  }

  next();
});

// 🧠 Virtuals & Methods

courseSchema.virtual("totalLessons").get(function () {
  let count = 0;
  (this.topics || []).forEach((topic) => {
    (topic.contents || []).forEach((c) => {
      if (c.type === "Lesson") count++;
    });
  });
  return count;
});

courseSchema.methods.calculateTotalDuration = function () {
  let totalMinutes = 0;
  (this.topics || []).forEach((topic) => {
    (topic.contents || []).forEach((content) => {
      if (content.type === "Lesson" && content.video) totalMinutes += 10;
      if (content.timeLimit) totalMinutes += content.timeLimit;
    });
  });
  this.duration = {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  };
  return this.duration;
};

courseSchema.methods.getAssessments = function () {
  const assessments = [];
  (this.topics || []).forEach((topic) => {
    (topic.contents || []).forEach((content) => {
      if (["Quiz", "Interactive Quiz", "Assignment"].includes(content.type)) {
        assessments.push(content);
      }
    });
  });
  return assessments;
};

courseSchema.methods.generateCertificateText = function () {
  if (!this.studentName || !this.courseName || !this.certType) return "";
  return `🎓 This is to certify that ${this.studentName} has successfully completed the "${this.courseName}" course and received a certificate of ${this.certType}.`;
};

// ✅ Export without Overwrite Error
module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);
