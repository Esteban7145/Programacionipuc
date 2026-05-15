import sqlite3
from datetime import datetime, timedelta
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import csv
import os

DB_PATH = "motopark.db"

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
        tk.Label(top, text=f"Usuario: {username} ({role})", bg="#161b22", fg="#c9d1d9", font=("Segoe UI", 12)).pack(side="left", padx=20)

        self.nb = ttk.Notebook(self)
        self.nb.pack(fill="both", expand=True, padx=10, pady=10)

        self.tabs = {}
        for name in ["Dashboard", "Ingreso", "Salida", "Mensualidades", "Lockers", "Caja", "Reportes"]:
            f = tk.Frame(self.nb, bg="#0d1117")
            self.nb.add(f, text=name)
            self.tabs[name] = f

        self.build_dashboard()
        self.build_ingreso()
        self.build_salida()
        self.build_mensualidades()
        self.build_lockers()
        self.build_caja()
        self.build_reportes()
        self.update_clock()
        self.refresh_dashboard()

    def big_button(self, parent, text, cmd, color="#1f6feb"):
        return tk.Button(parent, text=text, command=cmd, bg=color, fg="white", font=("Segoe UI", 16, "bold"), pady=12)

    def update_clock(self):
        self.clock_lbl.config(text=datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
        self.after(1000, self.update_clock)

    def build_dashboard(self):
        f = self.tabs["Dashboard"]
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

    def ingresar_moto(self):
        placa = self.inp["Placa"].get().strip().upper()
        if not placa:
            return messagebox.showwarning("Validación", "Placa es obligatoria")
        ticket = self.db.conn.execute("SELECT COALESCE(MAX(ticket_no),0)+1 n FROM movimientos").fetchone()["n"]
        self.db.conn.execute('''INSERT INTO movimientos(ticket_no,placa,cliente,service_type,entrada_at,locker_no,cascos,observaciones,amount,status)
             VALUES (?,?,?,?,?,?,?,?,?,?)''', (
            ticket, placa, self.inp["Cliente (opcional)"].get(), self.inp["Tipo de servicio"].get(), datetime.now().isoformat(),
            self.inp["Locker"].get(), int(self.inp["Cascos"].get() or 0), self.inp["Observaciones"].get(), TARIFAS[self.inp["Tipo de servicio"].get()], "PARKED"
        ))
        locker = self.inp["Locker"].get().strip()
        if locker:
            self.db.conn.execute("UPDATE lockers SET status='Ocupado', placa=?, cascos=? WHERE locker_no=?", (placa, int(self.inp["Cascos"].get() or 0), locker))
        self.db.conn.commit()
        self.db.audit(self.username, f"Ingreso moto {placa}, ticket {ticket}")
        self.print_ticket(ticket, entrada=True)
        self.bell()
        messagebox.showinfo("OK", f"Moto ingresada. Ticket #{ticket}")
        self.refresh_dashboard()

    def build_salida(self):
        f = self.tabs["Salida"]
        box = tk.Frame(f, bg="#0d1117")
        box.pack(fill="x", padx=20, pady=20)
        self.search = tk.Entry(box, font=("Segoe UI", 14), bg="#161b22", fg="white", insertbackground="white")
        self.search.pack(side="left", fill="x", expand=True, padx=(0,10))
        self.big_button(box, "Buscar por placa / ticket", self.buscar_moto).pack(side="left")
        self.out_info = tk.Label(f, text="", bg="#0d1117", fg="#c9d1d9", font=("Consolas", 13), justify="left")
        self.out_info.pack(anchor="w", padx=20, pady=10)
        self.pay_method = ttk.Combobox(f, values=["Efectivo","Nequi","Daviplata","Transferencia"], state="readonly")
        self.pay_method.current(0)
        self.pay_method.pack(padx=20, pady=8, anchor="w")
        self.big_button(f, "Registrar salida", self.registrar_salida, "#da3633").pack(fill="x", padx=20, pady=10)
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
        self.refresh_dashboard()
        messagebox.showinfo("OK", "Salida registrada")

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
        with open(f"tickets/{ticket_no}_{kind}.txt", "w", encoding="utf-8") as fp:
            fp.write("MOTOPARK PRO\n")
            fp.write("NIT: 900.000.000-0\nDirección: Colombia\n")
            fp.write(f"Ticket #{ticket_no}\nFecha: {datetime.now()}\n")
            fp.write(f"Placa: {row['placa']}\nServicio: {row['service_type']}\n")
            fp.write(f"Valor: ${row['amount'] or 0:,.0f}\n")
            fp.write("QR: [placeholder]\nGracias por su visita\n")

    def refresh_dashboard(self):
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
