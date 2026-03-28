import re
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


def parse_pipe_format(lines: List[str]) -> List[Dict[str, Any]]:
    """
    Supports:
    Scheme Name | Asset Class | Invested | Current Value | Expense Ratio
    """
    holdings = []
    today = str(date.today())

    for line in lines:
        parts = [p.strip() for p in line.split("|")]
        if len(parts) == 5:
            scheme_name, asset_class, invested, current_value, expense_ratio = parts
            try:
                invested_amount = float(invested.replace(",", "").replace("Rs.", "").strip())
                current_val = float(current_value.replace(",", "").replace("Rs.", "").strip())
                expense = float(expense_ratio.replace("%", "").strip())

                holdings.append(
                    {
                        "scheme_name": scheme_name,
                        "asset_class": asset_class,
                        "category": asset_class,
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


def infer_asset_class(category: str) -> str:
    category_lower = category.lower()
    if "debt" in category_lower:
        return "Debt"
    if "hybrid" in category_lower:
        return "Hybrid"
    return "Equity"


def parse_table_format(lines: List[str]) -> List[Dict[str, Any]]:
    """
    Supports demo CAMS-style extracted text like:
    Axis Bluechip Fund Large Cap 1,20,000 1,45,000 1.60% 2,500.000 58.00
    Parag Parikh Flexi Cap Fund Flexi Cap 1,00,000 1,30,000 1.50% 250.000 520.00
    HDFC Short Term Debt Fund Debt 80,000 86,000 0.80% 4,300.000 20.00
    """
    holdings = []
    today = str(date.today())

    pattern = re.compile(
        r"^(?P<scheme>.+?)\s+"
        r"(?P<category>Large Cap|Mid Cap|Small Cap|Flexi Cap|Multi Cap|Debt|Hybrid)\s+"
        r"(?P<invested>[\d,]+)\s+"
        r"(?P<current>[\d,]+)\s+"
        r"(?P<expense>[\d.]+%)\s+"
        r"(?P<units>[\d,]+\.\d+)\s+"
        r"(?P<nav>[\d.]+)$"
    )

    for line in lines:
        match = pattern.match(line)
        if not match:
            continue

        try:
            scheme_name = match.group("scheme").strip()
            category = match.group("category").strip()
            invested_amount = float(match.group("invested").replace(",", ""))
            current_val = float(match.group("current").replace(",", ""))
            expense = float(match.group("expense").replace("%", ""))

            holdings.append(
                {
                    "scheme_name": scheme_name,
                    "asset_class": infer_asset_class(category),
                    "category": category,
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


def parse_sample_portfolio(lines: List[str]) -> List[Dict[str, Any]]:
    holdings = parse_pipe_format(lines)

    if holdings:
        return holdings

    holdings = parse_table_format(lines)
    return holdings

