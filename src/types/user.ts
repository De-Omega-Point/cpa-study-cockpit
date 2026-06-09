export type Discipline = "BAR" | "ISC" | "TCP";
export interface UserProfile { name:string; targetDiscipline:Discipline; targetExamDate:string; studyHoursWeekly:number; xp:number; level:number; streak:number; createdAt:string; }
