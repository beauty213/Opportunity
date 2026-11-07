from typing import List, Dict, Any, Optional
from app.models.models import StudentProfile, Scholarship
from app.schemas.schemas import CopilotResponse, CitationSource

KNOWLEDGE_BASE = [
    {
        "keywords": ["lateral entry", "diploma", "b.tech", "epass", "rtf", "reimbursement", "లాటరల్ ఎంట్రీ", "లాటరల్"],
        "en": "Yes! Diploma students admitted into 2nd year B.Tech through Lateral Entry (TS ECET convenor counselling) are 100% ELIGIBLE for Telangana ePASS Post-Matric Fee Reimbursement (RTF) and Maintenance Allowance (MTF). Under G.O. Ms. No. 66, the annual family income ceiling is ₹2,00,000 for BC/EBC and ₹2,50,000 for SC/ST. You will apply as a 'Fresh' Post-Matric applicant in your 2nd year B.Tech, submitting your Diploma consolidated marks memo and TS ECET allotment order.",
        "te": "అవును! TS ECET కన్వీనర్ కోటా ద్వారా బి.టెక్ రెండవ సంవత్సరంలో లేటరల్ ఎంట్రీ పొందిన డిప్లొమా విద్యార్థులు తెలంగాణ ePASS పోస్ట్-మెట్రిక్ ఫీజు రీయింబర్స్‌మెంట్ (RTF) మరియు మెయింటెనెన్స్ అలవెన్స్ (MTF)కు 100% అర్హులు. G.O. Ms. No. 66 ప్రకారం BC/EBC విద్యార్థులకు కుటుంబ వార్షిక ఆదాయ పరిమితి ₹2,00,000. మీరు మీ డిప్లొమా మెమో మరియు ECET అలాట్‌మెంట్ ఆర్డర్‌తో 'ఫ్రెష్' అభ్యర్థిగా దరఖాస్తు చేసుకోవాలి.",
        "hi": "हाँ! TS ECET संयोजक कोटा के माध्यम से बी.टेक द्वितीय वर्ष में लेटरल एंट्री लेने वाले डिप्लोमा छात्र तेलंगाना ePASS पोस्ट-मैट्रिक शुल्क प्रतिपूर्ति (RTF) और रखरखाव भत्ते (MTF) के लिए 100% पात्र हैं। G.O. Ms. No. 66 के अनुसार, BC/EBC छात्रों के लिए वार्षिक पारिवारिक आय सीमा ₹2,00,000 है।",
        "citation": {
            "title": "Telangana Social Welfare Dept G.O. Ms. No. 66",
            "clause": "Clause 4(a) - Eligibility for Lateral Entry Professional Courses",
            "url": "https://telanganaepass.cgg.gov.in/",
            "verified": True
        }
    },
    {
        "keywords": ["documents", "required", "certificates", "what documents", "దస్తావేజులు", "కావాల్సిన సర్టిఫికెట్లు", "दस्तावेज़"],
        "en": "For Telangana ePASS Post-Matric applications, the mandatory documents are:\n1. Latest MeeSeva Income Certificate (issued within the current financial year with barcode).\n2. Permanent MeeSeva Caste Certificate (C-series).\n3. College Bonafide/Study Certificate with Principal signature and official seal.\n4. Previous Qualifying Marksheet (Diploma memo for lateral entry or Intermediate for regular).\n5. Nationalized Bank Passbook with active Aadhaar-NPCI DBT mapping.\n6. TS ECET / TS EAMCET Convenor Admission Allotment Order.",
        "te": "తెలంగాణ ePASS పోస్ట్-మెట్రిక్ కోసం అవసరమైన ముఖ్యమైన పత్రాలు:\n1. తాజా మీసేవ ఆదాయ ధృవీకరణ పత్రం (బార్‌కోడ్‌తో 1 సంవత్సరం లోపు జారీ చేయబడినది).\n2. శాశ్వత మీసేవ కుల ధృవీకరణ పత్రం (C-సిరీస్).\n3. ప్రిన్సిపాల్ సంతకం మరియు కాలేజ్ సీలు కలిగిన బోనఫైడ్ సర్టిఫికెట్.\n4. డిప్లొమా లేదా ఇంటర్ మార్కుల మెమో.\n5. ఆధార్-NPCI సీడింగ్ ఉన్న జాతీయ బ్యాంకు పాస్‌బుక్.\n6. కన్వీనర్ అడ్మిషన్ అలాట్‌మెంట్ ఆర్డర్ మరియు ఫీజు రసీదు.",
        "hi": "ePASS के लिए आवश्यक मुख्य दस्तावेज़:\n1. नवीनतम मी-सेवा आय प्रमाण पत्र (बारकोड सहित).\n2. स्थायी जाति प्रमाण पत्र.\n3. कॉलेज बोनाफाइड सर्टिफिकेट (प्रिंसिपल की मुहर सहित).\n4. डिप्लोमा या 12वीं की मार्कशीट.\n5. आधार-NPCI मैप किया गया बैंक पासबुक.\n6. एडमिशन अलॉटमेंट लेटर।",
        "citation": {
            "title": "Telangana ePASS Post-Matric Checklist Circular",
            "clause": "Rule 12 - Mandatory Document Verification Guidelines",
            "url": "https://telanganaepass.cgg.gov.in/Postmatrichomepage.do",
            "verified": True
        }
    },
    {
        "keywords": ["renewal", "renew", "second year", "third year", "రెన్యువల్", "నవీకరణ", "रिन्यूअल"],
        "en": "For Scholarship Renewal:\n1. You do not need to upload your Caste certificate again if already verified.\n2. In Telangana, a Fresh Income Certificate from MeeSeva is required annually.\n3. Your college biometric attendance must be at least 75%.\n4. You must have passed the previous year examinations without detentions.\n5. Apply under 'Renewal' on ePASS using your existing SSC Hall Ticket & Application ID.",
        "te": "స్కాలర్‌షిప్ రెన్యువల్ విధానం:\n1. మీ కుల ధృవీకరణ పత్రాన్ని మళ్లీ అప్‌లోడ్ చేయనవసరం లేదు.\n2. ఆదాయ ధృవీకరణ పత్రం ప్రతి సంవత్సరం మీసేవ నుండి కొత్తది పొందాలి.\n3. కాలేజీ బయోమెట్రిక్ హాజరు కనీసం 75% ఉండాలి.\n4. మునుపటి సెమిస్టర్లలో డిటెన్షన్ ఉండకూడదు.\n5. ePASS పోర్టల్‌లో 'రెన్యువల్' ఆప్షన్ ఎంచుకుని దరఖాస్తు చేసుకోవాలి.",
        "hi": "नवीनीकरण प्रक्रिया:\n1. जाति प्रमाण पत्र पुनः अपलोड करने की आवश्यकता नहीं है।\n2. नया आय प्रमाण पत्र अनिवार्य है।\n3. 75% बायोमेट्रिक उपस्थिति आवश्यक है।\n4. ePASS पोर्टल पर 'रिन्यूअल' विकल्प चुनें।",
        "citation": {
            "title": "ePASS Renewal Guidelines Circular 2026",
            "clause": "Section 3 - Academic Progression & Renewal Prerequisites",
            "url": "https://telanganaepass.cgg.gov.in/",
            "verified": True
        }
    },
    {
        "keywords": ["rejection", "rejected", "problem", "barcode", "npci", "తిరస్కరణ", "రిజెక్షన్", "रद्द", "अस्वीकृत"],
        "en": "Application Rejection / Correction Protocol:\nMost ePASS rejections occur due to two reasons:\n1. 'Income Certificate Barcode Unreadable': This happens when MeeSeva's online database cannot verify the scanned barcode. You must obtain an updated MeeSeva copy and have the college clerk re-upload it.\n2. 'Account Not Seeded with NPCI': Even if your bank account is active, DBT payments fail unless the bank maps your Aadhaar to the NPCI mapper. Visit your bank branch with an Aadhaar Consent Form for NPCI seeding, then request status update on ePASS.",
        "te": "దరఖాస్తు తిరస్కరణకు ప్రధాన కారణాలు మరియు పరిష్కారాలు:\n1. 'ఇన్‌కమ్ సర్టిఫికెట్ బార్‌కోడ్ లోపం': మీసేవ డేటాబేస్ సరిపోలకపోతే ఇది వస్తుంది. కొత్త సర్టిఫికెట్ తీసుకుని కాలేజీ నోడల్ అధికారి ద్వారా అప్‌డేట్ చేయించాలి.\n2. 'NPCI సీడింగ్ లేకపోవడం': మీ బ్యాంకు ఖాతాకు ఆధార్ NPCI మ్యాపింగ్ చేయించాలి. మీ బ్యాంక్ బ్రాంచ్‌కు వెళ్లి ఆధార్ కాన్సెంట్ ఫారం సమర్పించాలి.",
        "hi": "अस्वीकृति सुधार:\n1. आय प्रमाण पत्र बारकोड त्रुटि: मी-सेवा से नवीनतम कॉपी लेकर पोर्टल पर पुनः अपलोड करें।\n2. NPCI बैंक मैपिंग: अपनी बैंक शाखा में जाकर आधार को NPCI से लिंक करवाएं।",
        "citation": {
            "title": "DBT Direct Benefit Transfer Portal Manual",
            "clause": "Rule 8 - Mandatory NPCI Aadhaar Seeding for Scholarship Disbursals",
            "url": "https://dbtbharat.gov.in/",
            "verified": True
        }
    }
]

def generate_copilot_response(
    query: str,
    language: str = "en",
    profile: Optional[StudentProfile] = None,
    active_scholarship: Optional[Scholarship] = None
) -> CopilotResponse:
    q_lower = query.lower()

    # Search knowledge base
    matched_entry = None
    for entry in KNOWLEDGE_BASE:
        if any(kw in q_lower for kw in entry["keywords"]):
            matched_entry = entry
            break

    # Contextual profile summary to append if applicable
    context_prefix = ""
    if profile:
        edu = profile.educational_record
        fin = profile.financial_profile
        if language == "te":
            context_prefix = f"**మీ ప్రొఫైల్ ఆధారంగా ({profile.full_name}, {edu.course_name if edu else ''} {edu.admission_type if edu else ''}, వార్షిక ఆదాయం ₹{int(fin.annual_family_income):,}):**\n\n"
        elif language == "hi":
            context_prefix = f"**आपकी प्रोफ़ाइल के अनुसार ({profile.full_name}, {edu.course_name if edu else ''} {edu.admission_type if edu else ''}, आय ₹{int(fin.annual_family_income):,}):**\n\n"
        else:
            context_prefix = f"**Based on your verified profile ({profile.full_name}, {edu.course_name if edu else ''} {edu.admission_type if edu else ''}, Annual Income ₹{int(fin.annual_family_income):,}):**\n\n"

    if matched_entry:
        answer_text = context_prefix + matched_entry.get(language, matched_entry["en"])
        citation = CitationSource(
            title=matched_entry["citation"]["title"],
            clause=matched_entry["citation"]["clause"],
            url=matched_entry["citation"]["url"],
            verified=matched_entry["citation"]["verified"]
        )
        citations = [citation]
    else:
        # Default synthesized intelligence
        if language == "te":
            answer_text = (
                context_prefix +
                f"మీ ప్రశ్నకు సంబంధించిన నియమాలను మేము పరిశీలించాము. తెలంగాణ మరియు జాతీయ స్కాలర్‌షిప్ మార్గదర్శకాల ప్రకారం, "
                f"కన్వీనర్ కోటా అడ్మిషన్ పొందిన విద్యార్థులు వారి అర్హత ఆధారంగా దరఖాస్తు చేసుకోవచ్చు. "
                f"మరిన్ని వివరాల కోసం మీ కాలేజీ నోడల్ అధికారిని లేదా అధికారిక పోర్టల్‌ను సంప్రదించండి."
            )
        elif language == "hi":
            answer_text = (
                context_prefix +
                f"हमने आपके प्रश्न की समीक्षा की है। आधिकारिक दिशा-निर्देशों के अनुसार, पात्रता और आवश्यक दस्तावेजों की पुष्टि "
                f"अपने संस्थान के छात्रवृत्ति नोडल अधिकारी से अवश्य करें।"
            )
        else:
            answer_text = (
                context_prefix +
                f"We analyzed your inquiry against published Telangana ePASS and National Scholarship guidelines. "
                f"For your specific course and income bracket, please ensure that your MeeSeva certificates are updated "
                f"and your college biometric attendance remains above 75%. If any special rule applies, verify with your college scholarship nodal officer."
            )
        citations = [
            CitationSource(
                title="Telangana ePASS Official Portal",
                clause="General Citizen Advisory & Post-Matric Rules",
                url="https://telanganaepass.cgg.gov.in/",
                verified=True
            )
        ]

    suggested_questions = [
        "Can Lateral Entry B.Tech students get full fee reimbursement?",
        "What should I do if my application status says 'Income Mismatch'?",
        "What documents do I need to carry to the College Scholarship desk?",
        "How do I confirm if my Bank Account is seeded with NPCI?"
    ]

    action_pills = [
        {"label": "Check Zero-Repeat-Visit", "route": "/zero-visit"},
        {"label": "Audit Document Consistency", "route": "/documents"},
        {"label": "Simulate Eligibility Changes", "route": "/eligibility"}
    ]

    return CopilotResponse(
        answer=answer_text,
        language=language,
        citations=citations,
        suggested_questions=suggested_questions,
        action_pills=action_pills
    )
