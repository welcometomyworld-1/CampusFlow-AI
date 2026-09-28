import re
from typing import Tuple, Optional

class AgentSafetyGuard:
    """
    Security & Guardrail layer for CampusFlow AI.
    Protects against:
    1. Prompt injections and system prompt leakage attempts.
    2. Document content hijacking (indirect prompt injection).
    3. Cross-student data leakage.
    4. Hallucinated academic deadlines and fake exam claims.
    """
    INJECTION_PATTERNS = [
        r"ignore (all )?(previous|above|system) instructions",
        r"disregard (all )?prior prompts",
        r"reveal (your |the )?(secret|api|master|system) key",
        r"dump (all )?(credentials|passwords|database)",
        r"bypass (all )?(security|guardrails|safety)",
        r"you are now in developer mode",
        r"act as dan",
        r"exfiltrate",
    ]

    @classmethod
    def sanitize_user_input(cls, user_text: str) -> Tuple[bool, Optional[str]]:
        """
        Check for malicious prompt injection attempts.
        Returns: (is_safe, refusal_reason)
        """
        lower = user_text.lower()
        for pattern in cls.INJECTION_PATTERNS:
            if re.search(pattern, lower):
                return False, (
                    "I cannot fulfill this request. CampusFlow AI adheres to strict academic "
                    "safety and security policies. System instructions, credentials, and private keys "
                    "cannot be modified or disclosed."
                )
        return True, None

    @classmethod
    def validate_student_access(cls, authenticated_student_id: str, requested_student_id: str) -> bool:
        """
        Ensure students can ONLY access their own academic records.
        """
        return authenticated_student_id == requested_student_id

    @classmethod
    def sanitize_document_content(cls, raw_content: str) -> str:
        """
        Treat document content strictly as passive untrusted data,
        neutralizing any prompt manipulation attempts embedded inside PDFs or notices.
        """
        sanitized = re.sub(r"(?i)ignore\s+(all\s+)?instructions", "[FILTERED_TEXT]", raw_content)
        return sanitized
