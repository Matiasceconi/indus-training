import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'No autorizado' }, { status: 401 });

    const body = await req.json();
    const { participantId, status } = body;

    if (!participantId) return Response.json({ error: 'Falta participantId' }, { status: 400 });

    const validStatuses = ['pendiente', 'confirmado', 'cancelacion_avisada'];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Estado no válido' }, { status: 400 });
    }

    const participant = await base44.asServiceRole.entities.SessionParticipant.get(participantId);
    if (!participant) return Response.json({ error: 'Participación no encontrada' }, { status: 404 });

    if (participant.studentUserId !== user.id) {
      return Response.json({ error: 'No tenés permiso para modificar esta participación' }, { status: 403 });
    }

    if (['completada', 'cancelada'].includes(participant.classStatus)) {
      return Response.json({ error: 'La clase ya está completada o cancelada' }, { status: 400 });
    }

    const updated = await base44.asServiceRole.entities.SessionParticipant.update(participantId, {
      attendanceStatus: status
    });

    return Response.json({ success: true, participant: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}