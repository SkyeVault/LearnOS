export type ThemeId='classic'|'sports'|'unicorn'|'rose'|'dark'|'custom'
const key='learning-world-os:themes:v2',cssKey='learning-world-os:theme-css:v1';export const themes=[['classic','Classic Learning World'],['sports','Red Sports'],['unicorn','Unicorn Sky'],['rose','Pink Studio'],['dark','Dark Desk']] as const
const homeKey='learning-world-os:home-preferences:v1'
const read=():Record<string,ThemeId>=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}}
export const getTheme=(scope='parent')=>read()[scope]||'classic'
export const applyTheme=(scope='parent')=>{const id=getTheme(scope);document.documentElement.dataset.learnosTheme=id;let style=document.getElementById('learnos-custom-theme') as HTMLStyleElement|null;if(!style){style=document.createElement('style');style.id='learnos-custom-theme';document.head.append(style)}style.textContent=id==='custom'?localStorage.getItem(cssKey)||'':''}
export const setTheme=(scope:string,id:ThemeId)=>{const all=read();all[scope]=id;localStorage.setItem(key,JSON.stringify(all));applyTheme(scope)}
export type HomeStyle='classic'|'quiet'
const readHomes=():Record<string,HomeStyle>=>{try{return JSON.parse(localStorage.getItem(homeKey)||'{}')}catch{return{}}}
export const getHomeStyle=(scope:string)=>readHomes()[scope]||'classic'
export const setHomeStyle=(scope:string,style:HomeStyle)=>{const homes=readHomes();homes[scope]=style;localStorage.setItem(homeKey,JSON.stringify(homes))}
export const customCss=()=>localStorage.getItem(cssKey)||'';export const setCustomCss=(scope:string,css:string)=>{localStorage.setItem(cssKey,css);setTheme(scope,'custom')}
