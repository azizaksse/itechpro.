import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import Layout from "@/components/Layout";

const Delivery = () => {
  return (
    <Layout>
      <div className="container py-16 max-w-5xl" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
              <ShieldCheck size={40} className="text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">سياسة الضمان والتوصيل</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              يرجى التأكيد مجدداً بفحص الطلبية قبل الدفع لشركة التوصيل أو مكتب التوصيل.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* سياسة الضمان */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <h2 className="text-2xl font-bold">مدة الضمان</h2>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                  <span>ضمان التجميعات مدته <strong className="text-foreground">6 أشهر كاملة</strong>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                  <span>ضمان الشاشات من <strong className="text-foreground">4-6 أشهر</strong> (حسب النوع).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                  <span>ضمان الأكسسوارات ومنتجات الـ LED (مثل إضاءة الكيس، الكيبورد، الماوس، السماعات) هو <strong className="text-foreground">ضمان تجريبي مدته 3 أيام</strong> من يوم استلام المنتج.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
                  <span>ضمان قطع التجميعة شاملة لمدة <strong className="text-foreground">6 أشهر</strong> (معالج - كرت شاشة - رامات - ssd - باور سبلاي - لوحة أم).</span>
                </li>
              </ul>
            </div>

            {/* ما يشمله الضمان */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <h2 className="text-2xl font-bold">ما يشمله الضمان</h2>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <span>وجود أي خطأ تركيبي أو خلل في النظام الخاص بنا، أو عدم توافق القطع مع ما طلبته.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <span>أي عطل (لا قدر الله) يحدث دون تدخل العوامل الخارجية.</span>
                </li>
              </ul>

              <div className="mt-8 p-5 bg-secondary/50 rounded-xl border border-border/50">
                <h3 className="font-bold text-foreground mb-3 text-sm">طريقة سير الضمان بعد استلام المنتج:</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  بعد ما تلقى مشكل، تتواصل معانا على الخاص وحنا نتكفلو بالباقي، ويتم حل المشكل أونلاين. إذا لم ينجح، نبعثولك شركة التوصيل أو ترسلنا الحاسوب ونقوم بعملية الإصلاح أو الاستبدال <span className="text-primary font-bold">دون أي تكاليف</span> على الزبون.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            {/* ما لا يشمله الضمان */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-red-500/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <XCircle size={24} />
                </div>
                <h2 className="text-2xl font-bold">ما لا يشمله الضمان</h2>
              </div>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <span>التعرض للعوامل الخارجية (مشاكل في كهرباء المنزل، ملامسة الماء، أو التحطيم).</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <span>فتح الكيس والقيام بتعديلات دون استشارتنا وطلب إذن.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <span>تركيب أي قطعة عند محل آخر دون استشارتنا.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <span>محاولة العبث بالبيوس (BIOS) دون دراية.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <span>القيام بالتعديلات (Tweaks) وما شابهها (مما يؤدي لارتفاع الحرارة وتلف القطع).</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <span>تحميل الألعاب المكركة (لا قدر الله يفسدلك الـ SSD بسبب فيروس).</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <span>الدخول لمواقع مشبوهة أدت لتحميل أدوات خبيثة على الحاسوب.</span>
                </li>
              </ul>
            </div>

            {/* ضمان التوصيل */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-yellow-500/30 shadow-sm relative overflow-hidden bg-yellow-500/5">
              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/50" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-600 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <h2 className="text-2xl font-bold">ضمان التوصيل</h2>
              </div>
              <div className="space-y-6 text-muted-foreground">
                <p className="leading-relaxed text-lg">
                  يرجى تفقد المنتج بالعين المجردة <strong>قبل أن تدفع</strong> لمندوب التوصيل (إذا وجدت فيه كسر أو أي مشكل، يمكنك إلغاء الطلبية مباشرة).
                </p>
                <div className="p-5 bg-red-500/10 rounded-xl border border-red-500/20 text-red-500 text-sm flex items-start gap-3">
                  <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                  <p>
                    <strong>ملاحظة هامة:</strong> بعد استلامك ودفعك ثمن المنتج، إذا وجدت فيه كسور أو خدوش، فإننا لا نتحمل المسؤولية والضمان <strong>لا يغطي ذلك</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </Layout>
  );
};

export default Delivery;
