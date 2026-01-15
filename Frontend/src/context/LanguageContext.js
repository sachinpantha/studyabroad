import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  en: {
    // Header
    universities: 'Universities',
    scholarships: 'Scholarships',
    notices: 'Notices',
    faq: 'FAQ',
    blog: 'Blog',
    dashboard: 'Dashboard',
    applyNow: 'Apply Now',
    login: 'Login',
    logout: 'Logout',
    getStarted: 'Get Started',
    adminPanel: 'Admin Panel',
    hi: 'Hi',
    
    // Home Page
    heroTitle: 'Study in India from Nepal',
    heroSubtitle: 'Find your perfect Indian university with scholarships up to 100%',
    whatToStudy: 'What do you want to study?',
    selectCourse: 'Select Course',
    levelOfStudy: 'Level of Study',
    selectLevel: 'Select Level',
    yourGPA: 'Your GPA/Percentage',
    whenToStart: 'When to start?',
    selectIntake: 'Select Intake',
    findBestOptions: 'Find My Best Options',
    applyForFree: 'Apply for Free',
    studentsPlaced: 'Nepali Students Placed',
    indianUniversities: 'Indian Universities',
    scholarshipAvailable: 'Scholarship Available',
    applicationProcess: 'Application Process',
    whyChooseIndia: 'Why Choose India for Higher Education?',
    qualityEducation: 'Quality Education',
    qualityEducationDesc: 'World-class universities with international recognition and affordable fees',
    scholarshipsAvailable: 'Scholarships Available',
    scholarshipsAvailableDesc: 'Merit-based scholarships up to 100% for Nepali students',
    culturalSimilarity: 'Cultural Similarity',
    culturalSimilarityDesc: 'Similar culture, language, and easy adaptation for Nepali students',
    topUniversities: 'Top Indian Universities for Nepali Students',
    viewAllUniversities: 'View All Universities',
    simpleProcess: 'Simple 4-Step Process',
    step1Title: 'Search & Filter',
    step1Desc: 'Find universities based on your preferences',
    step2Title: 'Check Eligibility',
    step2Desc: 'See scholarships you qualify for',
    step3Title: 'Apply Online',
    step3Desc: 'Submit applications with our guidance',
    step4Title: 'Get Admission',
    step4Desc: 'Receive offers and start your journey',
    footerTagline: 'Your trusted partner for studying in India from Nepal',
    quickLinks: 'Quick Links',
    popularCourses: 'Popular Courses',
    contactInfo: 'Contact Info',
    footerCopyright: '© 2024 StudyIndia Nepal. All rights reserved. | Helping Nepali students achieve their dreams in India.',
    register: 'Register',
    
    // Register Page
    joinUsToday: 'Join Us Today!',
    startYourJourney: 'Start your study abroad journey',
    fullName: 'Full Name',
    enterFullName: 'Enter your full name',
    phoneNumber: 'Phone Number',
    enterPhone: 'Enter your phone number',
    createPassword: 'Create a strong password',
    minimumChars: 'Minimum 6 characters',
    creatingAccount: 'Creating Account...',
    welcomeToStudyAbroad: 'Welcome to StudyAbroad!',
    registrationFailed: 'Registration failed',
    
    // Login Page
    welcomeBackTitle: 'Welcome Back!',
    signInToContinue: 'Sign in to continue your journey',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    hidePassword: 'Hide password',
    showPassword: 'Show password',
    signingIn: 'Signing in...',
    createAccount: 'Create Account',
    adminAccess: 'Admin Access:',
    welcomeBack: 'Welcome back!',
    loginFailed: 'Login failed',
    
    // Common
    search: 'Search',
    filter: 'Filter',
    apply: 'Apply',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading',
    noData: 'No data available',
    
    // Profile
    profile: 'Profile',
    personalInfo: 'Personal Information',
    academicInfo: 'Academic Information',
    documents: 'Documents',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    country: 'Country',
    
    // Application
    applications: 'Applications',
    status: 'Status',
    applied: 'Applied',
    underReview: 'Under Review',
    offerReceived: 'Offer Received',
    enrolled: 'Enrolled',
    rejected: 'Rejected',
    
    // University
    course: 'Course',
    location: 'Location',
    tuitionFee: 'Tuition Fee',
    requirements: 'Requirements',
    deadline: 'Deadline',
    
    // Scholarship
    gpa: 'GPA',
    eligibility: 'Eligibility',
    amount: 'Amount',
    
    // Auth
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
  },
  ne: {
    // Header
    universities: 'विश्वविद्यालयहरू',
    scholarships: 'छात्रवृत्ति',
    notices: 'सूचनाहरू',
    faq: 'प्रश्नहरू',
    blog: 'ब्लग',
    dashboard: 'ड्यासबोर्ड',
    applyNow: 'अहिले आवेदन गर्नुहोस्',
    login: 'लगइन',
    logout: 'लगआउट',
    getStarted: 'सुरु गर्नुहोस्',
    adminPanel: 'Admin Panel',
    hi: 'नमस्ते',
    
    // Home Page
    heroTitle: 'नेपालबाट भारतमा अध्ययन गर्नुहोस्',
    heroSubtitle: '१००% सम्म छात्रवृत्तिको साथ आफ्नो उत्तम भारतीय विश्वविद्यालय फेला पार्नुहोस्',
    whatToStudy: 'तपाईं के अध्ययन गर्न चाहनुहुन्छ?',
    selectCourse: 'पाठ्यक्रम चयन गर्नुहोस्',
    levelOfStudy: 'अध्ययनको स्तर',
    selectLevel: 'स्तर चयन गर्नुहोस्',
    yourGPA: 'तपाईंको GPA/प्रतिशत',
    whenToStart: 'कहिले सुरु गर्ने?',
    selectIntake: 'इन्टेक चयन गर्नुहोस्',
    findBestOptions: 'मेरो उत्तम विकल्पहरू फेला पार्नुहोस्',
    applyForFree: 'नि:शुल्क आवेदन गर्नुहोस्',
    studentsPlaced: 'नेपाली विद्यार्थीहरू राखिएका',
    indianUniversities: 'भारतीय विश्वविद्यालयहरू',
    scholarshipAvailable: 'छात्रवृत्ति उपलब्ध',
    applicationProcess: 'आवेदन प्रक्रिया',
    whyChooseIndia: 'उच्च शिक्षाको लागि भारत किन रोज्ने?',
    qualityEducation: 'गुणस्तरीय शिक्षा',
    qualityEducationDesc: 'अन्तर्राष्ट्रिय मान्यता र किफायती शुल्कका साथ विश्वस्तरीय विश्वविद्यालयहरू',
    scholarshipsAvailable: 'छात्रवृत्ति उपलब्ध',
    scholarshipsAvailableDesc: 'नेपाली विद्यार्थीहरूको लागि १००% सम्म योग्यतामा आधारित छात्रवृत्ति',
    culturalSimilarity: 'सांस्कृतिक समानता',
    culturalSimilarityDesc: 'समान संस्कृति, भाषा र नेपाली विद्यार्थीहरूको लागि सजिलो अनुकूलन',
    topUniversities: 'नेपाली विद्यार्थीहरूको लागि शीर्ष भारतीय विश्वविद्यालयहरू',
    viewAllUniversities: 'सबै विश्वविद्यालयहरू हेर्नुहोस्',
    simpleProcess: 'सरल ४-चरण प्रक्रिया',
    step1Title: 'खोज र फिल्टर',
    step1Desc: 'आफ्नो प्राथमिकताको आधारमा विश्वविद्यालयहरू फेला पार्नुहोस्',
    step2Title: 'योग्यता जाँच गर्नुहोस्',
    step2Desc: 'तपाईं योग्य हुनुहुने छात्रवृत्तिहरू हेर्नुहोस्',
    step3Title: 'अनलाइन आवेदन गर्नुहोस्',
    step3Desc: 'हाम्रो मार्गदर्शनमा आवेदनहरू पेश गर्नुहोस्',
    step4Title: 'भर्ना प्राप्त गर्नुहोस्',
    step4Desc: 'प्रस्तावहरू प्राप्त गर्नुहोस् र आफ्नो यात्रा सुरु गर्नुहोस्',
    footerTagline: 'नेपालबाट भारतमा अध्ययनको लागि तपाईंको विश्वसनीय साझेदार',
    quickLinks: 'द्रुत लिङ्कहरू',
    popularCourses: 'लोकप्रिय पाठ्यक्रमहरू',
    contactInfo: 'सम्पर्क जानकारी',
    footerCopyright: '© २०२४ StudyIndia Nepal. सर्वाधिकार सुरक्षित। | नेपाली विद्यार्थीहरूलाई भारतमा उनीहरूको सपना पूरा गर्न मद्दत गर्दै।',
    register: 'दर्ता गर्नुहोस्',
    
    // Register Page
    joinUsToday: 'आज नै हामीसँग सामेल हुनुहोस्!',
    startYourJourney: 'आफ्नो विदेश अध्ययन यात्रा सुरु गर्नुहोस्',
    fullName: 'पूरा नाम',
    enterFullName: 'आफ्नो पूरा नाम प्रविष्ट गर्नुहोस्',
    phoneNumber: 'फोन नम्बर',
    enterPhone: 'आफ्नो फोन नम्बर प्रविष्ट गर्नुहोस्',
    createPassword: 'बलियो पासवर्ड सिर्जना गर्नुहोस्',
    minimumChars: 'न्यूनतम ६ वर्णहरू',
    creatingAccount: 'खाता सिर्जना गर्दै...',
    welcomeToStudyAbroad: 'StudyAbroad मा स्वागत छ!',
    registrationFailed: 'दर्ता असफल भयो',
    
    // Login Page
    welcomeBackTitle: 'फेरि स्वागत छ!',
    signInToContinue: 'आफ्नो यात्रा जारी राख्न साइन इन गर्नुहोस्',
    enterEmail: 'आफ्नो इमेल प्रविष्ट गर्नुहोस्',
    enterPassword: 'आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्',
    hidePassword: 'पासवर्ड लुकाउनुहोस्',
    showPassword: 'पासवर्ड देखाउनुहोस्',
    signingIn: 'साइन इन गर्दै...',
    createAccount: 'खाता सिर्जना गर्नुहोस्',
    adminAccess: 'Admin पहुँच:',
    welcomeBack: 'फेरि स्वागत छ!',
    loginFailed: 'लगइन असफल भयो',
    
    // Common
    search: 'खोज्नुहोस्',
    filter: 'फिल्टर',
    apply: 'आवेदन गर्नुहोस्',
    submit: 'पेश गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    save: 'सुरक्षित गर्नुहोस्',
    edit: 'सम्पादन गर्नुहोस्',
    delete: 'मेटाउनुहोस्',
    view: 'हेर्नुहोस्',
    download: 'डाउनलोड गर्नुहोस्',
    upload: 'अपलोड गर्नुहोस्',
    back: 'पछाडि',
    next: 'अर्को',
    previous: 'अघिल्लो',
    loading: 'लोड हुँदैछ',
    noData: 'कुनै डाटा उपलब्ध छैन',
    
    // Profile
    profile: 'प्रोफाइल',
    personalInfo: 'व्यक्तिगत जानकारी',
    academicInfo: 'शैक्षिक जानकारी',
    documents: 'कागजातहरू',
    name: 'नाम',
    email: 'इमेल',
    phone: 'फोन',
    address: 'ठेगाना',
    country: 'देश',
    
    // Application
    applications: 'आवेदनहरू',
    status: 'स्थिति',
    applied: 'आवेदन गरिएको',
    underReview: 'समीक्षाधीन',
    offerReceived: 'प्रस्ताव प्राप्त',
    enrolled: 'भर्ना भएको',
    rejected: 'अस्वीकृत',
    
    // University
    course: 'पाठ्यक्रम',
    location: 'स्थान',
    tuitionFee: 'ट्यूशन शुल्क',
    requirements: 'आवश्यकताहरू',
    deadline: 'अन्तिम मिति',
    
    // Scholarship
    gpa: 'GPA',
    eligibility: 'योग्यता',
    amount: 'रकम',
    
    // Auth
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड पुष्टि गर्नुहोस्',
    forgotPassword: 'पासवर्ड बिर्सनुभयो?',
    dontHaveAccount: 'खाता छैन?',
    alreadyHaveAccount: 'पहिले नै खाता छ?',
    signUp: 'साइन अप',
    signIn: 'साइन इन',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => translations[language][key] || key;

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ne' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
