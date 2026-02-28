# The Invisible Schoolhouse: Project Reference & Developer Guide

## 1. The Big Idea
**"The Invisible Schoolhouse"** is a decentralized, **Local-First AI** tutoring platform that transforms any smartphone into a private teacher. 
* **Zero Internet:** Operates in complete "Dead Zones."
* **Zero Server Fees:** Costs nothing to scale; runs entirely on student hardware.
* **Local-First:** Privacy by design; student data never leaves the device.

---

## 2. The Technical MVP (The "Magic" Demo)
This outlines the core architecture for the initial deployment, focusing on the **First Load** and the **Offline Chat**.

### A. The Teacher’s Hub (Source)
* **Hardware:** A laptop connected to a smartphone’s "Data-less" Hotspot.
* **Software:** A local HTTP server hosting PWA files and the quantized SLM (Small Language Model).
* **Access:** Students visit `http://[Laptop-IP]:8080` (e.g., `192.168.43.15`).

### B. The Student’s Device (The Client)
* **The Shell:** A PWA (Progressive Web App) "Installed" to the home screen.
* **The Brain:** **WebLLM** pulls a 0.5B Micro-Model (like **Qwen2-0.5B**) from the laptop to the phone's GPU.
* **The Vault:** The model is cached in **IndexedDB** for 100% offline persistence.

### C. The Interaction (Socratic Tutoring)
* **The Prompt:** A hidden "Concept Anchor" ensures the AI acts as a local tutor.
* **The Logic:** Uses the **Socratic method**—guiding students through math and reading with hints rather than direct answers.
* **Concept Anchor (System Prompt):**
  > "You are an Offline SLM Tutor. You were synced from the Teacher's Hub via a Local IP. You are running on Maya's phone via WebGPU. There is no internet. Your goal is to provide Socratic guidance on the local Lesson Pack. Stay concise, stay offline, and stay helpful."

---

## 3. Developer Roles & Deliverables

| Developer | Role | Mission-Critical Deliverable |
| :--- | :--- | :--- |
| **Dev A (DevOps)** | **The Bridge** | Host the model on the laptop; ensure the phone can "ping" the laptop over the hotspot. |
| **Dev B (AI/ML)** | **The Engine** | Implement WebLLM; configure the 0.5B model; write the "Concept Anchor" prompt. |
| **Dev C (Frontend)** | **The Interface** | Build the Chat UI and the Progress Bar (crucial for showing the model loading). |

---

## 4. The Pitch & Demo Sequence
**Why It Matters:**
* **Equity:** Students in "Dead Zones" gain the same AI power as those in Silicon Valley.
* **Privacy:** Student struggles are never uploaded to a cloud.
* **Scale:** "Zero-Cost" infrastructure. As more students join, the P2P mesh gets stronger.

**The Demo Sequence:**
1. **Connect:** Open the browser on a phone; show it connecting to the "Teacher Hotspot."
2. **Load:** Show the ~350MB download happening at high speed locally.
3. **Cut the Cord:** Turn on Airplane Mode.
4. **Engage:** Ask: *"How do I solve $2x = 10$?"*
5. **The Result:** The AI responds offline: *"Think about what operation is the opposite of multiplication..."*

---

## 5. Real-World Workflow: Teacher & Student
The following step-by-step scenario demonstrates how the entire system functions in a community without traditional internet infrastructure. 

### Phase 1: The Initial "Local Sync" (Monday Morning)
Before a student (Maya) can use the tutor at home, she needs the "Brain" on her phone.

1. **The Hub:** The teacher (Mr. Santos) has a laptop at the school acting as a "Local Hub." It broadcasts a Wi-Fi signal called `School_Sync_Network`. This Wi-Fi has no actual internet; it's a local router.
2. **The Download:** Maya arrives at school, connects to the Wi-Fi, and opens the web app link. Her browser prompts her to "Install App" (the PWA).
3. **Caching the AI:** In the background, the app pulls the compressed 0.5B Math & Reading AI Model (~350MB) directly from the laptop to Maya's phone via the local Wi-Fi in ~45 seconds.
4. **Offline Ready:** Maya's phone stores the AI in its permanent IndexedDB cache. The AI will now work perfectly in airplane mode.

### Phase 2: The Teacher's Broadcast (Wednesday Afternoon)
Mr. Santos wants to send a new assignment: solving linear equations and reading a historical text.
1. **Creating the Lesson:** On his laptop, he types the assignment into his teacher dashboard. The system packages the text and math problems into a tiny, encrypted text file (~15 KB).
2. **Sending to the Mesh:** He clicks "Broadcast to Grade 8." His device sends this file over Bluetooth and Wi-Fi Direct to the phones of nearby students.
3. **The Relay Begins:** Maya is already home, 3 km away. Her classmate, Leo, receives the file while walking home.

### Phase 3: The P2P "Hop" (Wednesday Evening)
This is where the mesh network (Briar/Bramble protocol) functions.

1. **The Carrier:** Leo walks through Maya’s neighborhood.
2. **The Handshake:** Leo’s phone and Maya’s phone are both running the Tutor App in the background. As Leo walks within 100 meters of Maya's house, their phones "see" each other via Wi-Fi Direct.
3. **The Transfer:** The encrypted assignment hops from Leo’s phone to Maya’s phone. Leo cannot read Maya's file.
4. **The Notification:** Maya's phone alerts her: *"New Assignment from Mr. Santos is ready."*

### Phase 4: The Offline Tutoring Session (Wednesday Night)
Maya sits down to do her homework with zero cell service.
1. **Opening the App:** She opens the PWA. The local AI (via WebGPU) wakes up and reads the new assignment file.
2. **The Math Struggle:** The app presents the problem: $3x + 12 = 27$.
   * Maya types: *"The answer is x = 4."*
   * The Local AI processes this on her GPU and realizes she is incorrect.
3. **Socratic Scaffolding:** * The AI replies: *"Not quite! Let's work it out together. If we want to get $3x$ by itself, what should we do with the 12?"*
   * Maya types: *"Subtract 12 from 27?"*
   * The AI replies: *"Exactly! So now we have $3x = 15$. What's the final step?"*
4. **The Reading Module:** Maya reads a short story, highlights the word "benevolent," and taps "Ask Tutor." The local AI provides the definition and asks her to use it in a sentence.

### Phase 5: The Sync Back (Friday Morning)
Mr. Santos needs to review Maya's progress.
1. **The Progress File:** Maya's app compresses her conversation, time taken, and scores into a tiny 5 KB "Progress File."
2. **The Reverse Hop:** Maya passes Leo, or walks onto school grounds.
3. **Data Merging:** Her phone connects to the `School_Sync_Network` (or Leo's phone relays it). The Progress File is securely delivered to the laptop.
4. **The Dashboard:** Mr. Santos sees: *"Maya completed the assignment. She struggled with the first step of linear equations but mastered it after two hints."*