export interface LegalDocument {
  id: string;
  title: string;
  category: 'website' | 'internship';
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  summary: string;
  sections: {
    heading: string;
    content: string[];
  }[];
}

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  'privacy-policy': {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    category: 'website',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'November 14, 2026',
    version: '2.4',
    summary:
      'This Privacy Policy outlines how Valoria Technology collects, processes, protects, and governs your personal and technical data across our website, motion platforms, and services in compliance with the Digital Personal Data Protection Act, 2023 (DPDP) and international privacy frameworks.',
    sections: [
      {
        heading: 'Introduction & Organizational Commitment',
        content: [
          'Valoria Technology ("Valoria", "we", "our", or "us") is dedicated to safeguarding the privacy and digital sovereignty of all visitors, clients, partners, and applicants. This Privacy Policy details the policies and technical procedures governing the collection, utilization, storage, and disclosure of personal data acquired through our digital interfaces (valoriatech.page), web-based applications, and sandbox systems.',
          'By accessing our website or submitting information through our application portals, you explicitly acknowledge having reviewed and agreed to the practices described herein. If you do not consent to these terms, please discontinue browsing or interacting with our services immediately.',
        ],
      },
      {
        heading: 'Categories of Information We Collect',
        content: [
          'Personal Identifiers: Name, official email address, mobile telephone number, location (State, District, Country), college/university affiliation, academic credentials, and professional URLs (LinkedIn, GitHub).',
          'Candidate & Educational Information: Graduation year, academic degree, engineering track, resume/CV files, professional portfolio data, and verification credentials uploaded during internship applications.',
          'Technical & Telemetry Data: Internet Protocol (IP) address, browser fingerprint, operating system, device characteristics, screen resolution, referral sources, interaction timestamps, motion simulation frame telemetry, and UI component usage logs.',
          'Communication Records: Records of inquiries, contact form transmissions, feedback, and technical support requests submitted through our platforms.',
        ],
      },
      {
        heading: 'Legal Grounds and Purposes for Processing',
        content: [
          'We process your data strictly under recognized legal bases, including explicit user consent, performance of contractual obligations, compliance with statutory requirements, and legitimate engineering development interests.',
          'Primary processing purposes include: (a) Delivering and optimizing our autonomous motion platforms and client cloud workflows; (b) Evaluating candidate credentials and administering the Valoria Technology Internship Programme; (c) Responding to customer inquiries and facilitating technical consultations; (d) Preventing unauthorized intrusion, vulnerability exploitation, and security breaches; and (e) Complying with regulatory obligations under the Information Technology Act, 2000 and DPDP Act, 2023.',
        ],
      },
      {
        heading: 'Data Storage, Encryption & Security Standards',
        content: [
          'Valoria enforces multi-layered technical, administrative, and physical safeguards designed to prevent accidental loss, unauthorized access, destruction, or alteration of collected information.',
          'All network transmissions are protected using Transport Layer Security (TLS 1.3) protocols. Data resting in our production databases is secured using AES-256 cryptographic standards with role-based access control (RBAC), multi-factor authentication (MFA), and zero-trust infrastructure boundaries.',
          'While we implement industry-leading defensive protocols, no digital transmission over public telecommunication networks can be guaranteed 100% impenetrable. Users transmit credentials and candidate submissions at their own calculated discretion.',
        ],
      },
      {
        heading: 'Data Disclosure & Third-Party Sub-Processors',
        content: [
          'Valoria Technology does not sell, lease, or monetize your personal information to commercial data brokers or non-affiliated advertisers.',
          'We disclose data solely to: (a) Verified cloud infrastructure and database service providers (e.g., Supabase, cloud hosting providers) operating under strict data processing agreements; (b) Academic or background verification agencies strictly for verifying candidate academic status; and (c) Law enforcement or judicial bodies when mandated by valid legal subpoenas, court decrees, or applicable statutory mandates.',
        ],
      },
      {
        heading: 'Data Subject Rights & Grievance Access',
        content: [
          'Under the Digital Personal Data Protection Act, 2023, you hold enforceable rights regarding your personal information, including: (a) Right to access an itemized summary of your processed data; (b) Right to request correction or updating of inaccurate records; (c) Right to withdraw consent and request erasure of non-essential records; and (d) Right to register grievances with our Data Protection Officer.',
          'To exercise these rights, submit a written communication to contact@valoriatech.page with verified proof of identity. Requests are acknowledged within 48 hours and resolved in accordance with statutory guidelines.',
        ],
      },
      {
        heading: 'Policy Amendments & Notifications',
        content: [
          'Valoria reserves the prerogative to revise, amend, or modernize this Privacy Policy periodically to reflect technological evolutions or legislative amendments. Material updates will be denoted by updating the "Last Updated" timestamp at the top of this policy.',
        ],
      },
    ],
  },

  'terms-and-conditions': {
    id: 'terms-and-conditions',
    title: 'Website Terms & Conditions',
    category: 'website',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'November 14, 2026',
    version: '3.1',
    summary:
      'These Terms and Conditions govern your lawful access and interaction with the Valoria Technology website, proprietary motion shaders, code primitives, system consoles, and associated intellectual property.',
    sections: [
      {
        heading: 'Binding Legal Agreement',
        content: [
          'These Website Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "Visitor", or "Applicant") and Valoria Technology Inc. ("Valoria Technology", "Company", "we", "us").',
          'By accessing, navigating, or utilizing any portion of this website, you confirm that you are at least 18 years of age (or have reached the age of majority in your jurisdiction), possess the legal capacity to enter into binding contracts, and accept all stipulations set forth herein.',
        ],
      },
      {
        heading: 'Proprietary Intellectual Property Rights',
        content: [
          'The entire visual and technical presentation of this website—including but not limited to the Valoria logo, visual marks, typography hierarchies, custom shaders, motion choreographies, layout morphing engines, 3D interactive canvases, software architectures, written copy, and source code primitives—is the exclusive intellectual property of Valoria Technology and is protected by domestic and international copyright, trademark, patent, and trade secret laws.',
          'No material from this website may be copied, reproduced, republished, uploaded, posted, reverse-engineered, decompiled, translated, or distributed in any manner without express prior written authorization from Valoria Technology.',
        ],
      },
      {
        heading: 'Acceptable Use & Conduct Restrictions',
        content: [
          'Users are expressly forbidden from: (a) Introducing viruses, Trojan horses, automated bots, scrapers, crawlers, or malicious payloads into the website architecture; (b) Attempting to probe, scan, or compromise our web servers, databases, or API infrastructure; (c) Falsifying candidate identity, academic credentials, or contact details in application modules; (d) Circumventing authentication mechanisms or access controls; and (e) Framing or mirroring our platform to deceive third parties.',
          'Any violation of these restrictions constitutes grounds for immediate termination of access and may result in civil and criminal liability under the Information Technology Act, 2000.',
        ],
      },
      {
        heading: 'Third-Party Links & Integrations',
        content: [
          'Our website displays information pertaining to third-party technology ecosystems (e.g., Salesforce, Slack, Tableau, Next.js, MapLibre). Valoria Technology does not own, operate, or endorse third-party web services linked from this portal. Your engagement with external sites is governed exclusively by their respective terms and policies.',
        ],
      },
      {
        heading: 'Disclaimer of Warranties & Limitation of Liability',
        content: [
          'THIS WEBSITE AND ALL MATERIALS, SIMULATIONS, AND CONSOLES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. VALORIA DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
          'IN NO EVENT SHALL VALORIA TECHNOLOGY, ITS DIRECTORS, EMPLOYEES, OR AFFILIATES BE LIABLE FOR DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR ACCESS TO, OR INABILITY TO ACCESS, THIS WEBSITE OR ITS TECHNICAL CONSOLES.',
        ],
      },
      {
        heading: 'Governing Law & Dispute Resolution',
        content: [
          'These Terms shall be interpreted, construed, and enforced in accordance with the laws of India. Any controversy, dispute, or claim arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts of Chennai, Tamil Nadu, India.',
        ],
      },
    ],
  },

  'cookie-policy': {
    id: 'cookie-policy',
    title: 'Cookie Policy',
    category: 'website',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'November 14, 2026',
    version: '1.8',
    summary:
      'This Cookie Policy explains how Valoria Technology deploys cookies, local storage tokens, and web telemetry to ensure seamless interactive motion experiences, security integrity, and application usability.',
    sections: [
      {
        heading: 'What Are Cookies and Local Storage Objects',
        content: [
          'Cookies are small text strings saved onto your computing device or mobile terminal when you visit web platforms. We also utilize modern HTML5 Local Storage and Session Storage mechanisms to preserve user preferences (such as dark theme settings, intro animation state, and application draft fields).',
        ],
      },
      {
        heading: 'Classification of Cookies Deployed',
        content: [
          'Strictly Necessary Cookies: Crucial for fundamental navigation, intro state management, session persistence, and cybersecurity verification. These cannot be disabled in our systems.',
          'Functional & Preference Cookies: Remember selections you make (such as degree and track filters in the interactive console) to provide enhanced, personalized motion experiences.',
          'Performance & Telemetry Cookies: Aggregate anonymous technical diagnostics (e.g., frame rendering latencies, canvas performance on varying GPUs) to help us refine and optimize our high-performance frontend animations.',
        ],
      },
      {
        heading: 'Managing Cookie Preferences',
        content: [
          'Most web browsers allow you to modify cookie controls through browser settings. You can choose to block or delete cookies; however, disabling strictly necessary cookies may impair the functionality of interactive simulations, shader rendering, and application modal states.',
        ],
      },
    ],
  },

  'disclaimer': {
    id: 'disclaimer',
    title: 'Technical & Service Disclaimer',
    category: 'website',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'November 14, 2026',
    version: '2.0',
    summary:
      'Official technical and operational disclaimer regarding prototype demonstrations, simulated sandbox data, client brand names, and autonomous system representations displayed on valoriatech.page.',
    sections: [
      {
        heading: 'Nature of Interactive Demonstrations',
        content: [
          'Certain modules on this website—such as the 3D Orbit Showcase, Physical Twin temperature/load monitors, and Motion Sandbox consoles—operate as simulated interactive demonstrations intended to illustrate Valoria Technology\'s motion engineering capabilities and software architecture standards.',
          'Metric readings (e.g., "38.4°C Optimal", "60Hz Telemetry", "0.02g drift") within demo cards are illustrative telemetry simulations and do not reflect live production telemetry of third-party enterprises unless explicitly designated under client engagement agreements.',
        ],
      },
      {
        heading: 'Brand Names & Trademark Acknowledgement',
        content: [
          'References to Salesforce, Slack, Tableau, Initech, Umbrella, Wayne, Hooli, and other enterprise names or marks are used strictly for conceptual illustration, integration demonstration, and portfolio representation. All respective trademarks and service marks remain the property of their respective corporate owners.',
        ],
      },
      {
        heading: 'Forward-Looking Statements',
        content: [
          'Statements regarding future product releases, upcoming software primitives, or prospective cohort dates constitute forward-looking estimations and are subject to engineering roadmaps, testing validations, and operational variables without mandatory prior notice.',
        ],
      },
    ],
  },

  'grievance-redressal': {
    id: 'grievance-redressal',
    title: 'Grievance Redressal Policy',
    category: 'website',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'November 14, 2026',
    version: '1.5',
    summary:
      'Statutory grievance redressal framework published pursuant to Rule 3(11) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Digital Personal Data Protection Act, 2023.',
    sections: [
      {
        heading: 'Statutory Mechanism & Purpose',
        content: [
          'Valoria Technology maintains a structured, transparent mechanism for the prompt redressal of concerns, data privacy inquiries, content objections, and service complaints registered by users, applicants, or legal entities.',
        ],
      },
      {
        heading: 'Designated Grievance Officer',
        content: [
          'In compliance with statutory requirements, the contact coordinates of our designated Grievance Redressal Officer are as follows:',
          'Name: Grievance & Compliance Directorate',
          'Designation: Principal Counsel & Data Protection Officer',
          'Entity: Valoria Technology',
          'Official Desk: contact@valoriatech.page',
          'Candidate & HR Inquiries: hr@valoriatech.page',
          'Official Digital Compliance Bureau: Valoria Technology Governance Desk (contact@valoriatech.page).',
        ],
      },
      {
        heading: 'Grievance Submission & Escalation Procedure',
        content: [
          'Step 1 (Filing): Submit a formal grievance via email to contact@valoriatech.page with the subject line "Grievance Notice: [Applicant/User Name] - [Brief Issue]". Provide all relevant supporting documentation, screenshots, and contact coordinates.',
          'Step 2 (Acknowledgement): Our office shall issue an automated or formal ticket acknowledgement carrying a unique grievance tracking number within forty-eight (48) hours of receipt.',
          'Step 3 (Investigation & Resolution): The grievance shall be investigated by internal legal and engineering leads. A substantive written response or corrective resolution shall be dispatched within fifteen (15) to thirty (30) business days from ticket creation.',
        ],
      },
    ],
  },

  'internship-disclaimer': {
    id: 'internship-disclaimer',
    title: 'Internship Program Disclaimer',
    category: 'internship',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'November 14, 2026',
    version: '2.2',
    summary:
      'Comprehensive legal disclaimer outlining the educational, experiential, and skill-acceleration nature of the Valoria Technology Internship Programme, evaluation metrics, and non-employment guarantees.',
    sections: [
      {
        heading: 'Program Nature & Educational Purpose',
        content: [
          'The Valoria Technology Internship Programme is an intensive experiential training and practical project implementation programme designed to bridge the chasm between academic curricula and industrial software engineering standards.',
          'Participation in this programme constitutes an educational and skill-acceleration engagement. It does not establish a formal employer-employee relationship, permanent tenure, or union representation under statutory labor frameworks.',
        ],
      },
      {
        heading: 'No Guarantee of Permanent Employment',
        content: [
          'Enrollment, progression, and completion of the internship programme DO NOT constitute or imply a guarantee of permanent employment, full-time recruitment, or a Pre-Placement Offer (PPO) at Valoria Technology or any of its enterprise partners.',
          'Any prospective hiring, campus offer, or transition into a full-time engineering position is solely at the independent discretion of Valoria Technology\'s talent acquisition leadership and is subject to open requisitions, commercial budgets, and rigorous individual performance evaluations.',
        ],
      },
      {
        heading: 'Certification & Completion Criteria',
        content: [
          'Participants who satisfactorily conclude Phase 1 (Training & Skill Acceleration) and successfully deliver Phase 2 (Live Industry Project Implementation) meeting our engineering quality benchmarks will be eligible for a Training Completion Certificate, Internship / Work Experience Certificate, and Letter of Appreciation.',
          'Participants who complete the training coursework but fail to submit or fulfill the assigned project deliverables within stipulated deadlines shall be eligible solely for the Training Completion Certificate.',
          'Valoria Technology reserves the absolute right to withhold certification in instances of non-attendance, plagiarism, unauthorized disclosure of intellectual property, or code of conduct violations.',
        ],
      },
      {
        heading: 'Academic Credit & Institutional Approvals',
        content: [
          'It is the sole responsibility of the applicant to ensure that participation in the Valoria Internship Programme aligns with their university or college degree requirements, credit granting guidelines, and No Objection Certificate (NOC) protocols.',
          'Valoria Technology shall provide standard verification letters upon request but makes no representations regarding the acceptance of credits by individual academic institutions.',
        ],
      },
    ],
  },

  'internship-terms': {
    id: 'internship-terms',
    title: 'Internship Application Terms',
    category: 'internship',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'November 14, 2026',
    version: '2.5',
    summary:
      'Mandatory contractual terms governing candidate applications, background disclosures, intellectual property assignment, and strict non-disclosure obligations for the Valoria Technology Internship Programme.',
    sections: [
      {
        heading: 'Candidate Eligibility & True Disclosures',
        content: [
          'By submitting an application for the Valoria Technology Internship Programme, you affirm that all submitted personal details, educational qualifications, degree programs, graduation year, contact information, and portfolio links are truthful, accurate, and complete.',
          'Furnishing falsified, misleading, or plagiarized information constitutes immediate grounds for disqualification of the application, revocation of any issued offer, cancellation of awarded certificates, and potential reporting to your academic institution.',
        ],
      },
      {
        heading: 'Non-Disclosure & Confidentiality Obligations (NDA)',
        content: [
          'During the evaluation process and any subsequent internship tenure, applicants may gain access to proprietary software architectures, Figma design files, internal source code, API keys, client project briefs, and technical methodology ("Confidential Information").',
          'You unconditionally agree to maintain strict confidentiality regarding all such information. You shall not copy, disclose, publish, reverse-engineer, decompile, or distribute any proprietary material to third parties, publicly accessible repositories (such as public GitHub repositories), or social media networks without explicit written authorization.',
        ],
      },
      {
        heading: 'Intellectual Property Assignment',
        content: [
          'All software code, documentation, algorithms, visual assets, shaders, schemas, and deliverables authored or created by the intern during the course of the internship project work shall constitute the exclusive intellectual property of Valoria Technology Inc. or its designated client.',
          'The applicant irrevocably assigns and transfers all worldwide rights, title, copyright, and patent interests in such work product to Valoria Technology without requirement of additional royalties or remuneration beyond agreed program terms.',
        ],
      },
      {
        heading: 'Code of Conduct & Academic Integrity',
        content: [
          'Applicants and enrolled interns are expected to maintain the highest standards of professional decorum, mutual respect, diversity inclusion, and technical integrity.',
          'Plagiarism of software code from unauthorized third-party repositories, violation of open-source licenses, or submission of AI-generated work without authorization is strictly prohibited and subject to immediate expulsion from the programme without certification.',
        ],
      },
      {
        heading: 'Data Verification & Consent to Contact',
        content: [
          'You authorize Valoria Technology and our talent operations desk (hr@valoriatech.page) to contact you via telephone, WhatsApp, or email, and to verify academic credentials with your affiliated college, university, or references strictly for candidate selection and cohort placement.',
        ],
      },
    ],
  },

  'payment-policy': {
    id: 'payment-policy',
    title: 'Payment & Refund Policy',
    category: 'internship',
    effectiveDate: 'January 1, 2026',
    lastUpdated: 'November 18, 2026',
    version: '1.0',
    summary:
      'Official statutory terms governing advance fee payments, single-installment requirements, and strict non-refundable policies for all applicants and enrolled participants in the Valoria Technology Internship Programme.',
    sections: [
      {
        heading: 'Advance Payment Requirement',
        content: [
          'All students enrolling in the Valoria Technology Internship Programme are required to complete the applicable programme fee payment before the commencement of Phase 1 (Training & Skill Acceleration).',
          '• Full payment must be successfully completed before the scheduled training commencement date.',
          '• Students will be permitted to commence the training programme only after successful verification and confirmation of their payment.',
          '• Registration or submission of an internship application alone does not guarantee access to the training programme.',
          '• Valoria Technology reserves the right to withhold programme access until the required payment has been received and verified.',
        ],
      },
      {
        heading: 'Full Payment Policy – No Installment Facility',
        content: [
          'The Internship Programme requires payment of the entire applicable programme fee at the time of enrollment.',
          '• Students must pay 100% of the prescribed programme fee before the commencement of Phase 1.',
          '• Partial payments, installment-based payments, or deferred payment arrangements are not available.',
          '• Students are responsible for ensuring that the complete payment is successfully processed within the specified payment period.',
          "• Failure to complete the full payment may result in the cancellation or suspension of the student's enrollment.",
        ],
      },
      {
        heading: 'Non-Refundable Payment Policy',
        content: [
          'All payments made towards enrollment in the Valoria Technology Internship Programme are non-refundable once successfully processed.',
          '• If a student voluntarily discontinues, withdraws from, or chooses not to continue the programme for personal, academic, professional, financial, health-related, or any other reasons, the amount paid will not be refunded.',
          '• Non-participation in training sessions, failure to complete assigned tasks, or voluntary withdrawal from the programme does not create an entitlement to a refund.',
          '• Students are advised to carefully evaluate their availability, commitment, and eligibility before making the payment.',
          '• By completing the payment, students acknowledge and accept the non-refundable nature of the programme fee, subject to applicable laws and statutory rights.',
        ],
      },
      {
        heading: 'Student Acknowledgement and Acceptance',
        content: [
          'By registering for the Valoria Technology Internship Programme and completing the payment, students acknowledge that they have read, understood, and agreed to the payment terms and conditions outlined in this policy.',
          'Students are responsible for reviewing the programme structure, duration, eligibility requirements, and financial obligations before confirming their enrollment.',
          'Valoria Technology reserves the right to amend or update this policy when necessary, subject to applicable laws and regulations. Any revised policy will be communicated through the appropriate official channels.',
        ],
      },
    ],
  },

};

