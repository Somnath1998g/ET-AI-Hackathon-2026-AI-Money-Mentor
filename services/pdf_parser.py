import pdfplumber
from typing import List, Dict, Any


def extract_text_from_pdf(uploaded_file) -> str:
    full_text = []
    with pdfplumber.open(uploaded_file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                full_text.append(text)
    return "\n".join(full_text)


def extract_lines_from_pdf(uploaded_file) -> List[str]:
    text = extract_text_from_pdf(uploaded_file)
    return [line.strip() for line in text.split("\n") if line.strip()]


def parse_sample_portfolio(lines: List[str]) -> List[Dict[str, Any]]:
    """
    Day 3 simplified parser.
    Replace this later with real CAMS/KFintech parsing logic.
    Expected mock line format:
    Fund Name | Invested | Current Value | Expense Ratio
    """
    holdings = []

    for line in lines:
        parts = [p.strip() for p in line.split("|")]
        if len(parts) == 4:
            fund_name, invested, current_value, expense_ratio = parts
            try:
                holdings.append(
                    {
                        "fund_name": fund_name,
                        "invested": float(invested),
                        "current_value": float(current_value),
                        "expense_ratio": float(expense_ratio),
                    }
                )
            except ValueError:
                continue

    return holdings