const bcrypt = require("bcryptjs");
const sequelize = require("./database/db");
const User = require("./models/User");

async function createAdmin() {
  await sequelize.sync();

  const username = "adminUser";
  const password = "adminPass";

  const hashedPassword = await bcrypt.hash(password, 10);

  const [admin, created] = await User.findOrCreate({
    where: { username },
    defaults: {
      password: hashedPassword,
      role: "admin",
      apiKey: null,
      usageCount: 0,
      lastUsedAt: null,
    },
  });

  if (!created) {
    // Update role if already exists but not admin
    if (admin.role !== "admin") {
      admin.role = "admin";
      await admin.save();
      console.log("Updated existing user to admin");
    } else {
      console.log("Admin user already exists");
    }
  } else {
    console.log("Created new admin user");
  }

  process.exit();
}

createAdmin().catch(console.error);
