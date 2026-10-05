import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API, FIELDS, STATES, loadEmployer, validate } from "./employerConfig";
import "./employer.css";
import { ChevronsLeft } from "lucide-react";

export default function EmployerEdit() {
  const { id = "demo" } = useParams();
  const navigate = useNavigate();
  const [emp, setEmp] = useState(null);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState({ text: "", bad: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEmployer(id).then((data) => {
      setEmp(data);
      setForm(data);
    });
  }, [id]);

  const change = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const save = async (e) => {
    e.preventDefault();
    const trimmed = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [
        k,
        typeof v === "string" ? v.trim() : v,
      ]),
    );
    const errs = validate(trimmed);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setMsg({ text: "Please fix the highlighted fields.", bad: true });
      return;
    }

    setSaving(true);
    const updated = { ...emp, ...trimmed, updatedAt: new Date().toISOString() };
    try {
      const r = await fetch(`${API}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!r.ok) throw new Error("save failed");
      setMsg({ text: "Saved. Redirecting...", bad: false });
    } catch {
      setMsg({
        text: "Server not reachable - saved locally (demo mode). Redirecting...",
        bad: false,
      });
    }
    localStorage.setItem(`employer:${id}`, JSON.stringify(updated));
    setTimeout(() => navigate(`/employers/${id}`), 900);
  };

  if (!emp) return <p className="emp-loading">Loading...</p>;

  return (
    <div className="emp-page">
      <header
        className="ep-hero relative mb-4 overflow-hidden rounded-2xl p-4 text-white shadow-sm sm:px-4 sm:py-2"
        style={{
          backgroundImage:
            "linear-gradient(110deg,#17405a 0%,#2f6b8a 40%,#4a9bb3 70%,#2f6b8a 100%)",
        }}
      >
        <span className="ep-orb ep-orb-a !h-40 !w-40" />
        <span className="ep-orb ep-orb-b !h-24 !w-24" />
        <div className="relative flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            title="Back"
            aria-label="Back"
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronsLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="m-0 text-[22px] font-extrabold tracking-tight sm:text-[26px]">
              Edit Organization
            </h1>
          </div>
        </div>
      </header>

      <main className="emp-main">
        <form className="emp-card" onSubmit={save} noValidate>
          <div className="emp-grid">
            {FIELDS.map((f) => {
              if (f.type === "checkbox")
                return (
                  <label key={f.name} className="emp-full emp-chk">
                    <input
                      type="checkbox"
                      checked={!!form[f.name]}
                      onChange={(e) => change(f.name, e.target.checked)}
                    />
                    {f.label}
                  </label>
                );

              return (
                <div key={f.name}>
                  <label className="emp-label">
                    {f.label} {f.required && <b>*</b>}
                    {f.type === "select" ? (
                      <select
                        className={errors[f.name] ? "bad" : ""}
                        value={form[f.name] ?? ""}
                        onChange={(e) => change(f.name, e.target.value)}
                      >
                        <option value="">Select</option>
                        {f.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type}
                        list={f.list}
                        className={errors[f.name] ? "bad" : ""}
                        value={form[f.name] ?? ""}
                        onChange={(e) => change(f.name, e.target.value)}
                      />
                    )}
                  </label>
                  <div className="emp-err">{errors[f.name]}</div>
                </div>
              );
            })}
          </div>

          <datalist id="states">
            {STATES.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>

          <div className="emp-actions flex justify-end">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link className="emp-cancel" to={`/employers/${id}`}>
              Cancel
            </Link>
          </div>
          {msg.text && (
            <p className={msg.bad ? "emp-msg bad" : "emp-msg"}>{msg.text}</p>
          )}
        </form>
      </main>
    </div>
  );
}
