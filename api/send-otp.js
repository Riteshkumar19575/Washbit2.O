const { db } = require("./firebase");

module.exports = async (req, res) => {
  try {
    console.log("STEP 1");

    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed",
      });
    }

    console.log("STEP 2");

    const { email } = req.body || {};

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    console.log("STEP 3");

    // Firestore aur Brevo dono skip
    console.log("STEP 4");

    return res.status(200).json({
      success: true,
      message: "Function reached successfully",
    });

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
