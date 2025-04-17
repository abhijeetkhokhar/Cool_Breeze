const mongoose = require('mongoose');
const ApprovedEmail = require('./models/approvedEmailModel');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const emails = [
    { email: "abhijeetkhokhar01@gmail.com", role: "customer" },
    { email: "as.khokhar73@gmail.com", role: "admin" },
    { email: "230110cst@starexuniversity.co.in", role: "rider" },
  ];

  for (const { email, role } of emails) {
    const exists = await ApprovedEmail.findOne({ email });
    if (!exists) {
      await ApprovedEmail.create({ email, role });
      console.log(`Seeded approved email: ${email} with role: ${role}`);
    } else {
      console.log(`Email already exists: ${email}`);
    }
  }

  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
