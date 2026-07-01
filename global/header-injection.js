window.addEventListener('DOMContentLoaded', () => {
    const headerHtml = `
    <a href="#" class="d-none d-md-block btn btn-primary-green px-5 btnSkipToMainContent">التخطي إلى
                المحتوى
                الرئيسي</a>
                <div class="container position-relative">
                    <a href="/index.html" class="navbar-brand"><img loading="lazy"
                            src="/mainFiles/assets/imgs/logo-square.png" alt="مؤسسة عطاء الخيرية" width="200"></a>
            </div>
            <div class="navbar navbar-expand-md navbar-light bg-white p-0">
                <div class="container">
                    <button id="mobileMenuBtn" class="navbar-toggler p-0 border-0 ms-3" type="button"
                        data-bs-toggle="offcanvas" data-bs-target="#navbarMenu" aria-expanded="false"
                        aria-label="القائمة" accesskey="ق">
                        <span class="navbar-toggler-icon" aria-hidden="true"></span>
                    </button>
                    <nav class="navbar-collapse offcanvas offcanvas-start w-75" id="navbarMenu"
                        aria-label="القائمة الجانبية" aria-describedby="mainMenuDescription">
                        <div id="closeMenuFocusout" data-bs-dismiss="offcanvas" class="d-block d-md-none"
                            style="height: 100%;position: absolute;top: 0;width: 25%;left: 0;" role="button"
                            aria-label="القائمة" tabindex="0" aria-expanded="true" accesskey="ق"></div>
                        <div class="navbar-mobile d-flex flex-column justify-content-between w-100">
                            <div class="d-block d-md-flex align-items-md-center">
                                <div class="d-block d-md-none text-end pt-3">
                                    <button id="closeNavbar" class="btn pb-0" type="button" aria-hidden="true"
                                        tabindex="-1"><i class="fas fa-chevron-right"
                                            style="font-size: 22px;"></i></button>
                                </div>
                                <ul class="navbar-nav me-auto" aria-label="القائمة الرئيسية"
                                    aria-owns="extraMenuItem1 extraMenuItem2 extraMenuItem3">
                                    <li class="nav-item active">
                                        <a class="nav-link" href="/index.html" aria-current="page"
                                            accesskey="0">الرئيسية</a>
                                    </li>
                                    <li class="nav-item dropdown ">
                                        <a class="nav-link dropdown-toggle" href="#" id="dropdown01"
                                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                            aria-current="false">إعمار</a>
                                        <div class="dropdown-menu border-0">
                                            <div class="container d-flex flex-wrap flex-column flex-md-row justify-content-center p-0 p-md-2"
                                                role="list" aria-labelledby="dropdown01">
                                                <div role="listitem">
                                                    <a class="dropdown-item" href="/mainFiles/ar/project/iemar.html"
                                                        accesskey="ماهي إعمار؟">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/whatis_icon.svg" alt="" />
                                                            ماهو مشروع إعمار؟
                                                        </div>
                                                    </a>
                                                </div>
                                                <div role="listitem">
                                                    <a class="dropdown-item"
                                                        href="/mainFiles/ar/all-project/1.html"
                                                        accesskey="م">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/project_icon.svg" alt="" />
                                                            المشاريع الحالية
                                                        </div>
                                                    </a>
                                                </div>
                                                <div role="listitem">
                                                    <a class="dropdown-item"
                                                        href="/mainFiles/ar/all-project/1.html"
                                                        accesskey="ت">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/project_done.svg" alt="" />
                                                            المشاريع المنجزة
                                                        </div>
                                                    </a>
                                                </div>
                                                <div role="listitem">
                                                    <a class="dropdown-item" href="/mainFiles/ar/all-project/1.html" accesskey="ف">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/donate_icon.svg" alt="" />
                                                            تبرع للمشروع
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="nav-item dropdown ">
                                        <a class="nav-link dropdown-toggle" href="#" id="dropdown02"
                                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                            aria-current="false">سقيا</a>
                                        <div class="dropdown-menu border-0">
                                            <div class="container d-flex  flex-wrap flex-column flex-md-row justify-content-center p-0 p-md-2"
                                                role="list" aria-labelledby="dropdown02">
                                                <div role="listitem">
                                                    <a class="dropdown-item" href="/mainFiles/ar/project/soqya.html" accesskey="ر">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/water_know.svg" alt="" />
                                                            تعرف على سقيا
                                                        </div>
                                                    </a>
                                                </div>
                                                <div role="listitem">
                                                    <a class="dropdown-item"
                                                        href="/mainFiles/ar/all-project/1ee7b.html"
                                                        accesskey="ز">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/project_icon.svg" alt="" />
                                                            المشاريع الحالية
                                                        </div>
                                                    </a>
                                                </div>
                                                <div role="listitem">
                                                    <a class="dropdown-item"
                                                        href="/mainFiles/ar/all-project/1ee7b.html">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/project_done.svg" alt="" />
                                                            المشاريع المنجزة
                                                        </div>
                                                    </a>
                                                </div>
                                                <div role="listitem">
                                                    <a class="dropdown-item" href="/mainFiles/ar/all-project/1ee7b.html" accesskey="ض">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/donate_tree.svg" alt="" />
                                                            تبرع للمشروع
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="nav-item dropdown ">
                                        <a class="nav-link dropdown-toggle" href="#" id="dropdown02"
                                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                            aria-current="false">مشاريع أخرى </a>
                                        <div class="dropdown-menu border-0">
                                            <div class="container d-flex  flex-wrap flex-column flex-md-row justify-content-center p-0 p-md-2"
                                                role="list" aria-labelledby="dropdown02">
                                                <div role="listitem">
                                                    <a class="dropdown-item" href="/mainFiles/ar/project/qofa.html" accesskey="ر">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy" width="40" height="40"
                                                                src="/mainFiles/assets/imgs/icons/ramadan_basket.png" alt="" />
                                                            قفة عطاء
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="nav-item dropdown ">
                                        <a class="nav-link dropdown-toggle" href="#" id="dropdown03"
                                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                                            aria-current="false">عن
                                            عطاء</a>
                                        <div class="dropdown-menu border-0">
                                            <div class="container d-flex flex-column flex-md-row justify-content-center p-0"
                                                role="list" aria-labelledby="dropdown03">
                                                <div role="listitem">
                                                    <a class="dropdown-item" accesskey="ع" href="/mainFiles/ar/about.html">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/about_icon.svg" alt="" />
                                                            من نحن
                                                        </div>
                                                    </a>
                                                </div>
                                                <div role="listitem">
                                                    <a class="dropdown-item" href="/mainFiles/ar/contact.html" accesskey="ش">
                                                        <div
                                                            class="d-flex align-items-center align-items-md-start align-items-md-center flex-row flex-md-column">
                                                            <img loading="lazy"
                                                                src="/mainFiles/assets/imgs/icons/contact_us.svg" alt="" />
                                                            إتصل بنا
                                                        </div>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <span id="mainMenuDescription" class="visually-hidden" aria-hidden="true"></span>
                    </nav>
                </div>
            </div>
            `;
    const placeholder = document.getElementById('page-header');

    if (placeholder) {
        placeholder.innerHTML = headerHtml;
    }
});