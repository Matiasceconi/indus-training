import { base44 } from "@/api/base44Client";

export async function createSessionWithParticipants(sessionData, students) {
  const session = await base44.entities.Session.create(sessionData);
  if (students.length > 0) {
    const participants = students.map((s) => ({
      sessionId: session.id,
      clientProfileId: s.id,
      studentUserId: s.created_by_id,
      studentName: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
      classDate: sessionData.date,
      classStartTime: sessionData.startTime,
      classEndTime: sessionData.endTime,
      classType: sessionData.type,
      classService: sessionData.service || "",
      classProfessor: sessionData.professor,
      classLocation: sessionData.location || "",
      classStatus: sessionData.status,
      classStudentNotes: sessionData.studentNotes || "",
      attendanceStatus: "pendiente",
    }));
    await base44.entities.SessionParticipant.bulkCreate(participants);
  }
  return session;
}

export async function updateSessionWithParticipants(sessionId, sessionData, students) {
  await base44.entities.Session.update(sessionId, sessionData);
  const existing = await base44.entities.SessionParticipant.filter({ sessionId });
  const existingMap = new Map(existing.map((p) => [p.clientProfileId, p]));
  const newStudentIds = new Set(students.map((s) => s.id));

  const toRemove = existing.filter((p) => !newStudentIds.has(p.clientProfileId));
  for (const p of toRemove) {
    await base44.entities.SessionParticipant.delete(p.id);
  }

  const toAdd = students.filter((s) => !existingMap.has(s.id));
  if (toAdd.length > 0) {
    const newParticipants = toAdd.map((s) => ({
      sessionId,
      clientProfileId: s.id,
      studentUserId: s.created_by_id,
      studentName: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
      classDate: sessionData.date,
      classStartTime: sessionData.startTime,
      classEndTime: sessionData.endTime,
      classType: sessionData.type,
      classService: sessionData.service || "",
      classProfessor: sessionData.professor,
      classLocation: sessionData.location || "",
      classStatus: sessionData.status,
      classStudentNotes: sessionData.studentNotes || "",
      attendanceStatus: "pendiente",
    }));
    await base44.entities.SessionParticipant.bulkCreate(newParticipants);
  }

  const toUpdate = existing.filter((p) => newStudentIds.has(p.clientProfileId));
  if (toUpdate.length > 0) {
    const updates = toUpdate.map((p) => ({
      id: p.id,
      classDate: sessionData.date,
      classStartTime: sessionData.startTime,
      classEndTime: sessionData.endTime,
      classType: sessionData.type,
      classService: sessionData.service || "",
      classProfessor: sessionData.professor,
      classLocation: sessionData.location || "",
      classStatus: sessionData.status,
      classStudentNotes: sessionData.studentNotes || "",
    }));
    await base44.entities.SessionParticipant.bulkUpdate(updates);
  }
}

export async function updateSessionStatus(sessionId, status) {
  await base44.entities.Session.update(sessionId, { status });
  await base44.entities.SessionParticipant.updateMany(
    { sessionId },
    { $set: { classStatus: status } }
  );
}

export async function deleteSessionWithParticipants(sessionId) {
  await base44.entities.SessionParticipant.deleteMany({ sessionId });
  await base44.entities.Session.delete(sessionId);
}

export async function addParticipant(session, student) {
  return await base44.entities.SessionParticipant.create({
    sessionId: session.id,
    clientProfileId: student.id,
    studentUserId: student.created_by_id,
    studentName: `${student.firstName || ""} ${student.lastName || ""}`.trim(),
    classDate: session.date,
    classStartTime: session.startTime,
    classEndTime: session.endTime,
    classType: session.type,
    classService: session.service || "",
    classProfessor: session.professor,
    classLocation: session.location || "",
    classStatus: session.status,
    classStudentNotes: session.studentNotes || "",
    attendanceStatus: "pendiente",
  });
}

export async function removeParticipant(participantId) {
  await base44.entities.SessionParticipant.delete(participantId);
}

export async function updateParticipantAttendance(participantId, data) {
  return await base44.entities.SessionParticipant.update(participantId, data);
}

export function checkProfessorOverlap(professor, date, startTime, endTime, sessions, excludeId) {
  return sessions.some((s) => {
    if (s.id === excludeId) return false;
    if (s.professor !== professor) return false;
    if (s.date !== date) return false;
    if (s.status === "cancelada") return false;
    return startTime < s.endTime && endTime > s.startTime;
  });
}

export function checkStudentOverlap(studentUserId, date, startTime, endTime, participants, excludeSessionId) {
  return participants.some((p) => {
    if (p.sessionId === excludeSessionId) return false;
    if (p.studentUserId !== studentUserId) return false;
    if (p.classDate !== date) return false;
    if (p.classStatus === "cancelada") return false;
    return startTime < p.classEndTime && endTime > p.classStartTime;
  });
}

export function generateWeeklyDates(startDate, endDate) {
  const dates = [];
  const start = new Date(startDate + "T00:00:00-03:00");
  const end = new Date(endDate + "T00:00:00-03:00");
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }));
    current.setDate(current.getDate() + 7);
  }
  return dates;
}