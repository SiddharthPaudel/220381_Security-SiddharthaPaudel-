// penetration.js
import axios from "axios";

// Replace with your actual running backend URL
const BASE_URL = "http://localhost:5000";

// Test credentials (use valid one for your DB or test one)
const testEmail = '{"$gt": ""}';
const testPassword = "test123";

// Optional: A JWT for protected route testing (use a real one)
const testJWT = "eyJhbGci...";

const headersWithJWT = {
  headers: {
    Authorization: `Bearer ${testJWT}`,
  },
};

const runPenetrationTests = async () => {
  try {
    console.log("=== 🚨 Penetration Testing Started ===");

    // 1. NoSQL Injection Test on Login
    console.log("1️⃣ Testing NoSQL Injection...");
    const res1 = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: testEmail,
      password: testPassword,
    });
    console.log("❌ Potential NoSQL Injection vulnerability!", res1.data);
  } catch (err) {
    console.log("✅ NoSQL Injection blocked!");
  }

  try {
    // 2. Brute Force Simulation (Try wrong password multiple times)
    console.log("2️⃣ Simulating Brute Force...");
    for (let i = 0; i < 6; i++) {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: "test@user.com",
        password: "wrongpassword" + i,
      });
    }
    console.log("❌ Rate limiting missing or too loose!");
  } catch (err) {
    console.log("✅ Rate limiting works.");
  }

  try {
    // 3. XSS Injection Test
    console.log("3️⃣ Testing XSS Injection...");
    const xssRes = await axios.post(`${BASE_URL}/api/manga/comment/1234567890`, {
      userId: "fakeuserid",
      username: "<script>alert('xss')</script>",
      text: "hello"
    });
    console.log("❌ XSS possibly allowed!", xssRes.data);
  } catch (err) {
    console.log("✅ XSS injection blocked or sanitized.");
  }

  try {
    // 4. IDOR Test - accessing another user's data
    console.log("4️⃣ Testing IDOR...");
    const idorRes = await axios.get(`${BASE_URL}/api/user/anotherUserId`, headersWithJWT);
    console.log("❌ IDOR Possible!", idorRes.data);
  } catch (err) {
    console.log("✅ IDOR prevented (Access denied).");
  }

  try {
    // 5. Directory Traversal Test
    console.log("5️⃣ Testing Directory Traversal...");
    const pathTraversal = await axios.get(`${BASE_URL}/uploads/../../.env`);
    console.log("❌ Directory traversal vulnerability found!", pathTraversal.data);
  } catch (err) {
    console.log("✅ Directory traversal blocked.");
  }

  console.log("=== ✅ Penetration Testing Complete ===");
};

runPenetrationTests();
