from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Table, TableStyle,
    KeepTogether, PageBreak
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Paquetes-Redes-Sociales-Systemic-Solutions.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#0A2540")
BLUE = colors.HexColor("#1A7B9E")
ORANGE = colors.HexColor("#F59E0B")
INK = colors.HexColor("#172B3A")
MUTED = colors.HexColor("#5D6B78")
PALE = colors.HexColor("#F3F7FB")
LINE = colors.HexColor("#DDE6EE")
WHITE = colors.white

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Brand", fontName="Helvetica-Bold", fontSize=20, leading=23, textColor=NAVY))
styles.add(ParagraphStyle(name="Eyebrow", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=BLUE, tracking=1.5))
styles.add(ParagraphStyle(name="Hero", fontName="Helvetica-Bold", fontSize=27, leading=31, textColor=NAVY))
styles.add(ParagraphStyle(name="Sub", fontName="Helvetica", fontSize=10.5, leading=15, textColor=MUTED))
styles.add(ParagraphStyle(name="Package", fontName="Helvetica-Bold", fontSize=13.5, leading=16, textColor=NAVY))
styles.add(ParagraphStyle(name="Price", fontName="Helvetica-Bold", fontSize=21, leading=23, textColor=NAVY))
styles.add(ParagraphStyle(name="Small", fontName="Helvetica", fontSize=8.2, leading=11.5, textColor=MUTED))
styles.add(ParagraphStyle(name="Feature", fontName="Helvetica", fontSize=9, leading=12.5, textColor=INK))
styles.add(ParagraphStyle(name="FeatureBold", fontName="Helvetica-Bold", fontSize=9, leading=12.5, textColor=INK))
styles.add(ParagraphStyle(name="Section", fontName="Helvetica-Bold", fontSize=17, leading=20, textColor=NAVY))
styles.add(ParagraphStyle(name="TableHead", fontName="Helvetica-Bold", fontSize=8.3, leading=10, textColor=WHITE, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="TableCell", fontName="Helvetica", fontSize=8, leading=10.5, textColor=INK, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="TableRow", fontName="Helvetica-Bold", fontSize=8.1, leading=10.5, textColor=NAVY, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="Footer", fontName="Helvetica", fontSize=7.5, leading=9, textColor=MUTED))


def header_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setFillColor(NAVY)
    canvas.rect(0, h - 10 * mm, w, 10 * mm, fill=1, stroke=0)
    canvas.setFillColor(BLUE)
    canvas.rect(0, h - 11.5 * mm, w, 1.5 * mm, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, w - 18 * mm, 14 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.5)
    canvas.drawString(18 * mm, 9 * mm, "Systemic Solutions | Tingo Maria | Soluciones digitales integrales")
    canvas.drawRightString(w - 18 * mm, 9 * mm, f"Pagina {doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT), pagesize=A4,
    leftMargin=18 * mm, rightMargin=18 * mm,
    topMargin=19 * mm, bottomMargin=18 * mm,
    title="Paquetes de redes sociales - Systemic Solutions",
    author="Systemic Solutions",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=header_footer)])


def check(text):
    return Paragraph(f'<font color="#1A7B9E"><b>-</b></font> {text}', styles["Feature"])


def package_card(name, label, price, features, accent, featured=False):
    tag = Paragraph(f'<font color="#FFFFFF"><b>{label}</b></font>', ParagraphStyle(
        "tag", parent=styles["Small"], alignment=TA_CENTER, fontSize=7.5, leading=9
    ))
    title = Paragraph(name, styles["Package"])
    price_p = Paragraph(f"S/ {price}<font size=9 color='#5D6B78'> / mes</font>", styles["Price"])
    inner = [[tag], [Spacer(1, 2 * mm)], [title], [price_p], [Spacer(1, 2 * mm)]]
    inner += [[check(f)] for f in features]
    t = Table(inner, colWidths=[52 * mm], rowHeights=None)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), accent),
        ("BOX", (0, 0), (-1, -1), 1.4 if featured else 0.8, accent if featured else LINE),
        ("BACKGROUND", (0, 1), (-1, -1), WHITE),
        ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
        ("TOPPADDING", (0, 0), (-1, 0), 2.2 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, 0), 2.2 * mm),
        ("TOPPADDING", (0, 1), (-1, -1), 1.6 * mm),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 1.6 * mm),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


standard = [
    "<b>8 publicaciones</b> mensuales",
    "<b>2 videos cortos</b> con edición básica",
    "Gestión de <b>Facebook</b>",
    "Respuesta de lunes a viernes, en menos de 8 h",
    "Calendario mensual básico",
    "Reporte de alcance e interacciones",
]
recommended = [
    "<b>12 publicaciones</b> mensuales",
    "<b>4 videos cortos</b> con edición dinámica",
    "Gestión de <b>Facebook + Instagram</b>",
    "Respuesta de lunes a sábado, en menos de 6 h",
    "Calendario estratégico y línea de contenidos",
    "Reporte con análisis y recomendaciones",
]
pro = [
    "<b>16 publicaciones</b> mensuales",
    "<b>6 videos cortos</b> con edición avanzada",
    "Gestión de <b>Facebook + Instagram + TikTok</b>",
    "Atención prioritaria, en menos de 4 h",
    "Estrategia mensual, campañas y optimización",
    "Reporte ejecutivo y reunión mensual",
]

story = []
story += [
    Spacer(1, 3 * mm),
    Paragraph("SYSTEMIC SOLUTIONS", styles["Brand"]),
    Spacer(1, 8 * mm),
    Paragraph("GESTIÓN DE REDES SOCIALES", styles["Eyebrow"]),
    Spacer(1, 2 * mm),
    Paragraph("Tres paquetes para hacer crecer tu presencia digital", styles["Hero"]),
    Spacer(1, 3 * mm),
    Paragraph("Elige el nivel de contenido, atención y estrategia que mejor se adapta a tu negocio. Todos los planes incluyen planificación, diseño de piezas y gestión profesional.", styles["Sub"]),
    Spacer(1, 9 * mm),
]

cards = Table([
    [
        package_card("ESTÁNDAR", "PARA EMPEZAR", "300", standard, NAVY),
        package_card("RECOMENDADO", "MEJOR EQUILIBRIO", "500", recommended, ORANGE, True),
        package_card("PRO", "MÁXIMO IMPULSO", "700", pro, BLUE),
    ]
], colWidths=[56.5 * mm] * 3, hAlign="CENTER")
cards.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 2 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm),
]))
story += [cards, Spacer(1, 7 * mm)]

note = Table([[Paragraph("El paquete Recomendado ofrece la mejor relación entre frecuencia, cobertura y estrategia para negocios que buscan crecer de forma constante.", styles["Sub"])]], colWidths=[doc.width])
note.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFF7E7")),
    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#F6C866")),
    ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
]))
story += [note, PageBreak()]

story += [
    Spacer(1, 3 * mm),
    Paragraph("COMPARACIÓN DETALLADA", styles["Eyebrow"]),
    Spacer(1, 2 * mm),
    Paragraph("Encuentra el paquete ideal para tu negocio", styles["Section"]),
    Spacer(1, 5 * mm),
]

rows = [
    ["Inversión mensual", "S/ 300", "S/ 500", "S/ 700"],
    ["Publicaciones", "8", "12", "16"],
    ["Videos cortos", "2", "4", "6"],
    ["Redes gestionadas", "Facebook", "Facebook + Instagram", "Facebook + Instagram + TikTok"],
    ["Community management", "Lun-vie / < 8 h", "Lun-sáb / < 6 h", "Prioritario / < 4 h"],
    ["Planificación", "Calendario básico", "Calendario estratégico", "Estrategia + campañas"],
    ["Reporte", "Métricas básicas", "Análisis y mejoras", "Ejecutivo + reunión"],
]
data = [[
    Paragraph("INCLUYE", styles["TableHead"]),
    Paragraph("ESTÁNDAR", styles["TableHead"]),
    Paragraph("RECOMENDADO", styles["TableHead"]),
    Paragraph("PRO", styles["TableHead"]),
]]
for i, row in enumerate(rows):
    data.append([
        Paragraph(row[0], styles["TableRow"]),
        Paragraph(row[1], styles["TableCell"]),
        Paragraph(row[2], styles["TableCell"]),
        Paragraph(row[3], styles["TableCell"]),
    ])

comparison = Table(data, colWidths=[44 * mm, 39 * mm, 48 * mm, 43 * mm], repeatRows=1)
comparison.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NAVY),
    ("BACKGROUND", (2, 0), (2, 0), ORANGE),
    ("GRID", (0, 0), (-1, -1), 0.6, LINE),
    ("BACKGROUND", (0, 1), (-1, -1), WHITE),
    ("BACKGROUND", (0, 2), (-1, 2), PALE),
    ("BACKGROUND", (0, 4), (-1, 4), PALE),
    ("BACKGROUND", (0, 6), (-1, 6), PALE),
    ("BACKGROUND", (2, 1), (2, -1), colors.HexColor("#FFF9EC")),
    ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm),
    ("LEFTPADDING", (0, 0), (-1, -1), 2.5 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 2.5 * mm),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
]))
story += [comparison, Spacer(1, 8 * mm)]

terms = [
    [Paragraph("CONDICIONES DEL SERVICIO", styles["Package"])],
    [Paragraph("• El servicio se factura por mes adelantado.<br/>• La pauta publicitaria no está incluida; el presupuesto de anuncios lo define el cliente.<br/>• El cliente proporciona logos, fotos, información comercial y aprobaciones en los plazos acordados.<br/>• Se incluye una ronda de ajustes por pieza antes de su publicación.<br/>• Permanencia mínima sugerida: 3 meses para evaluar resultados y optimizar la estrategia.", styles["Feature"])],
]
terms_table = Table(terms, colWidths=[doc.width])
terms_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), PALE),
    ("BOX", (0, 0), (-1, -1), 0.8, LINE),
    ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
    ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm),
]))
story += [terms_table, Spacer(1, 8 * mm)]

cta = Table([[Paragraph("¿LISTO PARA HACER CRECER TU MARCA?", ParagraphStyle("cta", parent=styles["Package"], textColor=WHITE, alignment=TA_CENTER)),
              Paragraph("contacto@systemicsolutions.pe", ParagraphStyle("cta2", parent=styles["Sub"], textColor=WHITE, alignment=TA_CENTER))]],
            colWidths=[94 * mm, 80 * mm])
cta.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), NAVY),
    ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
]))
story += [cta]

doc.build(story)
print(OUTPUT)
