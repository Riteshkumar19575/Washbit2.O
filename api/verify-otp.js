const { db } = require("./firebase");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: "Email and OTP are required",
      });
    }

    const doc = await db.collection("otp_codes").doc(email).get();

    if (!doc.exists) {
      return res.status(400).json({
        success: false,
        error: "OTP not found",
      });
    }

    const data = doc.data();

    if (Date.now() > data.expiresAt) {
      await db.collection("otp_codes").doc(email).delete();

      return res.status(400).json({
        success: false,
        error: "OTP expired",
      });
    }

    if (data.otp !== otp) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    // OTP verified → delete it
    await db.collection("otp_codes").doc(email).delete();

    return res.json({
      success: true,
      message: "OTP verified",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};