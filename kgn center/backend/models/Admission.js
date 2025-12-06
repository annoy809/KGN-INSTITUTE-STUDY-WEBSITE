const mongoose = require("mongoose");

const AdmissionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' },
  admissionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Admission", AdmissionSchema);
