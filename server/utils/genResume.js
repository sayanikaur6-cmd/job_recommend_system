const PDFDocument = require("pdfkit");
const puppeteer = require("puppeteer");
const generatePeachHTML = (user) => {
    const skills = Array.isArray(user.skills) ? user.skills : [];
    const education = Array.isArray(user.education) ? user.education : [];
    const experience = Array.isArray(user.experience) ? user.experience : [];
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
  margin:0;
  font-family: Arial, sans-serif;
}

.resume {
  width: 794px;
  height: 1123px;
  display: flex;
}

/* LEFT */
.left {
  width: 35%;
  background: #efe5e1;
  padding: 40px 25px;
}

/* RIGHT */
.right {
  width: 65%;
  background: #d3bcb3;
}

/* HEADER */
.header {
  background: #b9998d;
  padding: 40px;
  color: white;
}

.name {
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 2px;
}

.role {
  letter-spacing: 5px;
  margin-top: 10px;
  font-size: 14px;
}

/* PROFILE */
.profile {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  display: block;
  margin: 0 auto 30px;
  object-fit: cover;
}

/* LEFT SECTION */
.section-left {
  margin-top: 30px;
}

.title-left {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 15px;
}

.contact p {
  font-size: 14px;
  margin-bottom: 10px;
}

/* SKILL BAR */
.skill {
  margin-bottom: 20px;
}

.bar {
  height: 8px;
  background: #ccc;
  border-radius: 10px;
}

.fill {
  height: 100%;
  width: 70%;
  background: #b9998d;
  border-radius: 10px;
}

/* RIGHT CONTENT */
.content {
  padding: 30px 40px;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  background: #b9998d;
  padding: 5px 10px;
  font-weight: bold;
  margin-bottom: 10px;
}

.item {
  margin-bottom: 15px;
}

.item h4 {
  margin: 0;
  font-size: 16px;
}

.item p {
  font-size: 13px;
}
</style>
</head>

<body>

<div class="resume">

<!-- LEFT -->
<div class="left">

<img class="profile" src="${user.profilePic
            ? `http://localhost:5000${user.profilePic}`
            : "https://via.placeholder.com/150"
        }" />

<div class="section-left">
  <div class="title-left">Contact Us</div>
  <div class="contact">
    <p><b>Phone</b><br>${user.phone || ""}</p>
    <p><b>Website</b><br>${user.website || ""}</p>
    <p><b>Email</b><br>${user.email || ""}</p>
    <p><b>Address</b><br>${user.location || ""}</p>
  </div>
</div>

<div class="section-left">
  <div class="title-left">Language</div>
  <ul>
    ${user.languages && user.languages.map((lang, index) => (
     ` <li>${lang}</li>`
    ))}
  </ul>
</div>

<div class="section-left">
  <div class="title-left">Skill</div>
  ${(user.skills || []).map(
            (s) => `
  <div class="skill">
    <p>${s.skill}</p>
    <div class="bar"><div class="fill"></div></div>
  </div>
`
        ).join("")}
</div>

</div>

<!-- RIGHT -->
<div class="right">

<div class="header">
  <div class="name">${(user.name || "").toUpperCase()}</div>
  
</div>

<div class="content">

<div class="section">
  <div class="section-title">About Me</div>
  <p>${user.bio || ""}</p>
</div>

<div class="section">
  <div class="section-title">Education</div>
  ${(user.education || []).map(
            (e) => `
      <div class="item">
        <h4>${e.institution} - ${e.year}</h4>
        <p>${e.degree}</p>
      </div>
    `
        ).join("") || `
      <div class="item">
        <h4>Community - 2007</h4>
        <p>The best and professional community in the world</p>
      </div>
    `
        }
</div>

<div class="section">
  <div class="section-title">Experience</div>
  ${(user.experience || []).map(
            (e) => `
      <div class="item">
        <h4>${e.start_date} ${e.company_name}</h4>
        <p>${e.role}</p>
      </div>
    `
        ).join("") || `
      <div class="item">
        <h4>2012 studio Shodwe</h4>
        <p>Professional marketing Business</p>
      </div>
    `
        }
</div>

</div>

</div>

</div>

</body>
</html>
`;
};
const generatePeachResume = async (user, res) => {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();

        const html = generatePeachHTML(user);

        await page.setContent(html, {
            waitUntil: "networkidle0",
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px",
            },
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=peach-resume.pdf",
        });

        return res.send(pdfBuffer);
    } catch (err) {
        if (browser) await browser.close();

        console.error(err);
        return res.status(500).json({
            message: "Peach resume PDF generate failed",
        });
    }
};
const generateHTML = (user) => {
    const skills = Array.isArray(user.skills) ? user.skills : [];
    const education = Array.isArray(user.education) ? user.education : [];
    const experience = Array.isArray(user.experience) ? user.experience : [];

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <title>Minimalist CV Resume</title>

    <style>
        * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
        }

        body {
        background: #ddd;
        }

        .resume {
        width: 794px;
        min-height: 1123px;
        margin: 0 auto;
        background: #fff;
        display: flex;
        color: #333;
        }

        .left {
        width: 38%;
        background: #e9e9e9;
        padding: 55px 45px;
        }

        .right {
        width: 62%;
        padding: 95px 55px;
        }

        .profile {
        width: 210px;
        height: 210px;
        border-radius: 50%;
        border: 12px solid #fff;
        object-fit: cover;
        display: block;
        margin: 0 auto 75px;
        }

        .section {
        margin-bottom: 45px;
        }

        .section-title {
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        }

        .icon {
        font-size: 22px;
        }

        .about {
        font-size: 14px;
        line-height: 1.35;
        text-align: justify;
        }

        .contact p,
        .skills li,
        .language li {
        font-size: 15px;
        margin-bottom: 14px;
        }

        ul {
        padding-left: 22px;
        }

        .name {
        font-size: 48px;
        font-weight: 900;
        line-height: 0.95;
        margin-bottom: 12px;
        }

        .role {
        font-size: 22px;
        margin-bottom: 110px;
        }

        .timeline-item {
        display: flex;
        gap: 25px;
        margin-bottom: 38px;
        }

        .timeline-line {
        width: 15px;
        position: relative;
        display: flex;
        justify-content: center;
        }

        .timeline-line::before {
        content: "";
        width: 3px;
        height: 100%;
        background: #333;
        position: absolute;
        top: 12px;
        }

        .timeline-line::after {
        content: "";
        width: 9px;
        height: 9px;
        background: #333;
        border-radius: 50%;
        position: absolute;
        top: 0;
        }

        .timeline-content h3 {
        font-size: 21px;
        font-weight: 800;
        margin-bottom: 8px;
        }

        .timeline-content h4 {
        font-size: 14px;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 6px;
        }

        .timeline-content p {
        font-size: 15px;
        margin-bottom: 5px;
        }

        .timeline-content ul {
        margin-top: 10px;
        }

        .timeline-content li {
        font-size: 15px;
        margin-bottom: 6px;
        line-height: 1.4;
        }
    </style>
    </head>

    <body>
    <div class="resume">

        <div class="left">
        <img
            class="profile"
            src="${user.profilePic ? `http://localhost:5000${user.profilePic}` : "https://via.placeholder.com/210"}"
            alt="Profile Photo"
        />

        <div class="section">
            <h2 class="section-title">
            <span class="icon">👤</span> About Me
            </h2>
            <p class="about">${user.bio || user.about || "Write about yourself..."}</p>
        </div>

        <div class="section contact">
            <h2 class="section-title">
            <span class="icon">▣</span> Contact
            </h2>
            <p>📞 ${user.phone || "N/A"}</p>
            <p>✉️ ${user.email || "N/A"}</p>
            <p>📍 ${user.location || "N/A"}</p>
        </div>

        <div class="section skills">
            <h2 class="section-title">
            <span class="icon">⚙</span> Skills
            </h2>
            <ul>
            ${skills.length
            ? skills.map((s) => `<li>${typeof s === "string" ? s : s.skill || s.name}</li>`).join("")
            : "<li>No skills added</li>"
        }
            </ul>
        </div>

        <div class="section language">
            <h2 class="section-title">
            <span class="icon">A☆</span> Language
            </h2>
            <ul>
            ${user.languages && user.languages.map((lang, index) => (
              ` <li>${lang}</li>`
              ))}
            </ul>
        </div>
        </div>

        <div class="right">
        <h1 class="name">
            ${(user.name || "Your Name").split(" ").slice(0, 1).join(" ")}<br />
            ${(user.name || "").split(" ").slice(1).join(" ")}
        </h1>

        <p class="role">${user.role || user.job_title || "Professional"}</p>

        <div class="section">
            <h2 class="section-title">🎓 Education</h2>

            ${education.length
            ? education.map((e) => `
                <div class="timeline-item">
                    <div class="timeline-line"></div>
                    <div class="timeline-content">
                    <h3>${e.year || e.start_date || ""}</h3>
                    <h4>${e.institution || e.school || "Institution"}</h4>
                    <p>${e.degree || "Degree"}</p>
                    <p>${e.grade || e.cgpa || ""}</p>
                    </div>
                </div>
                `).join("")
            : "<p>No education added</p>"
        }
        </div>

        <div class="section">
            <h2 class="section-title">💼 Experience</h2>

            ${experience.length
            ? experience.map((e) => `
                <div class="timeline-item">
                    <div class="timeline-line"></div>
                    <div class="timeline-content">
                    <h3>${e.start_date || ""} - ${e.end_date || "Present"}</h3>
                    <h4>${e.role || "Role"}</h4>
                    <p>${e.company_name || e.company || "Company"}</p>
                    <ul>
                        <li>${e.description || "Work description"}</li>
                    </ul>
                    </div>
                </div>
                `).join("")
            : "<p>No experience added</p>"
        }
        </div>

        </div>
    </div>
    </body>
    </html>
    `;
};
const generateMinimalResume = async (user, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // 🔥 HTML dynamically inject user data
        const html = `
    ${generateHTML(user)}
    `;

        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=resume.pdf",
        });

        res.send(pdfBuffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "PDF generate failed" });
    }
};
const generateBlackHTML = (user) => {
    const skills = Array.isArray(user.skills) ? user.skills : [];
    const education = Array.isArray(user.education) ? user.education : [];
    const experience = Array.isArray(user.experience) ? user.experience : [];

    const skillName = (s) =>
        typeof s === "string" ? s : s.skill || s.name || "Skill";

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
*{margin:0;padding:0;box-sizing:border-box}

body{
  margin:0;
  background:#ddd;
  font-family:Arial, Helvetica, sans-serif;
}

.resume{
  width:794px;
  height:1123px;
  margin:0 auto;
  background:#fff;
  display:flex;
  position:relative;
  overflow:hidden;
  color:#111;
}

.left{
  width:340px;
  height:100%;
  background:#191919;
  color:#fff;
  padding:0 50px;
  position:relative;
  z-index:2;
}

.right{
  width:454px;
  height:100%;
  background:#fff;
  padding:280px 38px 35px 18px;
  position:relative;
  z-index:1;
}

.header{
  position:absolute;
  top:87px;
  left:0;
  width:794px;
  height:138px;
  background:#153f8d;
  z-index:5;
  display:flex;
  align-items:center;
  box-shadow:0 5px 12px rgba(0,0,0,.25);
}

.header-cut{
  width:335px;
  height:138px;
  background:linear-gradient(108deg,#0a367c 0%,#0a367c 70%,transparent 71%);
}

.header-text{
  color:white;
  margin-left:-25px;
  padding-top:5px;
}

.name{
  font-size:43px;
  font-weight:900;
  letter-spacing:1px;
  line-height:1.12;
}

.role{
  font-size:18px;
  margin-left:100px;
  margin-top:2px;
}

.profile-wrap{
  position:absolute;
  top:52px;
  left:86px;
  width:218px;
  height:218px;
  border-radius:50%;
  background:#153f8d;
  padding:5px;
  z-index:10;
}

.profile{
  width:100%;
  height:100%;
  border-radius:50%;
  object-fit:cover;
}

.left-content{
  margin-top:285px;
  text-align:center;
}

.about-title{
  font-size:23px;
  font-weight:400;
  margin-bottom:14px;
}

.about{
  font-size:14px;
  line-height:1.28;
  color:#f0f0f0;
  margin-bottom:25px;
}

.contact{
  text-align:left;
  margin-left:0;
  margin-bottom:30px;
}

.contact-row{
  display:flex;
  align-items:center;
  gap:14px;
  margin-bottom:16px;
  font-size:13px;
}

.contact-icon{
  width:26px;
  height:26px;
  background:#0b8ed8;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#111;
  font-size:14px;
  font-weight:bold;
}

.pill-title{
  border:2px solid #0b8ed8;
  border-radius:25px;
  padding:7px 0;
  text-align:center;
  font-size:17px;
  margin:24px 0 18px;
}

.left-list{
  text-align:left;
  padding-left:55px;
  font-size:15px;
}

.left-list li{
  margin-bottom:10px;
}

.section{
  margin-bottom:28px;
}

.section-title{
  background:#153f8d;
  color:white;
  width:200px;
  padding:7px 0;
  text-align:center;
  border-radius:22px;
  font-size:16px;
  font-weight:400;
  margin-bottom:22px;
}

.item{
  margin-bottom:22px;
}

.item h3{
  font-size:15px;
  font-weight:900;
  line-height:1.2;
}

.item .place,
.item .date{
  font-size:15px;
  font-weight:900;
  line-height:1.2;
}

.item p{
  font-size:13px;
  line-height:1.28;
  margin-top:7px;
}

.skill-summary-row{
  display:flex;
  align-items:center;
  margin-bottom:12px;
  font-size:13px;
}

.skill-summary-name{
  width:175px;
}

.skill-bar{
  width:85px;
  height:7px;
  background:#d8d8d8;
  border-radius:10px;
  overflow:hidden;
  margin-right:8px;
}

.skill-fill{
  height:100%;
  background:#2478bd;
  border-radius:10px;
}

.percent{
  font-size:20px;
  color:#4d6695;
}
</style>
</head>

<body>
<div class="resume">

  <div class="header">
    <div class="header-cut"></div>
    <div class="header-text">
      <div class="name">
        ${(user.name || "RICHARD SANCHEZ").toUpperCase().split(" ").slice(0, 1).join(" ")}<br>
        ${(user.name || "RICHARD SANCHEZ").toUpperCase().split(" ").slice(1).join(" ")}
      </div>
      <div class="role">${user.role || user.job_title || "Product Designer"}</div>
    </div>
  </div>

  <div class="profile-wrap">
    <img class="profile" src="${user.profilePic
            ? `http://localhost:5000${user.profilePic}`
            : "https://via.placeholder.com/210"
        }"/>
  </div>

  <div class="left">
    <div class="left-content">
      <div class="about-title">About Me</div>
      <p class="about">
        ${user.bio || user.about || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue dui."}
      </p>

      <div class="contact">
        <div class="contact-row"><div class="contact-icon">☎</div><div>${user.phone || "+123-456-7890"}</div></div>
        <div class="contact-row"><div class="contact-icon">✉</div><div>${user.email || "hello@reallygreatsite.com"}</div></div>
        <div class="contact-row"><div class="contact-icon">⌖</div><div>${user.location || "123 Anywhere St., Any City"}</div></div>
      </div>

      <div class="pill-title">Language</div>
      <ul class="left-list">
        ${user.languages && user.languages.map((lang, index) => (
        ` <li>${lang}</li>`
        ))}
      </ul>

      <div class="pill-title">Expertise</div>
      <ul class="left-list">
        ${skills.length
            ? skills.slice(0, 6).map((s) => `<li>${skillName(s)}</li>`).join("")
            : `
              <li>Management Skills</li>
              <li>Creativity</li>
              <li>Digital Marketing</li>
              <li>Negotiation</li>
              <li>Critical Thinking</li>
              <li>Leadership</li>
            `
        }
      </ul>
    </div>
  </div>

  <div class="right">
    <div class="section">
      <div class="section-title">Experience</div>
      ${experience.length
            ? experience.map((e) => `
            <div class="item">
              <h3>${e.company_name || e.company || "Company"}</h3>
              <div class="place">${e.location || ""}</div>
              <div class="date">${e.start_date || ""} - ${e.end_date || "Present"}</div>
              <p>${e.description || ""}</p>
            </div>
          `).join("")
            : `
            <div class="item"><h3>Arowwai Industries</h3><div class="place">Sydney - Australia</div><div class="date">2020 - 2022</div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.</p></div>
            <div class="item"><h3>Wardiere Inc.</h3><div class="place">Sydney - Australia</div><div class="date">2016 - 2020</div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.</p></div>
            <div class="item"><h3>Studio Showde</h3><div class="place">Sydney - Australia</div><div class="date">2010 - 2015</div><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sit amet quam rhoncus, egestas dui eget, malesuada justo. Ut aliquam augue.</p></div>
          `
        }
    </div>

    <div class="section">
      <div class="section-title">Education</div>
      ${education.length
            ? education.map((e) => `
            <div class="item">
              <h3>${e.institution || e.school || "University"}</h3>
              <p>${e.degree || ""}</p>
              <p>${e.year || e.start_date || ""}${e.end_date ? " - " + e.end_date : ""}</p>
            </div>
          `).join("")
            : `
            <div class="item"><h3>Borcelle University</h3><p>Bachelor of Business Management</p><p>2014 - 2023</p></div>
            <div class="item"><h3>Borcelle University</h3><p>Master of Business Management</p><p>2014 - 2018</p></div>
          `
        }
    </div>

    <div class="section">
      <div class="section-title">Skills Summary</div>
      ${skills.length
            ? skills.slice(0, 2).map((s, i) => `
            <div class="skill-summary-row">
              <div class="skill-summary-name">${skillName(s)}</div>
              <div class="skill-bar"><div class="skill-fill" style="width:${i === 0 ? "78" : "81"}%"></div></div>
              <div class="percent">${i === 0 ? "78" : "81"} %</div>
            </div>
          `).join("")
            : `
            <div class="skill-summary-row"><div class="skill-summary-name">Design Process</div><div class="skill-bar"><div class="skill-fill" style="width:78%"></div></div><div class="percent">78 %</div></div>
            <div class="skill-summary-row"><div class="skill-summary-name">Project Management</div><div class="skill-bar"><div class="skill-fill" style="width:81%"></div></div><div class="percent">81 %</div></div>
          `
        }
    </div>
  </div>
</div>
</body>
</html>
`;
};
const generateBlackResume = async (user, res) => {
    let browser;

    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const html = generateBlackHTML(user);

        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            width: "794px",
            height: "1123px",
            printBackground: true,
            margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=black-resume.pdf",
        });

        return res.send(pdfBuffer);
    } catch (err) {
        if (browser) await browser.close();
        console.error(err);
        return res.status(500).json({ message: "Black resume PDF generate failed" });
    }
};
module.exports = {
    generatePeachResume,
    generateMinimalResume,
    generateBlackResume
};