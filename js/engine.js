/* ============================================
   Visual Novel Engine
   Save slots, gender selection, settings,
   dialogue with typing, choices, profile
   ============================================ */

class VNEngine {
  constructor() {
    this.stats = new StatsManager();
    this.endings = new EndingManager(this.stats);
    this.currentNode = null;
    this.currentSlot = null; // 0-3
    this.gender = 'male'; // 'male' or 'female'
    this.playerName = 'Minh'; // custom player name
    this.typingTimer = null;
    this.isTyping = false;
    this.fullText = '';
    this.charIndex = 0;
    this.slotMode = 'new'; // 'new' or 'continue'
    this.time = { year: 1, semester: 1, month: 1 };
    this.debt = 0;

    // Settings
    this.settings = {
      volBgm: 70,
      volSfx: 80,
      graphics: 'medium',
      fontSize: 'medium',
    };

    this.init();
  }

  init() {
    this.el = {
      titleScreen: document.getElementById('title-screen'),
      gameScreen: document.getElementById('game-screen'),
      endingScreen: document.getElementById('ending-screen'),
      // Title buttons
      btnNew: document.getElementById('btn-new-game'),
      btnContinue: document.getElementById('btn-continue'),
      btnSettings: document.getElementById('btn-settings'),
      // Slot modal
      slotModal: document.getElementById('slot-modal'),
      slotModalTitle: document.getElementById('slot-modal-title'),
      slotList: document.getElementById('slot-list'),
      btnSlotBack: document.getElementById('btn-slot-back'),
      // Gender modal
      genderModal: document.getElementById('gender-modal'),
      btnGenderMale: document.getElementById('btn-gender-male'),
      btnGenderFemale: document.getElementById('btn-gender-female'),
      playerNameInput: document.getElementById('player-name-input'),
      btnGenderConfirm: document.getElementById('btn-gender-confirm'),
      previewMale: document.getElementById('preview-male'),
      previewFemale: document.getElementById('preview-female'),
      btnGenderBack: document.getElementById('btn-gender-back'),
      // Settings modal
      settingsModal: document.getElementById('settings-modal'),
      volBgm: document.getElementById('vol-bgm'),
      volBgmVal: document.getElementById('vol-bgm-val'),
      volSfx: document.getElementById('vol-sfx'),
      volSfxVal: document.getElementById('vol-sfx-val'),
      optGraphics: document.getElementById('opt-graphics'),
      optFontsize: document.getElementById('opt-fontsize'),
      btnSettingsClose: document.getElementById('btn-settings-close'),
      // Game
      bgImage: document.getElementById('bg-image'),
      charSprite: document.getElementById('char-sprite'),
      dialogueBox: document.getElementById('dialogue-box'),
      speakerName: document.getElementById('speaker-name'),
      dialogueText: document.getElementById('dialogue-text'),
      choicesContainer: document.getElementById('choices-container'),
      continueIndicator: document.getElementById('continue-indicator'),
      chapterOverlay: document.getElementById('chapter-overlay'),
      chapterTitle: document.getElementById('chapter-title-text'),
      btnProfile: document.getElementById('btn-profile'),
      btnMenu: document.getElementById('btn-menu'),
      // Profile
      profileModal: document.getElementById('profile-modal'),
      profileStats: document.getElementById('profile-stats'),
      btnCloseProfile: document.getElementById('btn-close-profile'),
      // Menu
      menuOverlay: document.getElementById('menu-overlay'),
      btnMenuResume: document.getElementById('btn-menu-resume'),
      btnMenuSave: document.getElementById('btn-menu-save'),
      btnMenuSettings: document.getElementById('btn-menu-settings'),
      btnMenuTitle: document.getElementById('btn-menu-title'),
      btnMenuSkip: document.getElementById('btn-menu-skip'),
      // Ending
      endingTitle: document.getElementById('ending-title'),
      endingStory: document.getElementById('ending-story'),
      endingFinalStats: document.getElementById('ending-final-stats'),
      btnRestart: document.getElementById('btn-restart'),
      // Notification
      notification: document.getElementById('notification'),
    };

    this.bgFallbacks = {
      university_gate: 'linear-gradient(135deg, #1a0835 0%, #2d1b69 30%, #1e3a5f 60%, #0f2847 100%)',
      dorm_room: 'linear-gradient(135deg, #2d1f0e 0%, #4a3520 40%, #3d2914 70%, #1a1008 100%)',
      lecture_hall: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)',
      canteen: 'linear-gradient(135deg, #3d2e1a 0%, #5c4033 40%, #6b4226 60%, #2e1f0f 100%)',
      campus: 'linear-gradient(135deg, #0d2818 0%, #1a4d2e 30%, #2e7d4f 60%, #0d1f14 100%)',
    };
    this.bgImages = {
      university_gate: 'assets/images/bg_university_gate.svg',
      dorm_room: 'assets/images/bg_dorm_room.svg',
      lecture_hall: 'assets/images/bg_lecture_hall.svg',
      canteen: 'assets/images/bg_canteen.svg',
      campus: 'assets/images/bg_campus.svg',
    };
    this.charFiles = {
      player_male: {
        default: 'assets/images/nam_bth.png',
        binh_thuong: 'assets/images/nam_bth.png',
        vui: 'assets/images/nam_vui.png',
        buon: 'assets/images/nam_buon.png',
        suy_ngam: 'assets/images/nam_nghi.png',
      },
      player_female: {
        default: 'assets/images/nu_bth.png',
        binh_thuong: 'assets/images/nu_bth.png',
        vui: 'assets/images/nu_vui.png',
        buon: 'assets/images/nu_buon.png',
        suy_ngam: 'assets/images/nu_nghi.png',
      },
      duc: {
        default: 'assets/images/char_duc.svg',
      },
      lan: {
        default: 'assets/images/char_lan.svg',
      },
      thay_hung: {
        default: 'assets/images/char_thay_hung.svg',
      },
    };

    this.loadSettings();
    this.applySettings();
    this.renderGenderPreviews();
    this.bindEvents();
    this.checkSave();
  }

  // ========== EVENT BINDING ==========
  bindEvents() {
    // Title
    this.el.btnNew.addEventListener('click', () => { this.slotMode = 'new'; this.showSlotModal(); });
    this.el.btnContinue.addEventListener('click', () => { this.slotMode = 'continue'; this.showSlotModal(); });
    this.el.btnSettings.addEventListener('click', () => this.openModal('settingsModal'));
    this.el.btnRestart.addEventListener('click', () => this.showScreen('title'));
    // Slot modal
    this.el.btnSlotBack.addEventListener('click', () => this.closeModal('slotModal'));
    // Gender modal
    this.el.btnGenderMale.addEventListener('click', () => this.selectGender('male'));
    this.el.btnGenderFemale.addEventListener('click', () => this.selectGender('female'));
    if (this.el.btnGenderConfirm) {
      this.el.btnGenderConfirm.addEventListener('click', () => this.confirmCharacterSelect());
    }
    if (this.el.playerNameInput) {
      this.el.playerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.confirmCharacterSelect();
        }
      });
    }
    this.el.btnGenderBack.addEventListener('click', () => { this.closeModal('genderModal'); this.openModal('slotModal'); this.renderSlots(); });
    // Settings
    this.el.volBgm.addEventListener('input', () => { this.settings.volBgm = +this.el.volBgm.value; this.el.volBgmVal.textContent = this.settings.volBgm + '%'; });
    this.el.volSfx.addEventListener('input', () => { this.settings.volSfx = +this.el.volSfx.value; this.el.volSfxVal.textContent = this.settings.volSfx + '%'; });
    this.el.optGraphics.addEventListener('click', (e) => this.handleOptClick(e, 'graphics'));
    this.el.optFontsize.addEventListener('click', (e) => this.handleOptClick(e, 'fontSize'));
    this.el.btnSettingsClose.addEventListener('click', () => { this.saveSettings(); this.applySettings(); this.closeModal('settingsModal'); });
    // Game — click anywhere
    this.el.gameScreen.addEventListener('click', (e) => {
      if (e.target.closest('.top-btn, .choice-btn, .choices-container.active')) return;
      this.onDialogueClick();
    });
    this.el.btnProfile.addEventListener('click', () => this.toggleProfile());
    this.el.btnCloseProfile.addEventListener('click', () => this.toggleProfile());
    this.el.btnMenu.addEventListener('click', () => this.toggleMenu());
    this.el.btnMenuResume.addEventListener('click', () => this.toggleMenu());
    this.el.btnMenuSave.addEventListener('click', () => { this.saveGame(); this.toggleMenu(); this.showNotif('💾 Đã lưu!'); });
    this.el.btnMenuSettings.addEventListener('click', () => { this.toggleMenu(); this.openModal('settingsModal'); });
    this.el.btnMenuTitle.addEventListener('click', () => { this.toggleMenu(); this.showScreen('title'); });
    this.el.btnMenuSkip.addEventListener('click', () => {
      this.stats.flags.skipChosen = true;
      this.toggleMenu();
      const bad = this.endings.checkBadEnding();
      if (bad) this.showEnding(bad);
    });
    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.onDialogueClick(); }
      if (e.key === 'Escape') {
        // Close topmost modal
        for (const id of ['settingsModal', 'genderModal', 'slotModal', 'profileModal', 'menuOverlay']) {
          if (this.el[id] && this.el[id].classList.contains('active')) { this.closeModal(id); return; }
        }
        if (this.el.gameScreen.classList.contains('active')) this.toggleMenu();
      }
    });
  }

  handleOptClick(e, key) {
    const btn = e.target.closest('.opt-btn');
    if (!btn) return;
    const parent = btn.parentElement;
    parent.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.settings[key] = btn.dataset.val;
  }

  // ========== MODALS ==========
  openModal(id) { this.el[id].classList.add('active'); }
  closeModal(id) { this.el[id].classList.remove('active'); }

  // ========== SCREENS ==========
  showScreen(name) {
    this.el.titleScreen.classList.toggle('active', name === 'title');
    this.el.gameScreen.classList.toggle('active', name === 'game');
    this.el.endingScreen.classList.toggle('active', name === 'ending');
    if (name === 'title') this.checkSave();
  }

  // ========== SAVE SLOTS ==========
  showSlotModal() {
    this.el.slotModalTitle.textContent = this.slotMode === 'new' ? '🎮 Chọn Ô Lưu (Mới)' : '▶ Chọn Ô Lưu (Tiếp Tục)';
    this.renderSlots();
    this.openModal('slotModal');
  }

  renderSlots() {
    const html = [];
    for (let i = 0; i < 4; i++) {
      const data = this.getSlotData(i);
      if (data) {
        const d = new Date(data.ts);
        const dateStr = d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const genderIcon = data.gender === 'female' ? '👩' : '🧑';
        const chapterStr = data.chapter ? `Chương ${data.chapter}` : 'Đang chơi';
        const charName = data.playerName || (data.gender === 'female' ? 'Mai' : 'Minh');
        html.push(`<div class="slot-card" data-slot="${i}">
          <div class="slot-icon">${genderIcon}</div>
          <div class="slot-info">
            <div class="slot-title">Ô ${i + 1} — ${charName}</div>
            <div class="slot-detail">${chapterStr} · ${dateStr}</div>
          </div>
          <div class="slot-actions">
            <button class="slot-del" data-del="${i}" title="Xóa">🗑️</button>
          </div>
        </div>`);
      } else {
        html.push(`<div class="slot-card" data-slot="${i}">
          <div class="slot-icon">📂</div>
          <div class="slot-info">
            <div class="slot-title">Ô ${i + 1} — Trống</div>
            <div class="slot-detail">Chưa có dữ liệu</div>
          </div>
        </div>`);
      }
    }
    this.el.slotList.innerHTML = html.join('');
    // Bind clicks
    this.el.slotList.querySelectorAll('.slot-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.slot-del')) return;
        this.onSlotClick(+card.dataset.slot);
      });
    });
    this.el.slotList.querySelectorAll('.slot-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteSlot(+btn.dataset.del);
      });
    });
  }

  onSlotClick(slotIdx) {
    const data = this.getSlotData(slotIdx);
    this.currentSlot = slotIdx;
    if (this.slotMode === 'continue' && data) {
      // Load existing save
      this.closeModal('slotModal');
      this.loadGame(slotIdx);
    } else if (this.slotMode === 'new') {
      // Start new — show gender select
      this.closeModal('slotModal');
      this.openGenderModal();
    } else {
      // Continue mode but empty slot
      this.showNotif('⚠️ Ô này trống!');
    }
  }

  deleteSlot(idx) {
    localStorage.removeItem(`vn_slot_${idx}`);
    this.renderSlots();
    this.checkSave();
    this.showNotif('🗑️ Đã xóa!');
  }

  getSlotData(idx) {
    const raw = localStorage.getItem(`vn_slot_${idx}`);
    return raw ? JSON.parse(raw) : null;
  }

  // ========== GENDER & NAME SELECT ==========
  renderGenderPreviews() {
    this.el.previewMale.innerHTML = this.makeCharSVG('male_preview');
    this.el.previewFemale.innerHTML = this.makeCharSVG('female_preview');
  }

  openGenderModal() {
    this.gender = 'male';
    this.updateGenderCardsUI();
    if (this.el.playerNameInput) {
      this.el.playerNameInput.value = '';
      this.el.playerNameInput.placeholder = 'Minh';
    }
    this.openModal('genderModal');
  }

  selectGender(g) {
    this.gender = g;
    this.updateGenderCardsUI();
    if (this.el.playerNameInput && !this.el.playerNameInput.value.trim()) {
      this.el.playerNameInput.placeholder = g === 'female' ? 'Mai' : 'Minh';
    }
  }

  updateGenderCardsUI() {
    if (this.el.btnGenderMale) {
      this.el.btnGenderMale.classList.toggle('selected', this.gender === 'male');
    }
    if (this.el.btnGenderFemale) {
      this.el.btnGenderFemale.classList.toggle('selected', this.gender === 'female');
    }
  }

  confirmCharacterSelect() {
    let customName = this.el.playerNameInput ? this.el.playerNameInput.value.trim() : '';
    if (!customName) {
      customName = this.gender === 'female' ? 'Mai' : 'Minh';
    }
    this.playerName = customName;
    this.closeModal('genderModal');
    this.startNewGame();
  }

  // ========== SETTINGS ==========
  loadSettings() {
    const raw = localStorage.getItem('vn_settings');
    if (raw) Object.assign(this.settings, JSON.parse(raw));
  }
  saveSettings() {
    localStorage.setItem('vn_settings', JSON.stringify(this.settings));
  }
  applySettings() {
    // Font size
    document.body.className = document.body.className.replace(/fs-\w+/g, '').trim();
    document.body.classList.add(`fs-${this.settings.fontSize}`);
    // Graphics
    document.body.className = document.body.className.replace(/gfx-\w+/g, '').trim();
    document.body.classList.add(`gfx-${this.settings.graphics}`);
    // Sync sliders & buttons
    if (this.el.volBgm) { this.el.volBgm.value = this.settings.volBgm; this.el.volBgmVal.textContent = this.settings.volBgm + '%'; }
    if (this.el.volSfx) { this.el.volSfx.value = this.settings.volSfx; this.el.volSfxVal.textContent = this.settings.volSfx + '%'; }
    this.syncOptButtons('optGraphics', this.settings.graphics);
    this.syncOptButtons('optFontsize', this.settings.fontSize);
  }
  syncOptButtons(elKey, val) {
    const container = this.el[elKey];
    if (!container) return;
    container.querySelectorAll('.opt-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.val === val);
    });
  }

  // ========== GAME FLOW ==========
  startNewGame() {
    this.stats = new StatsManager();
    this.endings = new EndingManager(this.stats);
    this.time = { year: 1, semester: 1, month: 1 };
    this.debt = 0;
    this.showScreen('game');
    this.updateHUD();
    this.goToNode('intro_start');
    this.saveGame();
  }

  updateHUD() {
    const hud = document.getElementById('time-hud');
    if (hud) {
      hud.textContent = `Năm ${this.time.year} - HK ${this.time.semester} - Tháng ${this.time.month}`;
    }
  }

  goToNode(nodeId) {
    if (nodeId === 'advance_time') {
      this.advanceTime();
      return;
    }
    if (nodeId === 'trigger_random_event') {
      const eventKeys = Object.keys(STORY_DATA).filter(k => STORY_DATA[k].isRandomEvent);
      if (eventKeys.length > 0) {
        const randEvent = eventKeys[Math.floor(Math.random() * eventKeys.length)];
        this.goToNode(randEvent);
      } else {
        this.advanceTime();
      }
      return;
    }
    const node = STORY_DATA[nodeId];
    if (!node) return;
    this.currentNode = node;
    if (node.effects) this.stats.apply(node.effects);
    const bad = this.endings.checkBadEnding();
    if (bad) { this.showEnding(bad); return; }
    if (node.chapter && node.chapterTitle) {
      this.showChapter(node.chapterTitle, () => this.renderNode(node));
    } else if (node.isEnding) {
      this.showEnding(this.endings.evaluateFinal());
    } else if (node.isExam) {
      this.runExam(node);
    } else if (node.isLottery) {
      this.runLottery(node);
    } else {
      this.renderNode(node);
    }
    this.saveGame();
  }

  advanceTime() {
    // Interest on debt: 10% per month
    const currentDebt = this.stats.get('debt');
    if (currentDebt > 0) {
      this.stats.apply({ debt: Math.floor(currentDebt * 0.1) || 1 });
    }

    this.time.month++;
    if (this.time.month > 4) {
      this.time.month = 1;
      this.time.semester++;
      if (this.time.semester > 3) {
        this.time.semester = 1;
        this.time.year++;
        if (this.time.year > 3) {
          const passed = this.stats.flags.passedExams;
          // Cần ít nhất 6/9 môn (kỳ) để ra trường
          if (passed >= 6) {
            this.updateHUD();
            this.goToNode('graduation_eval');
            return;
          } else if (this.time.year > 4) {
             // Học lại quá nhiều, bị đuổi
             this.showEnding(ENDINGS.quit);
             return;
          } else {
             // Vào năm 4 để học lại
             this.showNotif('⚠️ Bạn chưa đủ điều kiện tốt nghiệp. Bắt buộc học thêm năm 4!');
          }
        }
      }
      this.updateHUD();
      this.goToNode('exam_event');
      return;
    }
    this.updateHUD();
    this.goToNode('main_loop');
  }

  renderNode(node) {
    this.setBackground(node.background);
    // Speaker — replace 'Minh' with player's custom name
    let speaker = node.speaker;
    if (speaker === 'Minh') speaker = this.playerName || (this.gender === 'female' ? 'Mai' : 'Minh');
    
    let charsList = node.characters;
    const playerChar = this.gender === 'female' ? 'player_female' : 'player_male';

    if (!charsList) {
      if (node.speaker === null && node.character !== null) {
        // Just the specified character (e.g. main_loop has character: null)
        charsList = node.character ? [{ id: node.character, pose: node.pose || 'binh_thuong', pos: 'center' }] : [{ id: playerChar, pose: node.pose || 'binh_thuong', pos: 'center' }];
      } else if (node.character) {
        // NPC is speaking: show player on left, NPC on right
        charsList = [
          { id: playerChar, pose: node.pose || 'binh_thuong', pos: 'left' },
          { id: node.character, pose: node.pose || 'binh_thuong', pos: 'right' }
        ];
      } else if (node.speaker === null) {
         // Narration
         charsList = [{ id: playerChar, pose: node.pose || 'binh_thuong', pos: 'center' }];
      } else {
         charsList = [];
      }
    }

    this.setCharacters(charsList, speaker);
    
    this.el.speakerName.textContent = speaker || '';
    this.el.speakerName.style.display = speaker ? 'block' : 'none';
    this.el.choicesContainer.innerHTML = '';
    this.el.choicesContainer.classList.remove('active');
    this.el.continueIndicator.style.display = 'none';
    // Replace 'Minh' in text with player's custom name
    let text = node.text;
    const targetName = this.playerName || (this.gender === 'female' ? 'Mai' : 'Minh');
    text = text.replace(/\bMinh\b/g, targetName);
    this.typeText(text, () => {
      if (node.choices && node.choices.length > 0) {
        this.showChoices(node.choices);
      } else {
        this.el.continueIndicator.style.display = 'block';
      }
    });
  }

  // ========== TYPING ==========
  typeText(text, onComplete) {
    this.fullText = text;
    this.charIndex = 0;
    this.isTyping = true;
    this.el.dialogueText.textContent = '';
    this.onTypeComplete = onComplete;
    clearInterval(this.typingTimer);
    this.typingTimer = setInterval(() => {
      if (this.charIndex < this.fullText.length) {
        this.el.dialogueText.textContent += this.fullText[this.charIndex];
        this.charIndex++;
      } else {
        clearInterval(this.typingTimer);
        this.isTyping = false;
        if (this.onTypeComplete) this.onTypeComplete();
      }
    }, 28);
  }

  onDialogueClick() {
    if (!this.el.gameScreen.classList.contains('active')) return;
    if (this.isTyping) {
      clearInterval(this.typingTimer);
      this.el.dialogueText.textContent = this.fullText;
      this.isTyping = false;
      if (this.onTypeComplete) this.onTypeComplete();
    } else if (this.currentNode && this.currentNode.next && !this.currentNode.choices) {
      this.goToNode(this.currentNode.next);
    }
  }

  // ========== CHOICES ==========
  showChoices(choices) {
    this.el.choicesContainer.innerHTML = '';
    this.el.choicesContainer.classList.add('active');
    choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `<span class="choice-text">${choice.text}</span>`;
      // Removed the code that displays choice.effects on the button to hide stats from the player
      btn.addEventListener('click', () => {
        if (choice.effects) this.stats.apply(choice.effects);
        if (choice.familyPositive !== undefined) {
          this.stats.flags.familyTotal++;
          if (choice.familyPositive) this.stats.flags.familyPositive++;
        }
        this.el.choicesContainer.classList.remove('active');
        if (choice.effects) this.showStatNotification(choice.effects);
        const bad = this.endings.checkBadEnding();
        if (bad) { this.showEnding(bad); return; }
        this.goToNode(choice.next);
      });
      btn.style.animationDelay = `${idx * 0.1}s`;
      this.el.choicesContainer.appendChild(btn);
    });
  }

  // ========== EXAM ==========
  runExam(node) {
    const lvl = this.stats.getLevel('knowledge');
    let passed, text;
    if (lvl === 'high' || lvl === 'extreme') {
      passed = true;
      text = 'Bạn nhìn đề thi... Hầu hết đều quen thuộc! Tự tin làm bài, bạn nộp sớm với nụ cười mãn nguyện. ✅ ĐẠT!';
    } else if (lvl === 'medium') {
      passed = Math.random() < 0.7;
      text = passed
        ? 'Đề thi có vài câu khó, nhưng nhìn chung bạn làm được. Kết quả: ✅ Vừa đủ qua!'
        : 'Đề thi khó hơn dự kiến. Nhiều câu bạn không chắc chắn... Kết quả: ❌ Không đạt!';
    } else {
      passed = false;
      text = 'Nhìn đề thi, bạn hoảng hốt — chẳng hiểu gì cả! Viết lung tung rồi nộp bài trong tuyệt vọng. ❌ TRƯỢT!';
    }
    if (!passed) { this.stats.flags.failedExams++; this.stats.apply({ spirit: -10 }); }
    else { this.stats.flags.passedExams++; this.stats.apply({ spirit: 5, knowledge: 3 }); }
    STORY_DATA[node.next].text = text;
    this.renderNode({ ...node, text, choices: null, isExam: false });
    this.currentNode = { ...node, next: node.next, choices: null };
  }

  // ========== LOTTERY ==========
  runLottery(node) {
    this.stats.flags.lotterySpent += 5;
    const roll = Math.random();
    let text, amount;
    if (roll < 0.01) { amount = 100; text = '🎉🎉🎉 ĐỘC ĐẮC!!! Trúng giải lớn!'; this.stats.flags.wonJackpot = true; }
    else if (roll < 0.06) { amount = 30; text = '🎉 Trúng giải nhì! Vui mừng khôn xiết!'; }
    else if (roll < 0.16) { amount = 15; text = '😄 Trúng giải ba! Cũng được một khoản!'; }
    else { amount = 0; text = '😢 Không trúng gì cả... Tiếc tiền quá!'; }
    if (amount > 0) { this.stats.apply({ money: amount }); this.stats.flags.lotteryWon += amount; }
    STORY_DATA[node.next].text = text;
    this.renderNode({ ...node, text, choices: null, isLottery: false });
    this.currentNode = { ...node, next: node.next, choices: null };
  }

  // ========== BACKGROUND ==========
  setBackground(bgKey) {
    if (!bgKey) return;
    const imgUrl = this.bgImages[bgKey];
    const fallback = this.bgFallbacks[bgKey] || 'linear-gradient(135deg, #0a0a1a, #1a1030)';
    if (imgUrl) {
      const img = new Image();
      img.onload = () => { this.el.bgImage.style.backgroundImage = `url('${imgUrl}')`; };
      img.onerror = () => { this.el.bgImage.style.backgroundImage = fallback; };
      img.src = imgUrl;
    } else {
      this.el.bgImage.style.backgroundImage = fallback;
    }
  }

  // ========== MULTI-CHARACTER SPRITES ==========
  setCharacters(charsList, speakerName) {
    if (!charsList || charsList.length === 0) { 
      this.el.charSprite.style.display = 'none'; 
      this.el.charSprite.innerHTML = ''; 
      return; 
    }
    this.el.charSprite.style.display = 'block';
    let html = '';

    // A mapping helper to check if a character id is the current speaker
    const speakerMatches = (charId) => {
      if (!speakerName) return true; // If narration (no speaker), no one is dimmed (or everyone is dimmed? user requested them to be visible)
      if (speakerName === this.playerName || speakerName === 'Mai' || speakerName === 'Minh') {
        return charId === 'player_male' || charId === 'player_female';
      }
      // Simple fallback: if speakerName contains the character id or vice versa (e.g. 'Đức' vs 'duc')
      const normalizedSpeaker = speakerName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
      return normalizedSpeaker.includes(charId);
    };

    const playerChar = this.gender === 'female' ? 'player_female' : 'player_male';

    charsList.forEach(char => {
      // Map 'player' to the correct gender character
      const charKey = (char.id === 'player' || char.id === 'player_male' || char.id === 'player_female') ? playerChar : char.id;
      const pose = char.pose || 'binh_thuong';
      const posClass = char.pos ? `pos-${char.pos}` : 'pos-center';
      
      const isSpeaking = speakerMatches(charKey);
      const dimClass = isSpeaking ? '' : 'char-dimmed';

      const entry = this.charFiles && this.charFiles[charKey];
      let file = null;
      if (entry) {
        if (typeof entry === 'string') file = entry;
        else file = entry[pose] || entry.default || Object.values(entry)[0];
      }

      let innerHTML = '';
      if (file) {
        innerHTML = `<img class="char-img" src="${file}" alt="" style="border-radius: 12px; filter: drop-shadow(0 18px 36px rgba(0,0,0,.45));">`;
      } else {
        innerHTML = this.makeCharSVG(charKey);
      }

      html += `<div class="char-wrapper ${posClass} ${dimClass}">${innerHTML}</div>`;
    });

    this.el.charSprite.innerHTML = html;
    this.el.charSprite.classList.add('char-enter');
    setTimeout(() => this.el.charSprite.classList.remove('char-enter'), 500);
  }

  makeCharSVG(key) {
    const configs = {
      duc: { hair: '#2d1810', skin: '#e8c39e', shirt: '#f59e0b', accent: '#d97706', type: 'male', label: 'ĐỨC' },
      lan: { hair: '#1a1a2e', skin: '#f5d0a9', shirt: '#ec4899', accent: '#be185d', type: 'female', label: 'LAN' },
      thay_hung: { hair: '#444', skin: '#e8c39e', shirt: '#10b981', accent: '#047857', type: 'male', glasses: true, label: 'T.HÙNG' },
      player_male: { hair: '#1a1a2e', skin: '#f2cda2', shirt: '#2563eb', accent: '#1d4ed8', type: 'male', label: '' },
      player_female: { hair: '#1f2937', skin: '#f2cda2', shirt: '#f472b6', accent: '#be185d', type: 'female', label: '' },
      male_preview: { hair: '#1a1a2e', skin: '#f5d0a9', shirt: '#3b82f6', accent: '#1d4ed8', type: 'male', label: '' },
      female_preview: { hair: '#1a1a2e', skin: '#f5d0a9', shirt: '#ec4899', accent: '#be185d', type: 'female', label: '' },
    };
    const c = configs[key] || configs.duc;
    const gl = c.glasses ? `<rect x="120" y="136" width="24" height="18" rx="9" fill="none" stroke="#333" stroke-width="2.5"/><rect x="156" y="136" width="24" height="18" rx="9" fill="none" stroke="#333" stroke-width="2.5"/><line x1="144" y1="145" x2="156" y2="145" stroke="#333" stroke-width="2"/>` : '';
    const hairPath = c.type === 'female'
      ? `<path d="M95,130 C95,70 115,45 150,40 C185,45 205,70 205,130 C205,115 195,95 175,90 C160,95 140,95 125,90 C105,95 95,115 95,130 Z" fill="${c.hair}"/><path d="M95,125 L75,260 C78,265 84,260 88,240 Z" fill="${c.hair}"/><path d="M205,125 L225,260 C222,265 216,260 212,240 Z" fill="${c.hair}"/>`
      : `<path d="M100,125 C100,75 118,50 150,45 C182,50 200,75 200,125 C200,110 192,90 175,85 C162,88 138,88 125,85 C108,90 100,110 100,125 Z" fill="${c.hair}"/>`;
    const skirt = c.type === 'female' ? `<path d="M108,250 L85,400 C85,415 215,415 215,400 L192,250 Z" fill="#1e3a5f"/>` : '';
    const pants = c.type === 'male' ? `<path d="M110,380 L105,480 C108,485 142,485 145,480 L150,400 L155,480 C158,485 192,485 195,480 L190,380 Z" fill="#2d3748"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500" width="200" height="340">
      <defs><filter id="sd"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/></filter></defs>
      <path d="M110,250 C95,245 82,235 80,225 L82,195 C82,175 95,162 110,158 L150,150 L190,158 C205,162 218,175 218,195 L220,225 C218,235 205,245 190,250 L195,400 C195,415 155,420 150,420 C145,420 105,415 105,400 Z" fill="${c.shirt}" filter="url(#sd)"/>
      ${skirt}${pants}
      <ellipse cx="150" cy="145" rx="48" ry="55" fill="${c.skin}"/>
      ${hairPath}
      <ellipse cx="132" cy="146" rx="7" ry="9" fill="white"/><ellipse cx="168" cy="146" rx="7" ry="9" fill="white"/>
      <ellipse cx="133" cy="147" rx="5" ry="7" fill="#2d1810"/><ellipse cx="169" cy="147" rx="5" ry="7" fill="#2d1810"/>
      <ellipse cx="135" cy="144" rx="2.5" ry="2.5" fill="white"/><ellipse cx="171" cy="144" rx="2.5" ry="2.5" fill="white"/>
      ${gl}
      <path d="M142,172 C146,177 154,177 158,172" fill="none" stroke="${c.accent}" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="122" cy="160" rx="9" ry="4" fill="#ffb3b3" opacity="0.2"/>
      <ellipse cx="178" cy="160" rx="9" ry="4" fill="#ffb3b3" opacity="0.2"/>
      ${c.label ? `<text x="150" y="480" font-family="sans-serif" font-size="13" fill="white" text-anchor="middle" font-weight="bold" opacity="0.6">${c.label}</text>` : ''}
    </svg>`;
  }

  // ========== CHAPTER ==========
  showChapter(title, cb) {
    this.el.chapterOverlay.classList.add('active');
    this.el.chapterTitle.textContent = title;
    setTimeout(() => { this.el.chapterOverlay.classList.remove('active'); if (cb) cb(); }, 2500);
  }

  // ========== PROFILE ==========
  toggleProfile() {
    this.el.profileModal.classList.toggle('active');
    if (this.el.profileModal.classList.contains('active')) this.renderProfile();
  }
  renderProfile() {
    const all = this.stats.getAllDisplay();
    const name = this.playerName || (this.gender === 'female' ? 'Mai' : 'Minh');
    const gIcon = this.gender === 'female' ? '👩' : '🧑';
    this.el.profileStats.innerHTML =
      `<div class="ps-header" style="margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.06)">
        <span class="ps-icon">${gIcon}</span>
        <span class="ps-name" style="font-size:1rem;font-weight:600;color:var(--text)">${name}</span>
      </div>` +
      all.map(s => {
        const pct = Math.max(0, Math.min(100, s.value));
        return `<div class="profile-stat">
          <div class="ps-header"><span class="ps-icon">${s.icon}</span><span class="ps-name">${s.name}</span><span class="ps-val" style="color:${s.levelInfo.color}">${s.value}</span></div>
          <div class="ps-bar"><div class="ps-fill" style="width:${pct}%;background:${s.levelInfo.color}"></div></div>
          <div class="ps-level" style="color:${s.levelInfo.color}">${s.levelInfo.label}</div>
        </div>`;
      }).join('') +
      (this.stats.flags.hasMyopia ? '<div class="ps-flag">👓 Bị cận thị</div>' : '');
  }

  // ========== MENU ==========
  toggleMenu() { this.el.menuOverlay.classList.toggle('active'); }

  // ========== ENDING ==========
  showEnding(ending) {
    this.el.endingTitle.textContent = ending.title;
    this.el.endingTitle.style.color = ending.color;
    const t = ending.type === 'happy' ? '🌟 HAPPY END' : ending.type === 'neutral' ? '📌 NEUTRAL END' : '💀 BAD END';
    this.el.endingTitle.setAttribute('data-type', t);
    this.el.endingStory.textContent = ending.story;
    const all = this.stats.getAllDisplay();
    this.el.endingFinalStats.innerHTML = '<h4>📊 Chỉ số cuối cùng</h4>' +
      all.map(s => `<div class="ef-row"><span>${s.icon} ${s.name}</span><span style="color:${s.levelInfo.color}">${s.value} — ${s.levelInfo.label}</span></div>`).join('');
    this.showScreen('ending');
    // Clear this slot
    if (this.currentSlot !== null) localStorage.removeItem(`vn_slot_${this.currentSlot}`);
  }

  // ========== SAVE / LOAD ==========
  saveGame() {
    if (this.currentSlot === null) return;
    const chapter = this.currentNode?.chapter || null;
    const data = { nodeId: this.currentNode?.id, stats: this.stats.serialize(), gender: this.gender, playerName: this.playerName, chapter, ts: Date.now(), time: this.time };
    localStorage.setItem(`vn_slot_${this.currentSlot}`, JSON.stringify(data));
  }
  loadGame(slotIdx) {
    const data = this.getSlotData(slotIdx);
    if (!data) return;
    this.currentSlot = slotIdx;
    this.gender = data.gender || 'male';
    this.playerName = data.playerName || (this.gender === 'female' ? 'Mai' : 'Minh');
    this.time = data.time || { year: 1, semester: 1, month: 1 };
    this.stats.deserialize(data.stats);
    this.endings = new EndingManager(this.stats);
    this.showScreen('game');
    this.updateHUD();
    this.goToNode(data.nodeId);
  }
  checkSave() {
    let hasAny = false;
    for (let i = 0; i < 4; i++) { if (this.getSlotData(i)) { hasAny = true; break; } }
    this.el.btnContinue.disabled = !hasAny;
  }

  // ========== NOTIFICATION ==========
  showNotif(msg) {
    this.el.notification.textContent = msg;
    this.el.notification.classList.add('show');
    setTimeout(() => this.el.notification.classList.remove('show'), 2000);
  }
  showStatNotification(effects) {
    const parts = Object.entries(effects).map(([k, v]) => {
      const info = GAME_CONFIG.statInfo[k];
      if (!info) return '';
      return `${info.icon}${v > 0 ? '+' : ''}${v}`;
    }).filter(Boolean).join('  ');
    if (parts) this.showNotif(parts);
  }
}
