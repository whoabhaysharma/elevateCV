export const HTML = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ishu Sharma - Google Developer Resume</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            background-color: #f8f9fa;
            color: #343a40;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .resume-container {
            background-color: #ffffff;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            display: grid;
            grid-template-columns: 1fr 2fr;
            max-width: 1000px;
            margin: 40px;
            border-radius: 10px;
            overflow: hidden;
        }

        /* Sidebar Styles */
        .sidebar {
            background-color: #212529;
            color: #ffffff;
            padding: 30px;
        }

        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 20px;
            border: 5px solid #343a40;
        }

        .name {
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 10px;
            color: #ffffff;
        }

        .title {
            font-size: 1.2em;
            color: #adb5bd;
            margin-bottom: 25px;
        }

        .contact-info,
        .skills,
        .education {
            margin-bottom: 30px;
        }

        .sidebar h2 {
            color: #ffffff;
            border-bottom: 2px solid #343a40;
            padding-bottom: 10px;
            margin-bottom: 15px;
            font-size: 1.5em;
        }

        .contact-list,
        .skill-list,
        .education-list {
            list-style: none;
            padding: 0;
        }

        .contact-list li,
        .skill-list li,
        .education-list li {
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            color: #adb5bd;
        }

        .contact-list li i {
            margin-right: 10px;
            color: #ffffff;
        }

        .skill-list li {
            background-color: #343a40;
            padding: 8px 12px;
            border-radius: 20px;
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 0.9em;
        }

        .education-list li strong {
            color: #ffffff;
        }

        /* Content Styles */
        .content {
            padding: 30px;
        }

        .content h2 {
            font-size: 2em;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
            margin-bottom: 20px;
            color: #343a40;
        }

        .section {
            margin-bottom: 30px;
        }

        .section h3 {
            font-size: 1.5em;
            margin-bottom: 10px;
            color: #343a40;
        }

        .experience-item {
            margin-bottom: 20px;
        }

        .experience-item h4 {
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 5px;
            color: #343a40;
        }

        .experience-item .date {
            font-size: 0.9em;
            color: #6c757d;
            margin-bottom: 10px;
        }

        .project-list-content {
            list-style: none;
            padding: 0;
        }

        .project-list-content li {
            margin-bottom: 15px;
        }

        .project-title-content {
            font-weight: bold;
            color: #343a40;
        }

        .project-link {
            color: #007bff;
            text-decoration: none;
        }

        .project-link:hover {
            text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .resume-container {
                grid-template-columns: 1fr;
                margin: 20px;
            }

            .sidebar {
                padding: 20px;
            }

            .content {
                padding: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="resume-container">
        <div class="sidebar">
            <div class="profile">
                <img src="profile-placeholder.jpg" alt="Profile Picture" class="profile-image">
                <h1 class="name">Ishu Sharma</h1>
                <p class="title">Frontend Developer</p>
            </div>

            <div class="contact-info">
                <h2>Contact</h2>
                <ul class="contact-list">
                    <li><i class="fas fa-phone"></i> +91 9911900710</li>
                    <li><i class="fas fa-envelope"></i> ishusharma882003@gmail.com</li>
                    <li><i class="fas fa-map-marker-alt"></i> Kheri Pull, Old Faridabad</li>
                    <li><i class="fab fa-linkedin"></i> <a href="#" target="_blank" style="color: #adb5bd; text-decoration: none;">LinkedIn Profile</a></li>
                    <li><i class="fab fa-github"></i> <a href="#" target="_blank" style="color: #adb5bd; text-decoration: none;">GitHub Profile</a></li>
                    <li><i class="fas fa-globe"></i> <a href="#" target="_blank" style="color: #adb5bd; text-decoration: none;">Personal Website</a></li>
                </ul>
            </div>

            <div class="skills">
                <h2>Skills</h2>
                <ul class="skill-list">
                    <li>HTML5</li>
                    <li>CSS3</li>
                    <li>JavaScript (ES6+)</li>
                    <li>React</li>
                    <li>Bootstrap</li>
                    <li>WordPress</li>
                    <li>Microsoft Excel</li>
                    <li>Canva</li>
                    </ul>
            </div>

            <div class="education">
                <h2>Education</h2>
                <ul class="education-list">
                    <li>
                        <strong>Bachelor of Computer Application</strong><br>
                        K.L. Mehta Dayanand College<br>
                        2021 - 2024
                    </li>
                    <li>
                        <strong>12th (Non-Medical)</strong><br>
                        Mahadev Desai Sr. Sec. School<br>
                        2020 - 2021
                    </li>
                </ul>
            </div>
        </div>

        <div class="content">
            <div class="section" id="summary-content">
                <h2>Summary</h2>
                <p>Enthusiastic and detail-oriented web developer with a strong foundation in front-end technologies and a passion for creating user-friendly and visually appealing websites. As a recent BCA graduate, I am eager to apply my skills and learn new technologies in a challenging and dynamic environment. Proven ability to work effectively in teams and independently, with a focus on delivering high-quality results and contributing to project success.  Seeking opportunities to leverage my expertise in HTML, CSS, JavaScript, and related frameworks to build innovative and impactful web solutions.</p>
            </div>

            <div class="section" id="experience-content">
                <h2>Experience</h2>
                <div class="experience-item">
                    <h4>Web Designer Intern</h4>
                    <p class="date">July 2024 - November 2024</p>
                    <p>Dix Infotech</p>
                    <ul>
                        <li>Developed and maintained responsive web applications using HTML, CSS, and JavaScript, ensuring cross-browser compatibility and optimal user experience across devices.</li>
                        <li>Implemented interactive web features such as dynamic forms, engaging menus, and user-friendly navigation to enhance website usability and user engagement.</li>
                        <li>Collaborated with senior developers and designers to contribute to website redesign projects, focusing on improving site performance and accessibility.</li>
                    </ul>
                </div>
                </div>

            <div class="section" id="projects-content">
                <h2>Projects</h2>
                <ul class="project-list-content">
                    <li>
                        <h3 class="project-title-content">Engineering Website</h3>
                        <a href="https://theindustrialmall.com/" class="project-link">https://theindustrialmall.com/</a>
                        <p>Contributed to the front-end development of an e-commerce website for engineering products using WordPress and Elementor. Focused on creating mobile-responsive designs and improving user navigation. Technologies used: WordPress, Elementor, HTML, CSS.</p>
                    </li>
                    <li>
                        <h3 class="project-title-content">Daksh Engineering Website</h3>
                        <a href="https://daksh.co/" class="project-link">https://daksh.co/</a>
                        <p>Developed and maintained web pages for an engineering consultancy firm using WordPress. Ensured a responsive design and improved user interaction across various devices. Technologies used: WordPress, Elementor, HTML, CSS, JavaScript.</p>
                    </li>
                    <li>
                        <h3 class="project-title-content">Maruti IPTV Website</h3>
                        <a href="https://www.marutiiptv.com/" class="project-link">https://www.marutiiptv.com/</a>
                        <p>Participated in the development of a website for an IPTV service provider, focusing on responsive design and seamless user experience. Improved website performance and accessibility. Technologies used: WordPress, HTML, CSS, JavaScript.</p>
                    </li>
                    </ul>
            </div>
        </div>
    </div>
</body>

</html>`