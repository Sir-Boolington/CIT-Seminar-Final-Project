{
  "meta": {
    "version": "1.0.0",
    "lastUpdated": "2026-03-14",
    "totalTerms": 48,
    "categories": ["attack", "defense", "social_engineering", "general"]
  },
  "terms": [
    {
      "id": "adware",
      "term": "Adware",
      "definition": "Software that automatically displays or downloads advertising material, often bundled with free programs. Some adware tracks browsing habits to serve targeted ads and may slow system performance or redirect searches.",
      "category": "attack",
      "related": ["malware", "spyware", "trojan"]
    },
    {
      "id": "baiting",
      "term": "Baiting",
      "definition": "A social engineering attack in which a physical device — such as a USB drive or SD card — is deliberately left in a public location, hoping the target will plug it into their machine and unknowingly execute malicious code.",
      "category": "social_engineering",
      "related": ["social_engineering", "tailgating", "physical_security"]
    },
    {
      "id": "botnet",
      "term": "Botnet",
      "definition": "A network of compromised computers (bots or zombies) controlled remotely by an attacker, typically used to launch distributed denial-of-service attacks, send spam, or mine cryptocurrency without the owners' knowledge.",
      "category": "attack",
      "related": ["ddos", "malware", "command_and_control"]
    },
    {
      "id": "brute_force",
      "term": "Brute force attack",
      "definition": "A trial-and-error method of cracking passwords or encryption keys by systematically trying every possible combination until the correct one is found. Longer and more complex passwords dramatically increase the time required.",
      "category": "attack",
      "related": ["credential_stuffing", "dictionary_attack", "password_spraying"]
    },
    {
      "id": "ceo_fraud",
      "term": "CEO fraud",
      "definition": "A form of business email compromise in which an attacker impersonates a senior executive — typically the CEO or CFO — to trick employees into transferring funds, sharing sensitive data, or bypassing normal approval processes.",
      "category": "social_engineering",
      "related": ["bec", "spear_phishing", "pretexting", "whaling"]
    },
    {
      "id": "command_and_control",
      "term": "Command and control (C2)",
      "definition": "The infrastructure and communication channels an attacker uses to maintain contact with and send instructions to compromised systems inside a target network.",
      "category": "attack",
      "related": ["botnet", "malware", "rat"]
    },
    {
      "id": "credential_stuffing",
      "term": "Credential stuffing",
      "definition": "An automated attack that uses large sets of stolen username–password pairs (from previous data breaches) to attempt logins on other services, exploiting the common habit of password reuse.",
      "category": "attack",
      "related": ["brute_force", "data_breach", "password_spraying"]
    },
    {
      "id": "cryptojacking",
      "term": "Cryptojacking",
      "definition": "The unauthorized use of a victim's computing resources to mine cryptocurrency. This can happen through malicious scripts embedded in websites or through malware installed on the victim's device.",
      "category": "attack",
      "related": ["malware", "botnet"]
    },
    {
      "id": "data_breach",
      "term": "Data breach",
      "definition": "An incident in which sensitive, protected, or confidential data is accessed, copied, transmitted, or stolen by an unauthorized party. Breaches may result from hacking, insider threats, or accidental exposure.",
      "category": "general",
      "related": ["credential_stuffing", "encryption", "incident_response"]
    },
    {
      "id": "ddos",
      "term": "DDoS (Distributed Denial of Service)",
      "definition": "An attack that overwhelms a server, service, or network with a flood of internet traffic from multiple compromised sources, making it unavailable to legitimate users.",
      "category": "attack",
      "related": ["botnet", "dos"]
    },
    {
      "id": "dictionary_attack",
      "term": "Dictionary attack",
      "definition": "A password-cracking technique that systematically tries words from a precompiled list of common passwords, dictionary words, and known leaked credentials rather than every possible combination.",
      "category": "attack",
      "related": ["brute_force", "credential_stuffing"]
    },
    {
      "id": "dns_spoofing",
      "term": "DNS spoofing",
      "definition": "An attack that corrupts Domain Name System data so that a domain name resolves to an incorrect IP address, silently redirecting users to a malicious site even when they type the correct URL.",
      "category": "attack",
      "related": ["pharming", "mitm", "domain_hijacking"]
    },
    {
      "id": "domain_hijacking",
      "term": "Domain hijacking",
      "definition": "The act of taking control of a domain name from its rightful owner, typically by exploiting vulnerabilities in the domain registrar's systems or through social engineering of support staff.",
      "category": "attack",
      "related": ["dns_spoofing", "typosquatting", "social_engineering"]
    },
    {
      "id": "encryption",
      "term": "Encryption",
      "definition": "The process of converting readable data (plaintext) into an unreadable format (ciphertext) using an algorithm and a key, so that only authorized parties with the correct decryption key can access the original information.",
      "category": "defense",
      "related": ["ssl_tls", "vpn", "end_to_end_encryption"]
    },
    {
      "id": "end_to_end_encryption",
      "term": "End-to-end encryption (E2EE)",
      "definition": "A communication system where only the sender and intended recipient can read the messages. The data is encrypted on the sender's device and only decrypted on the recipient's device — no intermediary, including the service provider, can access it.",
      "category": "defense",
      "related": ["encryption", "ssl_tls"]
    },
    {
      "id": "exploit",
      "term": "Exploit",
      "definition": "A piece of code, software, or technique that takes advantage of a vulnerability or flaw in a system to cause unintended behavior, such as gaining unauthorized access or executing arbitrary commands.",
      "category": "attack",
      "related": ["vulnerability", "zero_day", "patch"]
    },
    {
      "id": "firewall",
      "term": "Firewall",
      "definition": "A network security device or software that monitors and filters incoming and outgoing traffic based on predefined rules, acting as a barrier between a trusted internal network and untrusted external networks.",
      "category": "defense",
      "related": ["ids", "network_security"]
    },
    {
      "id": "ids",
      "term": "IDS (Intrusion Detection System)",
      "definition": "A system that monitors network traffic or host activity for suspicious behavior or known attack signatures and generates alerts when potential threats are detected.",
      "category": "defense",
      "related": ["firewall", "siem", "network_security"]
    },
    {
      "id": "impersonation",
      "term": "Impersonation",
      "definition": "A social engineering technique where the attacker pretends to be a trusted individual — such as a coworker, IT technician, or authority figure — to manipulate the victim into revealing information or performing actions.",
      "category": "social_engineering",
      "related": ["pretexting", "ceo_fraud", "vishing"]
    },
    {
      "id": "incident_response",
      "term": "Incident response",
      "definition": "The organized approach to detecting, containing, eradicating, and recovering from a cybersecurity incident. A well-defined incident response plan minimizes damage and reduces recovery time and costs.",
      "category": "defense",
      "related": ["data_breach", "siem"]
    },
    {
      "id": "keylogger",
      "term": "Keylogger",
      "definition": "A type of surveillance software or hardware that records every keystroke made on a device, often used by attackers to capture passwords, credit card numbers, and other sensitive information.",
      "category": "attack",
      "related": ["spyware", "malware", "rat"]
    },
    {
      "id": "malware",
      "term": "Malware",
      "definition": "A catch-all term for any software intentionally designed to cause damage, steal data, or gain unauthorized access to a system. Includes viruses, worms, trojans, ransomware, spyware, and adware.",
      "category": "attack",
      "related": ["ransomware", "trojan", "spyware", "adware"]
    },
    {
      "id": "mfa",
      "term": "MFA (Multi-Factor Authentication)",
      "definition": "A security mechanism that requires users to provide two or more independent verification factors — such as a password plus a one-time code from a phone — before granting access to an account or system.",
      "category": "defense",
      "related": ["two_factor", "authentication", "social_engineering"]
    },
    {
      "id": "mitm",
      "term": "Man-in-the-middle (MitM) attack",
      "definition": "An attack where the adversary secretly intercepts and potentially alters communication between two parties who believe they are communicating directly with each other.",
      "category": "attack",
      "related": ["dns_spoofing", "ssl_tls", "session_hijacking"]
    },
    {
      "id": "password_spraying",
      "term": "Password spraying",
      "definition": "An attack that tries a small number of commonly used passwords against a large number of accounts, avoiding account lockout policies that would trigger from repeated attempts on a single account.",
      "category": "attack",
      "related": ["brute_force", "credential_stuffing", "dictionary_attack"]
    },
    {
      "id": "patch",
      "term": "Patch",
      "definition": "A software update released by a vendor to fix security vulnerabilities, bugs, or other issues. Timely patching is one of the most effective defenses against known exploits.",
      "category": "defense",
      "related": ["vulnerability", "zero_day", "exploit"]
    },
    {
      "id": "pharming",
      "term": "Pharming",
      "definition": "A cyber attack that redirects website traffic from a legitimate site to a fraudulent one by exploiting DNS vulnerabilities, without requiring the victim to click a malicious link.",
      "category": "attack",
      "related": ["dns_spoofing", "phishing"]
    },
    {
      "id": "phishing",
      "term": "Phishing",
      "definition": "A fraudulent attempt to obtain sensitive information — such as usernames, passwords, or credit card details — by disguising as a trustworthy entity in electronic communication, most commonly email.",
      "category": "social_engineering",
      "related": ["spear_phishing", "whaling", "vishing", "smishing"]
    },
    {
      "id": "physical_security",
      "term": "Physical security",
      "definition": "Measures designed to prevent unauthorized physical access to facilities, equipment, and resources. Includes locked server rooms, badge access, surveillance cameras, and visitor sign-in policies.",
      "category": "defense",
      "related": ["tailgating", "baiting", "social_engineering"]
    },
    {
      "id": "pretexting",
      "term": "Pretexting",
      "definition": "A social engineering technique where the attacker creates a fabricated scenario (a pretext) to engage a victim and build enough trust to extract confidential information or convince them to perform an action.",
      "category": "social_engineering",
      "related": ["impersonation", "social_engineering", "vishing"]
    },
    {
      "id": "ransomware",
      "term": "Ransomware",
      "definition": "A type of malware that encrypts a victim's files or locks them out of their system, then demands a ransom payment — usually in cryptocurrency — in exchange for the decryption key or restored access.",
      "category": "attack",
      "related": ["malware", "encryption", "phishing"]
    },
    {
      "id": "rat",
      "term": "RAT (Remote Access Trojan)",
      "definition": "A type of malware that gives an attacker full remote control over a victim's computer, including access to files, the webcam, microphone, and keystrokes, often without any visible indication to the user.",
      "category": "attack",
      "related": ["trojan", "malware", "keylogger", "command_and_control"]
    },
    {
      "id": "red_flag",
      "term": "Red flag",
      "definition": "A warning sign or indicator that something may be suspicious, fraudulent, or malicious. In cybersecurity training, learning to recognize red flags in emails, messages, and conversations is a core skill.",
      "category": "general",
      "related": ["phishing", "social_engineering"]
    },
    {
      "id": "session_hijacking",
      "term": "Session hijacking",
      "definition": "An attack where an adversary takes over an active user session by stealing or predicting a valid session token, allowing them to impersonate the user and access their account without needing credentials.",
      "category": "attack",
      "related": ["mitm", "xss", "ssl_tls"]
    },
    {
      "id": "siem",
      "term": "SIEM (Security Information and Event Management)",
      "definition": "A system that collects, aggregates, and analyzes log data from across an organization's IT infrastructure to detect anomalies, correlate events, and support incident response in real time.",
      "category": "defense",
      "related": ["ids", "incident_response"]
    },
    {
      "id": "smishing",
      "term": "Smishing",
      "definition": "A phishing attack delivered via SMS text messages. The message typically contains a link to a fraudulent website or a phone number that connects to an attacker posing as a legitimate organization.",
      "category": "social_engineering",
      "related": ["phishing", "vishing", "spear_phishing"]
    },
    {
      "id": "social_engineering",
      "term": "Social engineering",
      "definition": "The psychological manipulation of people into performing actions or divulging confidential information. Rather than exploiting technical vulnerabilities, social engineers exploit human trust, fear, urgency, and helpfulness.",
      "category": "social_engineering",
      "related": ["phishing", "pretexting", "baiting", "tailgating", "vishing"]
    },
    {
      "id": "spear_phishing",
      "term": "Spear phishing",
      "definition": "A targeted phishing attack directed at a specific individual or organization, using personalized information — such as the target's name, role, or recent activity — to increase credibility and the likelihood of success.",
      "category": "social_engineering",
      "related": ["phishing", "whaling", "ceo_fraud"]
    },
    {
      "id": "spoofing",
      "term": "Spoofing",
      "definition": "The act of forging identifying information — such as an email address, phone number, IP address, or website URL — to disguise the true origin of a communication and make it appear legitimate.",
      "category": "attack",
      "related": ["phishing", "dns_spoofing", "impersonation"]
    },
    {
      "id": "spyware",
      "term": "Spyware",
      "definition": "Malicious software that secretly monitors and collects information about a user's activities — including browsing habits, keystrokes, and personal data — and transmits it to a third party without consent.",
      "category": "attack",
      "related": ["malware", "keylogger", "adware"]
    },
    {
      "id": "ssl_tls",
      "term": "SSL/TLS",
      "definition": "Secure Sockets Layer and its successor Transport Layer Security are cryptographic protocols that encrypt data transmitted between a web browser and a server, indicated by the padlock icon and 'https' in the URL bar.",
      "category": "defense",
      "related": ["encryption", "mitm", "end_to_end_encryption"]
    },
    {
      "id": "sso",
      "term": "SSO (Single Sign-On)",
      "definition": "An authentication method that allows a user to log in once with a single set of credentials and gain access to multiple related but independent applications or systems without re-entering their password.",
      "category": "general",
      "related": ["mfa", "authentication"]
    },
    {
      "id": "tailgating",
      "term": "Tailgating",
      "definition": "A physical social engineering technique where an unauthorized person follows an authorized individual through a secured door or entrance without using their own credentials, often by pretending to carry items or simply walking close behind.",
      "category": "social_engineering",
      "related": ["baiting", "physical_security", "social_engineering"]
    },
    {
      "id": "trojan",
      "term": "Trojan horse",
      "definition": "A type of malware disguised as legitimate software that, once installed, gives an attacker unauthorized access to the victim's system. Unlike viruses, trojans do not self-replicate — they rely on the user to install them.",
      "category": "attack",
      "related": ["malware", "rat", "baiting"]
    },
    {
      "id": "typosquatting",
      "term": "Typosquatting",
      "definition": "The practice of registering domain names that are common misspellings of popular websites (e.g., 'gooogle.com') to capture traffic from users who mistype URLs, often redirecting them to phishing or ad-laden pages.",
      "category": "attack",
      "related": ["phishing", "spoofing", "domain_hijacking"]
    },
    {
      "id": "vishing",
      "term": "Vishing",
      "definition": "Voice phishing — a social engineering attack conducted over the phone. The caller impersonates a trusted entity (bank, government, tech support) to pressure the victim into revealing sensitive information or making payments.",
      "category": "social_engineering",
      "related": ["phishing", "smishing", "pretexting", "impersonation"]
    },
    {
      "id": "vpn",
      "term": "VPN (Virtual Private Network)",
      "definition": "A service that creates an encrypted tunnel between your device and the internet, masking your IP address and protecting your data from interception — especially important on public Wi-Fi networks.",
      "category": "defense",
      "related": ["encryption", "ssl_tls", "mitm"]
    },
    {
      "id": "vulnerability",
      "term": "Vulnerability",
      "definition": "A weakness or flaw in a system's design, implementation, or configuration that could be exploited by an attacker to compromise the system's security, integrity, or availability.",
      "category": "general",
      "related": ["exploit", "zero_day", "patch"]
    },
    {
      "id": "whaling",
      "term": "Whaling",
      "definition": "A highly targeted spear phishing attack aimed at senior executives or high-profile individuals within an organization. The attacker crafts personalized, convincing messages designed to trick the target into authorizing large transactions or disclosing sensitive corporate data.",
      "category": "social_engineering",
      "related": ["spear_phishing", "ceo_fraud", "phishing"]
    },
    {
      "id": "xss",
      "term": "XSS (Cross-Site Scripting)",
      "definition": "A web security vulnerability that allows an attacker to inject malicious scripts into web pages viewed by other users. The script executes in the victim's browser and can steal session cookies, redirect users, or deface content.",
      "category": "attack",
      "related": ["exploit", "session_hijacking", "vulnerability"]
    },
    {
      "id": "zero_day",
      "term": "Zero-day",
      "definition": "A software vulnerability that is unknown to the vendor and for which no patch exists yet. Zero-day exploits are particularly dangerous because defenders have had zero days to prepare a fix.",
      "category": "general",
      "related": ["vulnerability", "exploit", "patch"]
    }
  ]
}
