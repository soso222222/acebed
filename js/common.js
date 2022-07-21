// common script
'use strict';
$(document).ready(function () {
  preventDefaultAnchor();
  initEvent();
  setToggleUI();
});

function preventDefaultAnchor() {
  $(document).on('click', 'a[href="#"]', function (e) {
    e.preventDefault();
  });
}


function getScrollTop() {
  return $(document).scrollTop();
  // if(window.pageYOffset !== undefined)
  // {
  //     return window.pageYOffset;
  // } else {
  //     return document.documentElement.scrollTop;
  //     // || document.body.scrollTop;
  // }
}
function checkHeaderScroll() {
  var scrollAmt = getScrollTop();
  var headerHeight = Number($('#header').outerHeight()) + 10;
  
  if (scrollAmt > headerHeight) {
    $('#header').addClass('scroll');
  }else if (scrollAmt <= headerHeight) {
    $('#header').removeClass('scroll');
  }
}
function setHeaderMouseEvents(status, className) {

  if (status == 'enter') {
    $('body.sub #gnb > ul.etc > li.menu img').attr('src', '../img/header-menu-btn.png');

    if (className == 'bed-product') {
      $('#header').addClass('open bed-product');
      $('#gnb > ul.bed-product > li > ul').css({ 'display': 'block' });
      $('#gnb > ul.about-ace > li > ul').css({ 'display': 'none' });
    } else if (className == 'about-ace') {
      $('#header').addClass('open about-ace');
      $('#gnb > ul.about-ace > li > ul').css({ 'display': 'block' });
      $('#gnb > ul.bed-product > li > ul').css({ 'display': 'none' });
    }

  } else if (status == 'leave') {
    $('body.sub #gnb > ul.etc > li.menu img').attr('src', '../img/header-menu-btn-wht.png');

    if (className == 'bed-product') {
      $('#header').removeClass('open bed-product');
      $('#gnb > ul.bed-product > li > ul').css({ 'display': 'none' });
    } else if (className == 'about-ace') {
      $('#header').removeClass('open about-ace');
      $('#gnb > ul.about-ace > li > ul').css({ 'display': 'none' });
    }
  }
}

// main-menu mouse hover 처리
function initEvent() {
  $(window).on('scroll', function () {
    checkHeaderScroll();
  });
  $('#gnb > ul.bed-product').on('mouseenter focusin', function () {
    setHeaderMouseEvents('enter', 'bed-product');
  }).on('mouseleave', function () {
    setHeaderMouseEvents('leave', 'bed-product');
  });
  $('#gnb > ul.about-ace').on('mouseenter focusin', function () {
    setHeaderMouseEvents('enter', 'about-ace');
  }).on('mouseleave', function () {
    setHeaderMouseEvents('leave', 'about-ace');
  });
  $('#header').on('focusout', function () {
    // setHeaderMouseEvents('leave', 'bed-product');
    // setHeaderMouseEvents('enter', 'about-ace');
  });
  $('#gnb > ul.bed-product > li').on('mouseenter', function () {
    $(this).addClass('on');
  }).on('mouseleave', function () {
    $(this).removeClass('on');
  });
  $('#gnb > ul.about-ace > li').on('mouseenter', function () {
    $(this).addClass('on');
  }).on('mouseleave', function () {
    $(this).removeClass('on');
  });
  $('#gnb > ul.etc > li > a').on('click', function () {
    $(this).parent().toggleClass('on');
   });
  $('#gnb div.search-box p.close > a').on('click', function () {
    $('#gnb > ul.etc > li.search').removeClass('on');
  });
  $('#footer div.quick-link > ul.menu > li:last-child > a').on('click', function () {
    $('#footer div.quick-link').toggleClass('on');
  });
  $('#footer div.quick-link > ul.content div.quick-menu-list > p.close a').on('click', function () {
    $('#footer div.quick-link').toggleClass('on');
  });
  $('#footer .family-site-link > div.arrow > a').on('click', function () {
    $('.family-site-link').toggleClass('close');
  });

  

  $('#sub-product-list .category-matt > ul > li > a').on('click', function () {
    var mattLi = $(this).parent();
    var mattUl = mattLi.find('ul');

    if(mattLi.hasClass('on')){
      mattUl.css({'height': '0'});
      mattLi.removeClass('on');
    } else {
      $('#sub-product-list .category-matt > ul > li').removeClass('on');
      mattLi.addClass('on');
      
      if(mattUl.length > 0) {
        var height = 0;
        $(this).next().find(' > li').each(function() {
          height += $(this).outerHeight(true);
          // $(this).removeClass('on');
        });

        //일정 높이 이상이면 스크롤이 생기도록
        if (height > 275) {
          height = 275;
          mattLi.children('ul').css({'overflow-y':'scroll'});
        }
        $(this).next().css({'height': height + 'px'});
        $(this).parent().siblings().each(function() {
          $(this).find('ul').css({'height': '0'});
        });
      }
    }
     
  });

  $(".category-matt input[type='checkbox']").change(function () {
    var categoryId = $(this).attr('id');
    var categoryType = '';
    var keyword = '';

    // if ($(this).is(":checked")) {
    if ($(this).prop("checked")) {
      categoryType = $(this).attr('name');
      keyword = $(this).attr('value');
      
      $(this).parent().addClass('on');
      addTag(categoryId, $(this).siblings('label').text());

    } else {
      //del tag
      if ($('#sub-product-list .filter > ul.keyword:eq(0) > li').length > 1) {
        categoryType = $(this).attr('name');
        keyword = $(this).attr('value');
        delTag('', categoryId);
      } else {
        $(this).parent().removeClass('on');
        delTag('all');
      }
      //
    }
    showList(type);
  });
  //event 위임
  $('#sub-product-list div.filter > ul.keyword').on('click', 'a.del', function (e) {
    var categoryId = $(this).parent().attr('data-category');

    if ($('#sub-product-list .filter > ul.keyword:eq(0) > li').length > 1) {
      // $('#sub-product-list div.side ul > li > ul > li > input:checked').each(function (i) {
      $(".category-matt input[type='checkbox']:checked").each(function (i) {
        if (categoryId == $(this).attr('id')) {
          delTag('', categoryId);
          $(this).prop('checked', false);
          $(this).parent().removeClass('on');
          return false;
        }
      });
    } else {
      $(this).parent().removeClass('on');
      $(".category-matt input[type='checkbox']").prop('checked', false);
      delTag('all');
    }
    showList(type);
  });
  $('#sub-product-list div.top > div.filter span.clear').on('click', function() {
    $(".category-matt input[type='checkbox']").prop('checked', false);
    $('#sub-product-list div.side ul > li > ul > li').removeClass('on');
    delTag('all');
    showList(type);
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.page', function() {
    var index = $(this).index();
    showList(type, (index + 1));
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.prev', function() {
    var index = 0;
    $(this).siblings().each(function (i) {
      if($(this).hasClass('on')) index = parseInt($(this).attr('data-page'));
      return;
    });
    index = (index - maxPage) <= 1 ? index = 1 : (index - maxPage);
    // alert(index);
    showList(type, index);
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.next', function() {
    var index = 0;
    $(this).siblings().each(function (i) {
      if($(this).hasClass('on')) index = parseInt($(this).attr('data-page'));
      return;
    });
    index = (index + maxPage) > totalPage ? index = totalPage - (totalPage % maxPage) + 1 : (index + maxPage);
    // alert(index);
    showList(type, index);
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.first', function() {
    showList(type, 1);
  });
  $('#sub-product-list div.pages p.number').on('click', 'a.last', function() {
    showList(type, totalPage);
  });
  $('#sub-product-list div.list-box ul.list').on('click', 'ul.info > a.like', function() {
    var likeTimer = '';
    
    var curLi = $(this).closest('ul.content').parent();
    if(curLi.hasClass('liked')) {
      curLi.addClass('show-unlike');
      curLi.removeClass('liked');
      curLi.addClass('unliked');
      likeTimer = setTimeout(function() {curLi.removeClass('show-unlike');}, 2000);
      $(this).find(".img-like").attr('src', '../img/icon-like.png');
    }else {
      curLi.addClass('show-like');
      curLi.removeClass('unliked');
      curLi.addClass('liked');
      likeTimer = setTimeout(function() {curLi.removeClass('show-like');}, 2000);
      $(this).find(".img-like").attr('src', '../img/icon-liked.png');
    }
  });
  $('#sub-product-list div.list-box ul.list').on('mouseenter focusin', 'p.palette > a', function () {
    var index = $(this).index();
    $(this).closest('li').find('div.color-info:eq(' + index + ')').addClass('on');
  }).on('mouseleave focusout', 'p.palette > a', function () {
    $(this).closest('li').find('div.color-info').removeClass('on');
  });

}

function showRowView(row) {
  $('#sub-product-list ul.list > li').removeClass('on'); // transition 초기화
  $('#sub-product-list div.list-box').removeClass('row-3 row-2 row-1'); // list-view 초기화
  $('ul.arr-list > li.view > ul > li').removeClass('on'); // tab 초기화
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.' + row).addClass('on');
  $('#sub-product-list div.list-box').addClass(row);
  
  $('#sub-product-list div.list-box ul.list > li').each(function(i) {
    var listupTimer = setTimeout(function() { $('#sub-product-list ul.list > li:eq(' + i + ')').addClass('on'); }, (i + 1) * 100);
  });
}
function showRowViewM(row) {
  $('#sub-product-list ul.list > li').removeClass('on'); // transition 초기화
  $('#sub-product-list div.list-box').removeClass('row-3 row-2 row-1'); // list-view 초기화
  $('ul.arr-list li').removeClass('on'); // mobile tab 초기화
  $('#sub-product-list div.top-m ul.arr-list > li.' + row).addClass('on');
  $('#sub-product-list div.list-box').addClass(row);
  
  $('#sub-product-list div.list-box ul.list > li').each(function(i) {
    var listupTimer = setTimeout(function() { $('#sub-product-list ul.list > li:eq(' + i + ')').addClass('on'); }, (i + 1) * 100);
  });
}

function loadList(url, key) {
  $.ajax({
    url: url,
    dataType: 'json',

    success: function (loadData) {
      bedInfoData = loadData[key];

      if (bedInfoData.length > 0) {
        showList(type);
      }
    },
    error : function() {
      console.log('data load error');			
    }
  });
}
function setPage(list, curPage) {
  var maxList = 12;
  maxPage = 10;
  totalPage = Math.floor((list.length / maxList) + 1);
  var curPage = (curPage === undefined) ? 1 : curPage;
  var startPage = (curPage % 10 === 0) ? (curPage - maxPage) + 1 : curPage - (curPage % maxPage) + 1; // 11
  var endPage = startPage + maxPage - 1; //20
  var isPrev = false;
  var isNext = false;
  // var startList = ((curPage - 1) * maxList) + 1;
  // var endList = (maxList * curPage);
  // remainderPage

  $('#sub-product-list div.pages p.number').find('a').remove();
  
  if (endPage > totalPage) {
    endPage = totalPage;
  }
  
  // >>
  // <<
  if ((startPage + maxPage) <= totalPage) isNext = true
  if ((endPage - maxPage) >= 1) isPrev = true;

  if (isPrev) {
    $('#sub-product-list div.pages p.number').append('<a href="#" class="first"></a>');
    $('#sub-product-list div.pages p.number').append('<a href="#" class="prev"></a>');
  }
  for (var i = startPage; i < (endPage + 1); i++) {
    if (i === curPage) {
      $('#sub-product-list div.pages p.number').append('<a href="#" data-page="' + i + '" class="page on">' + i + '</a>');
    } else {
      $('#sub-product-list div.pages p.number').append('<a href="#" data-page="' + i + '" class="page">' + i + '</a>');
    }
  }
  if (isNext) {
    $('#sub-product-list div.pages p.number').append('<a href="#" class="next"></a>');
    $('#sub-product-list div.pages p.number').append('<a href="#" class="last"></a>');
  }
}
function showList(type, page) {
  var resultArr = bedInfoData;
  var categoryType = '';
  var categoryValue = '';
  var maxList = 12;
  var listType = (type === undefined) ? null : type;
  var curPage = (page === undefined) ? 1 : page;
  var startList = ((curPage - 1) * maxList) + 1;
  var endList = (maxList * curPage);

  $('#sub-product-list ul.list > li').removeClass('on');
  $('#sub-product-list div.list-box ul.list').find('li').remove();
  
  $(".category-matt input[type='checkbox']:checked").each(function (index) {
    categoryType = $(this).attr('name');
    categoryValue = $(this).attr('value');
    
    resultArr = resultArr.filter(function (el, i) {
      var data = el[categoryType].toLowerCase().split('|');
      return data.indexOf(categoryValue) > -1;
    });
  });

  if (endList > resultArr.length) {
    endList = resultArr.length;
  }

  for(var i = (startList - 1); i < endList; i++) {
    var item = resultArr[i];
    var categoryName = item['name'];
    var categorySize = item['category-size'].replaceAll('|', ' / ');
    var imgSrc = item['img-src'];
    var contentText = '';
    var appendStr = '';

    // `<li data-size="` + item['category-size'] + `" data-rank="` + item['category-rank'] + `" data-cushion="` + item['category-cushion'] + `" data-spring="` + item['category-spring'] + `" data-store="` + item['category-store'] + `">
    if(listType === 'bedMattressInfo'){
      var categoryRank = item['category-rank'].replaceAll('-', ' ');
      appendStr = 
      `<li>
        <p class="category-rank">` + categoryRank + `</p>
      </li>`;

    } else if(listType === 'bedFrameInfo') {
      var type = item['type'];
      var colorInfo = item['color'];
      var linkColor = '';
      var spanColor = '';
      var divColorInfo = ''
      var leftPosition = 6;

      $.each(colorInfo, function (i) {
        var colorName = colorInfo[i]['name'].split('|');
        var colorHex = colorInfo[i]['hex'].split('|');
        spanColor = '';
        linkColor = '';

        
        $.each(colorHex, function (j) {
          if (colorHex[j].indexOf(',') > -1) {
            var colorsDetail = colorHex[j].split(',');
            // if (Array.isArray(colorHex) === true) {}
            $.each(colorsDetail, function (z) {
              spanColor += '<span class="color-2" style="background-color: ' + colorsDetail[z] + ';"></span>';
            });
          } else {
            spanColor = '<span class="color" style="background-color: ' + colorHex[j] + ';"></span>';
          }
          linkColor += '<a href="#">' + spanColor + '</span></a>';
          divColorInfo += `
          <div class="color-info" style="left: ` + (j * leftPosition) + `%;">
            <div class="color-box">
              ` + spanColor + `
            </div>
            <span class="colorName">` + colorName[j ] + `</span>
          </div>`;
        });
        
      });

      appendStr = `
      <li>
        <p class="category-type">` + type + `</p>
      </li>
      <li>
        <p class="palette">` + linkColor + `</p>
        ` + divColorInfo + `
      </li>
      `;

    }
    contentText = 
    `<li>
        <ul class="content">
          <li>
            <a href="#">
              <img alt="" src="` + imgSrc + `" class="photo" />
              <div class="like-area">
                <div class="like-alert"><p><em>관심 제품으로<br />찜하였습니다.</em><br />마이페이지, 퀵 메뉴에서<br />확인하실 수 있습니다.</p></div>
                <div class="unlike-alert"><p>관심 제품에서<br /> 제외합니다.</p></div>
              </div>
              </a>
          </li>
          <li>
            <ul class="info">
              <li>
                <p class="category-size">` + categorySize + `</p>
              </li>
              <li>
                <p class="title">` + categoryName + `</p>
              </li>
              ` + appendStr + `
              <a href="#" class="like"><img alt="찜하기" src="../img/icon-like.png" class="img-like" /></a>
            </ul>
          </li>
        </ul>
    </li>`;

    $('#sub-product-list div.list-box ul.list').append(contentText);
  }
  setPage(resultArr, curPage);
  $('#sub-product-list .top > p.total-product > strong.num').text(resultArr.length + '개');

  $('#sub-product-list div.list-box ul.list > li').each(function(i) {
    var listupTimer = setTimeout(function() { $('#sub-product-list ul.list > li:eq(' + i + ')').addClass('on'); }, (i + 1) * 100);
  });

  // var listupTimer = setTimeout(function() { $('#sub-product-list ul.list').addClass('on'); }, 200);
    
  // $('#sub-product-list ul.list').addClass('on');
}



function setRowView() {
  var windowWidth = $(window).width();
  if (windowWidth < 1000){
    showRowViewM('row-2');
  }else{
    showRowView('row-3');
  }
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-3 a').on('click', function () {
    showRowView('row-3');
  });
  $('#sub-product-list div.top > ul.arr-list > li.view > ul > li.row-2 a').on('click', function () {
    showRowView('row-2');
  });
  $('#sub-product-list div.top-m ul.arr-list > li.row-2 a').on('click', function () {
    showRowViewM('row-1');
  });
  $('#sub-product-list div.top-m ul.arr-list > li.row-1 a').on('click', function () {
    showRowViewM('row-2');
  });
}

function setLogo() {
  var visualBgTimer = setTimeout(function() {$('body.sub.bed #main div.background-matt').addClass('on');}, 500); 
  var windowHeight = $(window).width();
  if(windowHeight < 768){
    $('#mobile-menu img.black').css({'display': 'none'});
    $('#mobile-menu img.white').css({'display': 'black'});
  } else {
    $('#mobile-menu img.black').css({'display': 'black'});
    $('#mobile-menu img.white').css({'display': 'none'});
  }
}

function addTag(id, text) {
$('#sub-product-list .filter > ul.keyword > li').each(function (i) {
    if ($(this).attr('data-category') == id) {
      return false;
    }
  });
  $('#sub-product-list .filter').addClass('on');
  $('#sub-product-list .filter > ul.keyword').append('<li data-category="' + id + '"><span class="text">' + text + '</span><a class="del">삭제</a></li>\n');
}
function delTag(type, id) {
  if (type === 'all') {
    $('#sub-product-list .filter').removeClass('on');
    $('#sub-product-list .filter > ul.keyword > li').remove();
  } else {
    $('#sub-product-list .filter > ul.keyword > li').each(function (i) {
      if (id == $(this).attr('data-category')) {
        $(this).remove();
        return false;
      }
    });
  }
}

function setToggleUI() {
  // $('a.btn-toggle').each(function() {
  //   var value = $(this).find('input').val();
  //   var valueLeft = $(this).find('input').attr('data-left');
  //   var valueRight = $(this).find('input').attr('data-right');
  //   $(this).attr({'title': value});
  //   if (value === valueRight) {
  //     $(this).addClass('on');
  //   } else {
  //     $(this).removeClass('on');
  //   }
  // });

  // $('a.btn-toggle').on('click', function() {
  //   var value = $(this).find('input').val();
  //   var valueLeft = $(this).find('input').attr('data-left');
  //   var valueRight = $(this).find('input').attr('data-right');
  //   if($(this).hasClass('disabled') === true){
  //     return false;
  //   }
  //   if ($(this).hasClass('on') === true) {
  //     $(this).removeClass('on');
  //     $(this).find('input').val(valueLeft);
  //     $(this).attr({'title': valueLeft});
  //   } else {
  //     $(this).addClass('on');
  //     $(this).find('input').val(valueRight);
  //     $(this).attr({'title': valueRight});
  //   }
  // });

  setTogglePW();
}
function setTogglePW() {
  $('.toggle-box').each(function(i) {
    $(this).addClass('hide');
  });

  $('.toggle-box > .btn-eye').on('click', function(e) {
    var $toggleBtn = $(this);
    var $toggleInput = $(this).siblings('input');
    var $toggleBox = $(this).parent();
    var isToggle = false;
    var toggleType = '';
    var toggleClass = '';

    isToggle = ($toggleInput.attr('type') === 'password') ? isToggle = true : isToggle = false;
    $toggleBox.removeClass('show hide');

    if(isToggle === true) {
      toggleType = 'text';
      toggleClass = 'show';
    } else {
      toggleType = 'password';
      toggleClass = 'hide';
    }

    $toggleInput.attr('type', toggleType);
    $toggleBox.addClass(toggleClass);
  });
}



