class Chapter1 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.ghostEncountered = false;
        this.keyFound = false;
    }

    // 开始第一章
    start() {
        this.game.gameState.currentChapter = 'chapter1';
        this.game.updateGameMap('corridor');
        this.plotProgress = 0;
        this.loadScene('corridor');
    }

    // 加载场景
    loadScene(sceneName) {
        this.game.clearDialogue();

        switch(sceneName) {
            case 'corridor':
                this.showCorridorScene();
                break;
            case 'staircase':
                this.showStaircaseScene();
                break;
            case 'artRoom':
                this.showArtRoomScene();
                break;
            case 'basement':
                this.showBasementScene();
                break;
            default:
                this.showCorridorScene();
        }
    }

    // 走廊场景
    showCorridorScene() {
        this.game.gameState.currentScene = 'corridor';
        this.game.updateGameMap('corridor');

        if (this.plotProgress === 0) {
            this.game.showDialogue('晚自习后的走廊异常安静，你总感觉有什么东西在盯着你。', [
                { text: '走向楼梯', action: () => this.goToStaircase() },
                { text: '返回教室', action: () => this.returnToClassroom() }
            ]);
        } else if (this.plotProgress === 1) {
            this.game.showDialogue('走廊里的温度突然下降，你看到墙上有奇怪的影子在晃动。', [
                { text: '继续前进', action: () => this.goToStaircase() },
                { text: '查看影子', action: () => this.examineShadow() }
            ]);
        } else {
            this.game.showDialogue('走廊里回荡着诡异的笑声，你必须尽快离开这里。', [
                { text: '冲向楼梯', action: () => this.goToStaircase() }
            ]);
        }
    }

    // 楼梯场景
    showStaircaseScene() {
        this.game.gameState.currentScene = 'staircase';
        this.game.updateGameMap('staircase');

        if (this.plotProgress === 1 && !this.ghostEncountered) {
            this.game.showDialogue('你来到楼梯间，楼梯上似乎有水滴落的声音，但周围并没有水。', [
                { text: '上楼', action: () => this.goUpstairs() },
                { text: '下楼', action: () => this.goDownstairs() }
            ]);
        } else if (this.plotProgress === 2 && this.ghostEncountered) {
            this.game.showDialogue('你逃离了艺术教室，鬼魂的哭喊声在身后回荡。', [
                { text: '继续下楼', action: () => this.goToBasement() }
            ]);
        } else {
            this.game.showDialogue('楼梯间弥漫着一股腐臭味，你不敢久留。', [
                { text: '下楼去地下室', action: () => this.goToBasement() },
                { text: '返回走廊', action: () => this.returnToCorridor() }
            ]);
        }
    }

    // 美术教室场景
    showArtRoomScene() {
        this.game.gameState.currentScene = 'artRoom';
        this.game.updateGameMap('artRoom');

        if (!this.ghostEncountered) {
            this.game.showDialogue('美术教室里的画都被翻了出来，地上散落着画笔和颜料。墙上有一幅未完成的肖像画，眼睛的位置是空的。', [
                { text: '查看肖像画', action: () => this.examinePainting() },
                { text: '离开教室', action: () => this.returnToStaircase() }
            ]);
        } else {
            this.game.showDialogue('肖像画的眼睛里流出了红色的液体，鬼魂的手从画布中伸了出来！', [
                { text: '快速逃离', action: () => this.escapeArtRoom() }
            ]);
        }
    }

    // 地下室场景
    showBasementScene() {
        this.game.gameState.currentScene = 'basement';
        this.game.updateGameMap('basement');

        if (!this.keyFound) {
            this.game.showDialogue('地下室阴暗潮湿，角落里堆放着旧家具和杂物。墙上挂着一把生锈的钥匙。', [
                { text: '拿起钥匙', action: () => this.takeKey() },
                { text: '探索其他区域', action: () => this.exploreBasement() }
            ]);
        } else {
            this.game.showDialogue('你找到了一把奇怪的钥匙，它似乎能打开什么重要的门。', [
                { text: '返回楼梯间', action: () => this.returnToStaircase() }
            ]);
        }
    }

    // 场景转换方法
    goToStaircase() {
        this.plotProgress = 1;
        this.loadScene('staircase');
    }

    returnToClassroom() {
        this.game.showDialogue('教室的门已经锁上了，你无法进去。', [
            { text: '返回走廊', action: () => this.loadScene('corridor') }
        ]);
    }

    examineShadow() {
        this.game.showDialogue('影子突然变得清晰，是一个穿着校服的女孩的轮廓。她慢慢转过脸，你看到她的眼睛里流出了血。', [
            { text: '后退', action: () => this.goToStaircase() },
            { text: '保持不动', action: () => this.encounterGhost() }
        ]);
    }

    goUpstairs() {
        this.game.showDialogue('楼上的门被锁住了，你无法通过。', [
            { text: '下楼', action: () => this.goDownstairs() }
        ]);
    }

    goDownstairs() {
        this.plotProgress = 2;
        this.loadScene('artRoom');
    }

    examinePainting() {
        this.ghostEncountered = true;
        this.game.showDialogue('你走近肖像画，突然画中的眼睛开始流血，画中女孩的嘴微微张开，发出了刺耳的尖叫！', [
            { text: '逃离教室', action: () => this.escapeArtRoom() }
        ]);
    }

    returnToStaircase() {
        this.loadScene('staircase');
    }

    escapeArtRoom() {
        this.plotProgress = 3;
        this.loadScene('staircase');
    }

    encounterGhost() {
        this.ghostEncountered = true;
        this.game.showDeath('女孩的鬼魂扑向了你，你感到一阵刺骨的寒冷，然后什么都不知道了...');
    }

    goToBasement() {
        this.plotProgress = 4;
        this.loadScene('basement');
    }

    returnToCorridor() {
        this.loadScene('corridor');
    }

    takeKey() {
        this.keyFound = true;
        this.game.gameState.inventory.push('生锈的钥匙');
        this.game.showDialogue('你拿起了生锈的钥匙，它看起来很古老。', [
            { text: '继续探索', action: () => this.exploreBasement() }
        ]);
    }

    exploreBasement() {
        if (this.keyFound) {
            if (!this.ghostEncountered) {
                this.game.showDialogue('你听到身后传来脚步声，一个穿着校服的女孩出现在地下室入口，她的眼睛流着血。', [
                    { text: '逃跑', action: () => this.encounterGhost() },
                    { text: '用钥匙对抗', action: () => this.useKeyAgainstGhost() }
                ]);
            } else {
                this.game.showDialogue('你在地下室深处发现了一个隐藏的门，上面有一个古老的锁。你的钥匙正好能打开它！', [
                    { text: '打开门', action: () => this.openSecretDoor() },
                    { text: '返回楼梯间', action: () => this.returnToStaircase() }
                ]);
            }
        } else {
            this.game.showDialogue('地下室深处传来奇怪的声音，你觉得最好不要靠近。', [
                { text: '返回楼梯间', action: () => this.returnToStaircase() }
            ]);
        }
    }

    useKeyAgainstGhost() {
        this.ghostEncountered = true;
        this.game.showDialogue('你用生锈的钥匙指向鬼魂，钥匙发出微弱的光芒，鬼魂后退了几步。', [
            { text: '检查隐藏门', action: () => this.exploreBasement() }
        ]);
    }

    // 打开秘密门
    openSecretDoor() {
        this.game.showDialogue('门后是一个狭窄的通道，尽头有一丝光线。你走过去，发现是学校的后门！你成功逃出来了！', [
            { text: '完成第一章', action: () => this.completeChapter() }
        ]);
    }

    // 完成章节
    completeChapter() {
        this.game.completeChapter('chapter1');
    }
}

// 导出Chapter1类到window对象，以便在主游戏中使用
window.Chapter1 = Chapter1;