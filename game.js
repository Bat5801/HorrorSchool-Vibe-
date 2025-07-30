class SchoolHorrorGame {
    constructor() {
        // 游戏状态
        this.gameState = {
            playerName: '',
            playerGender: '',
            currentScene: 'start',
            gameTime: '21:00',
            plotProgress: 0,
            inventory: [],
            hasKey: false,
            hasSeenGhost: false
        };

        // DOM元素
        this.elements = {
            startScreen: document.getElementById('start-screen'),
            gameScreen: document.getElementById('game-screen'),
            deathScreen: document.getElementById('death-screen'),
            playerNameInput: document.getElementById('player-name'),
            maleOption: document.getElementById('male-option'),
            femaleOption: document.getElementById('female-option'),
            startButton: document.getElementById('start-game'),
            restartButton: document.getElementById('restart-game'),
            playerNameDisplay: document.getElementById('player-name-display'),
            playerGenderDisplay: document.getElementById('player-gender-display'),
            currentTimeDisplay: document.getElementById('current-time'),
            gameMap: document.getElementById('game-map'),
            dialogueText: document.getElementById('dialogue-text'),
            dialogueChoices: document.getElementById('dialogue-choices'),
            deathMessage: document.getElementById('death-message')
        };

        // 绑定事件监听
        this.bindEvents();
    }

    // 绑定事件监听
    bindEvents() {
        // 名字输入事件
        this.elements.playerNameInput.addEventListener('input', () => {
            this.gameState.playerName = this.elements.playerNameInput.value.trim();
            this.checkStartConditions();
        });

        // 性别选择事件
        this.elements.maleOption.addEventListener('click', () => {
            this.gameState.playerGender = 'male';
            this.elements.maleOption.classList.add('selected');
            this.elements.femaleOption.classList.remove('selected');
            this.checkStartConditions();
        });

        this.elements.femaleOption.addEventListener('click', () => {
            this.gameState.playerGender = 'female';
            this.elements.femaleOption.classList.add('selected');
            this.elements.maleOption.classList.remove('selected');
            this.checkStartConditions();
        });

        // 开始游戏按钮
        this.elements.startButton.addEventListener('click', () => this.startGame());

        // 重新开始按钮
        this.elements.restartButton.addEventListener('click', () => this.restartGame());
    }

    // 检查开始游戏条件
    checkStartConditions() {
        if (this.gameState.playerName && this.gameState.playerGender) {
            this.elements.startButton.disabled = false;
        } else {
            this.elements.startButton.disabled = true;
        }
    }

    // 开始游戏
    startGame() {
        // 更新玩家信息显示
        this.elements.playerNameDisplay.textContent = this.gameState.playerName;
        this.elements.playerGenderDisplay.textContent = this.gameState.playerGender === 'male' ? '男' : '女';

        // 切换屏幕
        this.elements.startScreen.classList.add('hidden');
        this.elements.gameScreen.classList.remove('hidden');

        // 初始化第一个场景
        this.loadScene('classroom');
    }

    // 加载场景
    loadScene(sceneName) {
        this.clearDialogue();

        switch(sceneName) {
            case 'classroom':
                this.showClassroomScene();
                break;
            case 'corridor':
                this.showCorridorScene();
                break;
            case 'library':
                this.showLibraryScene();
                break;
            case 'bathroom':
                this.showBathroomScene();
                break;
            case 'principalOffice':
                this.showPrincipalOfficeScene();
                break;
            default:
                this.showClassroomScene();
        }
    }

    // 显示教室场景
    showClassroomScene() {
        this.gameState.currentScene = 'classroom';
        this.updateGameMap('classroom');

        if (this.gameState.plotProgress === 0) {
            this.showDialogue(`晚自习结束的铃声已经响过很久了，${this.gameState.playerName}，你为什么还留在教室里？`, [
                { text: '收拾书包回家', action: () => this.leaveClassroom() },
                { text: '再复习一会儿', action: () => this.stayInClassroom() }
            ]);
        } else {
            this.showDialogue('教室里空荡荡的，只有你的课桌还留在原地。', [
                { text: '离开教室', action: () => this.goToCorridor() }
            ]);
        }
    }

    // 显示走廊场景
    showCorridorScene() {
        this.gameState.currentScene = 'corridor';
        this.updateGameMap('corridor');

        // 根据性别展示不同内容
        if (this.gameState.playerGender === 'female') {
            this.showDialogue('走廊尽头好像有个穿红色连衣裙的女孩在看着你...', [
                { text: '向她走去', action: () => this.approachGirl() },
                { text: '快速离开', action: () => this.fastLeaveCorridor() }
            ]);
        } else {
            this.showDialogue('走廊的灯光忽明忽暗，你听到身后传来脚步声...', [
                { text: '回头查看', action: () => this.checkFootsteps() },
                { text: '继续前进', action: () => this.continueCorridor() }
            ]);
        }
    }

    // 显示图书馆场景
    showLibraryScene() {
        this.gameState.currentScene = 'library';
        this.updateGameMap('library');

        this.showDialogue('图书馆里弥漫着旧书的霉味，书架上的书好像在微微晃动。', [
            { text: '查看书架', action: () => this.checkBookshelf() },
            { text: '离开图书馆', action: () => this.goToCorridor() }
        ]);
    }

    // 显示卫生间场景
    showBathroomScene() {
        this.gameState.currentScene = 'bathroom';
        this.updateGameMap('bathroom');

        this.showDialogue('卫生间的镜子上用红色的液体写着"救命"两个字。', [
            { text: '靠近镜子', action: () => this.approachMirror() },
            { text: '逃离卫生间', action: () => this.goToCorridor() }
        ]);
    }

    // 显示校长办公室场景
    showPrincipalOfficeScene() {
        this.gameState.currentScene = 'principalOffice';
        this.updateGameMap('principalOffice');

        if (this.gameState.hasKey) {
            this.showDialogue('你用钥匙打开了校长办公室的门，里面一片漆黑。', [
                { text: '打开灯', action: () => this.turnOnLight() },
                { text: '在黑暗中摸索', action: () => this.searchInDark() }
            ]);
        } else {
            this.showDialogue('校长办公室的门锁着，你需要找到钥匙才能进去。', [
                { text: '返回走廊', action: () => this.goToCorridor() }
            ]);
        }
    }

    // 更新游戏地图显示
    updateGameMap(location) {
        const locations = {
            classroom: '🏫 你的教室',
            corridor: '🚪 学校走廊',
            library: '📚 图书馆',
            bathroom: '🚻 卫生间',
            principalOffice: '🔑 校长办公室'
        };

        this.elements.gameMap.innerHTML = `<div class="location-name">${locations[location]}</div>
<div class="pixel-map">${this.generatePixelMap(location)}</div>`;
    }

    // 生成像素风格地图
    generatePixelMap(location) {
        switch(location) {
            case 'classroom':
                return '■■■■■■■■■■\n■         ■\n■   T     ■\n■         ■\n■   C     ■\n■         ■\n■■■■■■■■■■';
            case 'corridor':
                return '■■■■■■■■■■■■■■\n■               ■\n■   D   D   D   ■\n■               ■\n■■■■■■■■■■■■■■';
            case 'library':
                return '■■■■■■■■■■\n■BBBBBBBBB■\n■B       B■\n■BBBBBBBBB■\n■B       B■\n■BBBBBBBBB■\n■■■■■■■■■■';
            case 'bathroom':
                return '■■■■■■\n■   S   ■\n■       ■\n■   M   ■\n■■■■■■';
            case 'principalOffice':
                return '■■■■■■■■\n■   D    ■\n■        ■\n■   F    ■\n■■■■■■■■';
            default:
                return '■■■■■■■■\n■   ?    ■\n■        ■\n■■■■■■■■';
        }
    }

    // 显示对话
    showDialogue(text, choices) {
        this.elements.dialogueText.textContent = text;
        this.elements.dialogueChoices.innerHTML = '';

        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.addEventListener('click', choice.action);
            this.elements.dialogueChoices.appendChild(button);
        });
    }

    // 清除对话
    clearDialogue() {
        this.elements.dialogueText.textContent = '';
        this.elements.dialogueChoices.innerHTML = '';
    }

    // 游戏方法和剧情分支
    leaveClassroom() {
        this.gameState.plotProgress = 1;
        this.showDialogue('当你走到教室门口时，发现门锁住了！无论怎么推拉都打不开。', [
            { text: '检查窗户', action: () => this.checkWindow() },
            { text: '寻找钥匙', action: () => this.searchForKey() }
        ]);
    }

    stayInClassroom() {
        this.gameState.plotProgress = 2;
        this.updateGameTime('21:15');
        this.showDialogue('时间一分一秒过去，突然，教室的灯全部熄灭了！', [
            { text: '拿出手机照明', action: () => this.usePhoneLight() },
            { text: '躲到桌子底下', action: () => this.hideUnderDesk() }
        ]);
    }

    goToCorridor() {
        this.updateGameTime('21:30');
        this.loadScene('corridor');
    }

    approachGirl() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:45');
        this.showDeath('当你靠近她时，她缓缓转过头——那是一张没有脸的脸！你尖叫着倒下...');
    }

    fastLeaveCorridor() {
        this.updateGameTime('21:40');
        this.showDialogue('你快速跑过走廊，感觉有什么东西在后面追赶你。', [
            { text: '躲进图书馆', action: () => this.goToLibrary() },
            { text: '冲进卫生间', action: () => this.goToBathroom() }
        ]);
    }

    checkFootsteps() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:45');
        this.showDeath('你转过身，看到一个没有腿的人漂浮在半空中，正伸出苍白的手抓向你...');
    }

    continueCorridor() {
        this.updateGameTime('21:40');
        this.showDialogue('你加快脚步，走廊尽头有三个门可以进入。', [
            { text: '图书馆', action: () => this.goToLibrary() },
            { text: '卫生间', action: () => this.goToBathroom() },
            { text: '校长办公室', action: () => this.goToPrincipalOffice() }
        ]);
    }

    checkBookshelf() {
        if (!this.gameState.hasKey) {
            this.gameState.hasKey = true;
            this.showDialogue('你在书架后面发现了一把闪着银光的钥匙！', [
                { text: '拿起钥匙', action: () => this.takeKey() },
                { text: '放回原处', action: () => this.leaveKey() }
            ]);
        } else {
            this.showDialogue('书架上的书突然全部掉了下来，把你埋在了书堆里！', [
                { text: '挣扎出来', action: () => this.escapeBookpile() }
            ]);
        }
    }

    approachMirror() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:50');
        this.showDeath('当你看向镜子时，镜中的你露出了诡异的笑容，然后慢慢爬出了镜子...');
    }

    turnOnLight() {
        this.updateGameTime('22:00');
        this.showDialogue('灯光亮起，你看到办公桌上有一本日记。', [
            { text: '阅读日记', action: () => this.readDiary() },
            { text: '检查抽屉', action: () => this.checkDrawer() }
        ]);
    }

    searchInDark() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('22:00');
        this.showDeath('你的手摸到了一个冰冷的东西，然后听到一个声音在你耳边说："你在找这个吗？"');
    }

    readDiary() {
        this.updateGameTime('22:10');
        this.showDialogue('日记里记录着一个学生的遭遇，他在三年前的今天消失在了这所学校...', [
            { text: '继续阅读', action: () => this.continueReading() },
            { text: '合上日记', action: () => this.closeDiary() }
        ]);
    }

    showDeath(message) {
        this.elements.gameScreen.classList.add('hidden');
        this.elements.deathScreen.classList.remove('hidden');
        this.elements.deathMessage.textContent = message;
    }

    restartGame() {
        // 重置游戏状态
        this.gameState = {
            playerName: this.gameState.playerName,
            playerGender: this.gameState.playerGender,
            currentScene: 'start',
            gameTime: '21:00',
            plotProgress: 0,
            inventory: [],
            hasKey: false,
            hasSeenGhost: false
        };

        // 重置界面
        this.elements.deathScreen.classList.add('hidden');
        this.elements.startScreen.classList.remove('hidden');
        this.elements.playerNameInput.value = this.gameState.playerName;
        if (this.gameState.playerGender === 'male') {
            this.elements.maleOption.classList.add('selected');
        } else {
            this.elements.femaleOption.classList.add('selected');
        }
        this.checkStartConditions();
    }

    // 辅助方法
    updateGameTime(time) {
        this.gameState.gameTime = time;
        this.elements.currentTimeDisplay.textContent = time;
    }

    // 更多剧情方法...
    checkWindow() { this.showDeath('窗户被铁条封死了，当你靠近时，一只冰冷的手从铁条间伸了出来抓住了你！'); }
    searchForKey() { this.showDialogue('你在讲台抽屉里找到了一把生锈的钥匙！', [{ text: '尝试开门', action: () => this.tryDoorKey() }]); }
    usePhoneLight() { this.showDialogue('手机屏幕亮起，你看到讲台上有一张纸条。', [{ text: '拿起纸条', action: () => this.takeNote() }]); }
    hideUnderDesk() { this.showDeath('桌子开始剧烈摇晃，然后整个压了下来...'); }
    goToLibrary() { this.loadScene('library'); }
    goToBathroom() { this.loadScene('bathroom'); }
    goToPrincipalOffice() { this.loadScene('principalOffice'); }
    takeKey() { this.showDialogue('你把钥匙放进了口袋。', [{ text: '离开图书馆', action: () => this.goToCorridor() }]); }
    leaveKey() { this.showDeath('你决定不拿钥匙，这时书架突然倒塌，把你压在了下面...'); }
    escapeBookpile() { this.showDialogue('你挣扎着从书堆里爬出来，感觉有什么东西在盯着你。', [{ text: '离开图书馆', action: () => this.goToCorridor() }]); }
    tryDoorKey() { this.showDialogue('钥匙插进锁孔，但转不动。这时你听到身后传来脚步声...', [{ text: '转身查看', action: () => this.seeWhoIsThere() }, { text: '继续尝试开门', action: () => this.keepTryingKey() }]); }
    takeNote() { this.showDialogue('纸条上写着："它不喜欢噪音，用水可以暂时驱赶它"', [{ text: '收好纸条', action: () => this.goToCorridor() }]); }
    seeWhoIsThere() { this.showDeath('站在你身后的是一个穿着校服的学生，他的脸正在慢慢融化...'); }
    keepTryingKey() { this.showDeath('门锁突然转动，但门打开的瞬间，一股黑色的雾气涌了进来，吞噬了你...'); }
    continueReading() { this.showDialogue('日记最后一页写着："它在找替身，特别是在这个日子留在学校的人..."', [{ text: '寻找出口', action: () => this.findExit() }]); }
    closeDiary() { this.showDialogue('你合上日记，决定寻找离开学校的方法。', [{ text: '离开办公室', action: () => this.goToCorridor() }]); }
    findExit() { this.showDialogue('根据日记的线索，你找到了学校的侧门！', [{ text: '尝试开门', action: () => this.trySideDoor() }]); }
    trySideDoor() { this.showDialogue('门没有锁！你成功逃出了学校！', [{ text: '游戏结束', action: () => this.gameClear() }]); }
    gameClear() { alert('恭喜你成功逃脱！但这所学校的秘密还没有解开...'); this.restartGame(); }
}

// 游戏初始化
window.addEventListener('DOMContentLoaded', () => {
    const game = new SchoolHorrorGame();
});