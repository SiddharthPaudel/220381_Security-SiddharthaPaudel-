// penetration.js
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const BASE_URL = "http://localhost:5000";

// Replace these IDs/tokens with real ones for your testing
const testMangaId = "yourMangaIdHere";
const testUserId = "yourUserIdHere";
const testJWT = "yourValidJWTHere";

const headersWithJWT = {
  headers: {
    Authorization: `Bearer ${testJWT}`,
  },
};

async function runPenetrationTests() {
  console.log("=== 🚨 Penetration Testing Started ===");

  // 1. NoSQL Injection on Login
  try {
    console.log("1️⃣ Testing NoSQL Injection on login...");
    await axios.post(`${BASE_URL}/api/auth/login`, {
      email: '{"$gt": ""}',
      password: "anything",
    });
    console.log("❌ Potential NoSQL Injection vulnerability!");
  } catch {
    console.log("✅ NoSQL Injection blocked!");
  }

  // 2. Brute Force Simulation on login
  try {
    console.log("2️⃣ Simulating Brute Force login...");
    for (let i = 0; i < 6; i++) {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: "test@user.com",
        password: "wrongpassword" + i,
      });
    }
    console.log("❌ Rate limiting missing or too loose!");
  } catch {
    console.log("✅ Rate limiting works.");
  }

  // 3. XSS Injection in Manga Comment
  try {
    console.log("3️⃣ Testing XSS Injection in comment...");
    await axios.post(
      `${BASE_URL}/api/manga/${testMangaId}/comment`,
      {
        userId: testUserId,
        username: "<script>alert('xss')</script>",
        text: "normal comment",
      },
      headersWithJWT
    );
    console.log("❌ XSS possibly allowed in comment!");
  } catch {
    console.log("✅ XSS injection blocked or sanitized.");
  }

  // 4. IDOR - unauthorized manga delete
  try {
    console.log("4️⃣ Attempting unauthorized DELETE manga...");
    await axios.delete(`${BASE_URL}/api/manga/delete/${testMangaId}`);
    console.log("❌ Unauthorized delete allowed!");
  } catch {
    console.log("✅ Unauthorized delete blocked.");
  }

  // 5. Directory Traversal on uploads
  try {
    console.log("5️⃣ Testing Directory Traversal on uploads...");
    await axios.get(`${BASE_URL}/uploads/../../.env`);
    console.log("❌ Directory traversal vulnerability found!");
  } catch {
    console.log("✅ Directory traversal blocked.");
  }

  // 6. XSS Injection in username when adding manga (cover upload test)
  try {
    console.log("6️⃣ Testing XSS Injection in addManga (cover upload)...");
    const form = new FormData();
    form.append("title", "Test Manga");
    form.append("author", "<script>alert('xss')</script>");
    form.append("coverImage", fs.createReadStream("./test-image.jpg")); // replace with real image path

    await axios.post(`${BASE_URL}/api/manga/`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${testJWT}`,
      },
    });
    console.log("❌ XSS injection possibly allowed in addManga!");
  } catch {
    console.log("✅ XSS injection blocked in addManga.");
  }

  // 7. Invalid ZIP upload in addChapter
  try {
    console.log("7️⃣ Upload invalid ZIP file for chapter...");
    const form = new FormData();
    form.append("zipFile", fs.createReadStream("./test.txt")); // dummy txt file

    await axios.post(`${BASE_URL}/api/manga/${testMangaId}/chapters`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${testJWT}`,
      },
    });
    console.log("❌ Invalid ZIP upload allowed!");
  } catch {
    console.log("✅ Invalid ZIP upload blocked.");
  }

  // 8. Duplicate rating test
  try {
    console.log("8️⃣ Testing duplicate rating...");
    await axios.post(
      `${BASE_URL}/api/manga/rate/${testMangaId}`,
      {
        userId: testUserId,
        rating: 5,
        review: "Awesome!",
      },
      headersWithJWT
    );
    await axios.post(
      `${BASE_URL}/api/manga/rate/${testMangaId}`,
      {
        userId: testUserId,
        rating: 1,
        review: "Changed my mind",
      },
      headersWithJWT
    );
    console.log("❌ Duplicate rating might be allowed!");
  } catch {
    console.log("✅ Duplicate rating prevented.");
  }

  // 9. Manga Rent Route Injection / Validation Test
  try {
    console.log("9️⃣ Testing rent route injection and validation...");
    await axios.post(
      `${BASE_URL}/api/manga/${testMangaId}/rent`,
      {
        userId: { "$ne": null },
        duration: -10,
        price: -100,
      },
      headersWithJWT
    );
    console.log("❌ Rent route input validation missing!");
  } catch {
    console.log("✅ Rent route blocked suspicious input.");
  }

  console.log("=== ✅ Penetration Testing Complete ===");
}

runPenetrationTests();
