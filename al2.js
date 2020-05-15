javascript:(function(){

    /******** 汎用関数 ********/

    /* ID をもとに elem を取得 */
    function getById(obj, id) {
        var elem = obj.getElementById(id);
        if(elem != null) {
            return elem.value;
        } else {
            return null;
        }
    };

    /* xml の elem 作成 */
    function createElem(name, text) {
        var elem = document.createElement('data');
        elem.setAttribute('name', name);
        elem.innerText = text;
        return elem;
    }

    /* numberResource である xml elem 作成 */
    function createNumRcElem(name, maxValue, currentValue) {
        var elem = document.createElement('data');
        elem.setAttribute('name', name);
        elem.innerText = maxValue;
        elem.setAttribute('type', 'numberResource');
        elem.setAttribute('currentValue', currentValue);
        return elem;
    }

    /* source から指定された id を取得し，xml elem を作成 */
    function createElemById(source, id, name) {
        return createElem(name, getById(source, id));
    }

    /******** 各ブロックの作成処理 ********/

    function createImgBlock() {
        var img = document.createElement('data');
        img.setAttribute('name', 'image');
        var elem = document.createElement('data');
        elem.setAttribute('type', 'image');
        elem.setAttribute('name', 'imageIdentifier');
        elem.innerText = 'null';
        img.appendChild(elem);

        return img;
    }

    function createCommonBlock(source) {
        var common = document.createElement('data');
        common.setAttribute('name', 'common');      
        common.appendChild(createElemById(source, 'base.name', 'name' ));
        common.appendChild(createElemById(source, 'base.player', 'プレイヤー名' ));
        common.appendChild(createElem('size', '1' ));

        return common;
    }

    function createResourceBlock(source) {
        /* キャラシートからHP, MPを取得 */
        var hp = getById(source, 'outfits.total.hp');
        var mp = getById(source, 'outfits.total.mp');

        var resource = document.createElement('data');
        resource.setAttribute('name', 'リソース');
        resource.appendChild(createNumRcElem('HP', hp, hp));
        resource.appendChild(createNumRcElem('MP', mp, mp));
        resource.appendChild(createNumRcElem('ブレイク', 1, 0));

        return resource;
    }

    function createMoveBlock(source) {
        /* キャラシートから移動値を取得し，m(メートル)を削除 */
        var battlespeed = getById(source, 'outfits.total.battlespeed.total').replace('m', '');

        var move = document.createElement('data');
        move.setAttribute('name', '行動');
        move.appendChild(createElemById(source, 'outfits.total.action', '行動値'));
        move.appendChild(createElem('移動値', battlespeed));

        return move;
    }

    function createAbilityBonusBlock(source) {
        var ability_b = document.createElement('data');
        ability_b.setAttribute('name', '能力値ボーナス');
        ability_b.appendChild(createElemById(source, 'abl.strong.bonus', '体力'));
        ability_b.appendChild(createElemById(source, 'abl.reflex.bonus','反射'));
        ability_b.appendChild(createElemById(source, 'abl.sense.bonus', '知覚'));
        ability_b.appendChild(createElemById(source, 'abl.intellect.bonus', '理知'));
        ability_b.appendChild(createElemById(source, 'abl.will.bonus', '意志'));
        ability_b.appendChild(createElemById(source, 'abl.bllesing.bonus', '幸運'));

        return ability_b;
    }

    function createOutfitsBlock(source) {
        var outfits = document.createElement('data');
        outfits.setAttribute('name', '戦闘値');
        outfits.appendChild(createElemById(source, 'outfits.total.hit', '命中'));
        outfits.appendChild(createElemById(source, 'outfits.total.dodge', '回避'));
        outfits.appendChild(createElemById(source, 'outfits.total.magic', '魔導'));
        outfits.appendChild(createElemById(source, 'outfits.total.countermagic', '抗魔'));
        outfits.appendChild(createElemById(source, 'outfits.total.action', '行動値'));
        outfits.appendChild(createElemById(source, 'outfits.total.mp', '耐久'));
        outfits.appendChild(createElemById(source, 'outfits.total.mp', '精神'));

        return outfits;
    }

    function createSpecialsBlock(source) {
        var special1 = getById(source, 'abl.specialpower.1st');
        var s2 = getById(source, 'abl.specialpower.2nd');
        if (s2 == special1) {
            var special2 = s2 + '2'
        }
        else {
            var special2 = s2
        }
        var s3 = getById(source, 'abl.specialpower.3rd');
        if (s3 == special1) {
            if (s3 == s2) {
                var special3 = s3 + '3'
            }
            else {
                var special3 = s3 + '2'
            }
        }
        else if (s3 == special2) {
            var special3 = s3 + '2'
        }
        else {
            var special3 = s3
        }
        
        var special = document.createElement('data');
        special.setAttribute('name', '加護');
        special.appendChild(createElem(special1, 1));
        special.appendChild(createElem(special2, 1));
        special.appendChild(createElem(special3, 1));

        return special;
    }

    function createChatPaletteBlock() {
        var cpd = document.createElement('chat-palette');

        var txt = '';
        txt += '========= 基本的な判定 ======== \n';
        txt += '2d6+{体力} 【体力】\n';
        txt += '2d6+{反射} 【反射】\n';
        txt += '2d6+{知覚} 【知覚】\n';
        txt += '2d6+{理知} 【理知】\n';
        txt += '2d6+{意志} 【意志】\n';
        txt += '2d6+{幸運} 【幸運】\n';
        txt += '\n';
        txt += '========= 戦闘中の判定 ======== \n';
        txt += '2d6+{命中} 【命中】\n';
        txt += '2d6+{回避} 【回避】\n';
        txt += '2d6+{魔導} 【魔導】\n';
        txt += '2d6+{抗魔} 【抗魔】\n';
        cpd.innerText = txt;

        return cpd;
    }

    /******** ここからメイン処理 ********/
    function main() {
        var source = window.document;
        var sourceURL = window.document.location;
        var validPattern = /^http(s)?:\/\/character-sheets\.appspot\.com\//;
        if(validPattern.test(sourceURL) == false) {
            return;
        }
        
        /* xml 作成 */
        var xml = document.createElement('character');
        xml.setAttribute('location.x', '0');
        xml.setAttribute('location.y', '0');
        xml.setAttribute('posZ', '0');

        /* xml の root に char 要素を作成する */
        var char = document.createElement('data');
        char.setAttribute('name', 'character');

        /* img ブロックを作成し，char の子ノードとする */
        char.appendChild(createImgBlock());

        /* common (キャラクター名，プレイヤー名など) ブロックを作成し，char の子ノードとする */
        char.appendChild(createCommonBlock(source));

        /* detail (能力値など) ブロックを作成し，char の子ノードとする */
        var detail = document.createElement('data');
        detail.setAttribute('name', 'detail');
        char.appendChild(detail);

        /* resource (HP, MP, ブレイク)ブロックを作成し，detail の子ノードとする */
        detail.appendChild(createResourceBlock(source));

        /* move (行動値，移動値)ブロックを作成し，detail の子ノードとする */
        detail.appendChild(createMoveBlock(source));

        /* ability_b (能力値ボーナス)ブロックを作成し，detail の子ノードとする */
        detail.appendChild(createAbilityBonusBlock(source));

        /* outfits (戦闘値) ブロックを作成し，detail の子ノードとする */
        detail.appendChild(createOutfitsBlock(source));

        /* special (加護) ブロックを作成し，detail の子ノードとする */
        detail.appendChild(createSpecialsBlock(source));

        /* 雛形にキャラデータとチャットパレットを設定 */
        xml.appendChild(char);
        xml.appendChild(createChatPaletteBlock());

        /* xml を zip 圧縮 */
        var s = new XMLSerializer();
        var out = s.serializeToString(xml);
        out = out.replace(/xmlns=.http:\/\/www\.w3\.org\/1999\/xhtml../, '');
        out = out.replace(/<br \/>/g, '\n');
        out = out.replace(/currentvalue/g, 'currentValue');
        var zip = new JSZip();
        zip.file(`${char_name}.xml`, out);

        /* ファイル保存 */
        var char_name = getById(source, 'base.name');
        zip.generateAsync({type:'blob'})
        .then(function(blob) {
            saveAs(blob, `${char_name}.zip`);
        });
    }

    /* 最初に jszip をロード */
    var scrJsZip = document.createElement('script');
    scrJsZip.src = 'https://js.cybozu.com/jszip/v3.1.5/jszip.min.js';
    document.body.appendChild(scrJsZip);

    /* 次に FileSaver をロード */
    var scrFileSaver = document.createElement('script');
    scrFileSaver.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js';
    scrFileSaver.onload=function(){main()}; /* 読み込み終了を待って main() を実行 */
    document.body.appendChild(scrFileSaver);

})();