const db = localStorage;
const _ = (el) => {
    return document.querySelector(el);
};
const getTpl = (element) => {
    return tpl[element];
};

const makeEditable = () => {
    let elements = document.querySelectorAll('.drop-element');
    let toArr = Array.prototype.slice.call(elements);
    Array.prototype.forEach.call(toArr, (obj, index) => {
        if (obj.querySelector('img')) {
            return false;
        } else {
            obj.addEventListener('click', (e) => {
                e.preventDefault();
                obj.children[0].setAttribute('contenteditable', '');
                obj.focus();
            });
            obj.children[0].addEventListener('blur', (e) => {
                e.preventDefault();
                obj.children[0].removeAttribute('contenteditable');
            });
        }
    });
};

const removeDivsToSave = () => {
    let elements = document.querySelectorAll('.drop-element');
    let toArr = Array.prototype.slice.call(elements);
    let html = '';
    Array.prototype.forEach.call(toArr, (obj, index) => {
        obj.children[0].removeAttribute('contenteditable');
        html += obj.innerHTML;
    });
    return html;
};


const tpl = {
    'header1': '<div class="list-box" data-list="">\n' +
        '                        <div class="log-box">\n' +
        '                            <img src="../images/山东.jpg">\n' +
        '                        </div>\n' +
        '                        <a href="" class="g-title"></a>\n' +
        '                        <a id="g-desc" class="g-desc" ></a>\n' +
        '                    </div>',
    'shortparagraph': ' <div class="title-icon">\n' +
        '                <img src="https://image.sqqmall.com/dev/png/2021930/JoqNRZ1v/xin.png">\n' +
        '                <div class = "aigo"></div>\n' +
        '            </div>',
};


const containers = [_('.box-left'), _('.box-right')];
const drake = dragula(containers, {
    copy:function (el, source) {
        return source === _('.box-left');
    },
    accepts:function (el, target) {
        return target !== _('.box-left');
    },
    removeOnSpill: true
});

drake.on('out', (el, container) => {
    if (container == _('.box-right')) {
        let a =$(el).find('#g-desc')[0]
        let b =$(el).find('.g-title')[0]
        let c =$(el).find('.log-box img')[0]
        let d =$(el).find('.aigo')[0]
        el.innerHTML = getTpl(el.getAttribute('data-tpl'));
        el.className = 'drop-element';
        makeEditable();
        if($(el).find('.g-title')[0]){
            if(b){
                $(el).find('.g-title')[0].href=a.href;
            }else {
                $(el).find('.g-title')[0].href=_('#u').value;
                // console.log($(el).find('.log-box')[0]);
                // $($(el).find('.list-box')[0]).attr('data-list',_('#u').value);
            }
        }
        if($(el).find('.log-box img')[0]){
            if(c){
                $(el).find('.log-box img')[0].src=c.src;
            }else {
                $(el).find('.log-box img')[0].src=_('.btn_img img').src;
            }
        }
        if($(el).find('.g-title')[0]){
            if(b){
                $(el).find('.g-title')[0].innerText=b.innerText;
            }else {
                $(el).find('.g-title')[0].innerText=_('#t').value;
            }

        }
        if($(el).find('#g-desc')[0]){
            if(a){
                $(el).find('#g-desc')[0].innerText=a.innerText;
            }else {
                $(el).find('#g-desc')[0].innerText=_('#c').value;
            }
        }
        if($(el).find('.aigo')[0]){
            if(d){
                $(el).find('.aigo')[0].innerText=d.innerText;
            }else {
                $(el).find('.aigo')[0].innerText=_('#igo').value;
            }
            // _('.aigo').innerText = _('#igo').value;
        }
        db.setItem('savedData', _('.box-right').innerHTML);

    }
    if (container == _('.box-left')) {
        el.innerHTML = el.getAttribute('data-title');
    }

});


if (typeof db.getItem('savedData') !== 'undefined') {
    _('.box-right').innerHTML = db.getItem('savedData');
    makeEditable();
};


_('.reset').addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Are you sure !')) {
        _('.box-right').innerHTML = '';
    }
});


_('.save').addEventListener('click', (e) => {
    $.ajax({
        type:"POST",
        url: "http://localhost/addData.php",
        data:
            {
                savedData:_('.box-right').innerHTML
            },
        success:function(dat){
            console.log(444);
        },
        error:function(){
            alert('服务器超时，请重试！');
        }

    });
    e.preventDefault();
    var blob = new Blob([removeDivsToSave()], {
        type: 'text/html;charset=utf-8'
    });
    db.setItem('savedData', _('.box-right').innerHTML);
    // saveAs(blob, 'index.html');
});
// _('.recover').addEventListener('click', (e) => {
//     $.ajax({
//         type:"POST",
//         url: "http://localhost/addData.php",
//         success : function(savedData) {
//             console.log(savedData);
//             $('.box-right').show().append(savedData);//插入节点中
//         },
//         error : function() {
//             alert("无法与数据库取得连接!!!1111");
//         }
//     });
// });
_('.btn_img').addEventListener('click', function (){
    $('.mask').show();
    $('.windows').show();
    $(".windows img").each(function (){
        $(this).click(function (){
            console.log($(this).attr('src'))
            _('.btn_img img').src=$(this).attr('src');
            $('.mask').hide();
            $('.windows').hide();
        })
    })
});




