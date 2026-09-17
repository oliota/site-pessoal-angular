export interface Link { label:string; url:string; icon:string }
export interface Profile { name:string; headline:string; location:string; intro:string; about:string[]; availability:string; links:Link[] }
export interface Experience { company:string; role:string; period:string; location:string; summary:string; technologies:string[] }
export type ProjectLinkType='route'|'external';
export type ProjectLinkTarget='same'|'new';
export interface ProjectLink { label:string; url:string; type:ProjectLinkType; target:ProjectLinkTarget }
export interface Project { name:string; description:string; technologies:string[]; status:string; link?:ProjectLink }
export interface Teaching { title:string; organization:string; period:string; topics:string[] }
export interface SkillGroup { name:string; items:string[] }
