import { describe,it,expect } from 'vitest'; import { content } from './data.js'; import { validateStory } from './validator.js';
const copy=()=>structuredClone(content);
describe('story validator',()=>{
	it('xác thực domain chuẩn',()=>{const c=validateStory(content);expect(c.activities).toHaveLength(10);expect(c.events.every(event=>event.choices.length>=2)).toBe(true);expect(c.endings).toHaveLength(14);expect(c.characters.map(x=>x.name)).toEqual(['Minh','Lan','Huy','Phong','Mai','Ông Tư','Cha','Mẹ']);});
	it('chặn event canonical dưới 2 choice',()=>{const c=copy();c.events[0]!.choices.splice(1);expect(()=>validateStory(c)).toThrow('ít nhất 2 choice');});
	it('chặn choice ID trùng trong event',()=>{const c=copy();c.events[0]!.choices[1]!.id=c.events[0]!.choices[0]!.id;expect(()=>validateStory(c)).toThrow('Choice ID trùng');});
	it('chặn choice không có effect trực tiếp hoặc delayed',()=>{const c=copy();c.events[0]!.choices[0]!.effects={};c.events[0]!.choices[0]!.delayed=[];expect(()=>validateStory(c)).toThrow('Choice không có effect');});
	it('chặn deadline canonical lệch',()=>{const c=copy();c.events.find(event=>event.id==='myopia-signs')!.deadline=20;expect(()=>validateStory(c)).toThrow('Deadline canonical sai');});
	it('chặn prerequisite flag không có writer',()=>{const c=copy();c.events[0]!.prerequisite=[{field:'flags.neverWritten',op:'eq',value:true}];expect(()=>validateStory(c)).toThrow('Prerequisite flag không có writer');});
});
