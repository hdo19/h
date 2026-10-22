(() => {
  'use strict';
  const db = window.hadoorSupabase;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  let article = null;
  let currentUser = null;
  let authMode = 'login';

  function message(id, text, type='') {
    const el = $(id); el.textContent = text || ''; el.className = 'inline-message' + (type ? ' ' + type : '');
  }
  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function formatDate(value) {
    try { return new Intl.DateTimeFormat('ar-IQ', { dateStyle:'medium', timeStyle:'short' }).format(new Date(value)); }
    catch { return ''; }
  }
  function validVideoUrl(value) {
    if (!value) return '';
    try {
      const u = new URL(value);
      if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com') {
        if (u.pathname === '/embed/' + u.pathname.split('/')[2]) return u.href;
        if (u.pathname === '/watch' && u.searchParams.get('v')) return 'https://www.youtube.com/embed/' + u.searchParams.get('v');
      }
      if (u.hostname === 'youtu.be') return 'https://www.youtube.com/embed/' + u.pathname.slice(1);
      return '';
    } catch { return ''; }
  }
  function renderArticle(row) {
    const root = $('articleContent'); root.replaceChildren();
    if (row.image_url) {
      const img = node('img','article-cover'); img.src = row.image_url; img.alt = row.title || 'صورة المقال'; img.loading = 'eager'; root.appendChild(img);
    }
    const inner = node('div','article-detail-inner');
    inner.appendChild(node('div','article-eyebrow','HADOOR TECH / شرح تقني'));
    inner.appendChild(node('h1','article-title',row.title || 'مقال تقني'));
    if (row.description) inner.appendChild(node('p','article-description',row.description));
    if (row.tools) {
      const tags = node('div','article-meta');
      String(row.tools).split(',').map(s=>s.trim()).filter(Boolean).forEach(s=>tags.appendChild(node('span','article-tag',s)));
      if (tags.childElementCount) inner.appendChild(tags);
    }
    const prose = node('div','article-prose');
    String(row.content || '').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean).forEach(paragraph=>prose.appendChild(node('p','',paragraph)));
    if (!prose.childElementCount) prose.textContent = row.content || '';
    inner.appendChild(prose);
    if (row.download_url) {
      const wrap = node('div','article-download-wrap');
      const link = node('a','article-button primary-button','تحميل الملفات أو البرنامج ↓');
      link.href = row.download_url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      wrap.appendChild(link); inner.appendChild(wrap);
    }
    const video = validVideoUrl(row.video_url);
    if (video) {
      const section = node('section','article-video-section');
      section.appendChild(node('h2','','مشاهدة الشرح بالفيديو'));
      const frameWrap = node('div','article-video');
      const frame = document.createElement('iframe'); frame.src = video; frame.title = 'فيديو شرح: ' + (row.title || 'Hadoor Tech');
      frame.loading = 'lazy'; frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'; frame.referrerPolicy = 'strict-origin-when-cross-origin'; frame.allowFullscreen = true;
      frameWrap.appendChild(frame); section.appendChild(frameWrap); inner.appendChild(section);
    }
    root.appendChild(inner);
    document.title = (row.title || 'المقال') + ' | حدور تك';
    const desc = document.querySelector('meta[name="description"]'); if (desc && row.description) desc.content = row.description;
    $('articleStatus').classList.add('hidden'); root.classList.remove('hidden'); $('commentsSection').classList.remove('hidden');
  }
  async function loadArticle() {
    if (!slug) { $('articleStatus').textContent = 'رابط المقال غير مكتمل. ارجع إلى قائمة الشروحات واختر مقالاً.'; return; }
    const { data, error } = await db.from('articles').select('id,title,slug,description,content,image_url,download_url,video_url,tools,created_at').eq('slug',slug).eq('published',true).maybeSingle();
    if (error) throw error;
    if (!data) { $('articleStatus').textContent = 'لم نعثر على هذا المقال، أو أنه غير منشور.'; return; }
    article = data; renderArticle(data); await loadComments();
  }
  function setAuthMode(mode) {
    authMode = mode;
    const signup = mode === 'signup';
    $('authTitle').textContent = signup ? 'إنشاء حساب جديد' : 'سجّل الدخول للمشاركة';
    $('authHint').textContent = signup ? 'أنشئ حساباً بالبريد الإلكتروني وكلمة مرور من 6 أحرف على الأقل.' : 'يمكنك قراءة المقال دون حساب، لكن كتابة التعليق تتطلب تسجيل الدخول.';
    $('nameField').classList.toggle('hidden', !signup);
    $('displayName').required = signup;
    $('authSubmit').textContent = signup ? 'إنشاء الحساب' : 'تسجيل الدخول';
    $('authSwitch').textContent = signup ? 'لديك حساب؟ سجّل الدخول' : 'ليس لديك حساب؟ أنشئ حساباً';
    message('authMessage','');
  }
  function renderAuthState() {
    $('authPanel').classList.toggle('hidden', !!currentUser);
    $('commentComposer').classList.toggle('hidden', !currentUser);
    if (currentUser) {
      $('signedInAs').textContent = 'مسجّل الدخول: ' + (currentUser.user_metadata?.display_name || currentUser.email || 'مستخدم');
    } else {
      const panel = $('authPanel');
      panel.replaceChildren();
      const copy = node('div','auth-copy');
      copy.appendChild(node('h3','','سجّل الدخول حتى تكتب تعليقاً'));
      copy.appendChild(node('p','','اقرأ المقال بحرية، وللمشاركة بالتعليقات أنشئ حساباً أو سجّل الدخول. تأكيد البريد واستعادة كلمة المرور متاحان من صفحة الحساب.'));
      const links = node('div','auth-action-links');
      const login = node('a','article-button primary-button','تسجيل الدخول');
      login.href = 'auth.html?mode=login&next=' + encodeURIComponent(location.href);
      const signup = node('a','article-button secondary-button','إنشاء حساب جديد');
      signup.href = 'auth.html?mode=signup&next=' + encodeURIComponent(location.href);
      links.append(login,signup); panel.append(copy,links);
    }
  }
  async function loadComments() {
    if (!article) return;
    const list = $('commentsList'); list.replaceChildren();
    const { data, error } = await db.from('article_comments').select('id,author_name,body,created_at').eq('article_slug',article.slug).order('created_at',{ascending:false});
    if (error) {
      list.appendChild(node('p','muted-text','تعذّر تحميل التعليقات. تأكد من تنفيذ إعدادات قاعدة البيانات الموضحة مع التحديث.'));
      $('commentCount').textContent = '— تعليق'; return;
    }
    $('commentCount').textContent = (data.length || 0) + ' تعليق';
    if (!data.length) { list.appendChild(node('p','muted-text','لا توجد تعليقات حتى الآن. كن أول من يشارك رأيه أو سؤاله.')); return; }
    data.forEach(item=>{
      const card = node('article','comment-item');
      const head = node('div','comment-item-head');
      head.appendChild(node('span','comment-author',item.author_name || 'زائر'));
      head.appendChild(node('time','comment-date',formatDate(item.created_at)));
      card.appendChild(head); card.appendChild(node('p','comment-text',item.body || '')); list.appendChild(card);
    });
  }
  $('authSwitch').addEventListener('click',()=>setAuthMode(authMode === 'login' ? 'signup' : 'login'));
  $('authForm').addEventListener('submit',async event=>{
    event.preventDefault(); const button = $('authSubmit'); button.disabled = true; message('authMessage','جارٍ تنفيذ العملية...');
    try {
      const email = $('authEmail').value.trim(); const password = $('authPassword').value;
      if (authMode === 'signup') {
        const displayName = $('displayName').value.trim();
        const { data, error } = await db.auth.signUp({ email, password, options:{ data:{ display_name:displayName } } });
        if (error) throw error;
        if (data.session) { currentUser = data.user; renderAuthState(); message('authMessage','تم إنشاء الحساب وتسجيل الدخول.','success'); }
        else message('authMessage','تم إنشاء الحساب. افحص بريدك الإلكتروني واضغط رابط التأكيد، ثم ارجع وسجّل الدخول.','success');
      } else {
        const { data, error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
        currentUser = data.user; renderAuthState(); message('authMessage','تم تسجيل الدخول بنجاح.','success');
      }
    } catch(error) { message('authMessage',error.message || 'حدث خطأ. تحقق من البيانات وحاول مجدداً.','error'); }
    finally { button.disabled = false; }
  });
  $('signOutButton').addEventListener('click',async()=>{ await db.auth.signOut(); currentUser = null; renderAuthState(); });
  $('commentForm').addEventListener('submit',async event=>{
    event.preventDefault(); if (!currentUser || !article) return;
    const body = $('commentBody').value.trim(); if (!body) return;
    const button = $('commentSubmit'); button.disabled = true; message('commentsMessage','جارٍ نشر التعليق...');
    try {
      const author = String(currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'مستخدم').slice(0,60);
      const { error } = await db.from('article_comments').insert({ article_slug:article.slug, user_id:currentUser.id, author_name:author, body });
      if (error) throw error;
      $('commentBody').value = ''; message('commentsMessage','تم نشر تعليقك. شكراً لمشاركتك!','success'); await loadComments();
    } catch(error) { message('commentsMessage',error.message || 'تعذّر نشر التعليق. تحقق من سياسات قاعدة البيانات.','error'); }
    finally { button.disabled = false; }
  });
  async function start() {
    if (!db) { $('articleStatus').textContent = 'تعذّر الاتصال بخدمة المقالات.'; return; }
    try {
      const { data } = await db.auth.getSession(); currentUser = data.session?.user || null; renderAuthState();
      db.auth.onAuthStateChange((_event,session)=>{ currentUser = session?.user || null; renderAuthState(); });
      await loadArticle();
    } catch(error) { $('articleStatus').textContent = 'حدث خطأ أثناء تحميل المقال: ' + (error.message || 'خطأ غير معروف'); }
  }
  setAuthMode('login');
  start();
})();