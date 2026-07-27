import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

export function useStudentClasses() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await base44.entities.SessionParticipant.list("-classDate", 500);
      const sorted = [...(data || [])].sort((a, b) => {
        const aKey = `${a.classDate}T${a.classStartTime || "00:00"}`;
        const bKey = `${b.classDate}T${b.classStartTime || "00:00"}`;
        return aKey.localeCompare(bKey);
      });
      setParticipants(sorted);
    } catch (e) {
      console.error("Error al cargar clases:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { participants, loading, reload: load };
}