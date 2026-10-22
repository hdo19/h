
 // ==========================================
 // قاعدة بيانات الشروحات والمقالات التفصيلية
 // ==========================================
let myChannelTutorials = [
    {
        id: 1,
        title: "شرح برنامج استرجاع الملفات المحذوفة R-Studio",
        desc: "دليل عملي لاستعادة ملفاتك الضائعة من الهارديسك أو الفلاش ميموري بكفاءة عالية.",
        tools: ["برنامج R-Studio", "حاسوب ويندوز"],
        articleContent: `
في كثير من الأحيان قد نتعرض لحذف ملفات مهمة بالخطأ، أو فورمات بالخطأ.
يعتبر برنامج R-Studio واحداً من أقوى البرامج المستخدمة في استرجاع الملفات المحذوفة حتى بعد التهيئة.
في هذا الشرح سنستعرض خطوات تثبيت البرنامج وكيفية فحص الأقراص واستعادة الصور والملفات والمستندات.
تأكد دائماً من عدم التخزين على نفس القرص الذي حذفت منه الملفات لكي لا تفقدها نهائياً قبل استعادتها.
        `,
        downloadUrl: "https://www.mediafire.com/file/o5xivo0f2pfvg6b/R-Studio_8.15.18015_Repack_%2526_Portable_by_9649.rar/file",
        videoUrl: "https://www.youtube.com/embed/DgSp0FvOfv8"
    },
    {
        id: 2,
        title: "فرمتة جهاز ريلمي C21Y بدون بوكسات أو دناكل",
        desc: "شرح طريقة التعامل مع هاتف Realme C21Y عند نسيان كلمة المرور وصعوبة الوصول إلى وضع الريكفري.",
        tools: ["هاتف Realme C21Y", "شاهد الفيديو للنهاية"],
        articleContent: `
الكثير يعاني من مشكلة الهاتف العنيد C21Y.
بعض هواتف ريلمي قد تكون صعبة الوصول إلى وضع الريكفري أو الفورمات بعد نسيان كلمة المرور.
في هذا الشرح من حدور تك نستعرض الطريقة الموضحة في الفيديو للتعامل مع الهاتف.
انتبه إلى أن عملية الفورمات قد تؤدي إلى حذف بيانات الهاتف، وقد يطلب الجهاز حساب Google السابق بعد إعادة الضبط.
        `,
        videoUrl: "https://www.youtube.com/embed/e972qd-I0Zc"
    },
    {
        id: 3,
        title: "شرح برنامج استرجاع الملفات المحذوفة R-Studio - دليل إضافي",
        desc: "معلومات إضافية ونصائح مهمة لاستعادة الملفات من الأقراص الصلبة والفلاش ميموري.",
        tools: ["برنامج R-Studio", "حاسوب ويندوز"],
        articleContent: `
قبل محاولة استرجاع الملفات، تجنب حفظ ملفات جديدة على القرص الذي فقدت منه البيانات.
افحص القرص وحدد الملفات التي تريد استعادتها، ثم احفظ الملفات المسترجعة في قرص آخر.
تعتمد النتيجة على حالة القرص والبيانات التي كُتبت فوق الملفات المحذوفة.
        `,
        downloadUrl: "https://www.mediafire.com/file/o5xivo0f2pfvg6b/R-Studio_8.15.18015_Repack_%2526_Portable_by_9649.rar/file",
        videoUrl: "https://www.youtube.com/embed/DgSp0FvOfv8"
    }
];

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. القائمة الجانبية للموبايل
    // ==========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        mobileMenu.querySelectorAll('.mobile-close-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 2. نافذة تواصل معنا
    // ==========================================
    const contactModal = document.getElementById('contactModal');
    const openDesktop = document.getElementById('openContactModalDesktop');
    const openMobile = document.getElementById('openContactModalMobile');
    const closeContact = document.getElementById('closeContactModal');

    function openModal(e) {
        if (e) e.preventDefault();

        if (mobileMenu) mobileMenu.classList.remove('active');
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');

        if (contactModal) {
            contactModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (contactModal) {
            contactModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    if (openDesktop) openDesktop.addEventListener('click', openModal);
    if (openMobile) openMobile.addEventListener('click', openModal);
    if (closeContact) closeContact.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });

    // ==========================================
    // 3. نظام الشروحات والمقالات
    // ==========================================
    const container = document.getElementById('dynamic-tutorials-container');

    if (container) {

        // صور غلاف مناسبة لكل شرح؛ يمكن استبدالها بصورك الخاصة لاحقاً.
        function getTutorialImage(tutorial) {
            if (tutorial.imageUrl) return tutorial.imageUrl;

            const covers = {
                1: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85",
                2: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85",
                3: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85"
            };
            return covers[tutorial.id] || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85";
        }

        // عرض قائمة الشروحات
        function renderTutorialsList() {
            container.className = 'portfolio-grid';
            container.innerHTML = '';

            myChannelTutorials.forEach((tutorial) => {
                const card = document.createElement('div');
                card.className = 'portfolio-item';
                card.style.cursor = 'pointer';

                const cover = getTutorialImage(tutorial);
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', 'افتح: ' + tutorial.title);
                card.innerHTML = `
                    <div class="portfolio-card-image">
                        <img src="${cover}" alt="${tutorial.title}" loading="lazy">
                    </div>
                    <div class="portfolio-content">
                        <span class="card-category">HADOOR TECH / شرح تقني</span>
                        <h4>${tutorial.title}</h4>
                        <p>${tutorial.desc}</p>
                        <span class="card-action">اقرأ المقال والشرح</span>
                    </div>
                `;

                // فتح المقال مباشرة دون إعادة تحميل الصفحة
                card.addEventListener('click', (e) => {
                    e.preventDefault();

                    history.pushState(
                        { articleId: tutorial.id },
                        '',
                        `#article-${tutorial.id}`
                    );

                    renderSingleArticle(tutorial);

                    window.scrollTo({
                        top: container.offsetTop - 100,
                        behavior: 'smooth'
                    });
                });

                container.appendChild(card);
            });
        }

        // عرض المقال المحدد
        function renderSingleArticle(tutorial) {
            container.className = '';
            container.innerHTML = '';

            const article = document.createElement('div');
            article.className = 'article-page';

            article.innerHTML = `
                <div class="article-panel" style="
                    background:var(--bg-card, #fff);
                    padding:clamp(1rem, 4vw, 3rem);
                    border-radius:30px;
                    box-shadow:0 20px 40px rgba(0,0,0,0.1);
                    text-align:right;
                    margin-bottom:4rem;">

                    <button id="back-to-list" type="button" style="
                        padding:0.6rem 1.5rem;
                        background:var(--secondary-color);
                        color:white;
                        border:none;
                        border-radius:20px;
                        cursor:pointer;
                        font-weight:bold;
                        margin-bottom:2rem;">
                        ← العودة إلى قائمة الشروحات
                    </button>

                    <h2 style="
                        font-size:clamp(1.5rem, 4vw, 2.2rem);
                        color:var(--text-primary);
                        margin-bottom:1.5rem;">
                        ${tutorial.title}
                    </h2>

                    <div class="article-body" style="
                        font-size:1.1rem;
                        color:var(--text-secondary);
                        margin-bottom:2.5rem;
                        line-height:2;
                        white-space:pre-line;">
                        ${tutorial.articleContent}
                    </div>

                    ${tutorial.downloadUrl ? `
                        <div style="margin:2.5rem 0;text-align:center;">
                            <a class="article-download" href="${tutorial.downloadUrl}"
                               target="_blank"
                               rel="noopener noreferrer"
                               style="
                                   display:inline-block;
                                   padding:1rem 2rem;
                                   background:#10b981;
                                   color:white;
                                   text-decoration:none;
                                   border-radius:30px;
                                   font-weight:bold;
                                   font-size:1.1rem;
                                   box-shadow:0 4px 15px rgba(16,185,129,0.3);">
                                للتحميل اضغط هنا 📥
                            </a>
                        </div>
                    ` : ''}

                    <hr style="
                        border:0;
                        border-top:1px solid rgba(0,0,0,0.1);
                        margin:3rem 0;">

                    <h3 style="
                        color:var(--primary-color);
                        margin-bottom:1rem;
                        font-size:1.4rem;
                        text-align:center;">
                        📺 مشاهدة الشرح الكامل على يوتيوب
                    </h3>

                    <div class="article-video" style="
                        position:relative;
                        padding-bottom:56.25%;
                        height:0;
                        overflow:hidden;
                        border-radius:20px;
                        background:#000;">

                        <iframe
                            src="${tutorial.videoUrl}"
                            title="${tutorial.title}"
                            style="
                                position:absolute;
                                top:0;
                                left:0;
                                width:100%;
                                height:100%;
                                border:0;"
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>

                <div class="other-tutorials" style="margin-top:4rem;">
                    <h3 style="
                        font-size:1.5rem;
                        margin-bottom:2rem;
                        text-align:center;
                        color:var(--text-primary);">
                        شروحات ومقالات أخرى قد تعجبك
                    </h3>

                    <div class="portfolio-grid" id="other-tutorials-grid"></div>
                </div>
            `;

            container.appendChild(article);

            // زر العودة إلى القائمة
            const backButton = article.querySelector('#back-to-list');

            backButton.addEventListener('click', (e) => {
                e.preventDefault();

                history.pushState(
                    { page: 'portfolio' },
                    '',
                    '#portfolio'
                );

                renderTutorialsList();

                window.scrollTo({
                    top: container.offsetTop - 100,
                    behavior: 'smooth'
                });
            });

            // عرض المقالات الأخرى
            const otherGrid = article.querySelector('#other-tutorials-grid');

            myChannelTutorials
                .filter(other => other.id !== tutorial.id)
                .forEach((other) => {
                    const otherCard = document.createElement('div');
                    otherCard.className = 'portfolio-item';
                    otherCard.style.cursor = 'pointer';

                    otherCard.innerHTML = `
                        <div class="portfolio-card-image">
                            <img src="${getTutorialImage(other)}" alt="${other.title}" loading="lazy">
                        </div>
                        <div class="portfolio-content">
                            <span class="card-category">HADOOR TECH / شرح تقني</span>
                            <h4>${other.title}</h4>
                            <p>${other.desc}</p>
                            <span class="card-action">اقرأ المقال</span>
                        </div>
                    `;

                    otherCard.addEventListener('click', (e) => {
                        e.preventDefault();

                        history.pushState(
                            { articleId: other.id },
                            '',
                            `#article-${other.id}`
                        );

                        renderSingleArticle(other);

                        window.scrollTo({
                            top: container.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    });

                    otherGrid.appendChild(otherCard);
                });
        }

        // فتح المقال حسب الرابط الحالي
        function checkUrlAndRender() {
            const hash = window.location.hash;
            const match = hash.match(/^#article-(\d+)$/);

            if (match) {
                const articleId = Number(match[1]);
                const tutorial = myChannelTutorials.find(
                    item => item.id === articleId
                );

                if (tutorial) {
                    renderSingleArticle(tutorial);
                    return;
                }
            }

            renderTutorialsList();
        }

        // دعم أزرار الرجوع والتقدم في المتصفح
        window.addEventListener('popstate', checkUrlAndRender);
        window.addEventListener('hashchange', checkUrlAndRender);

        // العرض الأولي: اعرض المحتوى المحلي فوراً، ثم حدّثه من Supabase عند نجاح الاتصال.
        checkUrlAndRender();

        async function loadArticlesFromSupabase() {
            if (!window.hadoorSupabase) {
                console.warn('Supabase client is not configured; using local articles.');
                return;
            }

            try {
                const { data, error } = await window.hadoorSupabase
                    .from('articles')
                    .select('id, title, slug, description, content, image_url, download_url, video_url, tools, published')
                    .eq('published', true)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Keep the local articles as a fallback if the database has no published rows.
                if (!Array.isArray(data) || data.length === 0) return;

                myChannelTutorials = data.map((row) => ({
                    id: row.id,
                    slug: row.slug,
                    title: row.title,
                    desc: row.description || '',
                    tools: row.tools ? row.tools.split(',').map(item => item.trim()).filter(Boolean) : [],
                    articleContent: row.content || '',
                    imageUrl: row.image_url || '',
                    downloadUrl: row.download_url || '',
                    videoUrl: row.video_url || ''
                }));

                checkUrlAndRender();
            } catch (error) {
                console.error('Could not load published articles from Supabase. Using local articles.', error);
            }
        }

        loadArticlesFromSupabase();
    }

    // ==========================================
    // 4. حماية نموذج الاتصال
    // ==========================================
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const lastSentTime = Number(
                localStorage.getItem('lastMessageTime') || 0
            );

            const now = Date.now();
            const oneHourInMs = 60 * 60 * 1000;

            if (lastSentTime && now - lastSentTime < oneHourInMs) {
                e.preventDefault();

                const remainingMinutes = Math.ceil(
                    (oneHourInMs - (now - lastSentTime)) / 60000
                );

                alert(
                    `عذراً، لقد أرسلت رسالة مسبقاً. يمكنك إرسال رسالة أخرى بعد ${remainingMinutes} دقيقة.`
                );

                return;
            }

            localStorage.setItem('lastMessageTime', String(now));
        });
    }
});
