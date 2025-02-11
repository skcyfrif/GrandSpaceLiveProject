// Define the custom header element
class MyHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
<header>
        <div class="sg_top_header">
            <div class="gs_spc_lr gs_headerbody">
                <div class="gs_header_top_sec">
                    <div class="sg_top_left_box">
                        <ul class="gs_inline_items">
                            <li class="icon_list_item">
                                <a href="tel:+91 9583215595">
                                    <div class="gs_contact_number"><i class="fa fa-phone"
                                            aria-hidden="true"></i></div>
                                    +91 9583215595
                                </a>
                            </li>
                            <li class="icon_list_item">
                                <a href="mailti:grandspace23@gmail.com">
                                    <div class="gs_contact_number"><img src="assets/images/iconsvg/mailto.svg" alt=""></div>
                                    grandspace23@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="social_icon_heading">
                    <h6>Follow Us:</h6>
                    <ul class="gs_social_med_link">
                        <li><a href="#"><i class="fa fa-instagram" aria-hidden="true"></i></a></li>
                        <li><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
                        <li>
                            <a href="#">
                                <i title="X" aria-hidden="true">
                                    <img src="assets/images/iconsvg/twiter.svg" alt="">
                                </i>
                            </a>
                        </li>
                        <li><a href="#"><i class="fa fa-whatsapp" aria-hidden="true"></i></a></li>
                        <li><a href="#"><i class="fa fa-youtube-play" aria-hidden="true"></i></a></li>
                    </ul>
                </div>
            </div>
        </div>
            <div class="gs_header_ses gs_spc_lr" id="header">
                 <nav class="navbar navbar-expand-lg navbar-darkv">
                        <div class="container-fluid">
                            <div class="logo_img_contener">
                                <a class="navbar-brand" href="index.html"><img src="assets/images/sg_logo.png" alt=""></a>
                            </div>
                            <!-- Toggle button for mobile offcanvas menu -->
                            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
                                aria-controls="offcanvasNavbar">
                                <span class="navbar-toggler-icon"></span>
                            </button>

                            <!-- Desktop Menu (visible on larger screens) -->
                            <div class="collapse navbar-collapse d-none d-lg-flex justify-content-end sg_desktop_Hopemenu">
                                <ul class="navbar-nav sg_desktop_menu">
                                    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                                    <li class="nav-item"><a class="nav-link" href="services.html">Services</a></li>
                                    <li class="nav-item"><a class="nav-link" href="about.html">About Us</a></li>
                                    <li class="nav-item"><a class="nav-link" href="project.html">Project</a></li>
                                    <li class="nav-item"><a class="nav-link" href="gallery.html">Gallery</a></li>
                                    <li class="nav-item"><a class="nav-link" href="contact.html">Contact Us</a></li>
                                </ul>

                                <div class="gs_button_two_botton">
                                    <button class="button gs_header_btn gs_regist_botton" onclick="window.location.href='Register.html';">
                                        <span>Register</span>
                                    </button>
                                    <button class="button gs_header_btn_login" onclick="window.location.href='gs-login.html';">
                                        <span>Sign in</span>
                                    </button>
                                </div>
                            </div>
                            <!-- Offcanvas Menu (visible on smaller screens) -->
                            <div class="offcanvas offcanvas-start sg_offcanvas_menu" tabindex="-1" id="offcanvasNavbar"
                                aria-labelledby="offcanvasNavbarLabel">
                                <div class="offcanvas-header">
                                  <div class="gs_button_two_botton">
                                    <button class="button gs_header_btn gs_regist_botton" onclick="window.location.href='Register.html';" fdprocessedid="2oopip">
                                        <span>Register</span>
                                    </button>
                                    <button class="button gs_header_btn_login" onclick="window.location.href='gs-login.html';" fdprocessedid="hbnxl">
                                        <span>Sign in</span>
                                    </button>
                                </div>
                                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div class="offcanvas-body">
                                    <ul class="navbar-nav">
                                        <li class="nav-item"><a class="nav-link" href="index.html">HOME</a></li>
                                        <li class="nav-item"><a class="nav-link" href="services.html">SERVICES</a></li>
                                        <li class="nav-item"><a class="nav-link" href="about.html">ABOUT US</a></li>
                                        <li class="nav-item"><a class="nav-link" href="project.html">PROJECT</a></li>
                                        <li class="nav-item"><a class="nav-link" href="gallery.html">GALLERY</a></li>
                                        <li class="nav-item"><a class="nav-link" href="contact.html">CONTACT US</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
            </div>
        </header>`;
    }
}

// Define the custom footer element
class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
 <footer class="gs_footer_sec">
        <div class="gs_footer_bg gs_spc_lr">
            <!-- <div class="gs_footer_Body">  </div> -->
            <div class="footer_container">
                <div class="gs_footer_box1">
                    <div class="gs_footer_box1_top"><a href="index.html"><img src="assets/images/sg_logo.png"
                                alt=""></a></div>
                    <div class="gs_footer_box1_botton">
                        <p>Excellence in every detail, accuracy in every build.</p>
                        <form class="d-flex">
                            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                            <button class="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
                <div class="gs_footer_box2">
                    <div class="gs_footer_box2_headinga">
                        <h2>Useful Links</h2>
                    </div>
                    <div class="gs_footer_box2_bottom">
                        <ul>
                            <li class="gs_footer_list_iteam">
                                <a href="about.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">About</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="services.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Services</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="project.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Our Projects</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="gallery.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Gallery</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="faqs.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Faqs</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="contact.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Contact Us</span>
                                </a>
                            </li>
                             <li class="gs_footer_list_iteam">
                                <a href="partner-registration-form.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Partner Registration</span>
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>
                <div class="gs_footer_box3">
                    <div class="gs_footer_box2_headinga">
                        <h2>Our Services</h2>
                    </div>
                    <div class="gs_footer_box2_bottom">
                        <ul>
                            <li class="gs_footer_list_iteam">
                                <a href="land.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Construction</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="interior.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Interior</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="land.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Land</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="project.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Upcoming Projects</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="completed-projects.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Completed Projects</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="privacy-policy.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Privacy-Policy</span>
                                </a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="careor.html">
                                    <span class="gs_footer_iteam_heading"><svg aria-hidden="true"
                                            class="e-font-icon-svg e-fas-tape" viewBox="0 0 640 512"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M224 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm400 224H380.6c41.5-40.7 67.4-97.3 67.4-160 0-123.7-100.3-224-224-224S0 132.3 0 256s100.3 224 224 224h400c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400-64c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z">
                                            </path>
                                        </svg></span>
                                    <span class="gs_footer_iteam_link">Careor</span>
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>
                <div class="gs_footer_box4">
                    <div class="gs_footer_box2_headinga">
                        <h2>Contact Us</h2>
                    </div>
                    <div class="gs_footer_box2_bottom">
                        <ul>
                            <li class="gs_footer_list_iteam">
                                <p>Ground Floor Ginger Hotel , Opp. NALCO Office , Jaydev Vihar , Bhubaneswar -751015</p>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="tel:9241678848">+91 9583215595</a>
                            </li>
                            <li class="gs_footer_list_iteam">
                                <a href="mailto:bkhamari@gmail.com">grandspace23@gmail.com</a>
                            </li>
                        </ul>
                        <div class="gs_opean_time">
                            <div class="gs_opean_hear">
                                <h6>Open Hours:</h6>
                            </div>
                            <p>Mon – Sat: 8 am – 5 pm<br>
                                Sunday: CLOSED</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="copyrait_container">
            <p>© 2024 grandspace. All Rights Reserved. Designed By <strong><a href="https://cyfrifprotech.com/">Cyfrifprotech</a></strong></p>
        </div>
    </footer>`;
    }
}

// Register custom elements
customElements.define('my-header', MyHeader);
customElements.define('my-footer', MyFooter);