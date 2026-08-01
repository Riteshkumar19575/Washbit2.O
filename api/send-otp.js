const brevo = require("@getbrevo/brevo");
const { db } = require("./firebase");

module.exports = async (req, res) => {
  try {
    console.log("STEP 1");

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    console.log("STEP 2");

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Save OTP in Firestore
    await db.collection("otp_codes").doc(email).set({
      otp,
      email,
      createdAt: Date.now(),
      expiresAt,
    });

    console.log("STEP 3");

    // Send email using Brevo
    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    console.log("STEP 4");

    await apiInstance.sendTransacEmail({
      sender: {
        email: "riteshkumar19575@gmail.com",
        name: "Washbit",
      },
      to: [{ email }],
      subject: "Your Washbit OTP",
      htmlContent: `
        <h2>Washbit Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("STEP 5");

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error("SEND OTP ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
