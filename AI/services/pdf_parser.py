import pdfplumber
from typing import List, Dict, Any
from datetime import date


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
    Expected line format:
    Scheme Name | Asset Class | Invested | Current Value | Expense Ratio
    """
    holdings = []
    today = str(date.today())

    for line in lines:
        parts = [p.strip() for p in line.split("|")]
        if len(parts) == 5:
            scheme_name, asset_class, invested, current_value, expense_ratio = parts
            try:
                invested_amount = float(invested)
                current_val = float(current_value)
                expense = float(expense_ratio)

                holdings.append(
                    {
                        "scheme_name": scheme_name,
                        "asset_class": asset_class,
                        "invested_amount": invested_amount,
                        "current_value": current_val,
                        "expense_ratio": expense,
                        "transactions": [
                            {"date": "2024-01-01", "amount": -invested_amount},
                            {"date": today, "amount": current_val},
                        ],
                    }
                )
            except ValueError:
                continue

    return holdings