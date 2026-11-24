/* Catalogue Pro — static Netlify build, styled to match the live Catalogue Pro app.
   Admin and customer order data stay in the Catalogue Pro app only. */
const WA_NUMBER = "918320698548";
const STORE_SLUG = "lyfexdigital-comic-store";
/* Base path: GitHub Pages serves this site under /cataloguepro, Netlify serves it from the root.
   Detect it from the first path segment so the same build works on both hosts. */
const BASE = (function(){ var seg = window.location.pathname.split("/").filter(Boolean); return seg[0] === "cataloguepro" ? "/cataloguepro" : ""; })();
const homePath = () => BASE || "/";
/* Clean per-store share link, derived from the store slug so it changes as per the store:
   GitHub Pages: https://yashlalchandani.github.io/cataloguepro/store/lyfexdigital-comic-store
   Netlify:      https://cataloguepro-app.netlify.app/store/lyfexdigital-comic-store */
const storePath = (slug) => BASE + "/store/" + (slug || STORE_SLUG);
const storeUrl = (slug) => window.location.origin + storePath(slug);
let PRODUCTS = [];
let cart = JSON.parse(localStorage.getItem("cp-cart") || "[]");
let lang = localStorage.getItem("cp-lang") || "en";
let themeMode = localStorage.getItem("cp-theme") || "auto";
let demoTheme = localStorage.getItem("cp-demo-theme") || "amber";
let activeCat = "All", searchQ = "", sortBy = "featured";

const I18N = {
en:{brand:"Catalogue Pro",nav_features:"Features",nav_pricing:"Pricing",live_store:"Live store",login:"Log in",cart:"Cart",your_cart:"Your Cart",total:"Total",order_whatsapp:"Order on WhatsApp",cart_note:"Delivery details will be asked before sending the order on WhatsApp.",hero_badge:"Built for WhatsApp-first shops",hero_title:"Create your digital catalogue in minutes",hero_sub:"Build a beautiful mobile catalogue, share it on WhatsApp & Instagram, and receive orders instantly. No app development needed.",create_catalogue:"Create your catalogue",see_live_store:"See a live store →",trust:"Live in minutes • Plans from ₹999/month • Cancel anytime",preview_title:"See how your catalogue will look",preview_sub:"Customize colors and see the changes instantly",choose_theme:"Choose your theme",features_title:"Everything you need to sell more",features_sub:"Powerful features designed specifically for small businesses.",how_title:"How it works",pricing_title:"Simple, transparent pricing",pricing_sub:"Four paid plans. No free tier.",start_now:"Start now",per_month:"/ month",most_popular:"Most popular",all:"All",search_ph:"Search products…",sort:"Sort",featured:"Featured",price_low:"Price: low to high",price_high:"Price: high to low",items:"items",add:"Add",add_to_cart:"Add",per_pc:"per pc",powered_by:"Powered by",store_tagline:"Phantom, Mandrake & Betal — in English, Hindi & Bengali",welcome:"Welcome to",empty_cart:"Your cart is empty.",empty_store:"No products match your search.",close:"Close",save:"Save",full_name:"Full Name",phone:"Phone",delivery_address:"Delivery Address",notes:"Notes for seller (optional)",submit_whatsapp:"Send on WhatsApp",delivery_title:"Delivery details",plan_form_title:"Start with",your_name:"Your name",business_name:"Business / Store name",email:"Email",plan:"Plan",login_note_title:"Admin login",login_note:"Store owner and super-admin login is managed in the Catalogue Pro app, not on this public site. Please use the app to log in and manage your store.",step1:"Add your products",step1d:"Bulk-import from Excel, CSV or JSON, or add products one by one.",step2:"Share your link",step2d:"Share your store link on WhatsApp and Instagram.",step3:"Get orders on WhatsApp",step3d:"Customers order straight on WhatsApp — no app needed.",f_mobile:"Mobile-first design",f_mobile_d:"Built for how customers actually browse. Fast, clean, and easy on any phone.",f_wa:"WhatsApp ordering",f_wa_d:"Customers place orders directly via WhatsApp. No login, no friction, just sales.",f_theme:"Custom themes",f_theme_d:"Pick a storefront theme and tune colours to match your brand.",f_bulk:"Bulk import",f_bulk_d:"Import hundreds of products at once from Excel, CSV or JSON — with covers by image link or upload.",f_share:"Easy sharing",f_share_d:"Share your catalog link on WhatsApp, Instagram, Facebook, or anywhere else.",f_dash:"Live dashboard",f_dash_d:"Track orders, stock and sales from one simple dashboard.",check1:"Mobile-optimized catalogue",check2:"WhatsApp ordering",check3:"Custom branding",check4:"Instant sharing links",check5:"Real-time inventory",check6:"Analytics dashboard",ads_note:"Advertising expenditure is not included in the subscription fee. The customer must fund their Meta Ads budget separately.",view_store:"View live store",open_store:"Open the store →",order_now:"Order now",qty:"Qty",remove:"Remove",description:"Description",isbn:"ISBN",language:"Language",series:"Series",required:"required",fill_name:"Please enter your full name",fill_phone:"Please enter your phone number",fill_address:"Please enter your delivery address",fill_plan_name:"Please enter your name",fill_plan_phone:"Please enter your phone number",ready_title:"Ready to start selling?",ready_sub:"Create your digital catalogue in 5 minutes — pick a plan above and start selling on WhatsApp today.",footer_tag:"WhatsApp-first catalogues for small businesses",showcase_eyebrow:"Live on Catalogue Pro",added:"Added ✓",in_stock:"In stock",out_of_stock:"Out of stock",left:"left",share:"Share",share_title:"Share LyfexDigital Comic Store",share_caption:"Scan to open this catalog on any phone",copy:"Copy",copied:"Copied ✓",share_apps:"Share with your apps",share_text:"Check out Lyfex Digital Comic Store"},
hi:{brand:"कैटलॉग प्रो",nav_features:"सुविधाएँ",nav_pricing:"मूल्य",live_store:"लाइव स्टोर",login:"लॉग इन",cart:"कार्ट",your_cart:"आपका कार्ट",total:"कुल",order_whatsapp:"WhatsApp पर ऑर्डर करें",cart_note:"WhatsApp पर ऑर्डर भेजने से पहले डिलीवरी विवरण पूछा जाएगा।",hero_badge:"WhatsApp-पहले दुकानों के लिए बनाया गया",hero_title:"मिनटों में अपना डिजिटल कैटलॉग बनाएँ",hero_sub:"एक सुंदर मोबाइल कैटलॉग बनाएँ, WhatsApp और Instagram पर साझा करें, और तुरंत ऑर्डर पाएँ। कोई ऐप डेवलपमेंट नहीं चाहिए।",create_catalogue:"अपना कैटलॉग बनाएँ",see_live_store:"लाइव स्टोर देखें →",trust:"कुछ ही मिनटों में लाइव • योजनाएँ ₹999/माह से • कभी भी रद्द करें",preview_title:"देखें आपका कैटलॉग कैसा दिखेगा",preview_sub:"रंग बदलें और बदलाव तुरंत देखें",choose_theme:"अपनी थीम चुनें",features_title:"बेचने के लिए आपको जो कुछ चाहिए",features_sub:"छोटे व्यवसायों के लिए डिज़ाइन की गई शक्तिशाली सुविधाएँ।",how_title:"यह कैसे काम करता है",pricing_title:"सरल, पारदर्शी मूल्य",pricing_sub:"चार सशुल्क योजनाएँ। कोई मुफ़्त योजना नहीं।",start_now:"अभी शुरू करें",per_month:"/ माह",most_popular:"सबसे लोकप्रिय",all:"सभी",search_ph:"उत्पाद खोजें…",sort:"क्रमबद्ध करें",featured:"विशेष",price_low:"मूल्य: कम से अधिक",price_high:"मूल्य: अधिक से कम",items:"आइटम",add:"जोड़ें",add_to_cart:"जोड़ें",per_pc:"प्रति पीस",powered_by:"द्वारा संचालित",store_tagline:"Phantom, Mandrake & Betal — in English, Hindi & Bengali",welcome:"स्वागत है",empty_cart:"आपका कार्ट खाली है।",empty_store:"आपकी खोज से कोई उत्पाद मेल नहीं खाता।",close:"बंद करें",save:"सहेजें",full_name:"पूरा नाम",phone:"फ़ोन",delivery_address:"डिलीवरी पता",notes:"विक्रेता के लिए नोट्स (वैकल्पिक)",submit_whatsapp:"WhatsApp पर भेजें",delivery_title:"डिलीवरी विवरण",plan_form_title:"शुरू करें",your_name:"आपका नाम",business_name:"व्यवसाय / स्टोर का नाम",email:"ईमेल",plan:"योजना",login_note_title:"एडमिन लॉगिन",login_note:"स्टोर मालिक और सुपर-एडमिन लॉगिन इस सार्वजनिक साइट पर नहीं, कैटलॉग प्रो ऐप में प्रबंधित किया जाता है। कृपया लॉगिन और स्टोर प्रबंधन के लिए ऐप का उपयोग करें।",step1:"अपने उत्पाद जोड़ें",step1d:"Excel, CSV या JSON से बल्क-इम्पोर्ट करें, या एक-एक करके जोड़ें।",step2:"अपना लिंक साझा करें",step2d:"अपना स्टोर लिंक WhatsApp और Instagram पर साझा करें।",step3:"WhatsApp पर ऑर्डर पाएँ",step3d:"ग्राहक सीधे WhatsApp पर ऑर्डर करते हैं — कोई ऐप नहीं चाहिए।",f_mobile:"मोबाइल-फर्स्ट डिज़ाइन",f_mobile_d:"ग्राहक वास्तव में जैसे ब्राउज़ करते हैं, उसके लिए बनाया गया। तेज़, साफ़ और किसी भी फ़ोन पर आसान।",f_wa:"WhatsApp ऑर्डरिंग",f_wa_d:"ग्राहक सीधे WhatsApp पर ऑर्डर देते हैं। कोई लॉगिन नहीं, कोई रुकावट नहीं, सिर्फ़ बिक्री।",f_theme:"कस्टम थीम",f_theme_d:"स्टोरफ्रंट थीम चुनें और रंग अपने ब्रांड से मिलाएँ।",f_bulk:"बल्क इम्पोर्ट",f_bulk_d:"Excel, CSV या JSON से एक साथ सैकड़ों उत्पाद इम्पोर्ट करें — छवि लिंक या अपलोड द्वारा कवर के साथ।",f_share:"आसान साझाकरण",f_share_d:"अपना कैटलॉग लिंक WhatsApp, Instagram, Facebook या कहीं भी साझा करें।",f_dash:"लाइव डैशबोर्ड",f_dash_d:"एक ही सरल डैशबोर्ड से ऑर्डर, स्टॉक और बिक्री देखें।",check1:"मोबाइल-ऑप्टिमाइज़्ड कैटलॉग",check2:"WhatsApp ऑर्डरिंग",check3:"कस्टम ब्रांडिंग",check4:"तुरंत साझा करने वाले लिंक",check5:"रियल-टाइम इन्वेंटरी",check6:"एनालिटिक्स डैशबोर्ड",ads_note:"विज्ञापन खर्च सदस्यता शुल्क में शामिल नहीं है। ग्राहक को अपना Meta Ads बजट अलग से देना होगा।",view_store:"लाइव स्टोर देखें",open_store:"स्टोर खोलें →",order_now:"अभी ऑर्डर करें",qty:"मात्रा",remove:"हटाएँ",description:"विवरण",isbn:"ISBN",language:"भाषा",series:"शृंखला",required:"आवश्यक",fill_name:"कृपया अपना पूरा नाम दर्ज करें",fill_phone:"कृपया अपना फ़ोन नंबर दर्ज करें",fill_address:"कृपया अपना डिलीवरी पता दर्ज करें",fill_plan_name:"कृपया अपना नाम दर्ज करें",fill_plan_phone:"कृपया अपना फ़ोन नंबर दर्ज करें",ready_title:"बेचना शुरू करने के लिए तैयार हैं?",ready_sub:"5 मिनट में अपना डिजिटल कैटलॉग बनाएँ — ऊपर कोई योजना चुनें और आज ही WhatsApp पर बेचना शुरू करें।",footer_tag:"छोटे व्यवसायों के लिए WhatsApp-पहले कैटलॉग",showcase_eyebrow:"कैटलॉग प्रो पर लाइव",added:"जोड़ा गया ✓",in_stock:"स्टॉक में",out_of_stock:"स्टॉक खत्म",left:"बचे",share:"साझा करें",share_title:"Share LyfexDigital Comic Store",share_caption:"किसी भी फ़ोन पर यह कैटलॉग खोलने के लिए स्कैन करें",copy:"कॉपी करें",copied:"Copied ✓",share_apps:"अपने ऐप्स से साझा करें",share_text:"Lyfex Digital Comic Store देखें"},
bn:{brand:"ক্যাটালগ প্রো",nav_features:"বৈশিষ্ট্য",nav_pricing:"মূল্য",live_store:"লাইভ স্টোর",login:"লগ ইন",cart:"কার্ট",your_cart:"আপনার কার্ট",total:"মোট",order_whatsapp:"WhatsApp-এ অর্ডার করুন",cart_note:"WhatsApp-এ অর্ডার পাঠানোর আগে ডেলিভারি বিবরণ চাওয়া হবে।",hero_badge:"WhatsApp-প্রথম দোকানের জন্য তৈরি",hero_title:"মিনিটে আপনার ডিজিটাল ক্যাটালগ তৈরি করুন",hero_sub:"একটি সুন্দর মোবাইল ক্যাটালগ তৈরি করুন, WhatsApp ও Instagram-এ শেয়ার করুন, এবং तुरন্ত অর্ডার পান। কোনো অ্যাপ ডেভেলপমেন্ট দরকার নেই।",create_catalogue:"আপনার ক্যাটালগ তৈরি করুন",see_live_store:"লাইভ স্টোর দেখুন →",trust:"কয়েক মিনিটে লাইভ • প্ল্যান ₹999/মাস থেকে • যেকোনো সময় বাতিল করুন",preview_title:"দেখুন আপনার ক্যাটালগ কেমন দেখাবে",preview_sub:"রং বদলান এবং পরিবর্তন तुरন্ত দেখুন",choose_theme:"আপনার থিম বেছে নিন",features_title:"বিক্রি করতে যা যা দরকার",features_sub:"ছোট ব্যবসার জন্য বিশেষভাবে ডিজাইন করা শক্তিশালী বৈশিষ্ট্য।",how_title:"এটি কীভাবে কাজ করে",pricing_title:"সহজ, স্বচ্ছ মূল্য",pricing_sub:"চারটি পেইড প্ল্যান। কোনো ফ্রি প্ল্যান নেই।",start_now:"এখনই শুরু করুন",per_month:"/ মাস",most_popular:"সবচেয়ে জনপ্রিয়",all:"সব",search_ph:"পণ্য খুঁজুন…",sort:"সাজান",featured:"বৈশিষ্ট্যযুক্ত",price_low:"মূল্য: কম থেকে বেশি",price_high:"মূল্য: বেশি থেকে কম",items:"আইটেম",add:"যোগ করুন",add_to_cart:"যোগ করুন",per_pc:"প্রতি পিস",powered_by:"দ্বারা পরিচালিত",store_tagline:"Phantom, Mandrake & Betal — in English, Hindi & Bengali",welcome:"স্বাগতম",empty_cart:"আপনার কার্ট খালি।",empty_store:"আপনার অনুসন্ধানের সঙ্গে কোনো পণ্য মেলেনি।",close:"বন্ধ করুন",save:"সংরক্ষণ করুন",full_name:"পুরো নাম",phone:"ফোন",delivery_address:"ডেলিভারি ঠিকানা",notes:"বিক্রেতার জন্য নোট (ঐচ্ছিক)",submit_whatsapp:"WhatsApp-এ পাঠান",delivery_title:"ডেলিভারি বিবরণ",plan_form_title:"শুরু করুন",your_name:"আপনার নাম",business_name:"ব্যবসা / স্টোরের নাম",email:"ইমেইল",plan:"প্ল্যান",login_note_title:"অ্যাডমিন লগইন",login_note:"স্টোরের মালিক ও সুপার-অ্যাডমিন লগইন এই পাবলিক সাইটে নয়, ক্যাটালগ প্রো অ্যাপে পরিচালিত হয়। লগইন ও স্টোর পরিচালনার জন্য অ্যাপটি ব্যবহার করুন।",step1:"আপনার পণ্য যোগ করুন",step1d:"Excel, CSV বা JSON থেকে বাল্ক-ইমপোর্ট করুন, বা একে একে যোগ করুন।",step2:"আপনার লিংক শেয়ার করুন",step2d:"আপনার স্টোর লিংক WhatsApp ও Instagram-এ শেয়ার করুন।",step3:"WhatsApp-এ অর্ডার পান",step3d:"গ্রাহকরা সরাসরি WhatsApp-এ অর্ডার দেন — কোনো অ্যাপ দরকার নেই।",f_mobile:"মোবাইল-ফার্স্ট ডিজাইন",f_mobile_d:"গ্রাহকরা আসলে যেভাবে ব্রাউজ করেন, তার জন্য তৈরি। দ্রুত, পরিষ্কার, যেকোনো ফোনে সহজ।",f_wa:"WhatsApp অর্ডারিং",f_wa_d:"গ্রাহকরা সরাসরি WhatsApp-এ অর্ডার দেন। কোনো লগইন নেই, কোনো বাধা নেই, শুধু বিক্রি।",f_theme:"কাস্টম থিম",f_theme_d:"স্টোরফ্রন্ট থিম বেছে নিন এবং রং আপনার ব্র্যান্ডের সঙ্গে মেলান।",f_bulk:"বাল্ক ইমপোর্ট",f_bulk_d:"Excel, CSV বা JSON থেকে একসঙ্গে শত শত পণ্য ইমপোর্ট করুন — ছবির লিংক বা আপলোড দিয়ে কভারসহ।",f_share:"সহজ শেয়ারিং",f_share_d:"আপনার ক্যাটালগ লিংক WhatsApp, Instagram, Facebook বা যেকোনো জায়গায় শেয়ার করুন।",f_dash:"লাইভ ড্যাশবোর্ড",f_dash_d:"একটি সহজ ড্যাশবোর্ড থেকে অর্ডার, স্টক ও বিক্রি দেখুন।",check1:"মোবাইল-অপ্টিমাইজড ক্যাটালগ",check2:"WhatsApp অর্ডারিং",check3:"কাস্টম ব্র্যান্ডিং",check4:"তাৎক্ষণিক শেয়ারিং লিংক",check5:"রিয়েল-টাইম ইনভেন্টরি",check6:"অ্যানালিটিক্স ড্যাশবোর্ড",ads_note:"বিজ্ঞাপন খরচ সাবস্ক্রিপশন ফি-তে অন্তর্ভুক্ত নয়। গ্রাহককে Meta Ads বাজেট আলাদাভাবে দিতে হবে।",view_store:"লাইভ স্টোর দেখুন",open_store:"স্টোর খুলুন →",order_now:"এখনই অর্ডার করুন",qty:"পরিমাণ",remove:"সরান",description:"বিবরণ",isbn:"ISBN",language:"ভাষা",series:"সিরিজ",required:"আবশ্যক",fill_name:"অনুগ্রহ করে আপনার পুরো নাম লিখুন",fill_phone:"অনুগ্রহ করে আপনার ফোন নম্বর লিখুন",fill_address:"অনুগ্রহ করে আপনার ডেলিভারি ঠিকানা লিখুন",fill_plan_name:"অনুগ্রহ করে আপনার নাম লিখুন",fill_plan_phone:"অনুগ্রহ করে আপনার ফোন নম্বর লিখুন",ready_title:"বিক্রি শুরু করতে প্রস্তুত?",ready_sub:"৫ মিনিটে আপনার ডিজিটাল ক্যাটালগ তৈরি করুন — উপরে একটি প্ল্যান বেছে নিন এবং আজই WhatsApp-এ বিক্রি শুরু করুন।",footer_tag:"ছোট ব্যবসার জন্য WhatsApp-ফার্স্ট ক্যাটালগ",showcase_eyebrow:"ক্যাটালগ প্রো-তে লাইভ",added:"যোগ করা হয়েছে ✓",in_stock:"স্টকে আছে",out_of_stock:"স্টক শেষ",left:"বাকি",share:"শেয়ার করুন",share_title:"Share LyfexDigital Comic Store",share_caption:"যেকোনো ফোনে এই ক্যাটালগ খুলতে স্ক্যান করুন",copy:"কপি করুন",copied:"Copied ✓",share_apps:"আপনার অ্যাপ দিয়ে শেয়ার করুন",share_text:"Lyfex Digital Comic Store দেখুন"}
};
const CAT_I18N = {
"The Phantom":{hi:"द फैंटम",bn:"দ্য ফ্যান্টম"},"Mandrake the Magician":{hi:"मैंड्रेक द मैजिशियन",bn:"ম্যান্ড্রেক দ্য ম্যাজিশিয়ান"},"Flash Gordon":{hi:"फ्लैश गॉर्डन",bn:"ফ্ল্যাশ গর্ডন"},"Rip Kirby":{hi:"रिप किर्बी",bn:"রিপ কিরবি"},"Popeye the Sailor":{hi:"पोपाय द सेलर",bn:"পপাই দ্য সেইলর"},"The Simpsons":{hi:"द सिम्पसंस",bn:"দ্য সিম্পসন্স"},"Shakti Imprints":{hi:"शक्ति इम्प्रिंट्स",bn:"শক্তি ইমপ্রিন্টস"},"Classic Stories":{hi:"क्लासिक स्टोरीज़",bn:"ক্লাসিক স্টোরিজ"},"Merchandise":{hi:"मर्चेंडाइज़",bn:"মার্চেন্ডাইজ"}};
const t = k => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
const catName = c => (lang==="en" ? c : (CAT_I18N[c] && CAT_I18N[c][lang]) || c);
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const inr = n => n==null ? "—" : Number(n).toLocaleString("en-IN");
const $ = s => document.querySelector(s);

/* Demo store themes from the live app's theme picker */
const DEMO_THEMES = {
  amber:{name:"Amber Press",accent:"#d97706",accentStrong:"#b45309",bg:"#fff8ec",surface:"#fffdf7",ink:"#16130e"},
  ocean:{name:"Ocean Ink",accent:"#0369a1",accentStrong:"#075985",bg:"#eef7fc",surface:"#ffffff",ink:"#0c1a24"},
  forest:{name:"Forest Panel",accent:"#15803d",accentStrong:"#166534",bg:"#f0f8f1",surface:"#ffffff",ink:"#101a12"},
  crimson:{name:"Crimson Pop",accent:"#dc2626",accentStrong:"#b91c1c",bg:"#fdf1f1",surface:"#fffafa",ink:"#1c0d0d"}
};
function resolvedTheme(){ return themeMode==="auto" ? (window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light") : themeMode; }
function applyDemoTheme(){
  const th = DEMO_THEMES[demoTheme] || DEMO_THEMES.amber;
  if(resolvedTheme()==="light"){ document.documentElement.style.setProperty("--accent", th.accent); document.documentElement.style.setProperty("--accent-strong", th.accentStrong); }
  else { document.documentElement.style.removeProperty("--accent"); document.documentElement.style.removeProperty("--accent-strong"); }
}
function applyTheme(){
  /* Auto removes data-theme so the prefers-color-scheme media query applies; explicit choice sets it. */
  if(themeMode==="auto") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", themeMode);
  document.querySelectorAll("[data-theme-btn]").forEach(b=>b.classList.toggle("active", b.getAttribute("data-theme-btn")===themeMode));
  applyDemoTheme();
}
function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{ el.textContent = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-lang]").forEach(b=>b.classList.toggle("active", b.getAttribute("data-lang")===lang));
  localStorage.setItem("cp-lang", lang);
}
function cartTotal(){ return cart.reduce((a,it)=>{ const p=PRODUCTS[it.idx]; return a + (p ? (p.price||0)*it.qty : 0); }, 0); }
function saveCart(){ localStorage.setItem("cp-cart", JSON.stringify(cart)); updateCartCounts(); }
function updateCartCounts(){
  const n = cart.reduce((a,i)=>a+i.qty,0);
  ["#cartCount","#cartCountTop"].forEach(s=>{ const e=$(s); if(e) e.textContent=n; });
  const fab = $("#cartFab");
  if(fab){
    if(n>0){ fab.classList.remove("hidden"); fab.textContent = "🛒 " + n + " • ₹" + inr(cartTotal()) + " — " + t("order_whatsapp"); }
    else fab.classList.add("hidden");
  }
}
function openModal(html){ $("#modalCard").innerHTML=html; $("#modalCard").classList.remove("share-card"); $("#modal").classList.add("open"); $("#overlay").classList.add("open"); }
function closeModal(){ $("#modal").classList.remove("open"); if(!$("#cartDrawer").classList.contains("open")) $("#overlay").classList.remove("open"); }
function openCart(){ renderCart(); $("#cartDrawer").classList.add("open"); $("#overlay").classList.add("open"); }
function closeCart(){ $("#cartDrawer").classList.remove("open"); $("#overlay").classList.remove("open"); }
function waLink(msg){ return "https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(msg); }

const PLANS = [
{name:"Starter",price:999,tag:"Perfect for small businesses and independent sellers.",features:["Up to 50 products","Dedicated digital storefront","Custom store link & QR code","WhatsApp ordering","Product categories & search","Shopping cart","Basic store analytics","Email support"]},
{name:"Professional",price:1999,popular:true,tag:"Designed for growing businesses looking to scale.",features:["Everything in Starter, plus:","Up to 500 products","Custom store colours","Advanced store analytics","Bulk product import & export","Custom promotional banners","Priority support"]},
{name:"Business",price:3999,tag:"For established brands seeking a premium digital presence.",features:["Everything in Professional, plus:","Unlimited products","Remove Catalogue Pro branding option","Premium storefront designs","Team collaboration & access management","Priority listing on Catalogue Pro","Advanced sales & customer insights","Dedicated support"]},
{name:"Business+",price:6999,tag:"For ambitious brands ready to accelerate sales through digital marketing.",features:["Everything in Business, plus:","Meta Ads management support","Facebook & Instagram ad campaign setup","Audience research & targeting","Campaign monitoring & optimisation","Monthly advertising performance report","Dedicated account manager","Premium priority support"]}
];
const CATS = ["The Phantom","Mandrake the Magician","Flash Gordon","Rip Kirby","Popeye the Sailor","The Simpsons","Shakti Imprints","Classic Stories","Merchandise"];
function catCount(c){ return PRODUCTS.filter(p=>p.series===c).length; }
function filtered(){
  let list = PRODUCTS.filter(p => (activeCat==="All" || p.series===activeCat));
  if(searchQ){ const q=searchQ.toLowerCase(); list=list.filter(p=>(p.title+" "+p.series+" "+p.language+" "+(p.isbn||"")).toLowerCase().includes(q)); }
  if(sortBy==="price_low") list=[...list].sort((a,b)=>(a.price||0)-(b.price||0));
  if(sortBy==="price_high") list=[...list].sort((a,b)=>(b.price||0)-(a.price||0));
  return list;
}
/* Series colours for the fallback cover, as in the live app */
function seriesColour(p){
  const hay = (p.series||"") + " " + (p.title||"");
  if(/phantom/i.test(hay)) return {bg:"#5b21b6", fg:"#f5f0ff"};
  if(/betal/i.test(hay)) return {bg:"#9d174d", fg:"#fff1f2"};
  if(/mandrake/i.test(hay)) return {bg:"#065f46", fg:"#ecfdf5"};
  return {bg:"#b45309", fg:"#fffbeb"};
}
function issueNo(p){
  const m = String(p.title||"").match(/#\s*(\d+)/) || String(p.title||"").match(/(\d+)/);
  return m ? m[1] : "•";
}
function coverHTML(p){
  if(p.image_url) return `<img class="cover" src="${esc(p.image_url)}" alt="${esc(p.title)}" loading="lazy">`;
  const c = seriesColour(p);
  return `<div class="cover fallback" style="background:${c.bg};color:${c.fg}">
    <div class="fb-top"><span>${esc(p.series||"")}</span><span>${esc(p.language||"")}</span></div>
    <div class="fb-mid"><div class="fb-num">${esc(issueNo(p))}</div><div class="fb-title">${esc(p.title)}</div></div>
    <div class="fb-bottom"><span>LYFEX DIGITAL</span><span>₹${inr(p.price)}</span></div>
  </div>`;
}
function badgeHTML(p){
  if(!p.badge) return "";
  const hot = /PRE-ORDER|BEST SELLER/i.test(p.badge);
  return `<span class="badge ${hot?"hot":"std"}">${esc(p.badge)}</span>`;
}
function stockHTML(p){
  if(p.stock==null) return "";
  if(p.stock<=0) return `<div class="stock out">${esc(t("out_of_stock"))}</div>`;
  if(p.stock<=10) return `<div class="stock low">${p.stock} ${esc(t("left"))}</div>`;
  return `<div class="stock">${esc(t("in_stock"))}</div>`;
}
function cardHTML(p,i){
  const out = p.stock!=null && p.stock<=0;
  const mrp = (p.mrp!=null && p.mrp>p.price) ? `<span class="mrp">₹${inr(p.mrp)}</span>` : "";
  return `<article class="product" data-idx="${i}" tabindex="0"><div>${coverHTML(p)}</div><div class="body">${badgeHTML(p)}<h3>${esc(p.title)}</h3><div class="meta">${esc(p.language)} • ${esc(catName(p.series))}${p.isbn?` • ${esc(t("isbn"))} ${esc(p.isbn)}`:""}</div>${stockHTML(p)}<div class="row"><div><span class="price">₹${inr(p.price)}</span>${mrp}<span class="per-pc">${esc(t("per_pc"))}</span></div><button class="add-btn" data-add="${i}" ${out?"disabled":""} aria-label="${esc(t("add"))} ${esc(p.title)}">+ ${esc(t("add"))}</button></div></div></article>`;
}
function previewHTML(){
  const th = DEMO_THEMES[demoTheme] || DEMO_THEMES.amber;
  const minis = PRODUCTS.slice(0,4).map(p=>`<div class="mini-card" style="border-color:${th.ink};background:${th.surface}">
    ${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.title)}" loading="lazy">`:`<div style="aspect-ratio:3/4;display:grid;place-items:center;background:${seriesColour(p).bg};color:${seriesColour(p).fg};font:900 24px var(--font-display)">${esc(issueNo(p))}</div>`}
    <div class="mini-body"><div class="mini-title" style="color:${th.ink}">${esc(p.title)}</div><div class="mini-row"><span class="mini-price" style="color:${th.ink}">₹${inr(p.price)}</span><span class="mini-add" style="background:${th.accent}">+ ${esc(t("add"))}</span></div></div>
  </div>`).join("");
  return `<div class="mini-head" style="border-bottom-color:${th.ink}">
    <img src="lyfex-logo.jpg" alt="LyfexDigital logo" style="border-color:${th.ink}">
    <span class="mini-name" style="color:${th.ink}">Lyfex Digital Comic Store</span>
    <span class="mini-cart" style="background:${th.accent}">🛒 ${esc(t("cart"))}</span>
  </div><div class="mini-grid">${minis}</div>`;
}
function renderHome(){
  const app=$("#app");
  app.innerHTML = `
  <section class="hero halftone"><div class="container">
    <span class="eyebrow">${esc(t("hero_badge"))}</span>
    <h1>${esc(t("hero_title"))}</h1>
    <p class="lead">${esc(t("hero_sub"))}</p>
    <div class="cta-row">
      <a class="btn btn-primary btn-hero" href="${homePath()}#pricing">${esc(t("create_catalogue"))}</a>
      <a class="btn btn-hero" href="${storePath(STORE_SLUG)}">${esc(t("see_live_store"))}</a>
    </div>
    <p class="footnote">${esc(t("trust"))}</p>
  </div></section>
  <section class="section"><div class="container">
    <div class="showcase-card">
      <img class="logo-img" src="lyfex-logo.jpg" alt="LyfexDigital logo">
      <div>
        <div class="eyebrow-sm">${esc(t("showcase_eyebrow"))}</div>
        <h3>Lyfex Digital Comic Store</h3>
        <p>${esc(t("store_tagline"))}</p>
      </div>
      <a class="btn btn-wa" href="${storePath(STORE_SLUG)}">${esc(t("open_store"))}</a>
    </div>
  </div></section>
  <section class="section" id="preview" style="padding-top:0"><div class="container">
    <h2>${esc(t("preview_title"))}</h2><p class="sub">${esc(t("preview_sub"))}</p>
    <div class="showcase">
      <div>
        <h3>${esc(t("choose_theme"))}</h3>
        <div class="theme-list">
          ${Object.entries(DEMO_THEMES).map(([k,v])=>`<button class="theme-btn ${demoTheme===k?"active":""}" data-demo-theme="${k}"><span class="swatch" style="background:${v.accent}"></span><span><strong>${v.name}</strong><small>Accent ${v.accent}</small></span></button>`).join("")}
        </div>
        <ul class="checklist">${[1,2,3,4,5,6].map(n=>`<li>${esc(t("check"+n))}</li>`).join("")}</ul>
      </div>
      <div class="preview" id="themePreview" style="border-color:${(DEMO_THEMES[demoTheme]||DEMO_THEMES.amber).ink};background:${(DEMO_THEMES[demoTheme]||DEMO_THEMES.amber).bg}">${previewHTML()}</div>
    </div>
  </div></section>
  <section class="section features-sec" id="features"><div class="container">
    <h2>${esc(t("features_title"))}</h2><p class="sub">${esc(t("features_sub"))}</p>
    <div class="grid-features">
      ${[["f_mobile","f_mobile_d"],["f_wa","f_wa_d"],["f_theme","f_theme_d"],["f_bulk","f_bulk_d"],["f_share","f_share_d"],["f_dash","f_dash_d"]].map(([a,b])=>`<div class="feature-card"><h3>${esc(t(a))}</h3><p>${esc(t(b))}</p></div>`).join("")}
    </div>
    <h3 style="text-align:center;margin:32px 0 0;font-size:20px;font-weight:900">${esc(t("how_title"))}</h3>
    <div class="steps">
      <div><div class="step-num">1</div><h3>${esc(t("step1"))}</h3><p>${esc(t("step1d"))}</p></div>
      <div><div class="step-num">2</div><h3>${esc(t("step2"))}</h3><p>${esc(t("step2d"))}</p></div>
      <div><div class="step-num">3</div><h3>${esc(t("step3"))}</h3><p>${esc(t("step3d"))}</p></div>
    </div>
  </div></section>
  <section class="section" id="pricing"><div class="container">
    <h2>${esc(t("pricing_title"))}</h2><p class="sub">${esc(t("pricing_sub"))}</p>
    <div class="pricing">
      ${PLANS.map(p=>`<div class="plan ${p.popular?"popular":""}">${p.popular?`<span class="badge-pop">${esc(t("most_popular"))}</span>`:""}<h3>${esc(p.name)}</h3><p class="blurb">${esc(p.tag)}</p><div class="price">₹${inr(p.price)}<small> ${esc(t("per_month"))}</small></div><ul>${p.features.map(f=>`<li>${esc(f)}</li>`).join("")}</ul>${p.name==="Business+"?`<p class="ads-note">${esc(t("ads_note"))}</p>`:""}<button class="btn ${p.popular?"btn-primary":""}" data-plan="${esc(p.name)}">${esc(t("start_now"))}</button></div>`).join("")}
    </div>
  </div></section>
  <section class="cta-band"><div class="container">
    <h2>${esc(t("ready_title"))}</h2>
    <p class="sub">${esc(t("ready_sub"))}</p>
    <a class="btn btn-primary btn-hero btn-cta" href="${homePath()}#pricing">${esc(t("create_catalogue"))}</a>
    <div class="foot-row"><strong>Catalogue Pro</strong> · <a href="${storePath(STORE_SLUG)}">Lyfex Digital Comic Store</a> · ${esc(t("footer_tag"))}</div>
  </div></section>`;
  bindHome();
}
function bindHome(){
  document.querySelectorAll("[data-demo-theme]").forEach(b=>b.addEventListener("click",()=>{
    demoTheme=b.getAttribute("data-demo-theme"); localStorage.setItem("cp-demo-theme",demoTheme);
    applyDemoTheme();
    document.querySelectorAll("[data-demo-theme]").forEach(x=>x.classList.toggle("active", x===b));
    const pv=$("#themePreview"); const th=DEMO_THEMES[demoTheme];
    if(pv){ pv.style.borderColor=th.ink; pv.style.background=th.bg; pv.innerHTML=previewHTML(); }
  }));
  document.querySelectorAll("[data-plan]").forEach(b=>b.addEventListener("click",()=>openPlanForm(b.getAttribute("data-plan"))));
}
function renderStore(){
  const list = filtered();
  const app=$("#app");
  app.innerHTML = `
  <section class="store-banner halftone"><div class="container store-banner-in">
    <img class="logo-img" src="lyfex-logo.jpg" alt="LyfexDigital logo">
    <div><h1>Lyfex Digital Comic Store</h1><p>${esc(t("store_tagline"))}</p></div>
  </div></section>
  <div class="container">
    <div class="store-toolbar" id="storeToolbar">
      <button class="btn btn-sm btn-share" id="shareBtn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg><span data-i18n="share">Share</span></button>
      <span class="spacer"></span>
      <div class="seg" role="group" aria-label="Language">
        <button class="seg-btn active" data-lang="en">EN</button>
        <button class="seg-btn" data-lang="hi">हिंदी</button>
        <button class="seg-btn" data-lang="bn">বাংলা</button>
      </div>
      <div class="seg" role="group" aria-label="Theme">
        <button class="seg-btn active" data-theme-btn="auto">Auto</button>
        <button class="seg-btn" data-theme-btn="light">Light</button>
        <button class="seg-btn" data-theme-btn="dark">Dark</button>
      </div>
      <button class="btn btn-sm btn-wa" id="storeCartBtn">🛒 <span data-i18n="cart">Cart</span> (<span id="cartCount">0</span>)</button>
    </div>
    <div class="toolbar">
      <input class="search-input" id="searchBox" type="search" placeholder="${esc(t("search_ph"))}" value="${esc(searchQ)}">
      <select id="sortSel" aria-label="${esc(t("sort"))}">
        <option value="featured" ${sortBy==="featured"?"selected":""}>${esc(t("featured"))}</option>
        <option value="price_low" ${sortBy==="price_low"?"selected":""}>${esc(t("price_low"))}</option>
        <option value="price_high" ${sortBy==="price_high"?"selected":""}>${esc(t("price_high"))}</option>
      </select>
    </div>
    <div class="pills">
      <button class="pill-btn ${activeCat==="All"?"active":""}" data-cat="All">${esc(t("all"))} ${PRODUCTS.length}</button>
      ${CATS.map(c=>`<button class="pill-btn ${activeCat===c?"active":""}" data-cat="${esc(c)}">${esc(catName(c))} ${catCount(c)}</button>`).join("")}
    </div>
    <p style="color:var(--dim)">${list.length} ${esc(t("items"))}</p>
    <div class="grid-products" id="grid">${list.length?list.map(p=>cardHTML(p, PRODUCTS.indexOf(p))).join(""):`<p class="empty">${esc(t("empty_store"))}</p>`}</div>
  </div>
  <footer class="site"><div class="container"><p>${esc(t("powered_by"))} <a href="${homePath()}">Catalogue Pro</a></p><p>© 2026 Catalogue Pro. All rights reserved.</p></div></footer>`;
  $("#searchBox").addEventListener("input",e=>{ searchQ=e.target.value; const pos=e.target.selectionStart; renderStoreKeepFocus(pos); });
  $("#sortSel").addEventListener("change",e=>{ sortBy=e.target.value; renderStore(); });
  document.querySelectorAll("[data-cat]").forEach(b=>b.addEventListener("click",()=>{ activeCat=b.getAttribute("data-cat"); renderStore(); }));
  bindStoreToolbar();
  bindGrid();
}
function renderStoreKeepFocus(pos){
  renderStore(); const s=$("#searchBox"); if(s){ s.focus(); s.setSelectionRange(pos,pos); }
}
function bindGrid(){
  document.querySelectorAll(".product").forEach(el=>{
    el.addEventListener("click",e=>{ if(e.target.closest("[data-add]")) return; openDetail(Number(el.getAttribute("data-idx"))); });
    el.addEventListener("keydown",e=>{ if(e.key==="Enter") openDetail(Number(el.getAttribute("data-idx"))); });
  });
  document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",e=>{
    e.stopPropagation();
    const idx=Number(b.getAttribute("data-add"));
    addToCart(idx);
    const label=b.textContent; b.textContent=t("added"); b.disabled=true;
    setTimeout(()=>{ b.textContent=label; b.disabled=false; },1200);
  }));
}
function addToCart(idx){ const p=PRODUCTS[idx]; if(!p) return; const ex=cart.find(i=>i.idx===idx); if(ex) ex.qty++; else cart.push({idx,qty:1}); saveCart(); openCart(); }
function renderCart(){
  const box=$("#cartItems");
  if(!cart.length){ box.innerHTML=`<p>${esc(t("empty_cart"))}</p>`; $("#cartTotal").textContent="0"; return; }
  let total=0;
  box.innerHTML = cart.map((it,i)=>{ const p=PRODUCTS[it.idx]; const line=(p.price||0)*it.qty; total+=line;
    return `<div class="cart-item"><img src="${esc(p.image_url||"lyfex-logo.jpg")}" alt=""><div style="flex:1"><strong>${esc(p.title)}</strong><div style="color:var(--dim);font-size:13px">₹${inr(p.price)} × ${it.qty} = ₹${inr(line)}</div></div><div class="qty"><button data-dec="${i}">−</button><span>${it.qty}</span><button data-inc="${i}">+</button><button data-rem="${i}" style="width:auto;padding:0 8px">${esc(t("remove"))}</button></div></div>`; }).join("");
  $("#cartTotal").textContent=inr(total);
  box.querySelectorAll("[data-inc]").forEach(b=>b.addEventListener("click",()=>{ cart[+b.getAttribute("data-inc")].qty++; saveCart(); renderCart(); }));
  box.querySelectorAll("[data-dec]").forEach(b=>b.addEventListener("click",()=>{ const it=cart[+b.getAttribute("data-dec")]; it.qty--; if(it.qty<=0) cart.splice(+b.getAttribute("data-dec"),1); saveCart(); renderCart(); }));
  box.querySelectorAll("[data-rem]").forEach(b=>b.addEventListener("click",()=>{ cart.splice(+b.getAttribute("data-rem"),1); saveCart(); renderCart(); }));
}
function openDetail(idx){
  const p=PRODUCTS[idx]; if(!p) return;
  const out = p.stock!=null && p.stock<=0;
  openModal(`<div class="detail-img">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.title)}">`:coverHTML(p)}</div>
  <h2 style="margin-top:14px">${esc(p.title)}</h2>
  <p style="color:var(--dim)">${esc(p.language)} • ${esc(catName(p.series))}${p.isbn?` • ${esc(t("isbn"))} ${esc(p.isbn)}`:""}</p>
  ${p.badge?`<p>${badgeHTML(p)}</p>`:""}
  <p>${esc(p.description||"")}</p>
  <p style="font-size:22px;font-weight:900;font-family:var(--font-display)">₹${inr(p.price)}${(p.mrp!=null && p.mrp>p.price)?` <span class="mrp">₹${inr(p.mrp)}</span>`:""}</p>
  <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" id="detailAdd" ${out?"disabled":""}>${esc(t("add_to_cart"))}</button><button class="btn btn-wa" id="detailOrder">${esc(t("order_now"))}</button><button class="btn" id="detailClose">${esc(t("close"))}</button></div>`);
  $("#detailAdd").addEventListener("click",()=>{ closeModal(); addToCart(idx); });
  $("#detailOrder").addEventListener("click",()=>{ closeModal(); cart=[{idx,qty:1}]; saveCart(); openDeliveryForm(true); });
  $("#detailClose").addEventListener("click",closeModal);
}
function openDeliveryForm(single){
  if(!cart.length){ alert(t("empty_cart")); return; }
  openModal(`<h2>${esc(t("delivery_title"))}</h2>
  <form id="delForm">
    <div class="field"><label>${esc(t("full_name"))} <span class="req">*</span></label><input id="dName" required></div>
    <div class="field"><label>${esc(t("phone"))} <span class="req">*</span></label><input id="dPhone" type="tel" required></div>
    <div class="field"><label>${esc(t("delivery_address"))} <span class="req">*</span></label><textarea id="dAddr" rows="3" required></textarea></div>
    <div class="field"><label>${esc(t("notes"))}</label><textarea id="dNotes" rows="2"></textarea></div>
    <button class="btn btn-primary" type="submit" style="width:100%">${esc(t("submit_whatsapp"))}</button>
    <button class="btn" type="button" id="delCancel" style="width:100%;margin-top:8px">${esc(t("close"))}</button>
  </form>`);
  $("#delCancel").addEventListener("click",closeModal);
  $("#delForm").addEventListener("submit",e=>{
    e.preventDefault();
    const name=$("#dName").value.trim(), phone=$("#dPhone").value.trim(), addr=$("#dAddr").value.trim(), notes=$("#dNotes").value.trim();
    if(!name) return alert(t("fill_name")); if(!phone) return alert(t("fill_phone")); if(!addr) return alert(t("fill_address"));
    let total=0; const lines=cart.map(it=>{ const p=PRODUCTS[it.idx]; const l=(p.price||0)*it.qty; total+=l; return `• ${p.title} x${it.qty} — ₹${inr(l)}`; });
    const msg=`Hello Lyfex Digital Comic Store! I would like to order:\n${lines.join("\n")}\nTotal: ₹${inr(total)}\n\nDelivery details:\nFull Name: ${name}\nPhone: ${phone}\nDelivery Address: ${addr}${notes?`\nNotes for seller: ${notes}`:""}`;
    cart=[]; saveCart(); closeCart(); closeModal();
    window.open(waLink(msg),"_blank");
  });
}
function openPlanForm(plan){
  openModal(`<h2>${esc(t("plan_form_title"))} ${esc(plan)}</h2>
  <form id="planForm">
    <div class="field"><label>${esc(t("plan"))}</label><input value="${esc(plan)}" disabled></div>
    <div class="field"><label>${esc(t("your_name"))} <span class="req">*</span></label><input id="pName" required></div>
    <div class="field"><label>${esc(t("phone"))} <span class="req">*</span></label><input id="pPhone" type="tel" required></div>
    <div class="field"><label>${esc(t("business_name"))}</label><input id="pBiz"></div>
    <div class="field"><label>${esc(t("email"))}</label><input id="pEmail" type="email"></div>
    <button class="btn btn-primary" type="submit" style="width:100%">${esc(t("submit_whatsapp"))}</button>
    <button class="btn" type="button" id="planCancel" style="width:100%;margin-top:8px">${esc(t("close"))}</button>
  </form>`);
  $("#planCancel").addEventListener("click",closeModal);
  $("#planForm").addEventListener("submit",e=>{
    e.preventDefault();
    const name=$("#pName").value.trim(), phone=$("#pPhone").value.trim(), biz=$("#pBiz").value.trim(), email=$("#pEmail").value.trim();
    if(!name) return alert(t("fill_plan_name")); if(!phone) return alert(t("fill_plan_phone"));
    const msg=`Hello Catalogue Pro! I would like to start with the ${plan} plan.\n\nName: ${name}\nPhone: ${phone}\nBusiness / Store name: ${biz||"-"}\nEmail: ${email||"-"}\nPlan: ${plan}`;
    closeModal(); window.open(waLink(msg),"_blank");
  });
}
function openLoginNote(){
  openModal(`<h2>${esc(t("login_note_title"))}</h2><div class="note">${esc(t("login_note"))}</div><button class="btn" id="loginClose" style="width:100%;margin-top:14px">${esc(t("close"))}</button>`);
  $("#loginClose").addEventListener("click",closeModal);
}
/* Store toolbar + Share modal */
function bindStoreToolbar(){
  const tb=$("#storeToolbar"); if(!tb) return;
  tb.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>{ lang=b.getAttribute("data-lang"); applyLang(); route(); }));
  tb.querySelectorAll("[data-theme-btn]").forEach(b=>b.addEventListener("click",()=>{ themeMode=b.getAttribute("data-theme-btn"); localStorage.setItem("cp-theme",themeMode); applyTheme(); }));
  const sb=$("#shareBtn"); if(sb) sb.addEventListener("click",openShareModal);
  const cb=$("#storeCartBtn"); if(cb) cb.addEventListener("click",openCart);
}
async function copyText(txt){
  try{ await navigator.clipboard.writeText(txt); return true; }
  catch(e){
    const ta=document.createElement("textarea"); ta.value=txt; ta.style.position="fixed"; ta.style.opacity="0";
    document.body.appendChild(ta); ta.select();
    try{ document.execCommand("copy"); }catch(_){}
    ta.remove(); return true;
  }
}
function flashCopied(btn,label){
  const orig=btn.textContent; btn.textContent=t("copied"); btn.disabled=true;
  setTimeout(()=>{ btn.textContent=label; btn.disabled=false; },1500);
}
const SHARE_SVGS = {
  wa:'<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
  fb:'<svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  tw:'<svg viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',
  ig:'<svg viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>'
};
function openShareModal(){
  const link = storeUrl();
  const qr = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(link);
  const shareText = t("share_text") + ": " + link;
  openModal(`<div class="share-head"><h2>${esc(t("share_title"))}</h2><button class="share-close" id="shareClose" aria-label="${esc(t("close"))}">✕</button></div>
  <div class="share-qr"><img src="${qr}" alt="QR code for Lyfex Digital Comic Store" loading="lazy"><p>${esc(t("share_caption"))}</p></div>
  <div class="share-link"><input id="shareLinkInput" type="text" readonly value="${link}"><button class="btn btn-wa" id="copyLinkBtn">${esc(t("copy"))}</button></div>
  <button class="share-apps" id="shareAppsBtn">↗ ${esc(t("share_apps"))}</button>
  <div class="share-row">
    <a class="share-svc wa" href="https://wa.me/?text=${encodeURIComponent(shareText)}" target="_blank" rel="noopener">${SHARE_SVGS.wa}<span>WhatsApp</span></a>
    <a class="share-svc fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}" target="_blank" rel="noopener">${SHARE_SVGS.fb}<span>Facebook</span></a>
    <a class="share-svc tw" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(t("share_text"))}&amp;url=${encodeURIComponent(link)}" target="_blank" rel="noopener">${SHARE_SVGS.tw}<span>Twitter</span></a>
    <button class="share-svc ig" id="shareIgBtn" type="button">${SHARE_SVGS.ig}<span>Instagram</span></button>
  </div>`);
  $("#modalCard").classList.add("share-card");
  $("#shareClose").addEventListener("click",closeModal);
  const copyBtn=$("#copyLinkBtn");
  copyBtn.addEventListener("click",async()=>{
    const inp=$("#shareLinkInput"); if(inp) inp.select();
    await copyText(link); flashCopied(copyBtn, t("copy"));
  });
  const appsBtn=$("#shareAppsBtn");
  appsBtn.addEventListener("click",async()=>{
    if(navigator.share){
      try{ await navigator.share({title:"Lyfex Digital Comic Store", text:t("share_text"), url:link}); }catch(e){ /* user dismissed */ }
    } else {
      await copyText(link); flashCopied(appsBtn, "↗ " + t("share_apps"));
    }
  });
  $("#shareIgBtn").addEventListener("click",async()=>{
    /* Instagram has no web share URL: copy the store link, then open Instagram. */
    await copyText(link);
    window.open("https://www.instagram.com/","_blank");
  });
}
function go(path){ history.pushState({}, "", path); route(); }
function route(){
  /* Strip the hosting base before matching, so /cataloguepro/store/<slug> and /store/<slug> both route to the store. */
  let raw = (window.location.pathname.replace(/\/+$/,"") || "/");
  let path = raw;
  if(BASE && raw === BASE) path = "/";
  else if(BASE && raw.indexOf(BASE + "/") === 0) path = raw.slice(BASE.length);
  let view = "home", section = null;
  if(path.startsWith("/store/")){
    view = "store";
  } else {
    /* Legacy hash route (e.g. an old bookmarked link) is read as a fallback only. */
    const hp = (window.location.hash || "").replace(/^#/, "");
    if(hp.startsWith("/store/")) view = "store";
    else if(hp === "/pricing" || hp === "pricing") section = "pricing";
    else if(hp === "/features" || hp === "features") section = "features";
  }
  /* On the store page the platform header is hidden; the store toolbar carries the controls. */
  document.body.classList.toggle("store-page", view === "store");
  closeCart();
  if(view === "store") renderStore(); else renderHome();
  applyLang(); window.scrollTo(0,0);
  if(section){ setTimeout(()=>{ const el=document.getElementById(section); if(el) el.scrollIntoView(); },50); }
}
document.addEventListener("DOMContentLoaded",()=>{
  applyTheme(); applyLang(); updateCartCounts();
  document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>{ lang=b.getAttribute("data-lang"); applyLang(); route(); }));
  document.querySelectorAll("[data-theme-btn]").forEach(b=>b.addEventListener("click",()=>{ themeMode=b.getAttribute("data-theme-btn"); localStorage.setItem("cp-theme",themeMode); applyTheme(); }));
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{ if(themeMode==="auto") applyTheme(); });
  $("#loginBtn").addEventListener("click",openLoginNote);
  $("#cartBtnTop").addEventListener("click",openCart);
  $("#cartFab").addEventListener("click",openCart);
  $("#closeCart").addEventListener("click",closeCart);
  $("#checkoutBtn").addEventListener("click",()=>{ closeCart(); openDeliveryForm(false); });
  $("#overlay").addEventListener("click",()=>{ closeModal(); closeCart(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeModal(); });
  $("#modal").addEventListener("click",e=>{ if(e.target.id==="modal") closeModal(); });
  /* Intercept same-origin internal links and resolve them against the document base,
     so relative hrefs (".", "#pricing", "store/...") navigate inside the SPA under either base. */
  document.addEventListener("click",e=>{
    const a = e.target.closest("a[href]");
    if(!a || a.target === "_blank") return;
    let url;
    try{ url = new URL(a.getAttribute("href"), document.baseURI); }catch(_){ return; }
    if(url.origin !== window.location.origin) return;
    e.preventDefault();
    go(url.pathname + url.search + url.hash);
  });
  fetch("products.json").then(r=>r.json()).then(d=>{ PRODUCTS=d.products||[]; route(); }).catch(()=>{ PRODUCTS=[]; route(); });
  window.addEventListener("hashchange",route);
  window.addEventListener("popstate",route);
});
