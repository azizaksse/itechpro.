import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

export const useOrderNotifications = (onNewOrder?: () => void) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preload audio
  useEffect(() => {
    const audio = new Audio(NOTIFICATION_SOUND_URL);
    audio.volume = 0.6;
    audio.preload = "auto";
    audioRef.current = audio;
  }, []);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Browser may block autoplay before user interaction
      });
    }
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-order-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const order = payload.new as any;
          playSound();
          toast.success("🛒 طلب جديد!", {
            description: `${order.customer_first_name} ${order.customer_last_name} — ${order.wilaya}`,
            duration: 8000,
          });
          onNewOrder?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewOrder, playSound]);
};
