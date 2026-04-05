import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, UserCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Member {
  id: string;
  name: string;
  phone: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

const AdminMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", role: "موظف" });

  const fetchMembers = async () => {
    const { data } = await supabase.from("members").select("*").order("created_at", { ascending: false });
    setMembers(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("يرجى إدخال اسم العضو"); return; }

    if (editingMember) {
      const { error } = await supabase.from("members").update({ name: form.name, phone: form.phone || null, role: form.role }).eq("id", editingMember.id);
      if (error) { toast.error("حدث خطأ أثناء التعديل"); return; }
      toast.success("تم تعديل العضو بنجاح");
    } else {
      const { error } = await supabase.from("members").insert({ name: form.name, phone: form.phone || null, role: form.role });
      if (error) { toast.error("حدث خطأ أثناء الإضافة"); return; }
      toast.success("تم إضافة العضو بنجاح");
    }

    setDialogOpen(false);
    setEditingMember(null);
    setForm({ name: "", phone: "", role: "موظف" });
    fetchMembers();
  };

  const toggleActive = async (member: Member) => {
    await supabase.from("members").update({ is_active: !member.is_active }).eq("id", member.id);
    fetchMembers();
  };

  const deleteMember = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
    await supabase.from("members").delete().eq("id", id);
    toast.success("تم حذف العضو");
    fetchMembers();
  };

  const openEdit = (member: Member) => {
    setEditingMember(member);
    setForm({ name: member.name, phone: member.phone || "", role: member.role });
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditingMember(null);
    setForm({ name: "", phone: "", role: "موظف" });
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">الأعضاء</h2>
          <Button onClick={openAdd} className="gap-2">
            <Plus size={16} /> إضافة عضو
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><span className="tech-loader" /></div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">لا يوجد أعضاء حالياً</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div key={member.id} className="glass-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    {member.phone && <p className="text-sm text-muted-foreground">{member.phone}</p>}
                  </div>
                  <Badge variant={member.is_active ? "default" : "secondary"}>
                    {member.is_active ? "نشط" : "غير نشط"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">الدور: {member.role}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(member)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleActive(member)}>
                    {member.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteMember(member.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent dir="rtl">
            <DialogHeader>
              <DialogTitle>{editingMember ? "تعديل العضو" : "إضافة عضو جديد"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1 block">الاسم</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسم العضو" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">الهاتف</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="رقم الهاتف" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">الدور الوظيفي</label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="مثال: مدير، تقني، بائع" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>{editingMember ? "حفظ التعديلات" : "إضافة"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminMembers;
