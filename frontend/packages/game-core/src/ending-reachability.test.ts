import {describe,expect,it} from 'vitest';
import {content} from '@game/game-content';
import {dispatch,initialState} from './index.js';
import type {GameState} from './types.js';

const choose=(state:GameState,eventId:string,choiceId:string,month=47)=>dispatch({...state,month,pendingEvent:eventId},{type:'CHOOSE_EVENT_OPTION',eventId,choiceId},content);
const repeat=(state:GameState,eventId:string,choiceId:string,times:number)=>{let next=state;for(let index=0;index<times;index++)next=choose(next,eventId,choiceId);return next;};
const finish=(state:GameState,choiceId='attend')=>choose(state,'graduation',choiceId,48);

const witnesses:Record<string,()=>GameState>={
  stop_midway:()=>dispatch(initialState(1),{type:'CONFIRM_STOP_JOURNEY'},content),
  room_without_light:()=>finish(repeat(initialState(2),'family-conflict','take-blame',9),'work'),
  debt_spiral:()=>finish(choose(initialState(3),'final-debt','new-loan')),
  body_speaks:()=>finish(repeat(initialState(4),'job-offer','high-pressure',2)),
  crossing_the_line:()=>finish(choose(initialState(5),'job-offer','illegal-shortcut')),
  cannot_graduate:()=>finish(choose(initialState(6),'graduation-exam','skip')),
  alone_in_the_city:()=>{let s=repeat(initialState(7),'friend-in-need','refuse',3);s=repeat(s,'phong-crisis','withdraw',2);s=repeat(s,'family-conflict','cut-contact',2);s=repeat(s,'graduation','work',2);return finish(s,'work');},
  life_changing_jackpot:()=>finish(choose(initialState(8),'first-lottery','save-jackpot')),
  four_years_well_spent:()=>{let s=repeat(initialState(9),'graduation-exam','study-plan',2);s=repeat(s,'internship','part-time',4);s=repeat(s,'friend-in-need','find-work',3);s=repeat(s,'first-test','prepare',4);s=repeat(s,'job-offer','healthy-job',3);s=repeat(s,'graduation','attend',4);return finish(s);},
  success_from_hospital_bed:()=>{let s=repeat(initialState(10),'graduation-exam','study-plan',2);s=choose(s,'internship','accept');s=choose(s,'job-offer','high-pressure');return finish(s);},
  lucky_player:()=>finish(choose(initialState(11),'first-lottery','cash-out')),
  freelancer:()=>finish(choose(initialState(12),'final-year-direction','freelance')),
  return_home:()=>finish(choose(initialState(13),'final-year-direction','home-plan')),
  university_degree:()=>finish(choose(initialState(14),'graduation-exam','study-plan')),
};

describe('ending reachability bằng command-driven focused witnesses',()=>{
  it.each(content.endings)('$id reachable qua choice effects và engine command',ending=>expect(witnesses[ending.id]!().ending).toBe(ending.id));
});