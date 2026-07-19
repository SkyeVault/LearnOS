export interface EngagementNote { id:string; learnerId:string; subject:string; context:string; strength:string; support:string; nextStep:string; createdAt:string }
export interface CollaborationProject { id:string; title:string; purpose:string; learnerIds:string[]; roles:string; checkpoint:string; createdAt:string; completedAt:string|null }
export interface LmsSettings { provider:'Google Classroom'|'Canvas'; baseUrl:string; courseName:string; updatedAt:string }
const engagementKey='learning-world-os:engagement:v1', projectsKey='learning-world-os:projects:v1', lmsKey='learning-world-os:lms:v1'
const read=<T>(key:string,fallback:T):T=>{try{return JSON.parse(localStorage.getItem(key)??'null')??fallback}catch{return fallback}}
const write=(key:string,value:unknown)=>localStorage.setItem(key,JSON.stringify(value))
export const engagementFor=(learnerId:string)=>read<EngagementNote[]>(engagementKey,[]).filter(note=>note.learnerId===learnerId)
export const addEngagement=(note:Omit<EngagementNote,'id'|'createdAt'>)=>write(engagementKey,[{...note,id:crypto.randomUUID(),createdAt:new Date().toISOString()},...read<EngagementNote[]>(engagementKey,[])])
export const projects=()=>read<CollaborationProject[]>(projectsKey,[])
export const addProject=(project:Omit<CollaborationProject,'id'|'createdAt'|'completedAt'>)=>write(projectsKey,[{...project,id:crypto.randomUUID(),createdAt:new Date().toISOString(),completedAt:null},...projects()])
export const completeProject=(id:string)=>write(projectsKey,projects().map(project=>project.id===id?{...project,completedAt:new Date().toISOString()}:project))
export const lmsSettings=()=>read<LmsSettings|null>(lmsKey,null)
export const saveLmsSettings=(settings:Omit<LmsSettings,'updatedAt'>)=>write(lmsKey,{...settings,updatedAt:new Date().toISOString()})
export const removeProject=(id:string)=>write(projectsKey,projects().filter(project=>project.id!==id))
