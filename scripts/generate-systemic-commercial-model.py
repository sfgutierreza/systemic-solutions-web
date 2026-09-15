from pathlib import Path
from math import atan2, cos, sin, pi

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "systemic-informacion-comercial-vendedores.pdf"
LOGO = ROOT / "public" / "favicon-systemic-dark-256.png"
FONT_DIR = Path(r"C:\Users\User\.agents\skills\canvas-design\canvas-fonts")

W, H = landscape(A4)

WHITE = HexColor("#FFFFFF")
PAPER = HexColor("#FBFCFD")
INK = HexColor("#14202B")
NAVY = HexColor("#10233A")
BODY = HexColor("#344552")
MUTED = HexColor("#667781")
FAINT = HexColor("#95A3AA")
LINE = HexColor("#D9E1E5")
SOFT = HexColor("#F3F6F8")
CYAN = HexColor("#078AA8")
CYAN_BRIGHT = HexColor("#38C3DE")
CYAN_PALE = HexColor("#E8F8FC")
PURPLE = HexColor("#6E55A6")
PURPLE_BRIGHT = HexColor("#A98BE8")
PURPLE_PALE = HexColor("#F1EDFA")
GREEN = HexColor("#2F7D65")
GREEN_PALE = HexColor("#EAF6F1")
AMBER = HexColor("#9A681B")
AMBER_PALE = HexColor("#FFF6E4")
RED = HexColor("#A34848")
RED_PALE = HexColor("#FCEEEE")

MARGIN = 42


def register_fonts():
    pdfmetrics.registerFont(TTFont("Display", str(FONT_DIR / "BricolageGrotesque-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Body", str(FONT_DIR / "InstrumentSans-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("BodyBold", str(FONT_DIR / "InstrumentSans-Bold.ttf")))
    pdfmetrics.registerFont(TTFont("Mono", str(FONT_DIR / "JetBrainsMono-Regular.ttf")))
    pdfmetrics.registerFont(TTFont("MonoBold", str(FONT_DIR / "JetBrainsMono-Bold.ttf")))


def pstyle(name="Body", size=9, leading=None, color=BODY, align=TA_LEFT, space_after=0):
    return ParagraphStyle(
        name=f"{name}-{size}-{leading}-{color}",
        fontName=name,
        fontSize=size,
        leading=leading or size * 1.32,
        textColor=color,
        alignment=align,
        spaceAfter=space_after,
        allowWidows=0,
        allowOrphans=0,
    )


def para(c, text, x, y_top, width, style=None, max_height=1000):
    style = style or pstyle()
    block = Paragraph(text, style)
    _, height = block.wrap(width, max_height)
    block.drawOn(c, x, y_top - height)
    return y_top - height


def bullet_list(c, items, x, y_top, width, color=CYAN, size=8.3, gap=7, leading=None, body_color=BODY):
    y = y_top
    for item in items:
        c.setFillColor(color)
        c.circle(x + 3, y - 4.1, 2.1, stroke=0, fill=1)
        y = para(c, item, x + 13, y, width - 13, pstyle("Body", size, leading or size * 1.35, body_color))
        y -= gap
    return y


def label(c, text, x, y, color=CYAN, size=6.8, spacing=0.75, bold=True):
    c.saveState()
    c.setFillColor(color)
    c.setFont("MonoBold" if bold else "Mono", size)
    t = c.beginText(x, y)
    t.setCharSpace(spacing)
    t.textLine(text)
    c.drawText(t)
    c.restoreState()


def page_base(c, page_no, section):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # Small identity lockup; rendered as vector accents for reliable print output.
    c.setFillColor(CYAN)
    c.circle(MARGIN + 4, H - 33.5, 3.6, stroke=0, fill=1)
    c.setFillColor(PURPLE)
    c.circle(MARGIN + 13, H - 33.5, 3.6, stroke=0, fill=1)
    c.setFillColor(NAVY)
    c.setFont("BodyBold", 8.5)
    c.drawString(MARGIN + 25, H - 34, "SYSTEMIC SOLUTIONS")
    label(c, section.upper(), MARGIN + 180, H - 34.5, MUTED, 5.8, 0.55, False)

    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.line(MARGIN, H - 53, W - MARGIN, H - 53)

    c.setFillColor(MUTED)
    c.setFont("Mono", 5.5)
    c.drawString(MARGIN, 22, "DOCUMENTO INTERNO  /  CAPACITACIÓN COMERCIAL  /  SYSTEMIC.PE")
    c.drawRightString(W - MARGIN, 22, f"{page_no:02d}")


def title(c, eyebrow, heading, intro=None, accent=CYAN, top=H - 78, width=760):
    label(c, eyebrow.upper(), MARGIN, top, accent, 6.6, 0.8, True)
    y = para(c, heading, MARGIN, top - 15, width, pstyle("BodyBold", 23, 26.5, NAVY))
    if intro:
        y = para(c, intro, MARGIN, y - 8, width, pstyle("Body", 10.5, 14, MUTED))
    return y


def card(c, x, y_top, w, h, fill=WHITE, border=LINE, radius=9, accent=None, shadow=False):
    y = y_top - h
    if shadow:
        c.saveState()
        c.setFillColor(NAVY)
        c.setFillAlpha(0.045)
        c.roundRect(x + 2.5, y - 3, w, h, radius, stroke=0, fill=1)
        c.restoreState()
    c.setFillColor(fill)
    c.setStrokeColor(border)
    c.setLineWidth(0.8)
    c.roundRect(x, y, w, h, radius, stroke=1, fill=1)
    if accent:
        c.setFillColor(accent)
        c.roundRect(x, y_top - 3, w, 3, 1.5, stroke=0, fill=1)
    return y


def pill(c, text, x, y, w, fill=CYAN_PALE, color=CYAN, border=None, size=6.6):
    c.setFillColor(fill)
    c.setStrokeColor(border or fill)
    c.roundRect(x, y, w, 22, 11, stroke=1 if border else 0, fill=1)
    c.setFillColor(color)
    c.setFont("MonoBold", size)
    c.drawCentredString(x + w / 2, y + 7.2, text)


def arrow(c, x1, y1, x2, y2, color=CYAN, width=1.2, head=5):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)
    angle = atan2(y2 - y1, x2 - x1)
    p1 = (x2 + head * cos(angle + 5 * pi / 6), y2 + head * sin(angle + 5 * pi / 6))
    p2 = (x2 + head * cos(angle - 5 * pi / 6), y2 + head * sin(angle - 5 * pi / 6))
    c.line(x2, y2, p1[0], p1[1])
    c.line(x2, y2, p2[0], p2[1])


def section_heading(c, text, x, y_top, color=NAVY, size=12):
    return para(c, text, x, y_top, 350, pstyle("BodyBold", size, size * 1.18, color))


def small_note(c, text, x, y_top, width, fill=SOFT, border=LINE, color=MUTED, accent=CYAN, h=46, size=7.5):
    card(c, x, y_top, width, h, fill=fill, border=border, radius=7)
    c.setFillColor(accent)
    c.roundRect(x, y_top - h, 4, h, 2, stroke=0, fill=1)
    para(c, text, x + 13, y_top - 11, width - 25, pstyle("Body", size, size * 1.3, color))


def draw_cover(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    # Calm technical field on the right.
    c.setFillColor(CYAN_PALE)
    c.circle(734, 112, 180, stroke=0, fill=1)
    c.setFillColor(PURPLE_PALE)
    c.circle(780, 510, 155, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    for x, y in [(613, 458), (728, 458), (670, 350), (744, 258), (657, 163)]:
        c.circle(x, y, 4, stroke=1, fill=0)
    arrow(c, 617, 458, 724, 458, CYAN, 1)
    arrow(c, 727, 454, 673, 354, PURPLE, 1)
    arrow(c, 674, 346, 740, 262, CYAN, 1)
    arrow(c, 739, 253, 660, 167, PURPLE, 1)

    if LOGO.exists():
        c.drawImage(ImageReader(str(LOGO)), MARGIN, H - 82, 38, 38, mask="auto", preserveAspectRatio=True)
    c.setFillColor(NAVY)
    c.setFont("BodyBold", 11)
    c.drawString(MARGIN + 49, H - 62, "SYSTEMIC SOLUTIONS")
    label(c, "MANUAL DE CAPACITACIÓN COMERCIAL", MARGIN + 49, H - 77, MUTED, 6, 0.55, False)

    label(c, "MODELO DE NEGOCIO", MARGIN, 417, CYAN, 8, 1.05, True)
    para(c, "MODELO DE NEGOCIO<br/><font color='#078AA8'>SYSTEMIC</font> <font color='#6E55A6'>SOLUTIONS</font>", MARGIN, 391, 535, pstyle("Display", 38, 40, NAVY))
    para(
        c,
        "Diagnosticar antes de proponer.<br/>Implementar con propósito. Medir para mejorar.",
        MARGIN,
        286,
        490,
        pstyle("BodyBold", 15, 19, BODY),
    )
    para(
        c,
        "Una guía para que el equipo comercial identifique problemas reales, recomiende la ruta adecuada y cierre un siguiente paso concreto sin prometer lo que aún no se ha validado.",
        MARGIN,
        225,
        455,
        pstyle("Body", 10, 14, MUTED),
    )

    c.setFillColor(NAVY)
    c.roundRect(MARGIN, 66, 430, 48, 8, stroke=0, fill=1)
    label(c, "USO INTERNO", MARGIN + 18, 94, CYAN_BRIGHT, 6.2, 0.8, True)
    c.setFillColor(WHITE)
    c.setFont("Body", 8.2)
    c.drawString(MARGIN + 18, 78, "Sin precios. Sin promesas automáticas. Con criterio comercial.")
    c.setFillColor(MUTED)
    c.setFont("Mono", 5.8)
    c.drawRightString(W - MARGIN, 28, "SYSTEMIC.PE  /  2026")


def draw_business_map(c):
    page_base(c, 2, "Mapa del modelo")
    title(c, "MODELO CENTRAL", "Del diagnóstico a una mejora verificable.")

    # Entry diagnosis.
    x, top, w, h = 130, 462, 582, 88
    card(c, x, top, w, h, fill=CYAN_PALE, border=CYAN_BRIGHT, radius=10, accent=CYAN)
    label(c, "01  /  DIAGNÓSTICO INICIAL", x + 20, top - 24, CYAN, 7.2, 0.7, True)
    para(c, "Auditoría completa del negocio, procesos, oportunidades de IA y plan de acción práctico.", x + 20, top - 37, w - 40, pstyle("BodyBold", 10.2, 13, NAVY))
    items = ["Auditoría de procesos (BPMN)", "Análisis de oportunidades", "Estudio de vulnerabilidades", "Roadmap técnico"]
    chip_w = (w - 46) / 4
    for i, item in enumerate(items):
        pill(c, item.upper(), x + 20 + i * (chip_w + 2), top - 78, chip_w, WHITE, CYAN if i % 2 == 0 else PURPLE, LINE, 4.8)

    arrow(c, W / 2, top - h, W / 2, 348, CYAN)
    label(c, "TRAS EL DIAGNÓSTICO, EL CLIENTE ELIGE", 287, 335, NAVY, 6.3, 0.65, True)

    cards = [
        (42, "02A", "IMPLEMENTACIÓN A MEDIDA", CYAN, CYAN_PALE, "Un ERP a medida es un programa de gestión empresarial creado desde cero o modificado para ajustarse a los procesos exactos de una compañía."),
        (300, "02B", "FORMACIÓN DE EQUIPO", PURPLE, PURPLE_PALE, "Para pequeñas y medianas empresas con equipo técnico."),
        (558, "02C", "CONSULTORÍA CAIO", CYAN, CYAN_PALE, "Para medianas o grandes empresas. CAIO: director externo de inteligencia artificial."),
    ]
    card_top, card_w, card_h = 318, 242, 116
    for x0, code, heading, color, fill, desc in cards:
        card(c, x0, card_top, card_w, card_h, fill=fill, border=color, radius=10, accent=color, shadow=True)
        label(c, code, x0 + 17, card_top - 22, color, 6.4, 0.7, True)
        para(c, heading, x0 + 17, card_top - 35, card_w - 34, pstyle("BodyBold", 10.2, 12.5, NAVY))
        para(c, desc, x0 + 17, card_top - 65, card_w - 34, pstyle("Body", 6.2, 7.8, BODY))

    # Convergence.
    centers = [163, 421, 679]
    for cx in centers:
        c.setStrokeColor(LINE)
        c.line(cx, card_top - card_h, cx, 176)
    c.line(centers[0], 176, centers[-1], 176)
    arrow(c, W / 2, 176, W / 2, 157, PURPLE)

    card(c, 177, 148, 488, 48, fill=NAVY, border=NAVY, radius=8)
    label(c, "03  /  SOPORTE Y EVALUACIÓN FINAL", 198, 121, CYAN_BRIGHT, 6.7, 0.7, True)
    c.setFillColor(WHITE)
    c.setFont("Body", 8.2)
    c.drawRightString(643, 121, "Estabilizar  ·  medir  ·  aprender  ·  priorizar la siguiente etapa")

    label(c, "SERVICIOS ADICIONALES", 42, 74, MUTED, 5.8, 0.6, True)
    pill(c, "CREACIÓN DE PÁGINAS WEB", 177, 61, 222, CYAN_PALE, CYAN, CYAN_BRIGHT, 6)
    pill(c, "AUTOMATIZACIÓN E IA", 414, 61, 208, PURPLE_PALE, PURPLE, PURPLE_BRIGHT, 6)
    para(c, "Pueden venderse como una entrada acotada cuando la necesidad ya está clara.", 635, 78, 162, pstyle("Body", 6.7, 8.5, MUTED))


def draw_why(c):
    page_base(c, 3, "Por qué lo necesitan")
    title(c, "ARGUMENTO COMERCIAL", "Las empresas no necesitan más tecnología. Necesitan más claridad.", width=730)

    left_x, col_w = 42, 468
    card(c, left_x, 435, col_w, 284, fill=PAPER, border=LINE, radius=10)
    label(c, "SEÑALES DE QUE HAY UN PROBLEMA REAL", left_x + 18, 411, RED, 6.1, 0.6, True)
    pains = [
        "Información repartida entre papel, Excel, chats y sistemas aislados.",
        "Reportes que llegan tarde o dependen de una sola persona.",
        "Registros duplicados, errores y tareas repetitivas que consumen capacidad.",
        "Gastos, inventario o seguimiento comercial sin una visión confiable.",
        "Decisiones de inversión tomadas sin datos suficientes ni prioridades claras.",
        "Crecimiento que aumenta el desorden en lugar de fortalecer la operación.",
    ]
    y = 390
    for i, item in enumerate(pains):
        x = left_x + 18 + (i % 2) * 220
        if i % 2 == 0 and i > 0:
            y -= 67
        c.setFillColor(RED_PALE)
        c.circle(x + 8, y - 6, 8, stroke=0, fill=1)
        c.setFillColor(RED)
        c.setFont("MonoBold", 6.5)
        c.drawCentredString(x + 8, y - 8.3, f"{i + 1}")
        para(c, item, x + 23, y, 183, pstyle("Body", 7.7, 10.1, BODY))

    right_x, right_w = 529, 271
    card(c, right_x, 435, right_w, 133, fill=AMBER_PALE, border=HexColor("#E7D3A5"), radius=10, accent=AMBER)
    label(c, "DATO CORRECTO PARA VENTAS  [1]", right_x + 17, 410, AMBER, 5.8, 0.55, True)
    para(c, "Los primeros tres años son críticos.", right_x + 17, 394, right_w - 34, pstyle("BodyBold", 12.2, 14, NAVY))
    para(c, "En Perú, el 72.3% de las empresas formales analizadas seguía activa al tercer año. No digas que ‘la mayoría cierra’ ni atribuyas los cierres a una sola causa.", right_x + 17, 360, right_w - 34, pstyle("Body", 7.5, 9.8, BODY))

    card(c, right_x, 286, right_w, 135, fill=PURPLE_PALE, border=PURPLE_BRIGHT, radius=10)
    label(c, "POR QUÉ NO DEBEN QUEDARSE ATRÁS", right_x + 17, 261, PURPLE, 5.6, 0.5, True)
    y = bullet_list(c, [
        "El cliente espera respuestas y seguimiento más rápidos.",
        "El trabajo manual aumenta costo y error al crecer el volumen.",
        "Adoptar sin diagnóstico también es un riesgo: se paga por herramientas que nadie usa.",
    ], right_x + 17, 245, right_w - 34, PURPLE, 7.1, 3.5)
    para(c, "En 2023, 90.1% de las MIPYME cubiertas por la EEA tenía internet, pero solo 6.6% reportó ventas por comercio electrónico. [1]", right_x + 17, y - 3, right_w - 34, pstyle("BodyBold", 6.3, 7.8, PURPLE))

    card(c, 42, 132, 758, 54, fill=NAVY, border=NAVY, radius=8)
    label(c, "MENSAJE PARA EL VENDEDOR", 60, 104, CYAN_BRIGHT, 5.8, 0.6, True)
    para(c, "No vendemos modernidad por miedo. Ayudamos a controlar gastos y procesos, reconocer qué funciona, elegir dónde poner foco y liberar capacidad en tareas repetitivas.", 205, 114, 570, pstyle("BodyBold", 8.7, 11, WHITE))

    para(c, "La digitalización bien aplicada puede automatizar procesos, optimizar recursos, simplificar flujos y mejorar la toma de decisiones. [2][3]", 42, 63, 758, pstyle("Body", 7.1, 9, MUTED, TA_CENTER))


def draw_bpmn(c, x, y_top, w, h):
    card(c, x, y_top, w, h, fill=PAPER, border=LINE, radius=9)
    label(c, "EJEMPLO DE MAPA BPMN  /  DE UNA SOLICITUD A UN RESULTADO", x + 18, y_top - 22, MUTED, 5.4, 0.45, True)
    left = x + 86
    right = x + w - 18
    lane_top = y_top - 38
    lane_h = (h - 50) / 3
    lanes = ["CLIENTE", "EQUIPO", "SISTEMA"]
    for i, lane in enumerate(lanes):
        yy = lane_top - i * lane_h
        c.setStrokeColor(LINE)
        c.line(x + 18, yy - lane_h, right, yy - lane_h)
        label(c, lane, x + 20, yy - lane_h / 2 - 2, FAINT, 5.2, 0.45, True)
    c.line(left, lane_top, left, lane_top - lane_h * 3)

    cy_client = lane_top - lane_h / 2
    cy_team = lane_top - lane_h * 1.5
    cy_system = lane_top - lane_h * 2.5

    # Start and request.
    c.setFillColor(WHITE)
    c.setStrokeColor(CYAN)
    c.setLineWidth(1.4)
    c.circle(left + 24, cy_client, 7, stroke=1, fill=1)
    arrow(c, left + 31, cy_client, left + 61, cy_client, CYAN, 1)
    card(c, left + 61, cy_client + 16, 86, 32, fill=CYAN_PALE, border=CYAN_BRIGHT, radius=5)
    para(c, "Enviar solicitud", left + 70, cy_client + 5, 68, pstyle("BodyBold", 6.5, 8, NAVY, TA_CENTER))

    arrow(c, left + 147, cy_client, left + 181, cy_team, CYAN, 1)
    card(c, left + 181, cy_team + 16, 82, 32, fill=WHITE, border=LINE, radius=5)
    para(c, "Revisar datos", left + 190, cy_team + 5, 64, pstyle("BodyBold", 6.5, 8, NAVY, TA_CENTER))

    # Gateway.
    gx, gy, r = left + 302, cy_team, 14
    c.setFillColor(PURPLE_PALE)
    c.setStrokeColor(PURPLE)
    c.setLineWidth(1)
    c.saveState()
    c.translate(gx, gy)
    c.rotate(45)
    c.rect(-r / 1.4, -r / 1.4, 2 * r / 1.4, 2 * r / 1.4, stroke=1, fill=1)
    c.restoreState()
    c.setFillColor(PURPLE)
    c.setFont("MonoBold", 7)
    c.drawCentredString(gx, gy - 2.3, "?")
    arrow(c, left + 263, cy_team, gx - 14, gy, PURPLE, 1)
    label(c, "¿DATOS COMPLETOS?", gx - 38, gy + 22, PURPLE, 4.6, 0.3, True)

    arrow(c, gx + 14, gy, left + 357, cy_system, PURPLE, 1)
    card(c, left + 357, cy_system + 16, 92, 32, fill=PURPLE_PALE, border=PURPLE_BRIGHT, radius=5)
    para(c, "Registrar y ejecutar", left + 365, cy_system + 5, 76, pstyle("BodyBold", 6.2, 7.7, NAVY, TA_CENTER))
    arrow(c, left + 449, cy_system, left + 487, cy_team, CYAN, 1)
    card(c, left + 487, cy_team + 16, 78, 32, fill=WHITE, border=LINE, radius=5)
    para(c, "Validar resultado", left + 494, cy_team + 5, 64, pstyle("BodyBold", 6.2, 7.7, NAVY, TA_CENTER))
    arrow(c, left + 565, cy_team, left + 598, cy_client, CYAN, 1)
    c.setFillColor(WHITE)
    c.setStrokeColor(CYAN)
    c.setLineWidth(2)
    c.circle(left + 606, cy_client, 8, stroke=1, fill=1)
    c.circle(left + 606, cy_client, 5, stroke=1, fill=0)


def draw_diagnosis(c):
    page_base(c, 4, "Diagnóstico inicial")
    y = title(c, "SERVICIO 01", "Diagnóstico inicial: entender antes de invertir.", "Una auditoría práctica para convertir problemas dispersos en prioridades, riesgos y una ruta ejecutable.")

    # Four outputs in small print, as requested.
    chip_y = y - 37
    chip_w = 183
    chips = [
        ("1", "AUDITORÍA DE PROCESOS", "Mapa BPMN del proceso real."),
        ("2", "ANÁLISIS DE OPORTUNIDADES", "Mejoras por impacto y viabilidad."),
        ("3", "ESTUDIO DE VULNERABILIDADES", "Riesgos operativos, tecnológicos y de datos."),
        ("4", "ROADMAP TÉCNICO", "Secuencia, responsables y próximos pasos."),
    ]
    for i, (num, head, desc) in enumerate(chips):
        x = 42 + i * 194
        card(c, x, chip_y, chip_w, 55, fill=SOFT, border=LINE, radius=7)
        c.setFillColor(CYAN_PALE if i % 2 == 0 else PURPLE_PALE)
        c.circle(x + 18, chip_y - 26, 10, stroke=0, fill=1)
        c.setFillColor(CYAN if i % 2 == 0 else PURPLE)
        c.setFont("MonoBold", 6.4)
        c.drawCentredString(x + 18, chip_y - 28, num)
        label(c, head, x + 34, chip_y - 21, CYAN if i % 2 == 0 else PURPLE, 4.8, 0.35, True)
        para(c, desc, x + 34, chip_y - 31, chip_w - 45, pstyle("Body", 6.4, 7.8, BODY))

    draw_bpmn(c, 42, chip_y - 68, 758, 171)

    bottom_top = chip_y - 250
    card(c, 42, bottom_top, 455, 74, fill=CYAN_PALE, border=CYAN_BRIGHT, radius=8)
    label(c, "BENEFICIOS", 58, bottom_top - 22, CYAN, 5.8, 0.55, True)
    bullet_list(c, [
        "Hace visible dónde se pierde tiempo, información o control.",
        "Evita invertir primero en una herramienta equivocada.",
        "Define qué automatizar, qué mantener humano y qué hacer por etapas.",
    ], 58, bottom_top - 34, 420, CYAN, 6.8, 2.5)

    card(c, 513, bottom_top, 287, 74, fill=NAVY, border=NAVY, radius=8)
    label(c, "CIERRE DE VENTA", 530, bottom_top - 22, CYAN_BRIGHT, 5.8, 0.55, True)
    para(c, "“El siguiente paso no es cotizar software: es mapear cómo funciona hoy el proceso. ¿Coordinamos el diagnóstico con las personas que lo conocen?”", 530, bottom_top - 34, 252, pstyle("BodyBold", 7.2, 9.1, WHITE))

    para(c, "Alcance: la revisión de vulnerabilidades es preliminar. No sustituye una auditoría especializada de ciberseguridad ni pruebas de penetración.", 42, 49, 758, pstyle("Body", 6.3, 8, MUTED, TA_CENTER))


def draw_custom(c):
    page_base(c, 5, "Implementación a medida")
    title(c, "SERVICIO 02A", "Implementación a medida.", "Construimos o adaptamos una herramienta cuando el proceso validado no encaja bien en una solución estándar.")

    card(c, 42, 431, 758, 75, fill=CYAN_PALE, border=CYAN_BRIGHT, radius=9, accent=CYAN)
    label(c, "DEFINICIÓN PARA EL VENDEDOR", 60, 405, CYAN, 5.8, 0.55, True)
    para(c, "Un ERP a medida es un sistema de gestión empresarial creado o adaptado para ajustarse a los procesos particulares de una organización.", 60, 391, 510, pstyle("BodyBold", 10.4, 13, NAVY))
    para(c, "No toda empresa necesita un ERP propio. Se recomienda solo cuando el diagnóstico muestra una diferencia relevante entre el proceso y las herramientas disponibles.", 584, 397, 195, pstyle("Body", 6.8, 8.6, MUTED))

    # Fit and no-fit.
    cols = [
        (42, "CUÁNDO SÍ ENCAJA", GREEN, GREEN_PALE, [
            "El proceso es frecuente, importante y relativamente estable.",
            "Los sistemas actuales no se conectan o exigen doble registro.",
            "Existe un responsable interno para decidir y probar.",
            "La empresa acepta construir por etapas.",
        ]),
        (429, "CUÁNDO NO ES LA PRIMERA OPCIÓN", RED, RED_PALE, [
            "El proceso cambia cada semana o nadie puede definirlo.",
            "Ya existe una herramienta estándar que resuelve bien la necesidad.",
            "No hay usuarios disponibles para validar ni datos confiables.",
            "El cliente pide ‘todo’ sin priorizar una primera versión.",
        ]),
    ]
    for x, head, color, fill, items in cols:
        card(c, x, 337, 371, 151, fill=fill, border=color, radius=9)
        label(c, head, x + 18, 312, color, 5.8, 0.5, True)
        bullet_list(c, items, x + 18, 294, 337, color, 7.4, 5)

    label(c, "BENEFICIOS", 42, 162, CYAN, 6.1, 0.6, True)
    benefits = ["Menos duplicación", "Información ordenada", "Trazabilidad", "Permisos claros", "Integraciones viables", "Crecimiento por módulos"]
    for i, item in enumerate(benefits):
        x = 42 + i * 126.3
        card(c, x, 149, 116, 42, fill=SOFT, border=LINE, radius=6)
        para(c, item, x + 8, 133, 100, pstyle("BodyBold", 6.8, 8.2, NAVY, TA_CENTER))

    card(c, 42, 92, 758, 42, fill=NAVY, border=NAVY, radius=7)
    label(c, "CIERRE", 58, 67, CYAN_BRIGHT, 5.5, 0.55, True)
    para(c, "“Ya validamos el proceso y el resultado esperado. ¿Coordinamos la sesión técnica para definir la primera etapa, responsables, datos y criterios de aceptación?”", 118, 77, 655, pstyle("BodyBold", 7.8, 10, WHITE))


def service_column(c, x, y_top, w, title_text, code, color, fill, definition, ideal, benefits, close):
    card(c, x, y_top, w, 360, fill=WHITE, border=color, radius=10, accent=color, shadow=True)
    label(c, code, x + 20, y_top - 26, color, 6.2, 0.65, True)
    para(c, title_text, x + 20, y_top - 40, w - 40, pstyle("BodyBold", 17, 19.5, NAVY))
    para(c, definition, x + 20, y_top - 88, w - 40, pstyle("Body", 8, 10.5, BODY))

    label(c, "CLIENTE IDEAL", x + 20, y_top - 144, color, 5.5, 0.5, True)
    y = bullet_list(c, ideal, x + 20, y_top - 159, w - 40, color, 7, 3.5)
    label(c, "BENEFICIOS", x + 20, y - 6, color, 5.5, 0.5, True)
    y = bullet_list(c, benefits, x + 20, y - 21, w - 40, color, 7, 3.5)
    c.setFillColor(fill)
    c.setStrokeColor(fill)
    c.roundRect(x + 17, y_top - 342, w - 34, 54, 7, stroke=0, fill=1)
    label(c, "CIERRE", x + 30, y_top - 310, color, 5.2, 0.45, True)
    para(c, close, x + 30, y_top - 322, w - 60, pstyle("BodyBold", 6.6, 8.1, NAVY))


def draw_training_caio(c):
    page_base(c, 6, "Formación y dirección de IA")
    title(c, "RUTAS 02B Y 02C", "Cuando la capacidad interna es parte de la solución.", "La formación enseña a ejecutar; CAIO ayuda a la dirección a decidir, gobernar y priorizar.")

    service_column(
        c, 42, 431, 371, "Formación de equipo", "02B  /  PEQUEÑAS Y MEDIANAS EMPRESAS", PURPLE, PURPLE_PALE,
        "Capacitación práctica alrededor de las herramientas, procesos y casos reales que el equipo debe adoptar.",
        ["Ya existe una herramienta o proceso definido.", "Hay un equipo técnico u operativo responsable.", "La organización quiere reducir dependencia del proveedor."],
        ["Mejor adopción y uso consistente.", "Criterios sobre privacidad, límites y revisión humana.", "Más autonomía y materiales de consulta."],
        "“Definamos participantes, tareas y el resultado que deben demostrar al terminar. ¿Coordinamos con el responsable del área?”",
    )
    service_column(
        c, 429, 431, 371, "Consultoría CAIO", "02C  /  MEDIANAS Y GRANDES EMPRESAS", CYAN, CYAN_PALE,
        "Dirección estratégica externa de inteligencia artificial. CAIO significa Chief Artificial Intelligence Officer o director de IA.",
        ["Existen varias áreas, proyectos o proveedores de IA.", "Hay liderazgo, datos y capacidad técnica para ejecutar.", "La dirección necesita priorización y gobierno."],
        ["Portafolio priorizado de iniciativas.", "Políticas de datos, riesgo y uso responsable.", "Coordinación entre negocio, tecnología y proveedores."],
        "“Revisemos iniciativas, capacidad de ejecución y riesgos con gerencia y tecnología. ¿Podemos coordinar esa sesión?”",
    )
    para(c, "Regla comercial: CAIO no es el primer producto para una microempresa que necesita una web o una automatización sencilla.", 42, 50, 758, pstyle("BodyBold", 7, 9, RED, TA_CENTER))


def draw_additional(c):
    page_base(c, 7, "Servicios adicionales")
    title(c, "ENTRADAS ACOTADAS", "Servicios adicionales con un objetivo claro.", "Pueden ser la primera relación con el cliente cuando la necesidad, el alcance y la acción esperada ya están definidos.")

    service_column(
        c, 42, 431, 371, "Creación de páginas web", "SERVICIO ADICIONAL  /  PRESENCIA Y CONVERSIÓN", CYAN, CYAN_PALE,
        "Sitios que explican el negocio y llevan a una acción medible: consulta, WhatsApp, reserva, cotización o registro.",
        ["El negocio no tiene web o no funciona bien en celular.", "Depende solo de redes sociales.", "Recibe tráfico, pero la oferta o el contacto no están claros."],
        ["Más confianza y una presentación propia.", "Información disponible y recorrido claro hacia el contacto.", "Base responsive, medición y SEO técnico inicial."],
        "“Antes de diseñar, definamos a quién queremos atraer y qué acción debe realizar. ¿Revisamos oferta, contenido y recorrido?”",
    )
    service_column(
        c, 429, 431, 371, "Automatización e IA", "SERVICIO ADICIONAL  /  EFICIENCIA OPERATIVA", PURPLE, PURPLE_PALE,
        "Flujos que ayudan a ejecutar tareas repetitivas con menos intervención manual y controles humanos según el riesgo.",
        ["La tarea es frecuente, repetible y tiene reglas estables.", "Existe volumen de consultas, registros o documentos.", "El cliente acepta empezar por un piloto medible."],
        ["Menos trabajo repetitivo y mejor seguimiento.", "Respuestas y registros más consistentes.", "Más tiempo para atención, criterio y crecimiento."],
        "“Elijamos una tarea repetitiva, midamos el esfuerzo actual y definamos un piloto con límites. ¿Quién conoce mejor ese proceso?”",
    )
    para(c, "No prometas ventas por tener una web ni un agente de IA infalible. El resultado depende de oferta, tráfico, datos, supervisión y ejecución.", 42, 50, 758, pstyle("BodyBold", 7, 9, RED, TA_CENTER))


def draw_support_matrix(c):
    page_base(c, 8, "Soporte, evaluación y beneficios")
    title(c, "ETAPA 03", "Soporte y evaluación final.", "La entrega no termina cuando el sistema se publica: termina cuando se valida su funcionamiento, adopción y resultado acordado.")

    card(c, 42, 431, 758, 78, fill=NAVY, border=NAVY, radius=9)
    support_items = [
        ("ESTABILIZAR", "Incidencias y operación real"),
        ("ADOPTAR", "Usuarios, materiales y responsables"),
        ("MEDIR", "Criterios y métricas acordadas"),
        ("DECIDIR", "Ajustar, mantener o ampliar"),
    ]
    for i, (head, desc) in enumerate(support_items):
        x = 60 + i * 184
        label(c, head, x, 401, CYAN_BRIGHT if i % 2 == 0 else PURPLE_BRIGHT, 5.9, 0.55, True)
        para(c, desc, x, 386, 160, pstyle("Body", 7.4, 9.2, WHITE))

    label(c, "MAPA DE BENEFICIOS POR SERVICIO", 42, 327, MUTED, 6, 0.55, True)
    headers = ["SERVICIO", "BENEFICIO PRINCIPAL", "SEÑAL DE COMPRA", "SIGUIENTE PASO"]
    col_x = [42, 197, 412, 622]
    col_w = [155, 215, 210, 178]
    table_top = 311
    row_h = 34
    c.setFillColor(SOFT)
    c.rect(42, table_top - 24, 758, 24, stroke=0, fill=1)
    for i, head in enumerate(headers):
        label(c, head, col_x[i] + 8, table_top - 16, NAVY, 5.1, 0.4, True)

    rows = [
        ("Diagnóstico", "Prioridades y roadmap", "Varios problemas sin orden", "Reunión de alcance"),
        ("Implementación a medida", "Control y trazabilidad", "La solución estándar no encaja", "Sesión técnica"),
        ("Formación", "Adopción y autonomía", "Herramienta subutilizada", "Definir casos y roles"),
        ("CAIO", "Gobierno y portafolio de IA", "Iniciativas dispersas", "Sesión con dirección"),
        ("Página web", "Confianza y consultas", "Presencia débil o confusa", "Definir audiencia y acción"),
        ("Automatización e IA", "Capacidad y consistencia", "Tarea repetitiva con volumen", "Medir y pilotear"),
    ]
    y = table_top - 24
    for idx, row in enumerate(rows):
        fill = WHITE if idx % 2 == 0 else PAPER
        c.setFillColor(fill)
        c.rect(42, y - row_h, 758, row_h, stroke=0, fill=1)
        c.setStrokeColor(LINE)
        c.line(42, y - row_h, 800, y - row_h)
        for i, value in enumerate(row):
            style = pstyle("BodyBold" if i == 0 else "Body", 6.7, 8.4, NAVY if i == 0 else BODY)
            para(c, value, col_x[i] + 8, y - 10, col_w[i] - 16, style)
        y -= row_h

    small_note(c, "El soporte diferencia tres cosas: corrección de una incidencia, ajuste dentro del alcance y nueva función. Definirlo antes de la entrega evita expectativas incompatibles.", 42, 74, 758, SOFT, LINE, BODY, PURPLE, 36)


def draw_sales_flow(c):
    page_base(c, 9, "Conversación comercial")
    title(c, "MÉTODO DEL VENDEDOR", "La primera conversación vende claridad, no tecnología.", "El objetivo es encontrar un problema importante y conseguir permiso para entenderlo correctamente.")

    stages = [
        ("1", "ABRIR", "Hablar del negocio, no del producto."),
        ("2", "DESCUBRIR", "Qué falla, a quién afecta y con qué frecuencia."),
        ("3", "CUANTIFICAR", "Tiempo, errores, dinero, riesgo u oportunidades."),
        ("4", "RECOMENDAR", "Una ruta proporcional, no todo el catálogo."),
        ("5", "CERRAR", "Fecha, participantes y siguiente paso."),
    ]
    start_x, gap, w = 42, 9, 144
    for i, (num, head, desc) in enumerate(stages):
        x = start_x + i * (w + gap)
        fill = CYAN_PALE if i % 2 == 0 else PURPLE_PALE
        color = CYAN if i % 2 == 0 else PURPLE
        card(c, x, 430, w, 90, fill=fill, border=color, radius=8, accent=color)
        label(c, f"{num}  /  {head}", x + 13, 403, color, 5.7, 0.5, True)
        para(c, desc, x + 13, 385, w - 26, pstyle("BodyBold", 7.3, 9.1, NAVY))
        if i < len(stages) - 1:
            arrow(c, x + w + 1, 385, x + w + gap - 1, 385, color, 0.8, 3.5)

    # Discovery and objections.
    card(c, 42, 317, 371, 189, fill=PAPER, border=LINE, radius=9)
    label(c, "PREGUNTAS QUE ABREN UNA BUENA VENTA", 60, 291, CYAN, 5.8, 0.55, True)
    bullet_list(c, [
        "¿Qué proceso les genera más errores, retrasos o pérdida de información?",
        "¿Cómo empieza, quién participa y dónde se registra?",
        "¿Cuánto tiempo consume y qué pasa cuando falla?",
        "¿Qué han intentado y por qué no funcionó?",
        "¿Qué resultado tendría mayor valor para la empresa?",
        "¿Quién conoce el proceso y quién puede aprobar el proyecto?",
    ], 60, 274, 335, CYAN, 7.1, 4)

    card(c, 429, 317, 371, 189, fill=PAPER, border=LINE, radius=9)
    label(c, "OBJECIONES: RESPONDER SIN PRESIONAR", 447, 291, PURPLE, 5.8, 0.55, True)
    objections = [
        ("“Ya usamos Excel y WhatsApp”", "Revisemos dónde todavía limitan control o seguimiento."),
        ("“Envíame una cotización”", "Para cotizar con responsabilidad necesitamos alcance, usuarios, datos e integraciones."),
        ("“No tengo tiempo”", "Empecemos por un solo proceso y las personas indispensables."),
        ("“Quiero pensarlo”", "¿Qué necesita evaluar: prioridad, alcance, confianza o participación de otra persona?"),
    ]
    y = 273
    for quote, response in objections:
        para(c, quote, 447, y, 328, pstyle("BodyBold", 7.2, 8.8, NAVY))
        y = para(c, response, 447, y - 11, 328, pstyle("Body", 6.8, 8.6, BODY)) - 7

    card(c, 42, 106, 758, 49, fill=NAVY, border=NAVY, radius=8)
    label(c, "CIERRE UNIVERSAL", 59, 78, CYAN_BRIGHT, 5.7, 0.55, True)
    para(c, "“Para avanzar necesitamos reunir a quien conoce el proceso y a quien toma la decisión. ¿Qué día coordinamos la siguiente sesión y quiénes deben participar?”", 178, 89, 595, pstyle("BodyBold", 8.1, 10.2, WHITE))


def mini_close_card(c, x, y_top, w, title_text, text, color, fill):
    card(c, x, y_top, w, 72, fill=fill, border=color, radius=7)
    label(c, title_text.upper(), x + 13, y_top - 20, color, 5.2, 0.42, True)
    para(c, text, x + 13, y_top - 32, w - 26, pstyle("Body", 6.4, 7.8, NAVY))


def draw_closings_sources(c):
    page_base(c, 10, "Cierres y criterios")
    title(c, "GUION FINAL", "Cerrar es acordar el siguiente paso correcto.", "No se fuerza una implementación. Se confirma una necesidad, el responsable y la reunión que permite avanzar.")

    closes = [
        ("Diagnóstico", "“Mapeemos el proceso antes de recomendar una herramienta. ¿Quiénes deben participar?”", CYAN, CYAN_PALE),
        ("Implementación", "“Definamos la primera etapa, los datos y los criterios de aceptación. ¿Coordinamos la sesión técnica?”", PURPLE, PURPLE_PALE),
        ("Formación", "“Acordemos qué debe saber hacer el equipo al terminar. ¿Quién define los casos reales?”", CYAN, CYAN_PALE),
        ("CAIO", "“Revisemos prioridades, capacidad y riesgos con gerencia y tecnología. ¿Agendamos esa sesión?”", PURPLE, PURPLE_PALE),
        ("Página web", "“Definamos audiencia, mensaje y acción esperada antes del diseño. ¿Quién aprueba contenido?”", CYAN, CYAN_PALE),
        ("Automatización e IA", "“Midamos una tarea repetitiva y diseñemos un piloto con límites. ¿Quién conoce mejor el flujo?”", PURPLE, PURPLE_PALE),
    ]
    card_w = 242
    for i, item in enumerate(closes):
        row = i // 3
        col = i % 3
        mini_close_card(c, 42 + col * 258, 431 - row * 84, card_w, *item)

    lower_top = 250
    card(c, 42, lower_top, 366, 160, fill=RED_PALE, border=HexColor("#E8BBBB"), radius=9)
    label(c, "REGLAS DE HONESTIDAD COMERCIAL", 60, lower_top - 24, RED, 5.7, 0.52, True)
    bullet_list(c, [
        "No prometer ventas, ahorros o retorno garantizados.",
        "No decir que la IA no se equivoca o reemplazará al equipo.",
        "No recomendar software a medida si una solución estándar encaja.",
        "No afirmar experiencia sectorial sin un caso real verificable.",
        "Sí proponer pilotos, métricas, límites y supervisión humana.",
        "Sí decir ‘necesitamos evaluarlo’ cuando aún faltan datos.",
    ], 60, lower_top - 42, 330, RED, 6.7, 2.8)

    card(c, 424, lower_top, 376, 160, fill=SOFT, border=LINE, radius=9)
    label(c, "FUENTES PARA LAS AFIRMACIONES DEL DOCUMENTO", 442, lower_top - 24, NAVY, 5.2, 0.42, True)
    sources = [
        "<link href='https://ogeiee.produce.gob.pe/index.php/en/shortcode/oee-documentos-publicaciones/publicaciones-anuales/item/1290-las-mipyme-en-cifras-2024'>[1] PRODUCE. Las Mipyme en cifras 2024: supervivencia, conectividad y comercio electrónico.</link>",
        "<link href='https://www.gob.pe/institucion/proinnovate/noticias/1145525-transforma-tu-negocio-proinnovate-ofrece-hasta-s-45-000-para-impulsar-la-digitalizacion-en-mipymes-peruanas'>[2] ProInnóvate. Mipymes Digitales 2025: diagnóstico, automatización, costos y ciberseguridad.</link>",
        "<link href='https://www.proinnovate.gob.pe/fincyt/doc/MIPYMES_DIGITALES/convocatoria_2/2BASES%20INICIALES%20MIPYMES%20DIGITALES.pdf'>[3] ProInnóvate. Bases Mipymes Digitales: recursos, flujos, datos y decisiones.</link>",
        "<link href='https://www.gob.pe/institucion/proinnovate/noticias/1192783-produce-impulsa-soluciones-con-ia-para-transformar-a-las-mipymes-peruanas'>[4] ProInnóvate. Iniciativas de IA para mipymes 2025: eficiencia, costos y decisiones.</link>",
    ]
    y = lower_top - 42
    for item in sources:
        y = para(c, item, 442, y, 340, pstyle("Body", 6.3, 7.8, BODY)) - 6

    label(c, "ENLACES", 442, 121, MUTED, 5, 0.42, True)
    para(c, "Los cuatro títulos anteriores contienen enlaces oficiales. Consulta realizada en agosto de 2026.", 442, 110, 340, pstyle("Mono", 5.4, 7, MUTED))

    card(c, 42, 73, 758, 31, fill=NAVY, border=NAVY, radius=6)
    para(c, "El mejor vendedor no coloca tecnología: ayuda al cliente a tomar una decisión mejor informada.", 70, 64, 702, pstyle("BodyBold", 8.3, 10.4, WHITE, TA_CENTER))


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    c = canvas.Canvas(str(OUTPUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("Modelo de negocio Systemic Solutions")
    c.setAuthor("Systemic Solutions")
    c.setSubject("Manual de capacitación comercial: diagnóstico, servicios, beneficios y cierres")
    c.setCreator("Systemic Solutions")

    pages = [
        draw_cover,
        draw_business_map,
        draw_why,
        draw_diagnosis,
        draw_custom,
        draw_training_caio,
        draw_additional,
        draw_support_matrix,
        draw_sales_flow,
        draw_closings_sources,
    ]
    for page in pages:
        page(c)
        c.showPage()
    c.save()
    print(OUTPUT)


# ---------------------------------------------------------------------------
# Revised eight-page edition requested in August 2026.
# The original page functions remain above as an archived composition layer;
# this edition is the one exported by the script.


def v2_cover(c):
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, stroke=0, fill=1)

    c.setFillColor(CYAN_PALE)
    c.circle(760, 102, 190, stroke=0, fill=1)
    c.setFillColor(PURPLE_PALE)
    c.circle(798, 500, 150, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.8)
    nodes = [(610, 455), (726, 455), (670, 345), (742, 246), (666, 145)]
    for x0, y0 in nodes:
        c.setFillColor(WHITE)
        c.circle(x0, y0, 4.2, stroke=1, fill=1)
    arrow(c, 614, 455, 722, 455, CYAN, 1.1)
    arrow(c, 725, 451, 673, 349, PURPLE, 1.1)
    arrow(c, 674, 341, 738, 250, CYAN, 1.1)
    arrow(c, 739, 242, 670, 149, PURPLE, 1.1)

    if LOGO.exists():
        c.drawImage(ImageReader(str(LOGO)), MARGIN, H - 82, 38, 38, mask="auto", preserveAspectRatio=True)
    c.setFillColor(NAVY)
    c.setFont("BodyBold", 11)
    c.drawString(MARGIN + 49, H - 62, "SYSTEMIC SOLUTIONS")
    label(c, "INFORMACIÓN COMERCIAL", MARGIN + 49, H - 77, MUTED, 6.2, 0.6, False)

    label(c, "MODELO DE NEGOCIO", MARGIN, 416, CYAN, 8, 1.05, True)
    para(c, "MODELO DE NEGOCIO<br/><font color='#078AA8'>SYSTEMIC</font> <font color='#6E55A6'>SOLUTIONS</font>", MARGIN, 390, 530, pstyle("Display", 37, 39.5, NAVY))
    para(c, "Servicios, beneficios y guía para vendedores.", MARGIN, 286, 500, pstyle("BodyBold", 16, 19, BODY))
    para(
        c,
        "Una herramienta interna para entender el negocio, recomendar una solución proporcional y conversar con el dueño desde los beneficios, no desde la tecnología.",
        MARGIN,
        235,
        470,
        pstyle("Body", 12.3, 16.2, MUTED),
    )

    card(c, MARGIN, 125, 500, 62, fill=NAVY, border=NAVY, radius=8)
    cover_items = [
        ("CONTROL", "Caja, stock y gastos claros"),
        ("TIEMPO", "Menos trabajo repetitivo"),
        ("CRECIMIENTO", "Decisiones con información"),
    ]
    for i, (head, desc) in enumerate(cover_items):
        x0 = MARGIN + 18 + i * 160
        label(c, head, x0, 100, CYAN_BRIGHT if i != 1 else PURPLE_BRIGHT, 5.8, 0.6, True)
        para(c, desc, x0, 87, 143, pstyle("Body", 9.3, 11.2, WHITE))

    c.setFillColor(MUTED)
    c.setFont("Mono", 5.8)
    c.drawString(MARGIN, 28, "DOCUMENTO INTERNO  /  SYSTEMIC.PE  /  2026")
    c.drawRightString(W - MARGIN, 28, "01 / 08")


def v2_business_map(c):
    page_base(c, 2, "MODELO DE NEGOCIO")
    title(c, "MODELO CENTRAL", "Entendemos primero. Proponemos solo lo necesario.")

    x, top, w, h = 122, 458, 598, 84
    card(c, x, top, w, h, fill=CYAN_PALE, border=CYAN_BRIGHT, radius=10, accent=CYAN)
    label(c, "01  /  ENTENDEMOS EL NEGOCIO", x + 20, top - 24, CYAN, 7, 0.7, True)
    para(c, "Revisamos cómo controla ventas, caja, cuentas, stock, inventario y gastos.", x + 20, top - 38, w - 40, pstyle("BodyBold", 11.5, 14, NAVY))
    chips = ["VENTAS Y CAJA", "STOCK E INVENTARIO", "CUENTAS Y GASTOS", "OPORTUNIDADES DE MEJORA"]
    chip_w = 134
    for i, text0 in enumerate(chips):
        pill(c, text0, x + 20 + i * 140, top - 76, chip_w, WHITE, CYAN if i % 2 == 0 else PURPLE, LINE, 5.2)

    arrow(c, W / 2, top - h, W / 2, 346, CYAN)
    label(c, "EL CLIENTE ELIGE LA RUTA QUE MEJOR ENCAJA", 299, 334, NAVY, 6.1, 0.6, True)

    card_top, card_w, card_h = 317, 242, 119
    routes = [
        (42, "02A", "SOFTWARE A MEDIDA", CYAN, CYAN_PALE, "PRODUCTO ESTRELLA", "SaaS o software compacto por suscripción para negocios de 1 a 5 personas. Caja, cuentas, stock y finanzas."),
        (300, "02B", "FORMACIÓN DE EQUIPO", PURPLE, PURPLE_PALE, "CAPACIDAD INTERNA", "Para organizaciones que ya tienen herramientas y necesitan que su equipo las adopte mejor."),
        (558, "02C", "CONSULTORÍA CAIO", CYAN, CYAN_PALE, "DIRECCIÓN DE IA", "Para empresas medianas o grandes con varias iniciativas, áreas y equipo técnico."),
    ]
    for x0, code, head, color, fill, badge, desc in routes:
        card(c, x0, card_top, card_w, card_h, fill=fill, border=color, radius=10, accent=color, shadow=True)
        label(c, code, x0 + 17, card_top - 22, color, 6.1, 0.6, True)
        label(c, badge, x0 + 70, card_top - 22, MUTED, 4.6, 0.38, True)
        para(c, head, x0 + 17, card_top - 36, card_w - 34, pstyle("BodyBold", 10.2, 12.4, NAVY))
        para(c, desc, x0 + 17, card_top - 68, card_w - 34, pstyle("Body", 9.5, 11.8, BODY))

    centers = [163, 421, 679]
    for cx in centers:
        c.setStrokeColor(LINE)
        c.line(cx, card_top - card_h, cx, 173)
    c.line(centers[0], 173, centers[-1], 173)
    arrow(c, W / 2, 173, W / 2, 154, PURPLE)

    card(c, 174, 145, 494, 48, fill=NAVY, border=NAVY, radius=8)
    label(c, "03  /  SOPORTE Y EVALUACIÓN FINAL", 194, 118, CYAN_BRIGHT, 6.5, 0.65, True)
    c.setFillColor(WHITE)
    c.setFont("Body", 9.2)
    c.drawRightString(646, 118, "Configurar  ·  acompañar  ·  medir  ·  mejorar")

    label(c, "ENTRADAS ACOTADAS", 42, 73, MUTED, 5.8, 0.58, True)
    pill(c, "CREACIÓN DE PÁGINAS WEB", 176, 60, 220, CYAN_PALE, CYAN, CYAN_BRIGHT, 6)
    pill(c, "AUTOMATIZACIÓN E IA", 411, 60, 208, PURPLE_PALE, PURPLE, PURPLE_BRIGHT, 6)
    para(c, "Para necesidades concretas que ya tienen un objetivo claro.", 633, 77, 164, pstyle("Body", 9, 11.2, MUTED))


def benefit_box(c, x, y_top, w, head, desc, color, fill):
    card(c, x, y_top, w, 66, fill=fill, border=color, radius=7)
    label(c, head.upper(), x + 12, y_top - 19, color, 5.2, 0.45, True)
    para(c, desc, x + 12, y_top - 31, w - 24, pstyle("BodyBold", 9.1, 10.8, NAVY))


def v2_services(c):
    page_base(c, 3, "MODELO DE NEGOCIO")
    title(
        c,
        "SERVICIOS",
        "Software simple para tener el negocio bajo control.",
        "Nuestra oferta prioritaria para pequeños negocios: empezar con lo esencial y pagar mediante una suscripción mensual predecible.",
        width=760,
    )

    card(c, 42, 421, 758, 207, fill=WHITE, border=CYAN, radius=10, accent=CYAN, shadow=True)
    pill(c, "PRODUCTO ESTRELLA", 60, 383, 124, CYAN_PALE, CYAN, CYAN_BRIGHT, 5.7)
    para(c, "Software a medida por suscripción", 60, 367, 470, pstyle("BodyBold", 19, 21.5, NAVY))
    para(
        c,
        "Puede ser un SaaS o un software compacto configurado alrededor de la operación real. Ayuda a registrar ventas y gastos, controlar caja, cuentas, stock, inventario y revisar resultados desde el celular o la computadora.",
        60,
        330,
        460,
        pstyle("Body", 10.8, 14.2, BODY),
    )
    para(
        c,
        "La idea no es entregar un sistema grande. Es resolver primero lo que hoy genera desorden, pérdida de tiempo o falta de información.",
        60,
        260,
        460,
        pstyle("BodyBold", 10.1, 12.6, CYAN),
    )

    card(c, 548, 399, 232, 165, fill=NAVY, border=NAVY, radius=8)
    label(c, "CLIENTE IDEAL", 566, 373, CYAN_BRIGHT, 5.8, 0.55, True)
    para(c, "NEGOCIOS DE<br/>1 A 5 PERSONAS", 566, 356, 190, pstyle("BodyBold", 15, 17.5, WHITE))
    bullet_list(c, [
        "El dueño participa en la operación.",
        "Usan cuaderno, Excel o chats.",
        "Buscan algo sencillo y accesible.",
    ], 566, 304, 192, CYAN_BRIGHT, 9, 5, None, WHITE)

    benefit_box(c, 42, 198, 177, "CAJA CLARA", "Saber cuánto entró, salió y quedó.", CYAN, CYAN_PALE)
    benefit_box(c, 235, 198, 177, "STOCK", "Saber qué falta y qué necesita reposición.", PURPLE, PURPLE_PALE)
    benefit_box(c, 428, 198, 177, "FINANZAS", "Ver ventas, gastos y resultados con orden.", CYAN, CYAN_PALE)
    benefit_box(c, 621, 198, 179, "TIEMPO", "Reducir registros repetidos y revisiones manuales.", PURPLE, PURPLE_PALE)

    card(c, 42, 120, 371, 62, fill=SOFT, border=LINE, radius=7)
    label(c, "FORMACIÓN DE EQUIPO", 58, 98, PURPLE, 5.5, 0.5, True)
    para(c, "Capacitación práctica cuando la empresa ya tiene herramientas y necesita una mejor adopción.", 58, 86, 335, pstyle("Body", 9.5, 11.8, BODY))
    card(c, 429, 120, 371, 62, fill=SOFT, border=LINE, radius=7)
    label(c, "CONSULTORÍA CAIO", 445, 98, CYAN, 5.5, 0.5, True)
    para(c, "Dirección estratégica de IA para empresas medianas o grandes con capacidad de ejecución.", 445, 86, 335, pstyle("Body", 9.5, 11.8, BODY))

    para(c, "Estrategia comercial: esta es la oferta que el vendedor presenta primero cuando el problema del pequeño negocio encaja.", 42, 49, 758, pstyle("BodyBold", 9.2, 11.4, MUTED, TA_CENTER))


def entry_column_v2(c, x, y_top, w, color, fill, code, heading, intro, benefits, fit, close):
    card(c, x, y_top, w, 326, fill=WHITE, border=color, radius=10, accent=color, shadow=True)
    label(c, code, x + 20, y_top - 26, color, 5.8, 0.55, True)
    para(c, heading, x + 20, y_top - 42, w - 40, pstyle("BodyBold", 18, 20.5, NAVY))
    para(c, intro, x + 20, y_top - 89, w - 40, pstyle("Body", 10.5, 13.4, BODY))
    label(c, "BENEFICIOS", x + 20, y_top - 150, color, 5.6, 0.5, True)
    y = bullet_list(c, benefits, x + 20, y_top - 167, w - 40, color, 9.3, 5)
    label(c, "CUÁNDO OFRECERLO", x + 20, y - 3, color, 5.6, 0.5, True)
    y = para(c, fit, x + 20, y - 18, w - 40, pstyle("Body", 9.3, 11.8, BODY))
    c.setFillColor(fill)
    c.roundRect(x + 17, y_top - 324, w - 34, 60, 7, stroke=0, fill=1)
    label(c, "CIERRE", x + 30, y_top - 285, color, 5.2, 0.45, True)
    para(c, close, x + 30, y_top - 297, w - 60, pstyle("BodyBold", 9.2, 11.2, NAVY))


def v2_entries(c):
    page_base(c, 4, "MODELO DE NEGOCIO")
    title(
        c,
        "ENTRADAS ACOTADAS",
        "Dos formas de empezar con una necesidad concreta.",
        "Se ofrecen cuando el objetivo ya está claro y no hace falta comenzar por un sistema operativo completo.",
    )
    entry_column_v2(
        c, 42, 420, 371, CYAN, CYAN_PALE,
        "PRESENCIA Y CONVERSIÓN", "Creación de páginas web",
        "Sitios que explican el negocio y llevan a una acción medible: escribir por WhatsApp, reservar, cotizar o registrarse.",
        ["Presentación profesional y canal propio.", "Mejor experiencia desde el celular.", "Recorrido claro hacia la consulta."],
        "Cuando el negocio depende solo de redes, su web está desactualizada o las visitas no encuentran cómo contactar.",
        "“Definamos a quién queremos atraer y qué acción debe realizar. ¿Revisamos oferta, contenido y recorrido?”",
    )
    entry_column_v2(
        c, 429, 420, 371, PURPLE, PURPLE_PALE,
        "EFICIENCIA OPERATIVA", "Automatización e IA",
        "Flujos que ayudan con tareas repetitivas, consultas, registros o seguimientos, manteniendo revisión humana según el riesgo.",
        ["Menos trabajo repetitivo.", "Respuestas y registros más consistentes.", "Más tiempo para atención y criterio."],
        "Cuando una tarea ocurre muchas veces, sigue reglas relativamente estables y se puede medir con un piloto.",
        "“Midamos una tarea repetitiva y probemos un flujo con límites. ¿Quién conoce mejor ese proceso?”",
    )
    small_note(c, "No prometas ventas por tener una web ni un agente de IA infalible. El resultado depende de oferta, tráfico, datos, supervisión y ejecución.", 42, 87, 758, RED_PALE, HexColor("#E8BBBB"), RED, RED, 36, 8.8)


def v2_support(c):
    page_base(c, 5, "MODELO DE NEGOCIO")
    title(
        c,
        "SOPORTE Y EVALUACIÓN FINAL",
        "El servicio continúa después de activar la solución.",
        "Acompañamos al negocio hasta que el uso sea claro, las incidencias tengan un canal y los resultados acordados puedan revisarse.",
    )

    card(c, 42, 414, 758, 90, fill=NAVY, border=NAVY, radius=9)
    stages = [
        ("1", "CONFIGURAR", "Datos, usuarios y operación inicial"),
        ("2", "ACOMPAÑAR", "Uso, dudas y adopción"),
        ("3", "MEDIR", "Criterios acordados"),
        ("4", "MEJORAR", "Ajustar o priorizar otra etapa"),
    ]
    for i, (num, head, desc) in enumerate(stages):
        x0 = 60 + i * 184
        c.setFillColor(CYAN_PALE if i % 2 == 0 else PURPLE_PALE)
        c.circle(x0 + 9, 374, 9, stroke=0, fill=1)
        c.setFillColor(CYAN if i % 2 == 0 else PURPLE)
        c.setFont("MonoBold", 6.2)
        c.drawCentredString(x0 + 9, 372, num)
        label(c, head, x0 + 25, 386, CYAN_BRIGHT if i % 2 == 0 else PURPLE_BRIGHT, 5.7, 0.5, True)
        para(c, desc, x0 + 25, 371, 145, pstyle("Body", 9.5, 11.8, WHITE))

    label(c, "QUÉ RECIBE EL CLIENTE", 42, 296, MUTED, 6, 0.55, True)
    support_cards = [
        (42, "PUESTA EN MARCHA", "Configuración inicial, accesos y explicación del flujo real de trabajo.", CYAN, CYAN_PALE),
        (300, "SOPORTE Y ACTUALIZACIONES", "Canal para dudas e incidencias, ajustes acordados y evolución responsable.", PURPLE, PURPLE_PALE),
        (558, "EVALUACIÓN FINAL", "Revisión de uso, aprendizajes y decisión sobre mantener, ajustar o ampliar.", CYAN, CYAN_PALE),
    ]
    for x0, head, desc, color, fill in support_cards:
        card(c, x0, 280, 242, 119, fill=fill, border=color, radius=8)
        label(c, head, x0 + 16, 256, color, 5.4, 0.45, True)
        para(c, desc, x0 + 16, 237, 210, pstyle("Body", 10, 12.8, BODY))

    card(c, 42, 143, 758, 65, fill=CYAN_PALE, border=CYAN_BRIGHT, radius=8)
    label(c, "CÓMO EXPLICARLO", 60, 118, CYAN, 5.8, 0.55, True)
    para(c, "“La suscripción no solo da acceso al sistema. Incluye una forma clara de empezar, recibir soporte y mantener la herramienta útil mientras el negocio evoluciona.”", 194, 125, 578, pstyle("BodyBold", 10.5, 13.2, NAVY))

    small_note(c, "Antes de cerrar, diferenciar: corrección de incidencia, ajuste dentro del alcance y nueva función. Esto evita expectativas incompatibles.", 42, 66, 758, SOFT, LINE, BODY, PURPLE, 34, 8.8)


def comparison_row(c, x, y_top, w, technical, benefit, color):
    c.setStrokeColor(LINE)
    c.line(x, y_top - 50, x + w, y_top - 50)
    label(c, "NO EMPIECES CON", x, y_top - 14, MUTED, 4.7, 0.35, True)
    para(c, technical, x, y_top - 25, w * 0.38, pstyle("Body", 9.3, 11.2, MUTED))
    label(c, "EXPLÍCALO ASÍ", x + w * 0.43, y_top - 14, color, 4.7, 0.35, True)
    para(c, benefit, x + w * 0.43, y_top - 25, w * 0.55, pstyle("BodyBold", 9.5, 11.6, NAVY))


def v2_argument(c):
    page_base(c, 6, "INFORMACIÓN COMERCIAL")
    title(
        c,
        "ARGUMENTO COMERCIAL",
        "No vendas software. Vende control, tiempo y tranquilidad.",
        "El dueño escucha cuando reconoce su problema y entiende cómo cambiaría su día a día.",
    )

    card(c, 42, 417, 360, 255, fill=PAPER, border=LINE, radius=9)
    label(c, "LO QUE VIVE EL DUEÑO", 60, 391, RED, 5.8, 0.55, True)
    para(c, "Estas situaciones abren una conversación real:", 60, 374, 320, pstyle("BodyBold", 10.2, 12.5, NAVY))
    bullet_list(c, [
        "Al cerrar el día no sabe con certeza cuánto ganó.",
        "Revisa cuadernos, chats o varios archivos para cuadrar caja.",
        "Compra sin saber exactamente qué queda en stock.",
        "Olvida cuentas por cobrar, pagos o gastos pequeños.",
        "El control le quita tiempo que debería usar en clientes o crecimiento.",
    ], 60, 348, 320, RED, 9.5, 7)

    card(c, 418, 417, 382, 255, fill=WHITE, border=PURPLE_BRIGHT, radius=9)
    label(c, "TRADUCE FUNCIONES EN BENEFICIOS", 436, 391, PURPLE, 5.8, 0.55, True)
    comparison_row(c, 436, 374, 346, "Módulo de caja", "Sabrá cuánto entró, salió y quedó.", CYAN)
    comparison_row(c, 436, 321, 346, "Control de inventario", "Sabrá qué falta y qué debe reponer.", PURPLE)
    comparison_row(c, 436, 268, 346, "Reportes financieros", "Verá ventas, gastos y resultados con orden.", CYAN)
    comparison_row(c, 436, 215, 346, "Sistema en la nube", "Podrá revisar el negocio desde su celular.", PURPLE)

    card(c, 42, 145, 758, 66, fill=NAVY, border=NAVY, radius=8)
    label(c, "SUSCRIPCIÓN MENSUAL", 60, 117, CYAN_BRIGHT, 5.8, 0.55, True)
    para(c, "En lugar de una gran inversión inicial, el pequeño negocio puede empezar con lo esencial mediante una mensualidad predecible, acompañamiento y soporte.", 221, 126, 548, pstyle("BodyBold", 10.5, 13.2, WHITE))

    card(c, 42, 70, 758, 36, fill=AMBER_PALE, border=HexColor("#E7D3A5"), radius=7)
    label(c, "ARGUMENTO DE PERSUASIÓN", 58, 48, AMBER, 5.2, 0.45, True)
    para(c, "La mayoría de las empresas no supera los tres años debido a que no controla correctamente sus finanzas. Usa este dato para explicar por qué es importante conocer ventas, gastos y resultados a tiempo.", 174, 61, 605, pstyle("BodyBold", 9.3, 11.4, BODY))


def step_card_v2(c, x, y_top, w, num, head, desc, color, fill):
    card(c, x, y_top, w, 92, fill=fill, border=color, radius=8, accent=color)
    label(c, f"{num}  /  {head}", x + 12, y_top - 25, color, 5.5, 0.45, True)
    para(c, desc, x + 12, y_top - 43, w - 24, pstyle("BodyBold", 9.4, 11.4, NAVY))


def v2_sales_method(c):
    page_base(c, 7, "INFORMACIÓN COMERCIAL")
    title(
        c,
        "MÉTODO DEL VENDEDOR",
        "Una conversación natural, paso a paso.",
        "El objetivo de la primera visita no es cerrar una suscripción: es confirmar si existe un problema importante y conseguir una demostración.",
    )

    steps = [
        ("1", "PEDIR PERMISO", "Primero entender; todavía no mostrar el sistema."),
        ("2", "DESCUBRIR", "Caja, gastos, stock, cuentas y tiempo."),
        ("3", "DEVOLVER", "Resumir el problema y confirmar que entendimos."),
        ("4", "CONECTAR", "Explicar beneficios con situaciones concretas."),
        ("5", "AVANZAR", "Agendar revisión o demostración."),
    ]
    for i, item in enumerate(steps):
        x0 = 42 + i * 153
        color = CYAN if i % 2 == 0 else PURPLE
        fill = CYAN_PALE if i % 2 == 0 else PURPLE_PALE
        step_card_v2(c, x0, 418, 144, *item, color, fill)

    card(c, 42, 307, 371, 208, fill=PAPER, border=LINE, radius=9)
    label(c, "PREGUNTAS PARA EL DUEÑO", 60, 281, CYAN, 5.8, 0.55, True)
    bullet_list(c, [
        "¿Cómo registra hoy las ventas y movimientos de caja?",
        "¿Al cerrar puede saber cuánto vendió, gastó y quedó?",
        "¿Cómo controla el stock y detecta faltantes?",
        "¿Tiene cuentas por cobrar o pagos que se olvidan?",
        "¿Qué parte le quita más tiempo o genera errores?",
        "Si mejorara una sola cosa este mes, ¿cuál sería?",
    ], 60, 260, 335, CYAN, 9.2, 4.8)

    card(c, 429, 307, 371, 208, fill=PAPER, border=LINE, radius=9)
    label(c, "TRES FRASES QUE MUEVEN LA CONVERSACIÓN", 447, 281, PURPLE, 5.4, 0.45, True)
    label(c, "DEVOLUCIÓN", 447, 257, MUTED, 4.8, 0.4, True)
    para(c, "“Entonces, el problema no es solo registrar: es que cuadrar y revisar le quita tiempo. ¿Lo entendí bien?”", 447, 245, 332, pstyle("BodyBold", 9.2, 11.4, NAVY))
    label(c, "BENEFICIO", 447, 198, MUTED, 4.8, 0.4, True)
    para(c, "“Imagine abrir el celular y saber cuánto vendió, qué gastó y qué debe reponer.”", 447, 186, 332, pstyle("BodyBold", 9.2, 11.4, NAVY))
    label(c, "SUSCRIPCIÓN", 447, 145, MUTED, 4.8, 0.4, True)
    para(c, "“Para un negocio de su tamaño proponemos algo sencillo, con una mensualidad accesible, soporte y solo lo necesario.”", 447, 133, 332, pstyle("BodyBold", 9.2, 11.4, NAVY))

    card(c, 42, 90, 758, 43, fill=NAVY, border=NAVY, radius=7)
    label(c, "SIGUIENTE PASO", 59, 65, CYAN_BRIGHT, 5.5, 0.5, True)
    para(c, "“Le propongo una demostración con ejemplos de su negocio. Si aporta una mejora clara, definimos cómo empezar. ¿Qué día revisamos 30 minutos?”", 178, 76, 595, pstyle("BodyBold", 9.5, 11.8, WHITE))


def script_row_v2(c, y_top, num, stage, quote, color, fill, h=50):
    card(c, 42, y_top, 758, h, fill=fill, border=color, radius=7)
    c.setFillColor(color)
    c.circle(66, y_top - h / 2, 10, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("MonoBold", 6)
    c.drawCentredString(66, y_top - h / 2 - 2, str(num))
    label(c, stage, 88, y_top - 19, color, 5.4, 0.45, True)
    para(c, quote, 194, y_top - 15, 582, pstyle("Body", 9.5, 11.7, NAVY))


def objection_card_v2(c, x, y_top, w, objection, reply, color, fill):
    card(c, x, y_top, w, 76, fill=fill, border=color, radius=7)
    para(c, objection, x + 12, y_top - 16, w - 24, pstyle("BodyBold", 9.2, 10.9, NAVY))
    para(c, reply, x + 12, y_top - 38, w - 24, pstyle("Body", 9, 10.8, BODY))


def v2_final_script(c):
    page_base(c, 8, "INFORMACIÓN COMERCIAL")
    title(c, "GUION FINAL", "De la conversación a una demostración.", "El vendedor puede adaptar las palabras, pero debe conservar este orden.")

    script_row_v2(c, 430, 1, "APERTURA", "“Antes de hablarle de sistemas, quisiera entender cómo controla hoy su negocio y comprobar si realmente podemos ayudarle.”", CYAN, CYAN_PALE, 48)
    script_row_v2(c, 375, 2, "DESCUBRIMIENTO", "“¿Cómo registra ventas y caja? ¿Cómo controla stock, gastos y cuentas? ¿Qué parte le quita más tiempo o genera errores?”", PURPLE, PURPLE_PALE, 55)
    script_row_v2(c, 313, 3, "DEVOLUCIÓN", "“Por lo que me cuenta, [problema] le obliga a [consecuencia]. Eso le quita tiempo y dificulta decidir con claridad. ¿Lo entendí bien?”", CYAN, CYAN_PALE, 55)
    script_row_v2(c, 251, 4, "PROPUESTA DE VALOR", "“Podemos reunir caja, ventas, cuentas, stock e inventario en una herramienta sencilla para que revise la operación desde el celular o la computadora.”", PURPLE, PURPLE_PALE, 55)
    script_row_v2(c, 189, 5, "SUSCRIPCIÓN Y CIERRE", "“Empezaría con lo esencial mediante una suscripción mensual, soporte y acompañamiento. Le propongo una demostración de 30 minutos. ¿Qué día coordinamos?”", CYAN, CYAN_PALE, 55)

    objections = [
        (42, "“Mi cuaderno o Excel funciona.”", "Si le da control suficiente, no necesita cambiar. Revisemos dónde todavía duplica trabajo.", CYAN, CYAN_PALE),
        (235, "“No quiero otro gasto mensual.”", "Comparemos la mensualidad con el tiempo, errores o desorden actual; no prometamos ahorro sin datos.", PURPLE, PURPLE_PALE),
        (428, "“Mi personal no sabe usar sistemas.”", "Debe ser sencillo y acompañado de capacitación. Primero veamos el flujo real.", CYAN, CYAN_PALE),
        (621, "“Quiero pensarlo.”", "Aclaremos qué necesita comprobar: facilidad, funciones, soporte o costo; luego fijemos seguimiento.", PURPLE, PURPLE_PALE),
    ]
    for x0, objection, reply, color, fill in objections:
        objection_card_v2(c, x0, 126, 179, objection, reply, color, fill)

    source_text = (
        "<link href='https://ogeiee.produce.gob.pe/index.php/en/shortcode/oee-documentos-publicaciones/publicaciones-anuales/item/1290-las-mipyme-en-cifras-2024'>[1] PRODUCE, Las Mipyme en cifras 2024.</link>  ·  "
        "<link href='https://www.gob.pe/institucion/proinnovate/noticias/1145525-transforma-tu-negocio-proinnovate-ofrece-hasta-s-45-000-para-impulsar-la-digitalizacion-en-mipymes-peruanas'>[2] ProInnóvate, Mipymes Digitales 2025.</link>"
    )
    para(c, source_text, 42, 45, 758, pstyle("Body", 7.2, 8.8, MUTED, TA_CENTER))


def build_pdf_v2():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    register_fonts()
    c = canvas.Canvas(str(OUTPUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("Información comercial - Systemic Solutions")
    c.setAuthor("Systemic Solutions")
    c.setSubject("Modelo de negocio, servicios, beneficios y guion comercial")
    c.setCreator("Systemic Solutions")

    pages = [
        v2_cover,
        v2_business_map,
        v2_services,
        v2_entries,
        v2_support,
        v2_argument,
        v2_sales_method,
        v2_final_script,
    ]
    for page in pages:
        page(c)
        c.showPage()
    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    build_pdf_v2()
