# CampusFlow AI — Document Grounding & RAG Architecture

## 1. Grounded Retrieval Flow
```
Institutional PDFs / MDs
(Syllabi, Exam Circulars, Calendars, Policies)
           ↓
Amazon S3 Bucket / Local Document Store
           ↓
Amazon Bedrock Knowledge Bases / RAG Retriever
           ↓
Semantic Chunking & Relevance Scoring
           ↓
MCP Tools: search_college_notices & search_academic_documents
           ↓
Agent Reasoning Loop (Amazon Bedrock / Claude 3.5 Sonnet)
           ↓
Strict Citation Output (Title, Official Ref, Verbatim Passage)
```

## 2. Institutional Documents Catalog
1. **`college_notice_exam_room_update.md`**:
   - Official Circular `ATU/COE/FALL2026/NOT-092`
   - Reassigns DBMS exam venue from Hall A-101 to **Room B-204** due to HVAC repairs.
2. **`syllabus_dbms.md`**:
   - Detailed modules for CS501. Highlighting Module 3 (Normalization, BCNF) and Module 4 (Transactions, 2PL) with over 55% exam weightage.
3. **`exam_schedule_fall2026.md`**:
   - Master examination timetable for 5th semester Computer Science.
4. **`attendance_policy.md`**:
   - University Regulation Clause 4.2 detailing the 75% threshold, warning/condonation criteria (70% - 74.9%), and debarment policy (&lt; 70%).
5. **`academic_calendar.md`**:
   - Submission cutoff dates and examination dates.

## 3. Anti-Hallucination Safeguards
- CampusFlow AI never fabricates exam dates or rooms.
- If a circular cannot be retrieved, the agent explicitly states: *"I cannot find an official notice regarding this change in university records."*
- Citations display the exact circular number and official issuing authority.
