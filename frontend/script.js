// ----------------- حالت شب/روز -----------------
function toggleDarkMode() {
  const body = document.body;
  const isDark = body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "true" : "false");
  document.getElementById("darkModeBtn").textContent = isDark ? "☀️ روز" : "🌙 شب";

  document.getElementById("loginContent")?.classList.toggle("dark-mode", isDark);
  document.getElementById("signupContent")?.classList.toggle("dark-mode", isDark);
}

// ----------------- مدیریت مدال -----------------
function openModal(id) {
  document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
document.getElementById("loginBtn").addEventListener("click", () => openModal('loginModal'));
document.getElementById("signupBtn").addEventListener("click", () => openModal('signupModal'));
document.getElementById("contact-btn").addEventListener("click", () => openModal('contactModal'));

// ----------------- ورود با JWT -----------------
async function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    alert("لطفا نام کاربری و رمز عبور را وارد کنید.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("نام کاربری یا رمز عبور اشتباه است.");

    const data = await response.json();
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    alert("ورود موفقیت‌آمیز بود.");
    closeModal('loginModal');
    // ✅ بروزرسانی ظاهر سایت بعد از لاگین
    document.getElementById("guestButtons").style.display = "none";
    document.getElementById("userInfo").style.display = "flex";
  } catch (error) {
    alert("ورود ناموفق: " + error.message);
  }
}

// ----------------- ثبت‌نام واقعی -----------------
async function signup() {
  const username = document.getElementById("signupUsername").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (!username || !password) {
    alert("لطفا نام کاربری و رمز عبور را وارد کنید.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(Object.values(data).flat().join(" - "));
    }

    alert("ثبت‌نام با موفقیت انجام شد. لطفاً وارد شوید.");
    closeModal("signupModal");
  } catch (error) {
    alert("خطا در ثبت‌نام: " + error.message);
  }
}

// ----------------- افزودن جلسه مطالعه + ارسال به بک‌اند -----------------
async function addStudySession() {
  // if (event) event.preventDefault();

  const title = document.getElementById("titleInput").value.trim();
  const duration = parseInt(document.getElementById("durationInput").value);
  const date = document.getElementById("dateInput").value;
  const startTime = document.getElementById("startTimeInput").value;

  if (!title || !duration || !date || !startTime) {
    alert("لطفا تمام فیلدها را پر کنید.");
    return;
  }

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(start.getTime() + duration * 60000);
  const endTime = end.toTimeString().substring(0, 5);
  const today = new Date().toISOString().split('T')[0];

  // نمایش در جدول
  appendSessionRow({ title, type: "مطالعه", date, start: startTime, end: endTime, duration });
  if (date === today) appendTodayRow({ title, type: "مطالعه", start: startTime, end: endTime, duration });

  let reducedDuration = duration;
  const intervals = [1, 3, 7, 30, 90];
  intervals.forEach((days, index) => {
    reducedDuration = Math.round(reducedDuration * 0.75);
    const reviewDate = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    const reviewDateStr = reviewDate.toISOString().split('T')[0];

    appendSessionRow({
      title,
      type: `مرور ${index + 1}`,
      date: reviewDate.toLocaleDateString("fa-IR"),
      start: "---",
      end: "---",
      duration: reducedDuration
    });

    if (reviewDateStr === today) {
      appendTodayRow({ title, type: `مرور ${index + 1}`, start: "---", end: "---", duration: reducedDuration });
    }
  });

  // ذخیره در سرور
  const token = localStorage.getItem("access");
  if (!token) {
    alert("برای ثبت درس باید وارد شوید.");
    return;
  }

  try {
    const lessonRes = await fetch("http://127.0.0.1:8000/api/lessons/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title, duration_minutes: duration }),
    });

    if (!lessonRes.ok) {
      const errorData = await lessonRes.json();
      alert("خطا در ساخت درس: " + Object.values(errorData).flat().join(" | "));
      return;
    }

    const lessonData = await lessonRes.json();
    const lessonId = lessonData.id;

    await sendSessionToAPI({
      lesson: lessonId,
      session_type: "study",
      date,
      start_time: startTime,
      end_time: endTime,
      duration_minutes: duration,
    });

    reducedDuration = duration;
    for (let i = 0; i < intervals.length; i++) {
      reducedDuration = Math.round(reducedDuration * 0.75);
      const reviewDate = new Date(start.getTime() + intervals[i] * 24 * 60 * 60 * 1000);
      const reviewDateStr = reviewDate.toISOString().split('T')[0];

      await sendSessionToAPI({
        lesson: lessonId,
        session_type: "review",
        date: reviewDateStr,
        start_time: null,
        end_time: null,
        duration_minutes: reducedDuration,
      });
    }

  } catch (err) {
    alert("خطا در ثبت اطلاعات در سرور: " + err.message);
  }

  // بارگذاری مجدد درس‌ها برای نمایش در جدول
  await loadLessons();


  // پاک‌سازی
  document.getElementById("titleInput").value = "";
  document.getElementById("durationInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("startTimeInput").value = "";
}

// ----------------- تابع کمک‌فرستنده جلسه -----------------

async function sendSessionToAPI(session) {
  let token = localStorage.getItem("access");
  if (!token) return;

  try {
    let response = await fetch("http://127.0.0.1:8000/api/sessions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(session),
    });

    // اگر توکن منقضی شده بود، سعی کن با refresh یک توکن جدید بگیری
    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        token = localStorage.getItem("access"); // توکن جدید
        response = await fetch("http://127.0.0.1:8000/api/sessions/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(session),
        });
      } else {
        alert("نشست شما منقضی شده است. لطفاً دوباره وارد شوید.");
        return;
      }
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(Object.values(data).flat().join(" | "));
    }

    console.log("✅ جلسه ثبت شد:", data);

  } catch (error) {
    console.error("❌ خطا در ثبت جلسه:", error.message);
  }
}

// ----------------- نمایش در DOM -----------------
function appendSessionRow({ title, type, date, start, end, duration }) {
  const row = `
    <tr>
      <td><input type="checkbox"></td>
      <td>${title}</td>
      <td>${type}</td>
      <td>${date}</td>
      <td>${start}</td>
      <td>${end}</td>
      <td>${duration}</td>
      <td>---</td>
      <td><button class="btn-delete" onclick="this.closest('tr').remove()">حذف</button></td>
    </tr>
  `;
  document.getElementById("allSessionsBody").insertAdjacentHTML('beforeend', row);
  document.getElementById("allSessionsTable").style.display = "table";
}

function appendTodayRow({ title, type, start, end, duration }) {
  const row = `
    <tr>
      <td><input type="checkbox"></td>
      <td>${title}</td>
      <td>${type}</td>
      <td>${start}</td>
      <td>${end}</td>
      <td>${duration}</td>
    </tr>
  `;
  document.getElementById("todaySessionsBody").insertAdjacentHTML('beforeend', row);
  document.getElementById("todaySection").style.display = "block";
}

function clearToday() {
  document.getElementById("todaySessionsBody").innerHTML = "";
  document.getElementById("todaySection").style.display = "none";
}

function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  alert("خروج انجام شد.");
  location.reload();  // صفحه رو ریفرش کن که دکمه‌ها آپدیت بشن
}


async function loadLessons() {
  const token = localStorage.getItem("access");
  if (!token) return;

  try {
    const res = await fetch("http://127.0.0.1:8000/api/lessons/", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.error("خطا در دریافت درس‌ها:", await res.text());
      return;
    }

    const lessons = await res.json();

    const tbody = document.getElementById("allSessionsBody");
    tbody.innerHTML = "";  // پاک‌سازی جدول

    lessons.forEach(lesson => {
      const row = `
        <tr>
          <td><input type="checkbox"></td>
          <td>${lesson.title}</td>
          <td>مطالعه</td>
          <td>${lesson.created_at.split("T")[0]}</td>
          <td>---</td>
          <td>---</td>
          <td>${lesson.duration_minutes}</td>
          <td>${lesson.sessions.length} مرور</td>
          <td><button class="btn-delete" onclick="this.closest('tr').remove()">حذف</button></td>
        </tr>
      `;

      tbody.insertAdjacentHTML("beforeend", row);

      // اضافه کردن مرورها
      lesson.sessions.forEach((sesh, index) => {
        const reviewRow = `
          <tr>
            <td><input type="checkbox"></td>
            <td>${lesson.title}</td>
            <td>مرور ${index + 1}</td>
            <td>${sesh.date}</td>
            <td>${sesh.start_time || "---"}</td>
            <td>${sesh.end_time || "---"}</td>
            <td>${sesh.duration_minutes}</td>
            <td>---</td>
            <td><button class="btn-delete" onclick="this.closest('tr').remove()">حذف</button></td>
          </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", reviewRow);
      });
    });

    document.getElementById("allSessionsTable").style.display = "table";

  } catch (err) {
    console.error("مشکل در ارتباط با سرور:", err);
  }
}


async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return false;

  try {
    const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem("access", data.access);
    return true;
  } catch {
    return false;
  }
}


function isToday(dateStr) {
  const today = new Date();
  const inputDate = new Date(dateStr);
  return (
    today.getFullYear() === inputDate.getFullYear() &&
    today.getMonth() === inputDate.getMonth() &&
    today.getDate() === inputDate.getDate()
  );
}


// ----------------- بارگذاری اولیه -----------------
window.onload = () => {
  // حالت شب/روز
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeBtn").textContent = "☀️ روز";
    document.getElementById("loginContent")?.classList.add("dark-mode");
    document.getElementById("signupContent")?.classList.add("dark-mode");
  }

  // وضعیت ورود
  const guestBtns = document.getElementById("guestButtons");
  const userInfo = document.getElementById("userInfo");
  const isLoggedIn = localStorage.getItem("access") !== null;
  if (isLoggedIn) {
    document.getElementById("guestButtons").style.display = "none";
    document.getElementById("userInfo").style.display = "flex";
  } else {
    document.getElementById("guestButtons").style.display = "flex";
    document.getElementById("userInfo").style.display = "none";
  }

if (localStorage.getItem("access")){
    loadLessons();  // ✅ نمایش لیست قبلی
  }
    
};

