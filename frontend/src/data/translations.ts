export type Language = 'en' | 'te' | 'hi';

export const translations = {
  en: {
    appTitle: "ScholarEase",
    tagline: "AI-Powered Educational Financial Assistance Platform",
    nav: {
      dashboard: "Dashboard",
      discovery: "Discover Aid",
      eligibility: "Eligibility & Simulator",
      documents: "Document Vault",
      zeroVisit: "Zero-Repeat-Visit",
      journey: "Application Journey",
      rejectionRecovery: "Rejection Recovery",
      deadlines: "Deadlines & Milestones",
      fundingGap: "Funding Calculator",
      changeDetector: "Change Alerts",
      admin: "Admin Verification"
    },
    status: {
      eligible: "Eligible",
      potentiallyEligible: "Potentially Eligible",
      notEligible: "Not Eligible",
      insufficientInfo: "Insufficient Information",
      ready: "READY (100% Prepared)",
      actionRequired: "ACTION REQUIRED",
      unclear: "REQUIREMENTS UNCLEAR"
    },
    actions: {
      applyNow: "Apply on Official Portal",
      checkEligibility: "Check Eligibility",
      saveScholarship: "Save for Later",
      simulateChanges: "Run Simulator",
      generateChecklist: "Generate Visit Checklist",
      auditConsistency: "Audit Consistency",
      solveProblem: "Solve Rejection Issue",
      calculateGap: "Calculate Funding Gap",
      switchDemo: "Switch Demo Profile",
      lowBandwidthOn: "Low-Bandwidth Mode ON",
      lowBandwidthOff: "Standard Mode"
    },
    demoPrompt: "Select demo scenario for instant evaluation:"
  },
  te: {
    appTitle: "స్కాలర్‌ఈజ్ (ScholarEase)",
    tagline: "విద్యార్థుల ఆర్థిక సహాయం & స్కాలర్‌షిప్ ప్లాట్‌ఫారమ్",
    nav: {
      dashboard: "డాష్‌బోర్డ్",
      discovery: "స్కాలర్‌షిప్‌లు",
      eligibility: "అర్హత & సిమ్యులేటర్",
      documents: "డాక్యుమెంట్ వాల్ట్",
      zeroVisit: "జీరో-రిపీట్-విజిట్",
      journey: "దరఖాస్తు ప్రయాణం",
      rejectionRecovery: "తిరస్కరణ పరిష్కారం",
      deadlines: "గడువులు & మైలురాళ్ళు",
      fundingGap: "ఫీజు గ్యాప్ కాలిక్యులేటర్",
      changeDetector: "తాజా మార్పులు",
      admin: "అడ్మిన్ వెరిఫికేషన్"
    },
    status: {
      eligible: "అర్హులు (Eligible)",
      potentiallyEligible: "పరిశీలనలో అర్హులు",
      notEligible: "అనర్హులు",
      insufficientInfo: "సమాచారం అసంపూర్ణం",
      ready: "సిద్ధంగా ఉన్నారు (100%)",
      actionRequired: "చర్య అవసరం (Action Required)",
      unclear: "స్పష్టత అవసరం"
    },
    actions: {
      applyNow: "అధికారిక పోర్టల్‌లో దరఖాస్తు చేయండి",
      checkEligibility: "అర్హతను సరిచూడండి",
      saveScholarship: "తర్వాత కోసం సేవ్ చేయండి",
      simulateChanges: "సిమ్యులేటర్ పరీక్షించండి",
      generateChecklist: "విజిట్ చెక్‌లిస్ట్ పొందండి",
      auditConsistency: "పత్రాల ఏకరూపత తనిఖీ",
      solveProblem: "తిరస్కరణ సమస్యను పరిష్కరించండి",
      calculateGap: "ఫీజు లోటును లెక్కించండి",
      switchDemo: "డెమో ప్రొఫైల్ మార్చండి",
      lowBandwidthOn: "తక్కువ ఇంటర్నెట్ మోడ్ (ఆన్)",
      lowBandwidthOff: "సాధారణ మోడ్"
    },
    demoPrompt: "త్వరిత పరిశీలన కోసం డెమో విద్యార్థిని ఎంచుకోండి:"
  },
  hi: {
    appTitle: "स्कॉलरईज़ (ScholarEase)",
    tagline: "एआई-संचालित शैक्षिक वित्तीय सहायता प्लेटफ़ॉर्म",
    nav: {
      dashboard: "डैशबोर्ड",
      discovery: "छात्रवृत्ति खोजें",
      eligibility: "पात्रता और सिम्युलेटर",
      documents: "दस्तावेज़ वॉल्ट",
      zeroVisit: "ज़ीरो-रिपीट-विज़िट",
      journey: "आवेदन यात्रा",
      rejectionRecovery: "अस्वीकृति सुधार",
      deadlines: "अंतिम तिथियां",
      fundingGap: "फंडिंग कैलकुलेटर",
      changeDetector: "नियम परिवर्तन",
      admin: "व्यवस्थापक सत्यापन"
    },
    status: {
      eligible: "पात्र (Eligible)",
      potentiallyEligible: "संभावित रूप से पात्र",
      notEligible: "अपात्र",
      insufficientInfo: "अधूरी जानकारी",
      ready: "तैयार (100% Prepared)",
      actionRequired: "कार्रवाई आवश्यक",
      unclear: "नियम अस्पष्ट"
    },
    actions: {
      applyNow: "आधिकारिक पोर्टल पर आवेदन करें",
      checkEligibility: "पात्रता जांचें",
      saveScholarship: "बाद के लिए सहेजें",
      simulateChanges: "सिम्युलेटर चलाएं",
      generateChecklist: "विज़िट चेकलिस्ट बनाएं",
      auditConsistency: "दस्तावेज़ स्थिरता जांचें",
      solveProblem: "अस्वीकृति समस्या हल करें",
      calculateGap: "फंडिंग अंतर की गणना करें",
      switchDemo: "डेमो प्रोफाइल बदलें",
      lowBandwidthOn: "कम बैंडविड्थ मोड (चालू)",
      lowBandwidthOff: "सामान्य मोड"
    },
    demoPrompt: "त्वरित मूल्यांकन के लिए डेमो परिदृश्य चुनें:"
  }
};
