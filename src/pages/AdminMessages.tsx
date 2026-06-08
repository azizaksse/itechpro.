import AdminLayout from "@/components/admin/AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Mail, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AdminMessages = () => {
  const messages = useQuery(api.messages.getMessages);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const handleDelete = async (id: any) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    try {
      await deleteMessage({ id });
      toast.success("تم حذف الرسالة");
    } catch {
      toast.error("فشل في حذف الرسالة");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Mail size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">الرسائل</h1>
            <p className="text-sm text-muted-foreground">رسائل اتصل بنا ({messages?.length ?? 0} رسالة)</p>
          </div>
        </div>

        {messages === undefined ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="glass-card rounded-2xl border border-border p-16 text-center text-muted-foreground">
            <Mail size={40} className="mx-auto mb-4 opacity-30" />
            <p>لا توجد رسائل حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {messages.map((m) => (
              <div key={m._id} className="glass-card rounded-2xl border border-border p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{m.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      {m.email && <p>البريد: {m.email}</p>}
                      {m.phone && <p>الهاتف: {m.phone}</p>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(m._id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <div className="p-4 bg-secondary/30 rounded-xl border border-border/50 text-sm whitespace-pre-wrap">
                  {m.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
