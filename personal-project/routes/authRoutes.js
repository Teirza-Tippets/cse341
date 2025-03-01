const express = require("express");
const passport = require("passport");

const router = express.Router();

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      res.redirect("/dashboard"); // Redirect to dashboard after login
    }
  );
  

// Logout route
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

module.exports = router;

