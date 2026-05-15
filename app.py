import sqlite3
from datetime import datetime, timedelta
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import csv
import os
import platform
import json
import urllib.request
import tempfile
import shutil
import threading
import sys
import subprocess

DB_PATH = "motopark.db"
APP_VERSION = "1.2.0"
UPDATE_INFO_URL = os.getenv("MOTOPARK_UPDATE_URL", "http://127.0.0.1:8000/update/latest.json")
NOMBRE_PARQUEADERO = "MOTOPARK PRO"
LOGO_TEXTO = "[LOGO AQUÍ]"

TARIFAS = {
    "Hora": 1300,
    "Día completo": 12000,
    "Mensualidad": 45000,
}

class Database:
    def __init__(self, path=DB_PATH):
        self.conn = sqlite3.connect(path)
        self.conn.row_factory = sqlite3.Row
        self.init_db()

    def init_db(self):
        cur = self.conn.cursor()
        cur.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            role TEXT
        );
        CREATE TABLE IF NOT EXISTS caja (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            opened_by TEXT,
            opened_at TEXT,
            initial_cash INTEGER,
            closed_at TEXT,
            status TEXT DEFAULT 'OPEN'
        );
        CREATE TABLE IF NOT EXISTS movimientos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_no INTEGER,
            placa TEXT,
            cliente TEXT,
            service_type TEXT,
            entrada_at TEXT,
            salida_at TEXT,
            locker_no TEXT,
            cascos INTEGER,
            observaciones TEXT,
            amount INTEGER,
            payment_method TEXT,
            status TEXT DEFAULT 'PARKED'
        );
        CREATE TABLE IF NOT EXISTS mensualidades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            placa TEXT,
            cliente TEXT,
            vence_at TEXT,
            estado TEXT,
            foto_path TEXT
        );
        CREATE TABLE IF NOT EXISTS lockers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            locker_no TEXT UNIQUE,
            status TEXT,
            placa TEXT,
            cascos INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            action TEXT,
            created_at TEXT
        );
        ''')
        self.conn.commit()

        if not self.conn.execute("SELECT 1 FROM users LIMIT 1").fetchone():
            self.conn.execute("INSERT INTO users (username,password,role) VALUES (?,?,?)", ("admin", "admin123", "Administrador"))
            self.conn.commit()

        if not self.conn.execute("SELECT 1 FROM lockers LIMIT 1").fetchone():
            for i in range(1, 51):
                self.conn.execute("INSERT OR IGNORE INTO lockers (locker_no,status,placa,cascos) VALUES (?,?,?,?)", (str(i), "Disponible", None, 0))
            self.conn.commit()

    def audit(self, username, action):
        self.conn.execute("INSERT INTO audit_log (username,action,created_at) VALUES (?,?,?)", (username, action, datetime.now().isoformat()))
        self.conn.commit()

class LoginWindow(tk.Tk):
    def __init__(self, db):
        super().__init__()
        self.db = db
        self.title("MotoPark Pro - Login")
        self.geometry("460x300")
        self.configure(bg="#0d1117")

        frame = tk.Frame(self, bg="#161b22", padx=20, pady=20)
        frame.pack(expand=True, fill="both", padx=20, pady=20)

        tk.Label(frame, text="MotoPark Pro", font=("Segoe UI", 24, "bold"), bg="#161b22", fg="#58a6ff").pack(pady=12)
        self.user = self._entry(frame, "Usuario")
        self.pwd = self._entry(frame, "Contraseña", show="*")
        tk.Button(frame, text="Ingresar", bg="#238636", fg="white", font=("Segoe UI", 14, "bold"), command=self.login).pack(fill="x", pady=12)
        self.user.bind("<Return>", lambda _e: self.pwd.focus_set())
        self.pwd.bind("<Return>", lambda _e: self.login())

    def _entry(self, parent, lbl, **kwargs):
        tk.Label(parent, text=lbl, bg="#161b22", fg="#c9d1d9", font=("Segoe UI", 10)).pack(anchor="w")
        e = tk.Entry(parent, font=("Segoe UI", 13), bg="#0d1117", fg="white", insertbackground="white", **kwargs)
        e.pack(fill="x", pady=(2, 10))
        return e

    def login(self):
        row = self.db.conn.execute("SELECT * FROM users WHERE username=? AND password=?", (self.user.get(), self.pwd.get())).fetchone()
        if not row:
            messagebox.showerror("Error", "Credenciales inválidas")
            return
        self.db.audit(row["username"], "Inicio de sesión")
        self.destroy()
        app = MainApp(self.db, row["username"], row["role"])
        app.mainloop()

class MainApp(tk.Tk):
    def __init__(self, db, username, role):
        super().__init__()
        self.db = db
        self.username = username
        self.role = role
        self.max_spaces = 120
        self.title("MotoPark Pro")
        self.state("zoomed")
        self.configure(bg="#0d1117")

        self.style = ttk.Style()
        self.style.theme_use("clam")
        self.style.configure("TNotebook", background="#0d1117", borderwidth=0)
        self.style.configure("TNotebook.Tab", background="#161b22", foreground="#c9d1d9", padding=10)

        top = tk.Frame(self, bg="#161b22", height=70)
        top.pack(fill="x")
        self.clock_lbl = tk.Label(top, text="", bg="#161b22", fg="#58a6ff", font=("Segoe UI", 16, "bold"))
        self.clock_lbl.pack(side="right", padx=20, pady=15)
        tk.Label(top, text=f"Usuario: {username} ({role}) | v{APP_VERSION}", bg="#161b22", fg="#c9d1d9", font=("Segoe UI", 12)).pack(side="left", padx=20)

        self.nb = ttk.Notebook(self)
        self.nb.pack(fill="both", expand=True, padx=10, pady=10)

        self.tabs = {}
        for name in ["Inicio", "Ingreso", "Salida", "Mensualidades", "Lockers", "Caja", "Reportes"]:
            f = tk.Frame(self.nb, bg="#0d1117")
            self.nb.add(f, text=name)
            self.tabs[name] = f

        self.build_inicio()
        self.build_ingreso()
        self.build_salida()
        self.build_mensualidades()
        self.build_lockers()
        self.build_caja()
        self.build_reportes()
        self.build_actualizaciones()
        self.setup_shortcuts()
        self.update_clock()
        self.refresh_inicio()



    def build_actualizaciones(self):
        f = self.tabs["Inicio"]
        bar = tk.Frame(f, bg="#0d1117")
        bar.pack(fill="x", padx=10, pady=(0, 6))
        tk.Button(bar, text="Buscar actualización", command=self.check_updates_async, bg="#1f6feb", fg="white", font=("Segoe UI", 10, "bold")).pack(side="left")
        tk.Button(bar, text="¿Error?", command=self.abrir_ayuda_actualizacion, bg="#30363d", fg="white", font=("Segoe UI", 9)).pack(side="left", padx=6)
        self.update_status = tk.Label(bar, text="", bg="#0d1117", fg="#8b949e")
        self.update_status.pack(side="left", padx=10)

    def abrir_ayuda_actualizacion(self):
        messagebox.showinfo(
            "Ayuda actualización",
            "Si aparece WinError 10061:\n\n"
            "1) Inicia el servidor local con: py server.py\n"
            "2) O configura MOTOPARK_UPDATE_URL con una URL pública válida\n"
            "3) Vuelve a pulsar Buscar actualización"
        )

    def check_updates_async(self):
        self.update_status.config(text="Buscando actualizaciones...")
        threading.Thread(target=self.check_updates, daemon=True).start()

    def check_updates(self):
        try:
            req = urllib.request.Request(UPDATE_INFO_URL, headers={"User-Agent": "MotoParkPro-Updater/1.0"})
            with urllib.request.urlopen(req, timeout=10) as r:
                data = json.loads(r.read().decode("utf-8"))
            latest = data.get("version", APP_VERSION)
            url = data.get("url")
            notes = data.get("notes", "")
            if latest > APP_VERSION and url:
                self.after(0, lambda: self.prompt_update(latest, url, notes))
            else:
                self.after(0, lambda: self.update_status.config(text="Ya tienes la última versión."))
        except Exception as e:
            msg = str(e)
            if "404" in msg:
                msg = "URL de actualización no encontrada (404). Configura MOTOPARK_UPDATE_URL o server.py"
            elif "10061" in msg or "Connection refused" in msg:
                msg = "No hay servidor de actualizaciones activo (WinError 10061). Inicia server.py o configura MOTOPARK_UPDATE_URL."
            self.after(0, lambda: self.update_status.config(text=f"No se pudo verificar: {msg}"))

    def prompt_update(self, latest, url, notes):
        msg = f"Nueva versión disponible: {latest}\n\n{notes}\n\n¿Deseas descargar e instalar ahora?"
        if messagebox.askyesno("Actualización disponible", msg):
            self.download_and_install_update(url, latest)

    def download_and_install_update(self, url, latest):
        try:
            self.update_status.config(text="Descargando actualización...")
            tmp_dir = tempfile.mkdtemp(prefix="motopark_update_")
            new_exe = os.path.join(tmp_dir, "MotoParkPro_new.exe")
            urllib.request.urlretrieve(url, new_exe)

            current_exe = sys.executable
            updater_bat = os.path.join(tmp_dir, "update.bat")
            with open(updater_bat, "w", encoding="utf-8") as f:
                f.write("@echo off\n")
                f.write("timeout /t 2 /nobreak > nul\n")
                f.write(f'copy /Y "{new_exe}" "{current_exe}" > nul\n')
                f.write(f'start "" "{current_exe}"\n')

            self.update_status.config(text=f"Instalando versión {latest}...")
            os.startfile(updater_bat)
            self.destroy()
        except Exception as e:
            messagebox.showerror("Actualización", f"Error al actualizar: {e}")

    def setup_shortcuts(self):
        self.bind("<F11>", lambda _e: self.attributes("-fullscreen", not self.attributes("-fullscreen")))
        self.bind("<Escape>", lambda _e: self.attributes("-fullscreen", False))
        self.bind("<F2>", lambda _e: self.open_quick_salida())

    def big_button(self, parent, text, cmd, color="#1f6feb"):
        return tk.Button(parent, text=text, command=cmd, bg=color, fg="white", font=("Segoe UI", 16, "bold"), pady=12)

    def update_clock(self):
        self.clock_lbl.config(text=datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
        self.after(1000, self.update_clock)

    def build_inicio(self):
        f = self.tabs["Inicio"]
        quick = tk.Frame(f, bg="#161b22", padx=12, pady=10)
        quick.pack(fill="x", padx=10, pady=(0, 10))
        tk.Label(quick, text="Ingreso rápido por placa", bg="#161b22", fg="#58a6ff", font=("Segoe UI", 12, "bold")).pack(side="left")
        self.quick_placa = tk.Entry(quick, font=("Segoe UI", 18, "bold"), bg="#0d1117", fg="white", insertbackground="white", width=12)
        self.quick_placa.pack(side="left", padx=8)
        self.quick_cascos = tk.Entry(quick, font=("Segoe UI", 12), bg="#0d1117", fg="white", insertbackground="white", width=4)
        self.quick_cascos.pack(side="left", padx=4)
        self.quick_cascos.insert(0, "0")
        self.quick_locker = tk.Entry(quick, font=("Segoe UI", 12), bg="#0d1117", fg="white", insertbackground="white", width=6)
        self.quick_locker.pack(side="left", padx=4)
        self.quick_tipo = ttk.Combobox(quick, values=["Hora","Día completo","Mensualidad"], state="readonly", width=12)
        self.quick_tipo.current(0)
        self.quick_tipo.pack(side="left", padx=6)
        self.quick_placa.bind("<Return>", lambda _e: self.ingresar_moto(placa_override=self.quick_placa.get(), rapido=True))
        tk.Label(quick, text="Placa + cascos + locker + tipo y ENTER", bg="#161b22", fg="#8b949e").pack(side="left", padx=8)
        self.cards = {}
        grid = tk.Frame(f, bg="#0d1117")
        grid.pack(fill="x", pady=10)
        for i, k in enumerate(["Parqueadas", "Disponibles", "Ingresos día", "Ingresadas hoy", "Retiradas hoy"]):
            card = tk.Frame(grid, bg="#161b22", padx=20, pady=15)
            card.grid(row=0, column=i, padx=8, sticky="nsew")
            tk.Label(card, text=k, bg="#161b22", fg="#8b949e").pack()
            lbl = tk.Label(card, text="0", bg="#161b22", fg="#58a6ff", font=("Segoe UI", 22, "bold"))
            lbl.pack()
            self.cards[k] = lbl
        self.mov_tree = ttk.Treeview(f, columns=("ticket","placa","tipo","entrada","estado"), show="headings")
        for c in self.mov_tree["columns"]:
            self.mov_tree.heading(c, text=c)
        self.mov_tree.pack(fill="both", expand=True, padx=10, pady=10)

    def build_ingreso(self):
        f = self.tabs["Ingreso"]
        form = tk.Frame(f, bg="#0d1117")
        form.pack(fill="x", padx=20, pady=20)
        self.inp = {}
        fields = ["Placa","Cliente (opcional)","Tipo de servicio","Cascos","Locker","Observaciones"]
        for i, field in enumerate(fields):
            tk.Label(form, text=field, fg="#c9d1d9", bg="#0d1117").grid(row=i, column=0, sticky="w", pady=6)
            if field == "Tipo de servicio":
                cb = ttk.Combobox(form, values=list(TARIFAS.keys()), state="readonly")
                cb.current(0)
                cb.grid(row=i, column=1, sticky="ew", pady=6)
                self.inp[field] = cb
            else:
                e = tk.Entry(form, font=("Segoe UI", 12), bg="#161b22", fg="white", insertbackground="white")
                e.grid(row=i, column=1, sticky="ew", pady=6)
                self.inp[field] = e
        form.columnconfigure(1, weight=1)
        self.big_button(f, "Ingresar Moto", self.ingresar_moto, "#238636").pack(fill="x", padx=20, pady=10)
        tk.Label(f, text="Consejo: escribe la placa y presiona Enter para ingresar.", bg="#0d1117", fg="#8b949e").pack(anchor="w", padx=20)
        self.inp["Placa"].focus_set()
        self.inp["Placa"].bind("<Return>", lambda _e: self.ingresar_moto())

    def ingresar_moto(self, placa_override=None, rapido=False):
        placa_raw = placa_override if placa_override is not None else self.inp["Placa"].get()
        placa = placa_raw.strip().upper()
        if not placa:
            return messagebox.showwarning("Validación", "Placa es obligatoria")
        existe = self.db.conn.execute("SELECT 1 FROM movimientos WHERE placa=? AND status='PARKED'", (placa,)).fetchone()
        if existe:
            return messagebox.showwarning("Duplicado", f"La moto {placa} ya se encuentra en el parqueadero")
        service_type = self.quick_tipo.get() if rapido and hasattr(self, "quick_tipo") else self.inp["Tipo de servicio"].get()
        cascos_val = int((self.quick_cascos.get() if rapido and hasattr(self, "quick_cascos") else self.inp["Cascos"].get()) or 0)
        locker_val = (self.quick_locker.get() if rapido and hasattr(self, "quick_locker") else self.inp["Locker"].get())
        if service_type == "Mensualidad":
            vence = datetime.now() + timedelta(days=30)
            self.db.conn.execute("INSERT INTO mensualidades(placa,cliente,vence_at,estado) VALUES (?,?,?,?)", (placa, self.inp["Cliente (opcional)"].get(), vence.date().isoformat(), "Activo"))
            self.db.conn.commit()
            self.db.audit(self.username, f"Registro mensualidad {placa}")
            self.refresh_mensualidades()
            self.quick_placa.delete(0, "end") if hasattr(self, "quick_placa") else None
            return messagebox.showinfo("Mensualidad", f"Moto {placa} registrada en mensualidades")
        ticket = self.db.conn.execute("SELECT COALESCE(MAX(ticket_no),0)+1 n FROM movimientos").fetchone()["n"]
        self.db.conn.execute('''INSERT INTO movimientos(ticket_no,placa,cliente,service_type,entrada_at,locker_no,cascos,observaciones,amount,status)
             VALUES (?,?,?,?,?,?,?,?,?,?)''', (
            ticket, placa, self.inp["Cliente (opcional)"].get(), service_type, datetime.now().isoformat(),
            locker_val, cascos_val, self.inp["Observaciones"].get(), TARIFAS[service_type], "PARKED"
        ))
        locker = (locker_val or "").strip()
        if locker:
            self.db.conn.execute("UPDATE lockers SET status='Ocupado', placa=?, cascos=? WHERE locker_no=?", (placa, cascos_val, locker))
        self.db.conn.commit()
        self.db.audit(self.username, f"Ingreso moto {placa}, ticket {ticket}")
        self.print_ticket(ticket, entrada=True)
        self.inp["Placa"].delete(0, "end")
        self.inp["Placa"].focus_set()
        if hasattr(self, "quick_placa"):
            self.quick_placa.delete(0, "end")
            self.quick_placa.focus_set()
        self.bell()
        messagebox.showinfo("OK", f"Moto ingresada. Tiquete #{ticket}")
        self.refresh_inicio()

    def build_salida(self):
        f = self.tabs["Salida"]
        box = tk.Frame(f, bg="#0d1117")
        box.pack(fill="x", padx=20, pady=20)
        self.search = tk.Entry(box, font=("Segoe UI", 14), bg="#161b22", fg="white", insertbackground="white")
        self.search.pack(side="left", fill="x", expand=True, padx=(0,10))
        self.big_button(box, "Buscar por placa / tiquete", self.buscar_moto).pack(side="left")
        self.out_info = tk.Label(f, text="", bg="#0d1117", fg="#c9d1d9", font=("Consolas", 13), justify="left")
        self.out_info.pack(anchor="w", padx=20, pady=10)
        self.pay_method = ttk.Combobox(f, values=["Efectivo","Nequi","Daviplata","Transferencia"], state="readonly")
        self.pay_method.current(0)
        self.pay_method.pack(padx=20, pady=8, anchor="w")
        self.big_button(f, "Registrar salida", self.registrar_salida, "#da3633").pack(fill="x", padx=20, pady=10)
        tk.Label(f, text="Consejo: busca por placa/tiquete y presiona Enter para consultar.", bg="#0d1117", fg="#8b949e").pack(anchor="w", padx=20)
        self.search.bind("<Return>", lambda _e: self.buscar_moto())
        self.current_move = None

    def buscar_moto(self):
        q = self.search.get().strip().upper()
        row = self.db.conn.execute("SELECT * FROM movimientos WHERE status='PARKED' AND (placa=? OR ticket_no=?)", (q, q if q.isdigit() else -1)).fetchone()
        if not row:
            self.current_move = None
            return messagebox.showwarning("Sin resultados", "No se encontró moto parqueada")
        entrada = datetime.fromisoformat(row["entrada_at"])
        delta = datetime.now() - entrada
        horas = max(1, int(delta.total_seconds() // 3600) + (1 if delta.total_seconds() % 3600 else 0))
        valor = TARIFAS[row["service_type"]] if row["service_type"] != "Hora" else horas * TARIFAS["Hora"]
        self.current_move = (row, valor, delta)
        self.out_info.config(text=f"Placa: {row['placa']}\nTicket: {row['ticket_no']}\nEntrada: {entrada}\nTiempo total: {delta}\nValor a pagar: ${valor:,.0f} COP")

    def registrar_salida(self):
        if not self.current_move:
            return
        row, valor, _ = self.current_move
        self.db.conn.execute("UPDATE movimientos SET salida_at=?,amount=?,payment_method=?,status='OUT' WHERE id=?", (datetime.now().isoformat(), valor, self.pay_method.get(), row["id"]))
        if row["locker_no"]:
            self.db.conn.execute("UPDATE lockers SET status='Disponible', placa=NULL, cascos=0 WHERE locker_no=?", (row["locker_no"],))
        self.db.conn.commit()
        self.print_ticket(row["ticket_no"], entrada=False)
        self.db.audit(self.username, f"Salida moto {row['placa']}, ticket {row['ticket_no']}")
        self.bell()
        self.refresh_inicio()
        messagebox.showinfo("OK", "Salida registrada")


    def open_quick_salida(self):
        win = tk.Toplevel(self)
        win.title("Salida rápida (F2)")
        win.geometry("520x280")
        win.configure(bg="#0d1117")
        tk.Label(win, text="Placa o Ticket", bg="#0d1117", fg="#c9d1d9", font=("Segoe UI", 11)).pack(anchor="w", padx=20, pady=(16, 4))
        placa = tk.Entry(win, font=("Segoe UI", 16, "bold"), bg="#161b22", fg="white", insertbackground="white")
        placa.pack(fill="x", padx=20)
        info = tk.Label(win, text="", bg="#0d1117", fg="#8b949e", justify="left")
        info.pack(anchor="w", padx=20, pady=10)
        pago = ttk.Combobox(win, values=["Efectivo","Nequi","Daviplata","Transferencia"], state="readonly")
        pago.current(0)
        pago.pack(padx=20, anchor="w")

        ctx = {"move": None}

        def buscar(_e=None):
            q = placa.get().strip().upper()
            row = self.db.conn.execute("SELECT * FROM movimientos WHERE status='PARKED' AND (placa=? OR ticket_no=?)", (q, q if q.isdigit() else -1)).fetchone()
            if not row:
                ctx["move"] = None
                info.config(text="No se encontró moto parqueada")
                return
            entrada = datetime.fromisoformat(row["entrada_at"])
            delta = datetime.now() - entrada
            horas = max(1, int(delta.total_seconds() // 3600) + (1 if delta.total_seconds() % 3600 else 0))
            valor = TARIFAS[row["service_type"]] if row["service_type"] != "Hora" else horas * TARIFAS["Hora"]
            ctx["move"] = (row, valor)
            info.config(text=f"Placa: {row['placa']}  |  Valor: ${valor:,.0f} COP")
            pago.focus_set()

        def cobrar(_e=None):
            if not ctx["move"]:
                return
            row, valor = ctx["move"]
            self.db.conn.execute("UPDATE movimientos SET salida_at=?,amount=?,payment_method=?,status='OUT' WHERE id=?", (datetime.now().isoformat(), valor, pago.get(), row["id"]))
            if row["locker_no"]:
                self.db.conn.execute("UPDATE lockers SET status='Disponible', placa=NULL, cascos=0 WHERE locker_no=?", (row["locker_no"],))
            self.db.conn.commit()
            self.print_ticket(row["ticket_no"], entrada=False)
            self.db.audit(self.username, f"Salida rápida moto {row['placa']}, ticket {row['ticket_no']}")
            self.refresh_inicio()
            win.destroy()

        placa.bind("<Return>", buscar)
        pago.bind("<Return>", cobrar)
        tk.Button(win, text="Buscar", command=buscar, bg="#1f6feb", fg="white").pack(side="left", padx=20, pady=16)
        tk.Button(win, text="Cobrar e imprimir", command=cobrar, bg="#da3633", fg="white").pack(side="left", padx=8, pady=16)
        placa.focus_set()

    def build_mensualidades(self):
        f = self.tabs["Mensualidades"]
        bar = tk.Frame(f, bg="#0d1117")
        bar.pack(fill="x", padx=20, pady=10)
        self.m_placa = tk.Entry(bar); self.m_placa.pack(side="left", padx=5)
        self.m_cliente = tk.Entry(bar); self.m_cliente.pack(side="left", padx=5)
        self.big_button(bar, "Agregar mensualidad", self.add_mensualidad).pack(side="left", padx=5)
        self.m_tree = ttk.Treeview(f, columns=("placa","cliente","vence","estado"), show="headings")
        for c in self.m_tree["columns"]: self.m_tree.heading(c, text=c)
        self.m_tree.pack(fill="both", expand=True, padx=20, pady=10)
        self.refresh_mensualidades()

    def add_mensualidad(self):
        vence = datetime.now() + timedelta(days=30)
        self.db.conn.execute("INSERT INTO mensualidades(placa,cliente,vence_at,estado) VALUES (?,?,?,?)", (self.m_placa.get().upper(), self.m_cliente.get(), vence.date().isoformat(), "Activo"))
        self.db.conn.commit(); self.refresh_mensualidades()

    def refresh_mensualidades(self):
        for i in self.m_tree.get_children(): self.m_tree.delete(i)
        for row in self.db.conn.execute("SELECT * FROM mensualidades ORDER BY id DESC"):
            vence = datetime.fromisoformat(row["vence_at"])
            days = (vence.date() - datetime.now().date()).days
            estado = "Vencido" if days < 0 else "Próximo a vencer" if days <= 5 else "Activo"
            self.db.conn.execute("UPDATE mensualidades SET estado=? WHERE id=?", (estado, row["id"]))
            self.m_tree.insert("", "end", values=(row["placa"], row["cliente"], row["vence_at"], estado))
        self.db.conn.commit()

    def build_lockers(self):
        f = self.tabs["Lockers"]
        self.lockers_frame = tk.Frame(f, bg="#0d1117")
        self.lockers_frame.pack(fill="both", expand=True, padx=20, pady=20)
        self.refresh_lockers()

    def refresh_lockers(self):
        for w in self.lockers_frame.winfo_children(): w.destroy()
        rows = self.db.conn.execute("SELECT * FROM lockers ORDER BY CAST(locker_no AS INT)").fetchall()
        for idx, row in enumerate(rows):
            color = "#238636" if row["status"] == "Disponible" else "#da3633"
            txt = f"#{row['locker_no']}\n{row['status']}\n{row['placa'] or ''}"
            tk.Button(self.lockers_frame, text=txt, bg=color, fg="white", width=12, height=4).grid(row=idx//10, column=idx%10, padx=4, pady=4)

    def build_caja(self):
        f = self.tabs["Caja"]
        head = tk.Frame(f, bg="#0d1117"); head.pack(fill="x", padx=20, pady=10)
        tk.Label(head, text="Dinero inicial", bg="#0d1117", fg="#c9d1d9").pack(side="left")
        self.cash_init = tk.Entry(head); self.cash_init.pack(side="left", padx=8)
        self.big_button(head, "Apertura", self.open_caja).pack(side="left", padx=8)
        self.big_button(head, "Arqueo (resumen)", self.arqueo).pack(side="left", padx=8)
        self.caja_txt = tk.Text(f, height=18, bg="#161b22", fg="#c9d1d9")
        self.caja_txt.pack(fill="both", expand=True, padx=20, pady=10)

    def open_caja(self):
        self.db.conn.execute("INSERT INTO caja(opened_by,opened_at,initial_cash,status) VALUES (?,?,?,?)", (self.username, datetime.now().isoformat(), int(self.cash_init.get() or 0), "OPEN"))
        self.db.conn.commit(); messagebox.showinfo("Caja", "Caja abierta")

    def arqueo(self):
        today = datetime.now().date().isoformat()
        cur = self.db.conn.execute("SELECT payment_method, COALESCE(SUM(amount),0) total FROM movimientos WHERE status='OUT' AND substr(salida_at,1,10)=? GROUP BY payment_method", (today,))
        lines = ["--- Arqueo del día ---"]
        total = 0
        for r in cur.fetchall():
            lines.append(f"{r['payment_method']}: ${r['total']:,.0f}")
            total += r["total"]
        lines.append(f"TOTAL: ${total:,.0f}")
        self.caja_txt.delete("1.0", "end"); self.caja_txt.insert("1.0", "\n".join(lines))

    def build_reportes(self):
        f = self.tabs["Reportes"]
        self.big_button(f, "Exportar historial CSV", self.export_csv).pack(fill="x", padx=20, pady=20)

    def export_csv(self):
        path = filedialog.asksaveasfilename(defaultextension=".csv", filetypes=[("CSV", "*.csv")])
        if not path: return
        rows = self.db.conn.execute("SELECT * FROM movimientos ORDER BY id DESC").fetchall()
        with open(path, "w", newline="", encoding="utf-8") as fp:
            wr = csv.writer(fp)
            wr.writerow(rows[0].keys() if rows else [])
            for r in rows: wr.writerow(tuple(r))
        messagebox.showinfo("Reporte", f"Exportado en {path}")

    def print_ticket(self, ticket_no, entrada=True):
        row = self.db.conn.execute("SELECT * FROM movimientos WHERE ticket_no=?", (ticket_no,)).fetchone()
        os.makedirs("tickets", exist_ok=True)
        kind = "entrada" if entrada else "salida"
        file_path = f"tickets/{ticket_no}_{kind}.txt"
        with open(file_path, "w", encoding="utf-8") as fp:
            fp.write(f"{LOGO_TEXTO}\n")
            fp.write(f"{NOMBRE_PARQUEADERO}\n")
            fp.write("NIT: 900.000.000-0\nDirección: Colombia\nTel: 3000000000\n")
            fp.write(f"Tiquete #{ticket_no}\nFecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            fp.write(f"Placa: {row['placa']}\nServicio: {row['service_type']}\n")
            fp.write(f"Valor: ${row['amount'] or 0:,.0f} COP\n")
            fp.write("QR: [placeholder]\n")
            fp.write("Gracias por su visita\n")
        self.try_print_file(file_path)

    def try_print_file(self, file_path):
        try:
            if platform.system() == "Windows":
                try:
                    os.startfile(file_path, "print")
                except Exception:
                    subprocess.run(["notepad.exe", "/p", file_path], check=False)
            else:
                print(f"Ticket generado: {file_path}")
        except Exception as e:
            messagebox.showwarning("Impresión", f"No se pudo imprimir automáticamente. Ticket guardado en: {file_path}\nDetalle: {e}")

    def refresh_inicio(self):
        parked = self.db.conn.execute("SELECT COUNT(*) c FROM movimientos WHERE status='PARKED'").fetchone()["c"]
        ins_today = self.db.conn.execute("SELECT COUNT(*) c FROM movimientos WHERE substr(entrada_at,1,10)=?", (datetime.now().date().isoformat(),)).fetchone()["c"]
        out_today = self.db.conn.execute("SELECT COUNT(*) c FROM movimientos WHERE status='OUT' AND substr(salida_at,1,10)=?", (datetime.now().date().isoformat(),)).fetchone()["c"]
        ingresos = self.db.conn.execute("SELECT COALESCE(SUM(amount),0) s FROM movimientos WHERE status='OUT' AND substr(salida_at,1,10)=?", (datetime.now().date().isoformat(),)).fetchone()["s"]
        self.cards["Parqueadas"].config(text=str(parked))
        self.cards["Disponibles"].config(text=str(self.max_spaces - parked))
        self.cards["Ingresos día"].config(text=f"${ingresos:,.0f}")
        self.cards["Ingresadas hoy"].config(text=str(ins_today))
        self.cards["Retiradas hoy"].config(text=str(out_today))

        for i in self.mov_tree.get_children(): self.mov_tree.delete(i)
        for row in self.db.conn.execute("SELECT ticket_no,placa,service_type,entrada_at,status FROM movimientos ORDER BY id DESC LIMIT 20"):
            self.mov_tree.insert("", "end", values=tuple(row))
        self.refresh_lockers()

if __name__ == "__main__":
    db = Database()
    login = LoginWindow(db)
    login.mainloop()
