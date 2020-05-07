javascript:(function(){

        var scr1 = document.createElement('script');
        scr1.src = 'https://js.cybozu.com/jszip/v3.1.5/jszip.min.js';
        document.body.appendChild(scr1);
        var scr2 = document.createElement('script');
        scr2.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js';
        document.body.appendChild(scr2);

        var source = window.document;
        var sourceURL = window.document.location;
        var validPattern = /^http(s)?:\/\/character-sheets\.appspot\.com\//;
        if(validPattern.test(sourceURL) == false) {
            return;
        }

        /* 汎用関数 */
        /*
        function getByName(obj, name) {
            var elem = obj.getElementsByName(name)[0];
            if(elem != null) {
                return  elem.value;
            } else {
                return '';
            }
        }

        function getByNameSelected(obj, name) {
            var select = obj.getElementsByName(name)[0];
            var result = null;
            if(select == null) {
                return '';
            }
            result = select.options[ select.selectedIndex ].value;
            if(result == null) {
                return '';
            } else {
                return result;
            }
        };
        */

        function getById(obj, id) {
            var elem = obj.getElementById(id);
            if(elem != null) {
                return elem.value;
            } else {
                return null;
            }
        };

        /*
        function nonZeroAndEmpty(obj, name) {
            var value = getByName(obj, name);
            return (value != '' && value != '0');
        }
        */

        function createElem(name, text) {
            elem = document.createElement('data');
            elem.setAttribute('name', name);
            elem.innerText = text;
            return elem;
        }

        function createNumRcElem(name, value) {
            elem = document.createElement('data');
            elem.setAttribute('name', name);
            elem.innerText = value;
            elem.setAttribute('type', 'numberResource');
            elem.setAttribute('currentValue', value);
            return elem;
        }

        /* ここからメイン処理 */

        /* データを取得 */
        /* 名前 */
        char_name = getById(source, 'base.name');
        /* 能力値ボーナス */
        strong_b = getById(source, 'abl.strong.bonus');
        reflex_b = getById(source, 'abl.reflex.bonus');
        sense_b = getById(source, 'abl.sense.bonus');
        intellect_b = getById(source, 'abl.intellect.bonus');
        will_b = getById(source, 'abl.will.bonus');
        bllesing_b = getById(source, 'abl.bllesing.bonus');
        /* 戦闘値 */
        hit = getById(source, 'outfits.total.hit');
        dodge = getById(source, 'outfits.total.dodge');
        magic = getById(source, 'outfits.total.magic');
        countermagic = getById(source, 'outfits.total.countermagic');
        action = getById(source, 'outfits.total.action');
        hp = getById(source, 'outfits.total.hp');
        mp = getById(source, 'outfits.total.mp');
        battlespeed = getById(source, 'outfits.total.battlespeed.total').replace('m', '');
        /* 加護 */
        special1 = getById(source, 'abl.specialpower.1st');
        s2 = getById(source, 'abl.specialpower.2nd');
        if (s2 == special1) {
            special2 = s2 + '2'
        }
        else {
            special2 = s2
        }
        s3 = getById(source, 'abl.specialpower.3rd');
        if (s3 == special1) {
            if (s3 == s2) {
                special3 = s3 + '3'
            }
            else {
                special3 = s3 + '2'
            }
        }
        else if (special3 == special2) {
            special3 = s3 + '2'
        }
        else {
            special3 =s3
        }

        /* xml 作成 */
        xml = document.createElement('character');
        xml.setAttribute('location.x', '0');
        xml.setAttribute('location.y', '0');
        xml.setAttribute('posZ', '0');

        /* xml の root に character 要素を作成する */
        char = document.createElement('data');
        char.setAttribute('name', 'character');

        /* img 要素を作成し，char の子ノードとする */
        img = document.createElement('data');
        img.setAttribute('name', 'image');
        elem = document.createElement('data');
        elem.setAttribute('type', 'image');
        elem.setAttribute('name', 'imageIdentifier');
        elem.innerText = 'null';
        img.appendChild(elem);
        char.appendChild(img);

        /* common (キャラクター名) 要素を作成し，char の子ノードとする */
        common = document.createElement('data');
        common.setAttribute('name', 'common');      
        common.appendChild(createElem('name', char_name));
        char.appendChild(common);

        /* detail (能力値など) 要素を作成し，char の子ノードとする */
        detail = document.createElement('data');
        detail.setAttribute('name', 'detail');
        char.appendChild(detail);

        /* resource (HP, MP, 行動値，移動値)要素を作成し，detail の子ノードとする */
        resource = document.createElement('data');
        resource.setAttribute('name', 'リソース');
        resource.appendChild(createNumRcElem('HP', hp));
        resource.appendChild(createNumRcElem('MP', mp));
        resource.appendChild(createElem('行動値', action));
        resource.appendChild(createElem('移動値', battlespeed));
        detail.appendChild(resource);
    
        /* ability_b (能力値ボーナス)要素を作成し，detail の子ノードとする */
        ability_b = document.createElement('data');
        ability_b.setAttribute('name', '能力値ボーナス');
        ability_b.appendChild(createElem('体力', strong_b));
        ability_b.appendChild(createElem('反射', reflex_b));
        ability_b.appendChild(createElem('知覚', sense_b));
        ability_b.appendChild(createElem('理知', intellect_b));
        ability_b.appendChild(createElem('意志', will_b));
        ability_b.appendChild(createElem('幸運', bllesing_b));
        detail.appendChild(ability_b);

        /* outfits (戦闘値) 要素を作成し，detail の子ノードとする */
        outfits = document.createElement('data');
        outfits.setAttribute('name', '戦闘値');
        outfits.appendChild(createElem('命中', hit));
        outfits.appendChild(createElem('回避', dodge));
        outfits.appendChild(createElem('魔導', magic));
        outfits.appendChild(createElem('抗魔', countermagic));
        outfits.appendChild(createElem('行動', action));
        outfits.appendChild(createElem('耐久', hp));
        outfits.appendChild(createElem('精神', mp));
        detail.appendChild(outfits);

        /* special (加護) 要素を作成し，detail の子ノードとする */
        special = document.createElement('data');
        special.setAttribute('name', '加護');
        special.appendChild(createNumRcElem(special1, 1));
        special.appendChild(createNumRcElem(special2, 1));
        special.appendChild(createNumRcElem(special3, 1));
        detail.appendChild(special);

        /* チャットパレットの生成 */
        cpd = document.createElement('chat-palette');
       
        /* 雛形にキャラデータとチャットパレットを設定 */
        xml.appendChild(char);
        xml.appendChild(cpd);

        s = new XMLSerializer();

        out = s.serializeToString(xml);
        out = out.replace(/xmlns=.http:\/\/www\.w3\.org\/1999\/xhtml../, '');
        out = out.replace(/<br \/>/g, '\n');
        out = out.replace(/currentvalue/g, 'currentValue');

        zip = new JSZip();
        zip.file(`${char_name}.xml`, out);
        zip.generateAsync({type:'blob'})
        .then(function(blob) {
            saveAs(blob, `${char_name}.zip`);
        });

})();