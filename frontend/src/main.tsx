import React from 'react';
import { createRoot } from 'react-dom/client';
import { content, surprisesById } from '@game/game-content';
import { dispatch, initialState, type GameState, importLegacy, resolveEnding, type Command } from '@game/game-core';
import {
  activityDialogues,
  activityDialogueVariants,
  activityScenes,
  backgrounds,
  eventDialogues,
  eventScenes,
  portraits,
  seasonBackgrounds,
  seasonFromMonth,
  seasonLabels,
  surpriseBackgrounds,
  surpriseSceneById,
  type BackgroundId,
  type DialogueBeat,
  type PortraitId,
} from './assets';
import './style.css';
import { gameAudio, type MusicMood } from './sound';

const KEY = 'bon-nam-save-0';

const STAT_LABELS: Record<string, string> = {
  health: 'Sức khỏe',
  spirit: 'Tinh thần',
  knowledge: 'Kiến thức',
  skill: 'Kỹ năng',
  morality: 'Đạo đức',
  money: 'Tiền',
  debt: 'Nợ',
};

function loadState(): GameState {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    try {
      const saved = JSON.parse(raw) as GameState;
      if (saved.month >= 48 && !saved.pendingEvent && !saved.pendingSurprise && !saved.ending) {
        saved.flags = { ...saved.flags, graduated: saved.stats.knowledge >= 35 };
        saved.ending = resolveEnding(saved, content);
        localStorage.setItem(KEY, JSON.stringify(saved));
      }
      return saved;
    } catch {
      /* fall through */
    }
  }
  const legacy = importLegacy((k) => localStorage.getItem(k))[0];
  return legacy?.save.state ?? initialState(Date.now());
}

function yearLabel(month: number) {
  return `Năm ${Math.min(4, Math.ceil(month / 12) || 1)}`;
}

function seasonLabel(month: number) {
  return seasonLabels[seasonFromMonth(month)];
}

function StageCast({ cast, spotlight }: { cast: PortraitId[]; spotlight?: PortraitId | null }) {
  const shown = cast.slice(0, 3);
  return (
    <div className={`cast ${shown.length === 1 ? 'is-solo' : 'is-group'}`} aria-hidden="true">
      {shown.map((id, index) => (
        <figure
          key={`${id}-${index}`}
          className={`portrait ${spotlight === id || (spotlight === undefined && index === 0) ? 'is-focus' : 'is-support'} pos-${index}`}
        >
          <img src={portraits[id]} alt="" />
        </figure>
      ))}
    </div>
  );
}

function StatBars({ stats }: { stats: GameState['stats'] }) {
  const keys = ['health', 'spirit', 'knowledge', 'skill', 'money'] as const;
  return (
    <ul className="hud-stats" aria-label="Chỉ số">
      {keys.map((key) => {
        const value = stats[key] ?? 0;
        const max = key === 'money' ? Math.max(100, value) : 100;
        const pct = Math.max(0, Math.min(100, (value / max) * 100));
        return (
          <li key={key}>
            <span>{STAT_LABELS[key]}</span>
            <div className="bar" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={STAT_LABELS[key]}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <strong>{value}</strong>
          </li>
        );
      })}
      {(stats.debt ?? 0) > 0 && (
        <li className="debt">
          <span>{STAT_LABELS.debt}</span>
          <strong>{stats.debt}</strong>
        </li>
      )}
    </ul>
  );
}

function App() {
  const [state, setState] = React.useState<GameState>(loadState);
  const [previewActivity, setPreviewActivity] = React.useState<string | null>(null);
  const [conversation, setConversation] = React.useState<{ activityId: string; beats: DialogueBeat[]; index: number } | null>(null);
  const [eventBeatIndex, setEventBeatIndex] = React.useState(0);
  const [leaving, setLeaving] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [soundOn, setSoundOn] = React.useState(() => localStorage.getItem('bon-nam-sound') !== 'off');
  const [transitioning, setTransitioning] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  React.useEffect(() => {
    gameAudio.setEnabled(soundOn);
  }, [soundOn]);

  React.useEffect(() => {
    const unlock = () => void gameAudio.ensureStarted();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  React.useEffect(() => {
    setEventBeatIndex(0);
  }, [state.pendingEvent]);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen((open) => !open);
      if (menuOpen || (event.key !== 'Enter' && event.key !== ' ')) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, input, textarea, select, a')) return;
      const currentEventBeats = state.pendingEvent ? eventDialogues[state.pendingEvent] ?? [] : [];
      if (currentEventBeats.length > 0 && eventBeatIndex < currentEventBeats.length - 1) {
        event.preventDefault();
        setEventBeatIndex((index) => index + 1);
      } else if (conversation) {
        event.preventDefault();
        setConversation((current) => {
          if (!current) return null;
          return current.index < current.beats.length - 1 ? { ...current, index: current.index + 1 } : null;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [conversation, eventBeatIndex, menuOpen, state.pendingEvent]);

  const restart = () => {
    const next = initialState(Date.now());
    localStorage.setItem(KEY, JSON.stringify(next));
    setPreviewActivity(null);
    setConversation(null);
    setLeaving(false);
    setState(next);
  };

  const act = (command: Command) => {
    const monthChange = command.type === 'ADVANCE_MONTH';
    gameAudio.play(
      monthChange
        ? 'advance'
        : command.type === 'CHOOSE_SURPRISE_OPTION'
          ? 'surprise'
          : command.type === 'CONFIRM_STOP_JOURNEY'
            ? 'ending'
            : 'choice',
    );
    if (monthChange) setTransitioning(true);
    setState((s) => {
      const next = dispatch(s, command, content);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
    setPreviewActivity(null);
    if (monthChange) {
      window.setTimeout(() => setTransitioning(false), 650);
      setToast('Tháng mới bắt đầu');
    } else if (command.type === 'SELECT_ACTIVITY') {
      setToast('Đã cập nhật chỉ số');
    }
  };

  const event = content.events.find((e) => e.id === state.pendingEvent);
  const surprise = state.pendingSurprise ? surprisesById[state.pendingSurprise] : undefined;
  const ending = content.endings.find((e) => e.id === state.ending);
  const eventBeats = event ? eventDialogues[event.id] ?? [] : [];
  const eventBeat = eventBeats[eventBeatIndex];
  const eventIntroComplete = !event || eventBeats.length === 0 || eventBeatIndex >= eventBeats.length - 1;
  const activeActivity = conversation?.activityId ?? previewActivity;
  const activeBeat = conversation?.beats[conversation.index];

  let bg: BackgroundId = seasonBackgrounds[seasonFromMonth(state.month)];
  let cast: PortraitId[] = ['minh'];
  let speaker = 'Minh';
  const season = seasonFromMonth(state.month);
  const apLeft = state.actionPoints;
  let line =
    apLeft <= 0
      ? 'Mùa này Minh đã dùng hết lựa chọn. Có thể sang mùa tiếp theo.'
      : apLeft === 1
        ? 'Còn một lựa chọn trong mùa này. Minh sẽ dùng nó thế nào?'
        : `Minh còn ${apLeft} lựa chọn để viết tiếp câu chuyện của mình.`;
  let title = `${yearLabel(state.month)} · ${seasonLabel(state.month)}`;

  if (ending) {
    bg = ending.group === 'happy' ? 'seasonReunion' : ending.group === 'bad' ? 'dorm' : 'classroom';
    cast = ['minh'];
    speaker = 'Kết thúc';
    line = ending.name;
    title = 'Hành trình khép lại';
  } else if (surprise) {
    bg = surpriseSceneById[surprise.id] ?? surpriseBackgrounds[surprise.category] ?? 'campus';
    cast = surprise.category === 'relationship' ? ['minh', 'lan', 'huy'] : surprise.category === 'work' ? ['minh', 'phong'] : ['minh'];
    speaker = 'Tình huống bất ngờ';
    line = 'Một chuyện không nằm trong kế hoạch đã xảy ra.';
    title = surprise.title;
  } else if (event) {
    const scene = eventScenes[event.id] ?? { bg: 'campus' as const, cast: ['minh'] as PortraitId[], line: event.title };
    bg = scene.bg;
    cast = scene.cast;
    const eventSpeaker = eventBeat?.speaker;
    speaker = eventSpeaker === 'narrator' || !eventSpeaker
      ? '…'
      : content.characters.find((c) => c.id === eventSpeaker)?.name ?? 'Minh';
    line = eventBeat?.line ?? scene.line;
    if (event.warning && eventBeatIndex === 0) line = `${event.warning}\n\n${line}`;
    title = event.title;
  } else if (activeActivity && activityScenes[activeActivity]) {
    const scene = activityScenes[activeActivity]!;
    cast = scene.cast;
    const speakerId = activeBeat?.speaker ?? cast[0];
    speaker =
      content.characters.find((c) => c.id === speakerId)?.name ??
      (speakerId === 'ong-tu' ? 'Ông Tư' : 'Minh');
    line = activeBeat?.line ?? scene.vibe;
    title = content.activities.find((a) => a.id === activeActivity)?.name ?? title;
  }

  const canAct = state.actionPoints > 0 && state.month < 48 && !state.ending && !surprise;
  const canAdvance = state.actionPoints === 0 && state.month < 48 && !state.ending && !event && !surprise;

  React.useEffect(() => {
    const mood: MusicMood = ending
      ? 'ending'
      : surprise
        ? 'surprise'
        : bg === 'classroom'
          ? 'classroom'
          : bg === 'campus' || bg === 'seasonGrowth' || bg === 'seasonChallenge'
            ? 'campus'
            : 'dorm';
    gameAudio.setMood(mood);
    if (ending) gameAudio.play('ending');
  }, [bg, ending, surprise]);

  return (
    <div className={`game season-${season} ${leaving ? 'is-leaving' : ''} ${transitioning ? 'is-transitioning' : ''} ${surprise ? 'has-surprise' : ''}`}>
      <div className="stage" style={{ backgroundImage: `url(${backgrounds[bg]})` }}>
        <div className="stage-veil" />
        <div className="scene-depth scene-depth-back" aria-hidden="true" />
        <div className="scene-depth scene-depth-front" aria-hidden="true" />
        <div className="light-orbs" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
        </div>
        <div className={`weather weather-${season}`} aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span />
        </div>
        {surprise && <div className="surprise-flash" aria-hidden="true" />}
        {activeActivity && !event && !surprise && (
          <div className={`activity-visual activity-visual-${activeActivity}`} aria-hidden="true">
            <span className="activity-visual-card" style={{ backgroundImage: `url(${backgrounds[activityScenes[activeActivity]!.bg]})` }} />
            <span className="activity-visual-ring" />
          </div>
        )}
        <header className="hud">
          <div className="brand-block">
            <p className="brand">Bốn Năm Thanh Xuân</p>
            <p className="chapter">{title}</p>
          </div>
          <div className="ap" aria-live="polite">
            <span>Lựa chọn mùa</span>
            <strong>{state.actionPoints}</strong>
          </div>
          <button type="button" className="menu-button" onClick={() => { gameAudio.play('click'); setMenuOpen(true); }} aria-label="Mở menu game">
            ☰
          </button>
        </header>

        <StageCast
          cast={cast}
          spotlight={event ? (eventBeat?.speaker === 'narrator' ? null : eventBeat?.speaker) : (activeBeat?.speaker ?? cast[0])}
        />

        <StatBars stats={state.stats} />

        <div className="season-timeline" aria-label={`Tiến độ ${yearLabel(state.month)}, ${seasonLabel(state.month)}`}>
          <span>{yearLabel(state.month)}</span>
          <div>{[1, 2, 3, 4].map((quarter) => <i key={quarter} className={quarter <= Math.floor(((state.month - 1) % 12) / 3) + 1 ? 'is-past' : ''} />)}</div>
          <strong>{seasonLabel(state.month)}</strong>
        </div>

        <section className="dialogue" aria-live="polite">
          <div className="dialogue-sheet">
            <p className="speaker">{speaker}</p>
            <p className="line" style={{ whiteSpace: 'pre-wrap' }}>{line}</p>

            {surprise && !state.ending && (
              <div className="surprise-panel">
                <div className="surprise-label">Bất ngờ · {surprise.category}</div>
                <h3>{surprise.title}</h3>
                <div className="choices surprise-choices" role="group" aria-label="Lựa chọn tình huống bất ngờ">
                  {surprise.choices.map((choice) => (
                    <button key={choice.id} type="button" className="choice" onClick={() => act({ type: 'CHOOSE_SURPRISE_OPTION', surpriseId: surprise.id, choiceId: choice.id })}>
                      <span>{choice.label}</span>
                      <small>{choice.effectSummary}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {event && !surprise && !state.ending && !eventIntroComplete && (
              <div className="conversation-actions event-progress">
                <span>{eventBeatIndex + 1} / {eventBeats.length}</span>
                <button type="button" className="advance" onClick={() => setEventBeatIndex((index) => index + 1)}>
                  Tiếp tục
                </button>
              </div>
            )}

            {event && !surprise && !state.ending && eventIntroComplete && (
              <div className="choices" role="group" aria-label="Lựa chọn sự kiện">
                {event.choices.map((c) => (
                  <button key={c.id} type="button" className="choice" onClick={() => act({ type: 'CHOOSE_EVENT_OPTION', eventId: event.id, choiceId: c.id })}>
                    <span>{c.label}</span>
                    <small>{c.effectSummary}</small>
                  </button>
                ))}
              </div>
            )}

            {!event && !surprise && !state.ending && conversation && (
              <div className="conversation-actions">
                <span>{conversation.index + 1} / {conversation.beats.length}</span>
                <button
                  type="button"
                  className="advance"
                  onClick={() => {
                    if (conversation.index < conversation.beats.length - 1) {
                      setConversation({ ...conversation, index: conversation.index + 1 });
                    } else {
                      setConversation(null);
                      setPreviewActivity(null);
                    }
                  }}
                >
                  {conversation.index < conversation.beats.length - 1 ? 'Tiếp tục' : 'Trở lại lựa chọn'}
                </button>
              </div>
            )}

            {!event && !surprise && !state.ending && !conversation && (
              <>
                <div className="activity-rail" role="list" aria-label="Chọn hoạt động">
                  {content.activities.map((a) => {
                    const scene = activityScenes[a.id];
                    const disabled = !canAct;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        role="listitem"
                        data-id={a.id}
                        className={`activity-chip ${previewActivity === a.id ? 'is-active' : ''}`}
                        disabled={disabled}
                        onMouseEnter={() => !disabled && setPreviewActivity(a.id)}
                        onFocus={() => !disabled && setPreviewActivity(a.id)}
                        onClick={() => {
                          act({ type: 'SELECT_ACTIVITY', activityId: a.id });
                          const variants = activityDialogueVariants[a.id];
                          const previousCount = state.history.filter((entry) => entry.includes(`:activity:${a.id}`)).length;
                          const beats = variants?.[(previousCount + Math.floor((state.month - 1) / 12)) % variants.length] ?? activityDialogues[a.id];
                          if (beats?.length) setConversation({ activityId: a.id, beats, index: 0 });
                        }}
                      >
                        <span className="activity-thumb" style={scene ? { backgroundImage: `url(${backgrounds[scene.bg]})` } : undefined}>
                          <span className="activity-mark" aria-hidden="true" />
                        </span>
                        <span className="activity-copy">
                          <strong>{a.name}</strong>
                          <small>{a.description}</small>
                        </span>
                        {scene?.cast[1] && (
                          <img className="activity-buddy" src={portraits[scene.cast[1]!]} alt="" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="dialogue-actions">
                  <button type="button" className="advance" disabled={!canAdvance} onClick={() => act({ type: 'ADVANCE_MONTH' })}>
                    Sang mùa tiếp theo
                  </button>
                  <button
                    type="button"
                    className="ghost"
                    onClick={() => {
                      if (confirm('Dừng toàn bộ hành trình?')) {
                        setLeaving(true);
                        act({ type: 'CONFIRM_STOP_JOURNEY' });
                      }
                    }}
                  >
                    Dừng hành trình
                  </button>
                </div>
              </>
            )}

            {state.ending && (
              <div className="ending-actions">
                <p className="ending-note" aria-live="polite">
                  {ending?.group === 'happy' ? 'Một kết thúc ấm.' : ending?.group === 'bad' ? 'Một kết thúc nặng.' : 'Một kết thúc mở.'}
                </p>
                <button type="button" className="advance" onClick={restart}>
                  Bắt đầu hành trình mới
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      {toast && <div className="game-toast" role="status">{toast}</div>}
      <div className="month-transition" aria-hidden="true"><span>{yearLabel(state.month)}</span><strong>{seasonLabel(state.month)}</strong></div>
      {menuOpen && (
        <div className="game-menu-backdrop" role="presentation" onMouseDown={() => setMenuOpen(false)}>
          <section className="game-menu" role="dialog" aria-modal="true" aria-labelledby="game-menu-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="menu-heading">
              <div><small>Tạm dừng</small><h2 id="game-menu-title">Bốn Năm Thanh Xuân</h2></div>
              <button type="button" className="menu-close" onClick={() => { gameAudio.play('click'); setMenuOpen(false); }} aria-label="Đóng menu">×</button>
            </div>
            <div className="save-summary">
              <strong>{yearLabel(state.month)} · {seasonLabel(state.month)}</strong>
              <span>{state.actionPoints} lựa chọn còn lại · Tiến độ {Math.round((state.month / 48) * 100)}%</span>
              <i><b style={{ width: `${(state.month / 48) * 100}%` }} /></i>
            </div>
            <div className="menu-options">
              <button type="button" onClick={() => { gameAudio.play('click'); setMenuOpen(false); }}>Tiếp tục chơi</button>
              <button type="button" onClick={() => { const next = !soundOn; setSoundOn(next); localStorage.setItem('bon-nam-sound', next ? 'on' : 'off'); if (next) window.setTimeout(() => gameAudio.play('choice'), 50); }}>Âm thanh <span>{soundOn ? 'Bật' : 'Tắt'}</span></button>
              <button type="button" onClick={() => { localStorage.setItem(KEY, JSON.stringify(state)); setToast('Đã lưu hành trình'); setMenuOpen(false); }}>Lưu hành trình</button>
              <button type="button" className="danger" onClick={() => { if (confirm('Xóa hành trình hiện tại và chơi lại từ đầu?')) { restart(); setMenuOpen(false); } }}>Chơi lại từ đầu</button>
            </div>
            <p className="menu-hint">ESC mở menu · Enter tiếp tục hội thoại</p>
          </section>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
