import {describe,expect,it} from 'vitest';
import {content} from '@game/game-content';
import {dispatch,initialState} from './index.js';
import type {GameState} from './types.js';

const choose=(state:GameState,eventId:string,choiceId:string,month=47)=>dispatch({...state,month,pendingEvent:eventId},{type:'CHOOSE_EVENT_OPTION',eventId,choiceId},content);
const surprise=(state:GameState,surpriseId:string,choiceId:string)=>dispatch({...state,pendingSurprise:surpriseId},{type:'CHOOSE_SURPRISE_OPTION',surpriseId,choiceId},content);
const repeat=(state:GameState,eventId:string,choiceId:string,times:number)=>{let next=state;for(let index=0;index<times;index++)next=choose(next,eventId,choiceId);return next;};
const passExam=(state:GameState)=>choose(state,'graduation-exam','study-plan');
const finish=(state:GameState,choiceId='attend')=>choose(state,'graduation',choiceId,48);

const witnesses:Record<string,()=>GameState>={
  stop_midway:()=>dispatch(initialState(1),{type:'CONFIRM_STOP_JOURNEY'},content),
  room_without_light:()=>finish(repeat(initialState(2),'family-conflict','take-blame',9),'work'),
  debt_spiral:()=>finish(choose(initialState(3),'final-debt','new-loan')),
  body_speaks:()=>finish(repeat(initialState(4),'job-offer','high-pressure',2)),
  crossing_the_line:()=>finish(choose(initialState(5),'job-offer','illegal-shortcut')),
  cannot_graduate:()=>finish(choose(initialState(6),'graduation-exam','skip')),
  alone_in_the_city:()=>{let s=passExam(initialState(7));s=repeat(s,'friend-in-need','refuse',2);s=surprise(s,'lost-group-file','blame-lan');s=choose(s,'phong-crisis','withdraw');s=choose(s,'family-conflict','cut-contact');s=choose(s,'last-tet','city');return finish(s,'work');},
  life_changing_jackpot:()=>{let s=choose(initialState(8),'first-lottery','buy-one',20);s=surprise(s,'lottery-jackpot','make-plan');s=passExam(s);return finish(s);},
  four_years_well_spent:()=>{let s=repeat(initialState(9),'first-test','prepare',3);s=repeat(s,'internship','part-time',4);s=repeat(s,'friend-in-need','find-work',3);s=repeat(s,'family-conflict','mediate',2);s=repeat(s,'job-offer','healthy-job',2);s=passExam(s);return finish(s);},
  success_from_hospital_bed:()=>{let s=repeat(initialState(10),'graduation-exam','study-plan',2);s=choose(s,'internship','accept');s=choose(s,'job-offer','high-pressure');return finish(s);},
  lucky_player:()=>{let s=choose(initialState(11),'first-lottery','buy-one',20);s=surprise(s,'small-lottery-win','pay-debt');s=passExam(s);return finish(s);},
  freelancer:()=>{let s=choose(initialState(12),'final-year-direction','freelance',39);s=repeat(s,'internship','part-time',3);s=passExam(s);return finish(s);},
  return_home:()=>{let s=choose(initialState(13),'final-year-direction','home-plan',39);s=repeat(s,'family-conflict','mediate',4);s=passExam(s);return finish(s);},
  university_degree:()=>finish(choose(initialState(14),'graduation-exam','study-plan')),
};

describe('ending reachability bằng command-driven focused witnesses',()=>{
  it.each(content.endings)('$id reachable qua choice effects và engine command',ending=>expect(witnesses[ending.id]!().ending).toBe(ending.id));
});