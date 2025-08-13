class Chapter5 {
    constructor(game) {
        this.game = game;
        this.chapterName = '第五章 - 「黑暗源头」';
        this.plotProgress = 0;
        this.requiredClicks = 20; // 最终QTE需要的点击次数
        this.clickTimeLimit = 6000; // 最终QTE的时间限制(毫秒)
        this.hasWeapon = false;
        this.weaponType = '';
    }

    // 开始章节
    start(startTime = null) {
        this.game.gameState.currentChapter = `chapter5`;
        this.game.elements.gameTitle.textContent = this.chapterName;
        this.game.elements.gameMap.innerHTML = ``;
        this.game.elements.dialogueText.innerHTML = ``;
        this.game.elements.dialogueChoices.innerHTML = ``;

        // 初始化游戏状态
        this.plotProgress = 0;
        this.isPuzzleActive = false;
        this.clickCount = 0;
        this.hasWeapon = false;
        this.weaponType = '';

        // 初始化游戏时间
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime(`00:00`); // 默认起始时间
        }

        // 播放章节开始音效
        this.playSound(`horror`);

        // 显示章节介绍
        this.showDialogue(`经历了前几章的冒险，你和${this.getFriendName()}决定彻底解决黑暗神器的威胁。你们得知，黑暗神器的源头可能与学校的地下室有关。`, [
            { text: `前往地下室`, action: () => this.goToBasement() },
            { text: `准备武器`, action: () => this.prepareWeapons() }
        ]);
    }

    // 获取朋友名字
    getFriendName() {
        return this.game.gameState.friendName || '朋友';
    }

    // 获取朋友代词
    getFriendPronoun(type) {
        const gender = this.game.gameState.friendGender || 'neutral';
        if (type === 'subject') {
            return gender === 'male' ? '他' : gender === 'female' ? '她' : 'TA';
        } else if (type === 'object') {
            return gender === 'male' ? '他' : gender === 'female' ? '她' : 'TA';
        } else if (type === 'possessive') {
            return gender === 'male' ? '他的' : gender === 'female' ? '她的' : 'TA的';
        }
        return 'TA';
    }

    // 前往地下室
    goToBasement() {
        this.plotProgress = 1;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你和${friendName}来到学校的地下室入口。门被锁住了，上面有一个奇怪的符号，看起来与黑暗神器上的符号相似。`, [
            { text: `使用黑暗神器开门`, action: () => this.useArtifactToOpenDoor() },
            { text: `寻找钥匙`, action: () => this.searchForKey() }
        ]);
    }

    // 准备武器
    prepareWeapons() {
        this.plotProgress = 2;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你和${friendName}在学校里寻找可以作为武器的物品。你们找到了一根铁棍和一个灭火器。`, [
            { text: `拿上铁棍`, action: () => this.takeIronRod() },
            { text: `拿上灭火器`, action: () => this.takeFireExtinguisher() },
            { text: `前往地下室`, action: () => this.goToBasement() }
        ]);
    }

    // 拿上铁棍
    takeIronRod() {
        this.hasWeapon = true;
        this.weaponType = '铁棍';
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`${friendName}看着你手里的铁棍："这个应该能派上用场。我们走吧。"`, [
            { text: `前往地下室`, action: () => this.goToBasement() }
        ]);
    }

    // 拿上灭火器
    takeFireExtinguisher() {
        this.hasWeapon = true;
        this.weaponType = '灭火器';
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`${friendName}点点头："灭火器不仅能灭火，必要时也能当武器用。我们出发吧。"`, [
            { text: `前往地下室`, action: () => this.goToBasement() }
        ]);
    }

    // 使用黑暗神器开门
    useArtifactToOpenDoor() {
        this.plotProgress = 3;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horrorUp`);
        this.showDialogue(`你拿出黑暗神器，靠近门锁。神器发出黑色的光芒，门锁开始变形。${friendName}紧张地说："小心点，这看起来不太对劲。"随着一声脆响，门锁被打开了，但神器的光芒变得更加强烈，几乎要灼伤你的手。`, [
            { text: `进入地下室`, action: () => this.enterBasement() },
            { text: `先放下神器`, action: () => this.putDownArtifact() }
        ]);
    }

    // 寻找钥匙
    searchForKey() {
        this.plotProgress = 4;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你和${friendName}在地下室周围寻找钥匙。${friendName}在一个旧柜子里找到了一串生锈的钥匙。"也许这些钥匙里有能打开地下室门的。"`, [
            { text: `尝试用钥匙开门`, action: () => this.tryKeysToOpenDoor() },
            { text: `放弃，使用黑暗神器`, action: () => this.useArtifactToOpenDoor() }
        ]);
    }

    // 尝试用钥匙开门
    tryKeysToOpenDoor() {
        this.plotProgress = 5;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你和${friendName}尝试了好几把钥匙，终于有一把钥匙转动了。门锁发出"咔嗒"一声，门开了。${friendName}松了口气："太好了，我们不用冒险使用那个神器了。"`, [
            { text: `进入地下室`, action: () => this.enterBasement() }
        ]);
    }

    // 放下神器
    putDownArtifact() {
        this.plotProgress = 6;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你将黑暗神器放在地上，光芒逐渐减弱。${friendName}皱着眉头说："我们真的需要带着这个东西吗？它看起来很危险。"`, [
            { text: `带上神器，进入地下室`, action: () => this.enterBasementWithArtifact() },
            { text: `留下神器，进入地下室`, action: () => this.enterBasementWithoutArtifact() }
        ]);
    }

    // 进入地下室
    enterBasement() {
        this.plotProgress = 7;
        const friendName = this.getFriendName();
        this.playSound(`ghostHa`);
        this.showDialogue(`地下室里一片漆黑，空气中弥漫着一股发霉的气味。你打开手电筒，照亮了前方的路。地下室深处似乎有什么东西在发光。${friendName}紧紧跟在你身后："那里...那里好像有什么东西。"`, [
            { text: `走向发光处`, action: () => this.walkToGlow() },
            { text: `先探索周围`, action: () => this.exploreSurroundings() }
        ]);
    }

    // 带着神器进入地下室
    enterBasementWithArtifact() {
        this.plotProgress = 8;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`你拿起黑暗神器，和${friendName}一起走进地下室。神器在黑暗中发出微弱的光芒，照亮了前方的路。${friendName}警惕地环顾四周："这里感觉很不对劲，我们得小心。"`, [
            { text: `走向地下室深处`, action: () => this.walkToBasementDepth() }
        ]);
    }

    // 不带神器进入地下室
    enterBasementWithoutArtifact() {
        this.plotProgress = 9;
        const friendName = this.getFriendName();
        this.playSound(`ghostHa`);
        this.showDialogue(`你和${friendName}走进地下室，没有带黑暗神器。地下室里一片漆黑，你们只能靠着手电筒的光前行。${friendName}有点紧张："没有那个神器，我们能应付吗？"`, [
            { text: `继续前进`, action: () => this.continueForward() },
            { text: `返回拿神器`, action: () => this.returnForArtifact() }
        ]);
    }

    // 走向发光处
    walkToGlow() {
        this.plotProgress = 10;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horrorUp`);
        this.showDialogue(`你和${friendName}走向发光处。那是一个祭坛，上面放着一个巨大的黑色宝石，正在发出诡异的光芒。${friendName}突然尖叫起来："小心！"你转头一看，${pronounSub}的眼睛变成了纯黑色，正缓缓走向祭坛。`, [
            { text: `阻止${friendName}`, action: () => this.stopFriend() },
            { text: `摧毁黑色宝石`, action: () => this.destroyBlackGem() }
        ]);
    }

    // 探索周围
    exploreSurroundings() {
        this.plotProgress = 11;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你和${friendName}探索了地下室的周围。你们发现了一些旧文件，上面记载着关于黑暗神器和黑色宝石的信息。看起来，黑色宝石是黑暗力量的源头，而黑暗神器是用来控制这种力量的。`, [
            { text: `走向发光处`, action: () => this.walkToGlow() }
        ]);
    }

    // 走向地下室深处
    walkToBasementDepth() {
        this.plotProgress = 12;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horrorUp`);
        this.showDialogue(`你和${friendName}走到地下室深处。你们看到一个祭坛，上面放着一个巨大的黑色宝石。${friendName}突然停住了脚步，${pronounSub}的眼睛变成了纯黑色。${friendName}机械地走向祭坛，嘴里喃喃自语："黑暗...力量...属于我..."`, [
            { text: `阻止${friendName}`, action: () => this.stopFriend() },
            { text: `使用黑暗神器`, action: () => this.useArtifact() }
        ]);
    }

    // 继续前进
    continueForward() {
        this.plotProgress = 13;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ghostHa`);
        this.showDialogue(`你和${friendName}继续前进。地下室深处，你们看到一个祭坛，上面放着一个巨大的黑色宝石。突然，${friendName}被一股无形的力量控制，${pronounSub}的眼睛变成了纯黑色，走向祭坛。`, [
            { text: `阻止${friendName}`, action: () => this.stopFriend() },
            { text: `寻找可以摧毁宝石的东西`, action: () => this.findSomethingToDestroyGem() }
        ]);
    }

    // 返回拿神器
    returnForArtifact() {
        this.plotProgress = 14;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你和${friendName}返回入口处拿黑暗神器。当你拿起神器时，它发出强烈的光芒。${friendName}皱着眉头说："这个东西真的很危险，但也许我们需要它。"`, [
            { text: `重新进入地下室`, action: () => this.enterBasementWithArtifact() }
        ]);
    }

    // 阻止朋友
    stopFriend() {
        this.plotProgress = 15;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        if (this.hasWeapon) {
            this.playSound(`ding`);
            this.showDialogue(`你用${this.weaponType}轻轻打了${friendName}一下，希望能唤醒${pronounSub}。${friendName}停下了脚步，眼神恢复了正常，但看起来很虚弱。"刚才...刚才发生了什么？"`, [
                { text: `摧毁黑色宝石`, action: () => this.destroyBlackGem() }
            ]);
        } else {
            this.playSound(`ding`);
            this.showDialogue(`你试图阻止${friendName}，但${pronounSub}的力量变得异常强大，轻易地把你推开。${friendName}继续走向祭坛，触摸到了黑色宝石。${pronounSub}发出一声惨叫，倒在地上。`, [
                { text: `唤醒${friendName}`, action: () => this.wakeUpFriend() },
                { text: `摧毁黑色宝石`, action: () => this.destroyBlackGem() }
            ]);
        }
    }

    // 摧毁黑色宝石
    destroyBlackGem() {
        this.plotProgress = 16;
        const friendName = this.getFriendName();
        if (this.hasWeapon) {
            this.playSound(`ding`);
            this.showDialogue(`你用${this.weaponType}砸向黑色宝石。宝石发出一声脆响，裂开了一道缝。里面涌出大量黑色雾气，消散在空气中。${friendName}松了口气："终于结束了。"`, [
                { text: `离开地下室`, action: () => this.leaveBasement() }
            ]);
        } else {
            this.playSound(`horrorUp`);
            this.showDialogue(`你试图摧毁黑色宝石，但没有工具，根本无法对它造成伤害。黑色宝石发出强烈的光芒，你感到一阵头晕目眩。`, [
                { text: `使用黑暗神器`, action: () => this.useArtifact() }
            ]);
        }
    }

    // 使用黑暗神器
    useArtifact() {
        this.plotProgress = 17;
        const friendName = this.getFriendName();
        this.playSound(`ahahahaha`);
        this.showDialogue(`你拿出黑暗神器，对准黑色宝石。神器发出黑色的光芒，与宝石的光芒相互交织。突然，一个邪恶的声音在你脑海中响起："愚蠢的人类，你们以为可以阻止我吗？"`, [
            { text: `继续使用神器`, action: () => this.continueUsingArtifact() },
            { text: `放弃`, action: () => this.giveUp() }
        ]);
    }

    // 寻找可以摧毁宝石的东西
    findSomethingToDestroyGem() {
        this.plotProgress = 18;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你在地下室里寻找可以摧毁黑色宝石的东西。你找到了一把生锈的斧头。${friendName}仍然被控制着，但${pronounSub}的动作变得缓慢。`, [
            { text: `用斧头砸宝石`, action: () => this.useAxeToDestroyGem() }
        ]);
    }

    // 唤醒朋友
    wakeUpFriend() {
        this.plotProgress = 19;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你摇晃着${friendName}，试图唤醒${pronounSub}。${friendName}慢慢睁开眼睛，眼神恢复了正常，但看起来很虚弱。"刚才...刚才我好像被什么东西控制了。那个宝石...它有问题。"`, [
            { text: `摧毁黑色宝石`, action: () => this.destroyBlackGem() }
        ]);
    }

    // 继续使用神器
    continueUsingArtifact() {
        this.plotProgress = 20;
        this.playSound(`longScream`);
        this.showDialogue(`你咬紧牙关，继续使用黑暗神器。神器和黑色宝石的光芒越来越强烈，最终发生了爆炸。你被冲击波掀飞，晕了过去。`, [
            { text: `(醒来)`, action: () => this.wakeUpAfterExplosion() }
        ]);
    }

    // 放弃
    giveUp() {
        this.plotProgress = 21;
        this.playSound(`ahahahaha`);
        this.showDialogue(`你放弃了抵抗，黑暗力量席卷了整个地下室。你感到意识逐渐模糊，最后陷入了黑暗。`, [
            { text: `(结局)`, action: () => this.badEnding() }
        ]);
    }

    // 用斧头砸宝石
    useAxeToDestroyGem() {
        this.plotProgress = 22;
        const friendName = this.getFriendName();
        this.hasWeapon = true;
        this.weaponType = '斧头';
        this.playSound(`ding`);
        this.showDialogue(`你拿起斧头，用力砸向黑色宝石。宝石发出一声脆响，裂开了。里面的黑色雾气涌出，消散在空气中。${friendName}的眼神恢复了正常："太好了！我们成功了！"`, [
            { text: `离开地下室`, action: () => this.leaveBasement() }
        ]);
    }

    // 醒来
    wakeUpAfterExplosion() {
        this.plotProgress = 23;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你慢慢醒来，发现自己躺在医院的病床上。${friendName}坐在你旁边，看起来很担心。"你终于醒了！我们在地下室里发生了爆炸，你昏迷了三天。"`, [
            { text: `询问黑暗神器和宝石`, action: () => this.askAboutArtifactAndGem() }
        ]);
    }

    // 离开地下室
    leaveBasement() {
        this.plotProgress = 24;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你和${friendName}离开了地下室。阳光照在你们身上，让你们感到一阵温暖。${friendName}转头看着你："终于结束了。我们再也不用被那些奇怪的事情困扰了。"`, [
            { text: `是的，结束了`, action: () => this.goodEnding() }
        ]);
    }

    // 询问黑暗神器和宝石
    askAboutArtifactAndGem() {
        this.plotProgress = 25;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`${friendName}摇了摇头："不知道。救援人员赶到的时候，只找到了我们，没有找到什么黑暗神器和黑色宝石。也许它们在爆炸中消失了。"你松了口气，也许这是最好的结果。`, [
            { text: `出院`, action: () => this.leaveHospital() }
        ]);
    }

    // 离开医院
    leaveHospital() {
        this.plotProgress = 26;
        this.playSound(`ding`);
        this.showDialogue(`你出院了，阳光照在身上，让你感到无比温暖。这场噩梦终于结束了。`, [
            { text: `(结局)`, action: () => this.goodEnding() }
        ]);
    }

    // 好结局
    goodEnding() {
        this.plotProgress = 27;
        this.playSound(`ding`);
        // 启动最终QTE
        this.startFinalQTE();
    }

    // 坏结局
    badEnding() {
        this.plotProgress = 28;
        this.playSound(`ahahahaha`);
        this.showDialogue(`你陷入了黑暗，再也没有醒来。黑暗力量吞噬了一切，包括你的意识。`, [
            { text: `重新开始`, action: () => this.game.restartGame() }
        ]);
    }

    // 开始最终QTE
    startFinalQTE() {
        this.isPuzzleActive = true;
        this.clickCount = 0;
        this.startTime = Date.now();

        // 创建QTE容器
        const qteContainer = document.createElement('div');
        qteContainer.id = 'final-qte-container';
        qteContainer.className = 'qte-container';

        // 创建QTE提示文本
        const qteText = document.createElement('div');
        qteText.className = 'qte-text';
        qteText.textContent = `黑暗力量试图最后的挣扎！快速点击按钮彻底摧毁它！已点击 ${this.clickCount}/${this.requiredClicks} 次`;

        // 创建QTE按钮
        const qteButton = document.createElement('button');
        qteButton.className = 'big-button';
        qteButton.textContent = '摧毁黑暗力量！👊';
        qteButton.addEventListener('click', () => this.handleFinalQTEClick());

        // 创建计时器进度条
        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        timerBar.style.width = '100%';

        // 添加元素到QTE容器
        qteContainer.appendChild(qteText);
        qteContainer.appendChild(qteButton);
        qteContainer.appendChild(timerBar);

        // 清空游戏动作区域并添加QTE
        this.game.elements.gameActions.innerHTML = '';
        this.game.elements.gameActions.appendChild(qteContainer);

        // 开始更新计时器
        this.updateFinalQTE();
    }

    // 处理最终QTE点击
    handleFinalQTEClick() {
        if (!this.isPuzzleActive) return;

        this.clickCount++;
        const qteText = document.querySelector('#final-qte-container .qte-text');
        qteText.textContent = `黑暗力量试图最后的挣扎！快速点击按钮彻底摧毁它！已点击 ${this.clickCount}/${this.requiredClicks} 次`;

        // 播放点击音效
        this.playSound(`ding`);

        // 检查是否完成QTE
        if (this.clickCount >= this.requiredClicks) {
            this.completeFinalQTE(true);
        }
    }

    // 更新最终QTE计时器
    updateFinalQTE() {
        if (!this.isPuzzleActive) return;

        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = this.clickTimeLimit - elapsedTime;
        const timerBar = document.querySelector('#final-qte-container .timer-bar');

        if (remainingTime <= 0) {
            // 时间到，QTE失败
            this.completeFinalQTE(false);
            return;
        }

        // 更新进度条
        const progress = (remainingTime / this.clickTimeLimit) * 100;
        timerBar.style.width = `${progress}%`;

        // 继续更新计时器
        requestAnimationFrame(() => this.updateFinalQTE());
    }

    // 完成最终QTE
    completeFinalQTE(success) {
        this.isPuzzleActive = false;

        // 移除QTE容器
        const qteContainer = document.getElementById('final-qte-container');
        if (qteContainer) {
            qteContainer.remove();
        }

        if (success) {
            // QTE成功，显示结局
            this.showDialogue(`你成功摧毁了黑暗力量！一切都结束了。阳光重新照亮了大地，你和朋友们安全了。`, [
                { text: `结束游戏`, action: () => this.completeChapter() }
            ]);
        } else {
            // QTE失败，显示坏结局
            this.showDialogue(`黑暗力量过于强大，你没能彻底摧毁它。它将再次卷土重来...`, [
                { text: `重新开始`, action: () => this.game.restartGame() }
            ]);
        }
    }

    // 完成章节
    completeChapter() {
        // 显示结局画面
        this.showResultScreen();
    }

    // 显示结局画面
    showResultScreen() {
        this.game.elements.gameTitle.textContent = '游戏结局';
        this.game.elements.gameMap.innerHTML = '';
        this.game.elements.dialogueText.innerHTML = '<h2>恭喜你完成了游戏！</h2><p>你成功地解决了黑暗神器的威胁，拯救了学校和你的朋友们。</p><p>感谢你玩这个游戏！</p>';
        this.game.elements.dialogueChoices.innerHTML = '';

        // 创建返回主菜单按钮
        const backButton = document.createElement('button');
        backButton.className = 'big-button';
        backButton.textContent = '返回主菜单';
        backButton.addEventListener('click', () => this.game.returnToMainMenu());

        // 添加按钮到游戏动作区域
        this.game.elements.gameActions.innerHTML = '';
        this.game.elements.gameActions.appendChild(backButton);
    }

    // 更新游戏时间（确保时间只能前进）
    updateGameTime(time) {
        // 解析当前时间和新时间
        const currentTime = this.parseTime(this.game.gameState.gameTime || '00:00');
        const newTime = this.parseTime(time);

        // 只有当新时间晚于当前时间时才更新
        if (newTime > currentTime) {
            this.game.gameState.gameTime = time;
        }
    }

    // 解析时间字符串为分钟数（用于比较）
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // 播放音效
    playSound(type) {
        // 这里应该实现播放音效的逻辑
        // 由于没有具体的音效播放API，这里只是一个占位方法
        console.log(`播放音效: ${type}`);
    }
}
